import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { IoEye, IoEyeOff } from "react-icons/io5";

export const Signup = () => {
  let navigate=useNavigate();
  let [showPassword,setShowPassword]=useState(false);
  const [form, setForm] = useState({ name: '', email: '',phone:'', password: '',rePassword:'' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async () => {
    try {
      const res = await axios.post('https://chatapp-rtvj.onrender.com/api/signup', form);
      navigate('/user/login')
    } catch (err) {
      alert(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className='w-full'>
 
    <div className="min-h-screen flex items-center justify-center px-4 shadow-2xl bg-zinc-50">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md ">
        <h2 className="text-3xl font-bold mb-6  ">Sign Up</h2>

        <label htmlFor="" className='font-medium text-[17.5px]'>Name</label>
        <input
          type="name"
          name='name'
          placeholder="Enter your name..."
          className="w-full mb-4 px-2 pt-1.5 pb-2  focus:outline-none border-b-1  placeholder:italic "
          value={form.name}
          onChange={handleChange}
        />

        <label htmlFor="" className='font-medium text-[17.5px]'>Email</label>
        <input
          type="email"
          name='email'
          placeholder="Enter your email..."
          className="w-full mb-4 px-2 pt-1.5 pb-2 focus:outline-none border-b-1  placeholder:italic "
          value={form.email}
          onChange={handleChange}
        />

        <label htmlFor="" className='font-medium text-[17.5px]'>Phone</label>
        <input
          type="number"
          name='phone'
          placeholder="Enter your phone number..."
          className="w-full mb-4 px-2 pt-1.5 pb-2 focus:outline-none border-b-1  placeholder:italic "
          value={form.phone}
          onChange={handleChange}
          autoComplete='off'
        />

        <label htmlFor="" className='font-medium text-[17.5px] '>Password</label>
        <input
          type="password"
          name='password'
          placeholder="Enter your password..."
          className="w-full mb-4 px-2 pt-1.5 pb-2 focus:outline-none border-b-1  placeholder:italic"
          value={form.password}
          onChange={handleChange}
        />

        <label htmlFor="" className='font-medium text-[17.5px] '>Confirm Password</label>
        <div className='w-full flex'>
        <input
          type={showPassword? 'text':'password'}
          name='rePassword'
          placeholder="Re-Enter your password..."
          className="w-full mb-4 px-2 pt-1.5 pb-2  focus:outline-none border-b-1  placeholder:italic"
          value={form.rePassword}
          onChange={handleChange}
        />
        {form.rePassword && (!showPassword? <IoEye className='text-2xl mt-1' onClick={()=>setShowPassword(true)}/> :
        <IoEyeOff className='text-2xl mt-1'onClick={()=>setShowPassword(false)}/>)}
        </div>
        <button
          onClick={handleSignup}
          className="w-full bg-violet-600 hover:bg-violet-700 text-white py-2 rounded mt-2 mb-4 font-semibold"
        >
          Sign Up
        </button>

        <p className='text-center font-medium'>Already have an account?<a href='' onClick={()=>navigate("/user/login")} className='text-blue-600 ml-1 hover:underline'>
          Login
        </a></p>
      </div>
    </div>
    </div>
  );
};
