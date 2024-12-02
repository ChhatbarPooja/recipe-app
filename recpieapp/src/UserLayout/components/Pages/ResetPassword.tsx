import { useState } from 'react';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { notify } from '../../../common/Toast';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const validatePassword = (password: string) => {
    // Define the password validation criteria
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasDigit = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
      return `Password must be at least ${minLength} characters long.`;
    }
    if (!hasUpperCase) {
      return "Password must contain at least one uppercase letter.";
    }
    if (!hasLowerCase) {
      return "Password must contain at least one lowercase letter.";
    }
    if (!hasDigit) {
      return "Password must contain at least one digit.";
    }
    if (!hasSpecialChar) {
      return "Password must contain at least one special character.";
    }

    return null; // Validation passed
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const passwordError = validatePassword(password);
    if (passwordError) {
      notify(passwordError, { type: "error" });
      return;
    }
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:3000/auth/reset-password/${token}`,
        { password },
      );
      setMessage(response.data.message);
      if (response.status === 200) {
        notify(response.data.message, { type: 'success' })
        navigate('/');
      }
    } catch (error:any) {
      setMessage('Error resetting password. Please try again.');
      notify(error.response.data.message, { type: 'error' })
    }
  };

  return (
    <div className="flex justify-center items-center mt-40">
      <form className="space-y-5" onSubmit={handleSubmit}>
        <h2 className="">Reset Your Password</h2>
        <div>
          <input
            type="password"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  block w-full p-2.5"
            required
          />
          <br />
          <input
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  block w-full p-2.5"
            required
          />
        </div>
        {message && <p className='text-red-500'>{message}</p>}
        <button
          type="submit"
          className="w-full text-white bg-green-500 focus:ring-4 focus:outline-none  font-medium rounded-lg text-sm px-5 py-2.5 text-center "
        >
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
