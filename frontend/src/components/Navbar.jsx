import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '/assets/logo.png'; // Replace with your actual logo path
import Navbar from './Navbar';
import { FiAlignJustify } from "react-icons/fi";
import { FaRegUserCircle } from "react-icons/fa";

function Header() {
  const [menuOpened, setMenuOpened] = useState(false);
  const [active, setActive] = useState(false);

  const toggleMenu = () => {
    setMenuOpened(!menuOpened);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        if (menuOpened) {
          setMenuOpened(false);
        }
      }
      setActive(window.scrollY > 30);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [menuOpened]);

  return (
    <header className="fixed top-0 left-0 right-0 z-30 w-full transition-all duration-300">
      <div
        className={`${
          active ? 'bg-white dark:bg-gray-800 py-2.5 shadow-md' : 'bg-white dark:bg-gray-800 py-3 shadow-sm'
        } max-padd-container flex justify-between items-center px-4 transition-all duration-300`}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center justify-start flex-1">
          <img
            src={logo}
            alt="App Logo"
            height={36}
            width={36}
            className="rounded-full mr-3 transition-all duration-200 hover:scale-105"
          />
          <h4 className="text-violet-700 dark:text-violet-300 font-bold text-2xl tracking-tight">Signify</h4>
        </Link>

        {/* Navbar (Top Bar on Desktop) */}
        <div className="flex-1 hidden xl:flex justify-center gap-x-8 xl:gap-x-14">
          <Navbar
            menuOpened={menuOpened}
            toggleMenu={toggleMenu}
            containerStyles="flex gap-x-8"
          />
        </div>

        {/* Right Side */}
        <div className="flex items-center justify-end gap-x-3 sm:gap-x-10 flex-1">
          {/* Mobile Menu Icon */}
          {!menuOpened && (
            <FiAlignJustify
              className="text-2xl xl:hidden cursor-pointer text-violet-600 dark:text-violet-400 transition-all duration-200 hover:scale-110"
              aria-label="Open Menu"
              onClick={toggleMenu}
            />
          )}

          {/* Login Button */}
          <button
            className="flex items-center gap-x-2 px-4 py-2 rounded-xl border border-violet-300 dark:border-violet-600 text-violet-700 dark:text-violet-300 font-medium hover:bg-violet-50 dark:hover:bg-violet-900/30 transition-all duration-200 shadow-sm hover:shadow-md focus:ring-2 focus:ring-violet-400/50"
            aria-label="Login Button"
          >
            <FaRegUserCircle className="text-xl text-violet-600 dark:text-violet-400" />
            <span>Login</span>
          </button>
        </div>
      </div>

      {/* Mobile Sidebar (Visible when menu is opened on smaller screens) */}
      {menuOpened && (
        <div className="fixed top-0 left-0 w-3/4 h-full bg-white dark:bg-gray-800 shadow-xl z-40 transform transition-transform duration-300 translate-x-0 xl:hidden">
          <Navbar
            menuOpened={menuOpened}
            toggleMenu={toggleMenu}
            containerStyles="flex flex-col gap-4 p-4"
          />
        </div>
      )}
      {menuOpened && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-30 xl:hidden" onClick={toggleMenu}></div>
      )}
    </header>
  );
}

export default Header;
