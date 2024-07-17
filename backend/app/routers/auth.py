from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta
import auth_data, schemas, models, database, jwt
from typing import List

router = APIRouter()

@router.post("/token", response_model=schemas.Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(database.get_db)): 
    user = auth_data.authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=auth_data.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth_data.create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    refresh_token_expires = timedelta(days=auth_data.REFRESH_TOKEN_EXPIRE_DAYS)
    refresh_token = auth_data.create_refresh_token(
        data={"sub": user.username}, expires_delta=refresh_token_expires
    )
    print(f'refresh_token: {refresh_token}')
    return {"access_token": access_token, "token_type": "bearer", "refresh_token": refresh_token}


@router.post("/refresh", response_model=schemas.Token)
async def refresh_access_token(refresh_token: schemas.RefreshToken, db: Session = Depends(database.get_db)):
    try:
        # Verify the refresh token
        payload = jwt.decode(refresh_token.token, auth_data.SECRET_KEY, algorithms=[auth_data.ALGORITHM])
        username = payload.get("sub")
        if username is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid refresh token",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        # Get the user from the database
        user = auth_data.get_user_by_username(db, username)
        if user is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        # Generate a new access token
        access_token_expires = timedelta(minutes=auth_data.ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = auth_data.create_access_token(
            data={"sub": user.username}, expires_delta=access_token_expires
        )
        
        return { "access_token": access_token, "token_type": "bearer", "refresh_token": refresh_token.token}
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Expired refresh token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token",
            headers={"WWW-Authenticate": "Bearer"},
        )


@router.post("/users/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(database.get_db)):
    hashed_password = auth_data.get_password_hash(user.password)
    db_user = models.User(username=user.username, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


@router.get("/users/", response_model=List[schemas.UserList])
def read_users(db: Session = Depends(database.get_db), current_user: schemas.User = Depends(auth_data.get_current_user)):
    return auth_data.get_users(db)
