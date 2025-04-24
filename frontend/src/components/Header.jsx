import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png'; // Replace with your actual logo
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
    <header className="fixed top-0 left-0 right-0 z-30 w-full">
      <div
        className={`${
          active ? 'bg-white py-2.5' : 'py-3'
        } max-padd-container flex justify-between items-center transition-all duration-300 px-4`}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center justify-start flex-1">
          <img
            src={logo}
            alt="App Logo"
            height={32}
            width={32}
            className="rounded-full mr-2"
          />
          <h4 className="text-blue-950 font-bold text-xl">Signify</h4>
        </Link>

        {/* Navbar */}
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
              className="text-2xl xl:hidden cursor-pointer"
              aria-label="Open Menu"
              onClick={toggleMenu}
            />
          )}

          {/* Optionally, add a login button or any other functionality */}
          <button
            className="btn-outline flex items-center gap-x-2"
            aria-label="Login Button"
          >
            <FaRegUserCircle className='text-xl text-blue-950' />
            {/* Add Login/Sign-Up functionality here if needed */}
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
