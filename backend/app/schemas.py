from typing import List, Optional
from pydantic import BaseModel
from datetime import date


class EmployeeBase(BaseModel):
    name: str


class EmployeeCreate(EmployeeBase):
    pass


class Employee(EmployeeBase):
    id: int

    class Config:
        orm_mode = True


class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    priority: str
    target_date: date


class TaskCreate(TaskBase):
    employee_ids: Optional[List[int]] = []


class TaskUpdate(TaskBase):
    employee_ids: Optional[List[int]] = []


class Task(TaskBase):
    id: int
    employees: List[Employee]

    class Config:
        orm_mode = True


class UserBase(BaseModel):
    full_name: str
    username: str


class UserCreate(UserBase):
    password: str


class User(UserBase):
    id: int

    class Config:
        orm_mode = True


class Token(BaseModel):
    access_token: str
    token_type: str
    refresh_token: str

class RefreshToken(BaseModel):
    token: str

class TokenData(BaseModel):
    username: Optional[str] = None


class UserList(BaseModel):
    id: int
    full_name: Optional[str] = None
    username: str

    class Config:
        orm_mode = True
