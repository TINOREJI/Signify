import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { FaHome } from "react-icons/fa";
import { MdOutlineGTranslate } from "react-icons/md";
import { IoMailOpenOutline } from "react-icons/io5";
import { FaRegWindowClose } from "react-icons/fa";

const Navbar = ({ containerStyles, menuOpened, toggleMenu }) => {
  const NavItems = [
    { to: '/', label: 'Home', icon: <FaHome /> },
    { to: '/texttosign', label: 'Text to Sign', icon: <MdOutlineGTranslate /> },
    { to: 'mailto:contact@signifyapp.com', label: 'Contact', icon: <IoMailOpenOutline /> },
  ];

  const handleToggleMenu = () => {
    if (toggleMenu) toggleMenu();
  };

  return (
    <nav className={`${containerStyles} transition-all duration-300`}>
      {/* Close Button (Visible on mobile when menu is open) */}
      {menuOpened && (
        <FaRegWindowClose
          onClick={handleToggleMenu}
          className="text-2xl self-end cursor-pointer mb-4 text-violet-600 dark:text-violet-400 hover:scale-110 transition-all duration-200"
          aria-label="Close Menu"
        />
      )}


      {/* Navigation Items */}
      {NavItems.map(({ to, label, icon }) =>
        to.startsWith('mailto') ? (
          <a
            key={label}
            href={to}
            onClick={menuOpened ? handleToggleMenu : undefined}
            className="flex items-center gap-x-3 text-violet-700 dark:text-violet-300 font-medium py-2 px-3 rounded-lg hover:bg-violet-50 dark:hover:bg-violet-900/30 transition-all duration-200 shadow-sm hover:shadow-md focus:ring-2 focus:ring-violet-400/50"
          >
            <span className="text-xl">{icon}</span>
            <span className="text-base">{label}</span>
          </a>
        ) : (
          <div key={label} className="inline-flex items-center py-2 px-3 rounded-lg transition-all duration-200 shadow-sm">
            <NavLink
              to={to}
              onClick={menuOpened ? handleToggleMenu : undefined}
              className={({ isActive }) =>
                `flex items-center gap-x-3 font-medium relative ${
                  isActive
                    ? 'text-violet-600 dark:text-violet-400'
                    : 'text-violet-700 dark:text-violet-300'
                }`
              }
            >
              {({ isActive }) => (
                <div className="flex items-center gap-x-3">
                  <span className="text-xl">{icon}</span>
                  <span className="text-base relative">
                    {label}
                    {isActive && (
                      <span className="absolute left-0 right-0 -bottom-1 h-0.5 bg-violet-600 dark:bg-violet-400 rounded-full transition-all duration-300"></span>
                    )}
                  </span>
                </div>
              )}
            </NavLink>
          </div>
        )
      )}
    </nav>
  );
};

export default Navbar;
