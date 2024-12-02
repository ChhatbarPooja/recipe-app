import axios from "axios";
import { useState } from "react"
import { notify } from "../../common/Toast";

interface ChangePassword {
  currentPassword : string,
  newPassword:string,
  confirmPassword:string
}
const ChangePassword = () => {
  const token = localStorage.getItem('token')
  const [data , setData] = useState<ChangePassword>({
    currentPassword : '',
    newPassword:'',
    confirmPassword:''
  })

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

  const handleInputChange = (
    key: keyof ChangePassword,
    value: string | number | boolean | File | null,
  ) => {
    setData ({
      ...data,
      [key]: value,
    });
  };

  const handleSubmit = async(e:any)=>{
    e.preventDefault()
    const passwordError = validatePassword(data.newPassword);
    if (passwordError) {
      notify(passwordError, { type: "error" });
      return;
    }
    try {
       await axios.put(`http://localhost:3000/auth/change-password`, data , {
        headers :{
          'Content-Type' : 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
      notify('Password change successfully',{type:'success'})
      setData({
        currentPassword : '',
        newPassword:'',
        confirmPassword:''
      });
    } catch (error:any) {
      notify(error.response.data.message,{type:'error'})
    }

  }

  return (
    <div className='py-10 items-center'>
      <form className="space-y-5" onSubmit={handleSubmit}>
        <h2 className="flex justify-center text-xl font-medium">Change password</h2>
        <div className=''>
            <div className='flex justify-center'>

        <input
            type="password"
            placeholder="Enter current password"
            value={data.currentPassword}
            onChange={(e) => handleInputChange( 'currentPassword' , e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  block w-90 p-2.5"
            required
            />
            </div>
          <br/>
          <div className='flex justify-center'>

          <input
            type="password"
            placeholder="Enter new password"
            value={data.newPassword}
            onChange={(e) => handleInputChange( 'newPassword' , e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  block w-90 p-2.5"
            required
          />
          </div>
          <br />
          <div className='flex justify-center'>

          <input
            type="password"
            placeholder="Confirm new password"
            value={data.confirmPassword}
            onChange={(e) => handleInputChange( 'confirmPassword' , e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  block w-90 p-2.5"
            required
          />
          </div>
        </div>
        {/* {message && <p className='text-red-500'>{message}</p>} */}
        <div className='flex justify-center'>
        <button
          type="submit"
          className="w-90 text-white bg-green-500 focus:ring-4 focus:outline-none  font-medium rounded-lg text-sm px-5 py-2.5 text-center "
        >
          Change Password
        </button>
        </div>
      </form>
    </div>
  )
}

export default ChangePassword
