# Task Management App

## Backend Setup
You must have installed Python 3.10+ and PostgreSQL 14+ on your machine.

### Installing Dependencies
1. Open the backend folder in your editor.
2. Create a new virtual environment using `python -m venv venv` and activate it using Windows: `venv\Scripts\activate` and Linux/macOS: `source venv/bin/activate`.
3. Make sure it shows `(venv)` in terminal, it means virtual environment is activated. Run the following command to install the dependencies using pip.
```bash
pip install -r requirements.txt
```

### Setting up PostgreSQL

1. Create a new database and name it `TaskApp` (You can choose any name) using pgAdmin or psql.
2. Create a `.env` file and update the `DATABASE_URL` variable with the appropriate values.

```
DATABASE_URL=postgresql://username:password@localhost:5432/DatabaseName
```

### Running the Server

```bash
cd app && uvicorn main:app --reload
```

## Frontend Setup
You must have installed Node.js 18+ on your machine.

### Installing Dependencies
1. Open the frontend folder in your editor.
2. Run the following command to install the dependencies using npm.
```bash
npm install
```

### Running the Server

```bash
npm run dev
```

Make sure both the backend and frontend servers are running before running the frontend.