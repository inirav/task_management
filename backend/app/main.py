from fastapi import FastAPI
from routers import task, employee, auth
from database import engine, Base
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

Base.metadata.create_all(bind=engine)

app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"],)

app.include_router(task.router)
app.include_router(employee.router)
app.include_router(auth.router)
