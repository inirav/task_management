from sqlalchemy.orm import Session
import models, schemas


def get_employees(db: Session):
    return db.query(models.Employee).all()


def create_employee(db: Session, employee: schemas.EmployeeCreate):
    db_emp = models.Employee(name=employee.name,)
    db.add(db_emp)
    db.commit()
    db.refresh(db_emp)
    return db_emp


def delete_employee(db: Session, emp_id: int):
    db_emp = db.query(models.Employee).filter(models.Employee.id == emp_id).first()
    if not db_emp:
        return None
    db.delete(db_emp)
    db.commit()
    return db_emp