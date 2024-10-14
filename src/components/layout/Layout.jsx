import React from "react";
import Sidebar from "../sidebar/Sidebar";
import Header from "../header/Header";
import Footer from "../footer/Footer";

const Layout = ({ children }) => {
  return (
    <div className="bg-black min-h-screen">
      <div className="hidden  md:flex md:items-start ">
        <Sidebar />

        <div className="w-[70%] mx-auto pl-[60px] flex flex-col">
          {children}
          <div className="pt-8">
            <p className="text-center text-[#f5f5f5] text-[0.91rem] pb-[1.5rem]">
              &copy; 2024 Instagram from Meta
            </p>
          </div>
        </div>
      </div>

      <div className="block md:hidden">
        <Header />
        <div className="pb-[3rem]">{children}</div>

        <Footer />
      </div>
    </div>
  );
};

export default Layout;
