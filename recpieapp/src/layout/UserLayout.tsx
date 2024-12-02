import React, { useState, ReactNode } from 'react';
import Header from '../components/Header/index';
import Sidebar from '../components/Sidebar/index';
import Footer from '../UserLayout/components/Footer';

const UserLayout : React.FC<{ children: ReactNode }> = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
  
    return (
        <div className="flex flex-col min-h-screen dark:bg-boxdark-2 dark:text-bodydark">
          {/* <!-- ===== Sidebar Start ===== --> */}
          {/* <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} /> */}
          {/* <!-- ===== Sidebar End ===== --> */}
  
          {/* <!-- ===== Content Area Start ===== --> */}
          <div className=" flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
            {/* <!-- ===== Header Start ===== --> */}
            {/* <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} /> */}
            {/* <!-- ===== Header End ===== --> */}
  
            {/* <!-- ===== Main Content Start ===== --> */}
            <main className="flex-1 overflow-y-auto">
            <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
                {children}
              </div>
            </main>
            {/* <!-- ===== Main Content End ===== --> */}
          </div>
          {/* <!-- ===== Content Area End ===== --> */}
        <Footer/>
        </div>
    );
  };

  export default UserLayout;
