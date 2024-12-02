import React from 'react';
import { ToastContainer, toast, ToastContainerProps, ToastOptions } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Toast: React.FC<ToastContainerProps> = (props) => {
  return <ToastContainer {...props} />;
};

export const notify = (message: string, options?: ToastOptions) => {
  toast(message, options);
};

export default Toast;
