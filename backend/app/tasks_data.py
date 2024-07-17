from sqlalchemy.orm import Session
import models, schemas

def get_tasks(db: Session):
    return db.query(models.Task).all()


def create_task(db: Session, task: schemas.TaskCreate):
    db_task = models.Task(
        title=task.title,
        description=task.description,
        priority=task.priority,
        target_date=task.target_date
    )
    db_task.employees = db.query(models.Employee).filter(models.Employee.id.in_(task.employee_ids)).all()
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task


def update_task(db: Session, task_id: int, task: schemas.TaskUpdate):
    db_task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if not db_task:
        return None
    for key, value in task.dict(exclude_unset=True).items():
        setattr(db_task, key, value)
    if task.employee_ids is not None:
        db_task.employees = db.query(models.Employee).filter(models.Employee.id.in_(task.employee_ids)).all()
    db.commit()
    db.refresh(db_task)
    return db_task


def delete_task(db: Session, task_id: int):
    db_task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if not db_task:
        return None
    db.delete(db_task)
    db.commit()
    return db_task
