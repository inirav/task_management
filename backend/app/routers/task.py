from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import tasks_data, schemas, database, auth_data

router = APIRouter()

@router.get("/")
def home():
    return {"message": "Welcome to the Task Management API"}

@router.get("/tasks/{task_id}", response_model=schemas.Task)
def get_task_details(task_id: int, db: Session = Depends(database.get_db), current_user: schemas.User = Depends(auth_data.get_current_user)):
    return tasks_data.get_task_details(db=db, task_id=task_id)

@router.post("/tasks/", response_model=schemas.Task)
def create_task(task: schemas.TaskCreate, db: Session = Depends(database.get_db), current_user: schemas.User = Depends(auth_data.get_current_user)):
    return tasks_data.create_task(db=db, task=task)

@router.get("/tasks/", response_model=List[schemas.Task])
def read_tasks(db: Session = Depends(database.get_db), current_user: schemas.User = Depends(auth_data.get_current_user)):
    return tasks_data.get_tasks(db)

@router.put("/tasks/{task_id}/", response_model=schemas.Task)
def update_task(task_id: int, task: schemas.TaskUpdate, db: Session = Depends(database.get_db), current_user: schemas.User = Depends(auth_data.get_current_user)):
    db_task = tasks_data.update_task(db, task_id=task_id, task=task)
    if db_task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    return db_task

@router.delete("/tasks/{task_id}/", response_model=schemas.Task)
def delete_task(task_id: int, db: Session = Depends(database.get_db), current_user: schemas.User = Depends(auth_data.get_current_user)):
    db_task = tasks_data.delete_task(db, task_id=task_id)
    if db_task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    return db_task