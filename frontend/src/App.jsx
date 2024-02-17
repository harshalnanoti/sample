import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Dashboard from "./pages/Dashboard"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Header from "./components/Header"
import { ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';
import UpdateTask from "./components/UpdateTask"
import ForgotPassword from "./pages/Forgetpassword"
import PasswordResetForm from "./pages/RechangePassword"



function App() {
  

  return (
    <>
    <Router>
        <div className="container">
          <Header/>
            <Routes>
              <Route path="/" element={<Dashboard/>}/>
              <Route path="/login" element={<Login/>}/>
              <Route path="/register" element={<Register/>}/>
              <Route path="/forgetpassword" element={<ForgotPassword/>}/>
              <Route path="/update/:taskId" element={<UpdateTask />} />
              <Route path="/rechange-password/:token" element={<PasswordResetForm/>} />
            </Routes>
        </div>
    </Router>
    <ToastContainer/>
     
    </>
  )
}

export default App
