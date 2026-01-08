import React, { useState } from 'react';
import RecruiterHeader from './RecruiterHeader';
import Footer from '../src/components/custom/Footer';
import { db } from '../utils/db';
import { Candidate } from '../utils/schema';
import { Button } from '../src/components/ui/button';
import { FiEye, FiEyeOff } from 'react-icons/fi';

function AddCandidate() {
  const [formData, setFormData] = useState({
    candidateName: '',
    userName: '',
    password: '',
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
      await db.insert(Candidate).values({
        candidateName: formData.candidateName,
        userName: formData.userName,
        password: formData.password,
      });

      setMessage({ type: 'success', text: 'Candidate added successfully!' });
      setFormData({
        candidateName: '',
        userName: '',
        password: '',
      });
    } catch (error) {
      console.error('Error adding candidate:', error);
      setMessage({ type: 'error', text: 'Something went wrong. Please try again.' });
    }
  };

  return (
    <>
      <RecruiterHeader />
      
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-lg border">
          <h2 className="text-xl font-bold text-center text-primary mb-4">Add Candidate</h2>

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
              <label className="block mb-1 font-medium">Candidate Name</label>
              <input
                type="text"
                name="candidateName"
                value={formData.candidateName}
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
                  className="w-full px-4 py-2 pr-12 border rounded-xl focus:outline-none focus:ring focus:border-primary"
                  required
                />
                <span
                  className="absolute right-4 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </span>
              </div>
            </div>
            <div className="flex justify-center">
              <Button
                type="submit"
                className="bg-primary w-auto text-white py-1 px-4 text-sm rounded-xl shadow hover:bg-primary/90"
              >
                Add Candidate
              </Button>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default AddCandidate;
