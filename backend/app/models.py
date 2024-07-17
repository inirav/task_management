from sqlalchemy import Column, Integer, String, Date, ForeignKey, Table
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)


task_employee_association = Table('task_employee_association', Base.metadata,
    Column('task_id', Integer, ForeignKey('tasks.id')),
    Column('employee_id', Integer, ForeignKey('employees.id'))
)

class Employee(Base):
    __tablename__ = "employees"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)


class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(String, index=True)
    priority = Column(String, index=True)
    target_date = Column(Date, index=True)
    employees = relationship("Employee", secondary=task_employee_association)
    user_id = Column(Integer, ForeignKey("tasks.id")) 

