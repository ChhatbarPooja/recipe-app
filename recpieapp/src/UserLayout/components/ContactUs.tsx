import axios from 'axios';
import background from '../../images/bg-img/breadcumb4.jpg';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { notify } from '../../common/Toast';

const SignupSchema = Yup.object().shape({
  name: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Please enter name'),
  email: Yup.string().matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0.-]+\.[a-zA-Z]{2,}$/, 'Invalid email address').required('Please enter email'),
  subject: Yup.string().required('Please enter subject'),
  message: Yup.string().required('Please enter message'),
});

const ContactUs = () => {
  return (
    <>
      <div className="container mx-auto">
        <div
          style={{ backgroundImage: `url(${background})` }}
          className="bg-cover h-44 container mx-auto items-center my-10 text-white flex justify-center text-3xl font-semibold md:opacity-60 lg:opacity-60"
        >
          <p>Recipe</p>
        </div>
        <div className="lg:mx-30">
          <div>
            <p className='text-3xl text-black flex justify-center font-semibold py-10'>Get In Touch</p>
            <Formik
              initialValues={{
                name: '',
                email: '',
                subject: '',
                message: '',
              }}
              validationSchema={SignupSchema}
              onSubmit={async (values, { resetForm }) => {
                try {
                  await axios.post('http://localhost:3000/contact', values);
                  notify('Message sent successfully , we will get back to you soon', { type: 'success' })
                  resetForm();
                } catch (error) {
                  console.error('Error sending message:', error);
                }
              }}
            >
              <div className='flex justify-center'>
                <Form className='space-y-5'>
                  <div>
                    <Field
                      type='text'
                      name='name'
                      className='py-3 px-10 lg:w-[500px] bg-[#f3f5f8] focus:outline-none'
                      placeholder='Name'
                    />
                    <ErrorMessage name='name' component='div' className='text-red-500' />
                  </div>
                  <div>
                    <Field
                      type='email'
                      name='email'
                      className='py-3 px-10 lg:w-[500px] bg-[#f3f5f8] focus:outline-none'
                      placeholder='Email'
                    />
                    <ErrorMessage name='email' component='div' className='text-red-500' />
                  </div>
                  <div>
                    <Field
                      type='text'
                      name='subject'
                      className='py-3 px-10 lg:w-[500px] bg-[#f3f5f8] focus:outline-none'
                      placeholder='Subject'
                    />
                    <ErrorMessage name='subject' component='div' className='text-red-500' />
                  </div>
                  <div>
                    <Field
                      as='textarea'
                      name='message'
                      className='py-3 px-10 w-80 lg:w-[500px] bg-[#f3f5f8] focus:outline-none'
                      placeholder='Message'
                    />
                    <ErrorMessage name='message' component='div' className='text-red-500' />
                  </div>
                  <div className='flex justify-center'>
                    <button type='submit' className='py-4 px-15 bg-[#40ba37] text-white items-center'>Send</button>
                  </div>
                </Form>
              </div>

            </Formik>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactUs;
