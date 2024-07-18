from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import employees_data, schemas, database, auth_data

router = APIRouter()

@router.get("/employees/", response_model=List[schemas.Employee])
def read_employees(db: Session = Depends(database.get_db), current_user: schemas.User = Depends(auth_data.get_current_user)):
    return employees_data.get_employees(db)


@router.post("/employee/", response_model=schemas.Employee)
def create_employee(employee: schemas.EmployeeCreate, db: Session = Depends(database.get_db), current_user: schemas.User = Depends(auth_data.get_current_user)):
    return employees_data.create_employee(db=db, employee=employee)


@router.delete("/employee/{emp_id}/", response_model=schemas.Employee)
def delete_task(emp_id: int, db: Session = Depends(database.get_db), current_user: schemas.User = Depends(auth_data.get_current_user)):
    db_emp = employees_data.delete_employee(db, emp_id=emp_id)
    if db_emp is None:
        raise HTTPException(status_code=404, detail="Employee not found")
    return db_emp