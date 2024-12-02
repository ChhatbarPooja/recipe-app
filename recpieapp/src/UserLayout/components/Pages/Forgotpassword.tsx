// ForgotPassword.jsx
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { notify } from '../../../common/Toast';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        'http://localhost:3000/auth/forgot-password',
        { email },
      );
      setMessage(res.data);
      notify(res.data.message, { type: 'success' })
      navigate('/');
    } catch (err:any) {
      setMessage('Error sending email');
      notify(err.res.data.message, { type: 'error' })
    }
  };

  return (
    <div className=" flex justify-center items-center">
      <div className="mt-40">
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="block mb-3 text-sm font-bold text-gray-900"
            >
              Enter Your email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  block w-full p-2.5"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full text-white bg-green-500 focus:ring-4 focus:outline-none  font-medium rounded-lg text-sm px-5 py-2.5 text-center "
          >
            Send Reset Link
          </button>
          {message && <p>{message}</p>}
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
