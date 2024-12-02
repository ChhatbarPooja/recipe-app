import { NavLink } from "react-router-dom";

const NotFound = () => {
  return (
    <>
      <div className=" flex justify-center items-center mt-60">
        <div>

        <p className="text-8xl">404 NOT FOUND</p>
        <p className="flex justify-end mt-5">Go Back To  <span className="pl-2 underline font-semibold text-[#40ba37]"><NavLink to='/'>HomePage</NavLink></span> </p>
      </div>
        </div>
    </>
  );
};

export default NotFound;
