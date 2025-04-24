import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { FaHome } from "react-icons/fa";
import { MdOutlineGTranslate } from "react-icons/md";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { IoMailOpenOutline } from "react-icons/io5";
import { FaRegWindowClose } from "react-icons/fa";
import logo from '../assets/logo.png'; // Replace with your actual logo

const Navbar = ({ containerStyles, menuOpened, toggleMenu }) => {
  const NavItems = [
    { to: '/', label: 'Home', icon: <FaHome /> },
    { to: '/texttosign', label: 'Text to Sign', icon: <MdOutlineGTranslate /> },
    { to: '/about', label: 'About', icon: <IoIosInformationCircleOutline /> },
    { to: 'mailto:contact@signifyapp.com', label: 'Contact', icon: <IoMailOpenOutline /> },
  ];

  return (
    <nav className={containerStyles}>
      {/* Close Button (Visible on mobile when menu is open) */}
      {menuOpened && (
        <>
          <FaRegWindowClose
            onClick={toggleMenu}
            className="text-xl self-end cursor-pointer relative left-[18px] mb-4"
          />

          {/* Logo */}
          <Link to="/" className="bold-24 mb-10 flex items-center justify-center">
            <img src={logo} alt="App Logo" height={50} width={50} className="sm:flex mr-2 rounded-full" />
            <h4 className="text-blue-950">Signify</h4>
          </Link>
        </>
      )}

      {/* Navigation Items */}
      {NavItems.map(({ to, label, icon }) =>
        to.startsWith('mailto') ? (
          <a
            key={label}
            onClick={menuOpened ? toggleMenu : undefined}
            href={to}
            className="flex items-center gap-x-2 text-blue-950"
          >
            <span className="text-xl">{icon}</span>
            <span className="medium-16">{label}</span>
          </a>
        ) : (
          <div key={label} className="inline-flex items-center">
            <NavLink
              to={to}
              className={({ isActive }) =>
                isActive
                  ? "flex items-center gap-x-2 border-b-2 border-blue-900" // Active link with underline
                  : "flex items-center gap-x-2"
              }
              onClick={menuOpened ? toggleMenu : undefined}
            >
              <span className="text-xl text-blue-950">{icon}</span>
              <span className="medium-16 text-blue-950">{label}</span>
            </NavLink>
          </div>
        )
      )}
    </nav>
  );
};

export default Navbar;
