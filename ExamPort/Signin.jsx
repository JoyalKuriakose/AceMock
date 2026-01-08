import React, { useState } from 'react';
import { FaLaptop } from 'react-icons/fa';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { db } from '../utils/db';
import { Candidate, Recruiter } from '../utils/schema';
import { eq } from 'drizzle-orm';

function Signin() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(''); // Clear previous error

    if (!username || !password) {
      setErrorMessage('Please enter both username and password.');
      return;
    }

    try {
      // Check if user is a Recruiter
      const recruiter = await db.select()
        .from(Recruiter)
        .where(eq(Recruiter.userName, username))
        .limit(1);

      if (recruiter.length > 0) {
        if (recruiter[0].password === password) {
          sessionStorage.setItem('username', username);
          navigate('/Addquestions');
          return;
        } else {
          setErrorMessage('Incorrect password for recruiter.');
          return;
        }
      }

      // Check if user is a Candidate
      const candidate = await db.select()
        .from(Candidate)
        .where(eq(Candidate.userName, username))
        .limit(1);

      if (candidate.length > 0) {
        if (candidate[0].password === password) {
          sessionStorage.setItem('username', username);
          navigate('/ExamUser/Examuserhome');
          return;
        } else {
          setErrorMessage('Incorrect password for candidate.');
          return;
        }
      }

      // Username not found
      setErrorMessage('Username not found.');

    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-5xl flex rounded-2xl shadow-lg overflow-hidden bg-white">
        {/* Left Section */}
        <div
          className="w-1/2 text-white flex flex-col items-center justify-center p-10"
          style={{ backgroundColor: '#90EE90' }}
        >
          <FaLaptop size={70} className="mb-4" />
          <h1 className="text-3xl font-serif font-semibold tracking-wider">Ace Mock</h1>
        </div>

        {/* Right Section - Login Form */}
        <div className="w-1/2 p-10 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Sign In</h2>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                className="w-full border-b border-gray-300 focus:outline-none focus:border-teal-500 py-2 placeholder-gray-500"
                required
              />
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full border-b border-gray-300 focus:outline-none focus:border-teal-500 py-2 pr-10 placeholder-gray-500"
                required
              />
              <span
                className="absolute top-1/2 right-2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </span>
            </div>

            {/* Error message shown here */}
            {errorMessage && (
              <div className="text-red-500 text-sm text-center">{errorMessage}</div>
            )}

            <button
              type="submit"
              style={{ backgroundColor: '#90EE90' }}
              className="w-full py-2 font-semibold rounded-full"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signin;
