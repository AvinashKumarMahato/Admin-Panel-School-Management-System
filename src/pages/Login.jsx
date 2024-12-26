import React, { useContext, useState } from 'react';
import axios from 'axios';
import { TeacherContext } from '../context/TeacherContext';
import { AdminContext } from '../context/AdminContext';
import { toast } from 'react-toastify';

const Login = () => {
  const [state, setState] = useState('Admin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const { setDToken } = useContext(TeacherContext);
  const { setAToken } = useContext(AdminContext);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    
    if (!email.trim() || !password.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);

    try {
      let response;
      
      if (state === 'Admin') {
        response = await axios.post(`${backendUrl}/api/admin/login`, 
          { email, password },
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
        
        if (response.data.success) {
          setAToken(response.data.token);
          localStorage.setItem('aToken', response.data.token);
          
          // Store admin data if available
          if (response.data.admin) {
            localStorage.setItem('adminData', JSON.stringify(response.data.admin));
          }
          
          toast.success('Admin login successful');
          window.location.href = '/admin/dashboard';
        }
      } else {
        response = await axios.post(`${backendUrl}/api/teacher/login`,
          { email, password },
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
        
        if (response.data.success) {
          setDToken(response.data.token);
          localStorage.setItem('dToken', response.data.token);
          
          // Store teacher data if available
          if (response.data.teacher) {
            localStorage.setItem('teacherData', JSON.stringify(response.data.teacher));
          }
          
          toast.success('Teacher login successful');
          window.location.href = '/teacher-classes';
        }
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Login failed. Please try again.';
      toast.error(errorMessage);
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStateChange = (newState) => {
    setState(newState);
    setEmail('');
    setPassword('');
  };

  return (
    <form onSubmit={onSubmitHandler} className="min-h-[80vh] flex items-center">
      <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg">
        <p className="text-2xl font-semibold m-auto">
          <span className="text-primary">{state}</span> Login
        </p>
        
        <div className="w-full">
          <p>Email</p>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            className="border border-[#DADADA] rounded w-full p-2 mt-1"
            type="email"
            required
            placeholder={`Enter ${state.toLowerCase()} email`}
            disabled={isLoading}
          />
        </div>
        
        <div className="w-full">
          <p>Password</p>
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            className="border border-[#DADADA] rounded w-full p-2 mt-1"
            type="password"
            required
            placeholder="Enter password"
            disabled={isLoading}
          />
        </div>
        
        <button 
          type="submit"
          className={`w-full py-2 rounded-md text-base transition-all duration-200 ${
            isLoading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-primary text-white hover:opacity-90'
          }`}
          disabled={isLoading}
        >
          {isLoading ? 'Logging in...' : `Login as ${state}`}
        </button>
        
        <p>
          {state === 'Admin' ? (
            <>
              Teacher Login?{' '}
              <span
                onClick={() => !isLoading && handleStateChange('Teacher')}
                className={`text-primary underline cursor-pointer hover:text-opacity-80 ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                Click here
              </span>
            </>
          ) : (
            <>
              Admin Login?{' '}
              <span
                onClick={() => !isLoading && handleStateChange('Admin')}
                className={`text-primary underline cursor-pointer hover:text-opacity-80 ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                Click here
              </span>
            </>
          )}
        </p>
      </div>
    </form>
  );
};

export default Login;