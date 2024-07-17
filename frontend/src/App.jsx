import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from './pages/LoginPage.jsx'
import HomePage from './pages/HomePage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import Tasks from './components/tasks/Tasks.jsx'
import Employees from './components/employees/Employees.jsx'
import Users from './components/users/Users.jsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />}>
          <Route index element={<Tasks />} />
          <Route path="employees" element={<Employees />} />
          <Route path="users" element={<Users />} />
        </Route>
        <Route path="/login" element={<LoginPage />}></Route>
        <Route path="/register" element={<RegisterPage />}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
