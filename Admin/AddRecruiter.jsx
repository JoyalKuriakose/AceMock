import React, { useState } from 'react';
import moment from 'moment';
import { db } from '../utils/db';
import { Recruiter } from '../utils/schema';
import { Button } from '../src/components/ui/button';
import { FiEye, FiEyeOff } from 'react-icons/fi';

function AddRecruiter() {
  const [formData, setFormData] = useState({
    recruiterName: '',
    companyName: '',
    userName: '',
    password: '',
    email: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await db.insert(Recruiter).values({
        recruiterNAme: formData.recruiterName,
        companyName: formData.companyName,
        userName: formData.userName,
        password: formData.password,
        email: formData.email,
      });

      setMessage({ type: 'success', text: 'Recruiter added successfully!' });
      setFormData({
        recruiterName: '',
        companyName: '',
        userName: '',
        password: '',
        email: '',
      });
    } catch (error) {
      console.error('Error adding recruiter:', error);
      setMessage({ type: 'error', text: 'Something went wrong. Please try again.' });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-lg border">
        <h2 className="text-xl font-bold text-center text-primary mb-4">Add Recruiter</h2>

        {message.text && (
          <div
            className={`mb-4 text-center font-medium ${
              message.type === 'success' ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Recruiter Name</label>
            <input
              type="text"
              name="recruiterName"
              value={formData.recruiterName}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring focus:border-primary"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Company Name</label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring focus:border-primary"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Username</label>
            <input
              type="text"
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring focus:border-primary"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-xl pr-10 focus:outline-none focus:ring focus:border-primary"
                required
              />
              <span
                className="absolute right-0 top-20 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </span>
            </div>
          </div>

          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring focus:border-primary"
              required
            />
          </div>

          <div>
            <Button
              type="submit"
              className="bg-primary w-full text-white py-2 rounded-xl shadow hover:bg-primary/90"
            >
              Add Recruiter
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddRecruiter;
