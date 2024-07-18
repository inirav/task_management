import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from './pages/LoginPage.jsx'
import HomePage from './pages/HomePage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import Tasks from './components/tasks/Tasks.jsx'
import AddTask from './components/tasks/AddTask.jsx'
import EditTask from './components/tasks/EditTask.jsx'
import Employees from './components/employees/Employees.jsx'
import AddEmployee from './components/employees/AddEmployee.jsx'
import Users from './components/users/Users.jsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />}>
          <Route index element={<Tasks />} />
          <Route path="tasks/add" element={<AddTask />} />
          <Route path="tasks/:taskid/edit" element={<EditTask />} />
          <Route path="employees">
            <Route index element={<Employees />} />
            <Route path="add" element={<AddEmployee />} />
          </Route>
          <Route path="users" element={<Users />} />
        </Route>
        <Route path="/login" element={<LoginPage />}></Route>
        <Route path="/register" element={<RegisterPage />}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
