import React, { useContext, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { IoEye, IoEyeOff } from "react-icons/io5";
import { toast } from 'react-toastify';

export const Login = () => {
  let navigate=useNavigate();
  let [showPassword,setShowPassword]=useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
      await axios.post('https://chatapp-rtvj.onrender.com/api/login',{ email, password },{withCredentials:true}).then((res)=>{
        // setUser(res.data.user)
        navigate('/chat');
        toast.success('Logged in Successfully')
      })
    .catch ((err)=> {
      alert(err.response?.data?.message || 'Login failed');
      console.log(err);
    })
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 shadow-2xl bg-zinc-50">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md ">
        <h2 className="text-3xl font-bold mb-6  ">Login</h2>

        <label htmlFor="" className='font-medium text-[17.5px]'>Email</label>
        <input
          type="email"
          placeholder="Enter your email..."
          className="w-full mb-6 px-2 py-2  focus:outline-none border-b-1 mt-1 placeholder:italic "
          onChange={(e) => setEmail(e.target.value)}
        />

        <label htmlFor="" className='font-medium text-[17.5px] '>Password</label>
        <div className='w-full flex'>
        <input
          type={showPassword? 'text':'password'}
          placeholder="Enter your password..."
          className="w-full mb-3 px-2 py-2  focus:outline-none border-b-1 mt-1 placeholder:italic"
          onChange={(e) => setPassword(e.target.value)}
        />
        {password &&  (!showPassword? <IoEye className='text-2xl mt-2.5' onClick={()=>setShowPassword(true)}/> :
        <IoEyeOff className='text-2xl mt-2.5'onClick={()=>setShowPassword(false)}/>)}
        
        </div>
        <button
          onClick={handleLogin}
          className="w-full bg-violet-600 hover:bg-violet-700 text-white py-2 rounded mt-2 mb-4 font-semibold"
        >
          Login
        </button>

        <p className='text-center font-medium'>Don't have an account?<a href='' onClick={()=>navigate("/user/signup")} className='text-blue-600 ml-1 hover:underline'>
          Sign Up
        </a></p>
      </div>
    </div>
  );
};
