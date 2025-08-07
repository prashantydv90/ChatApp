import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Signup } from "./components/Signup"
import { Login } from "./components/Login"
import {ChatApp} from "./components/ChatApp"
import { ToastContainer } from "react-toastify"


function App() {

  return (
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000} theme="light"  />
      <Routes>
        <Route path='/' element={<Login/>} />
        <Route path='/chat/:userId?' element={<ChatApp/>} />
        <Route path='/user/login' element={<Login/>}/>
        <Route path='/user/signup' element={<Signup/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
