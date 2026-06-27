import { useState, useContext, useEffect } from "react";
import { Link, NavLink } from "react-router";
import { FiShoppingBag, FiLoader } from "react-icons/fi";
import { FiMenu } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";
import { MdLogout } from "react-icons/md";
import { MdFastfood } from "react-icons/md";

import { signOut } from "firebase/auth";
import { auth } from "../../services/firebaseConnection";

import { AuthContext } from "../../contexts/AuthContext";
import { CartContext } from "../../contexts/CartContext";

import { AnimatePresence, motion } from "motion/react";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { signed, isAdmin, loadingAuth } = useContext(AuthContext);
  const { totalAmount } = useContext(CartContext);

  useEffect(() => {
    function handleRezise(e: MediaQueryListEvent){
      if(e.matches){
        setIsMenuOpen(false)
      }
    }

    let windowWidth = matchMedia("(min-width: 768px)");
    windowWidth.addEventListener("change", handleRezise)

    return () => {
      windowWidth.addEventListener("change", handleRezise)
    }
  }, [])

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isMenuOpen]);

  function toggleMenu() {
    setIsMenuOpen((prev) => !prev);
  }

  async function handleLogout() {
    await signOut(auth);
  }

  return (
    <>
      <header className="w-full py-3.5 fixed z-10 bg-white shadow-md">
        <div className="max-w-6xl w-full mx-auto px-3 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-1">
            <MdFastfood size={32} color="#FA2828" />
            <span className="font-extrabold text-xl">
              Dev<span className="text-[#FA2828]">Food</span>
            </span>
          </Link>

          <nav className="md:flex hidden items-center gap-10 text-md">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive
                  ? "text-[#FA2828]"
                  : "hover:text-red-300 transition-colors duration-300"
              }
            >
              Início
            </NavLink>

            <NavLink
              to="/menu"
              className={({ isActive }) =>
                isActive
                  ? "text-[#FA2828]"
                  : "hover:text-red-300 transition-colors duration-300"
              }
            >
              Cardápio
            </NavLink>
            {isAdmin && (
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  isActive
                    ? "text-[#FA2828]"
                    : "hover:text-red-300 transition-colors duration-300"
                }
              >
                Painel
              </NavLink>
            )}
          </nav>

          {signed ? (
            <div className="flex items-center gap-5">
              {!isAdmin && (
                <Link to="/cart" className="hidden md:block relative">
                  <FiShoppingBag size={26} color="#FA2828" />
                  {totalAmount > 0 && (
                    <div className="bg-[#FA2828] rounded-full flex items-center justify-center absolute h-5 w-5 text-xs text-white -top-2 -right-2">
                      <p>{totalAmount}</p>
                    </div>
                  )}
                </Link>
              )}

              <div
                className="md:flex hidden px-3 py-1.5 rounded-md text-white bg-[#e48080] hover:bg-[#cf2323] transition-colors duration-300 cursor-pointer"
                onClick={handleLogout}
              >
                <MdLogout size={18} />
              </div>
            </div>
          ) : (
            <Link
              className="md:block hidden px-6 py-1.5 rounded-md text-white bg-[#FA2828] hover:bg-[#cf2323] transition-colors duration-300"
              to="/login"
            >
              {loadingAuth ? (
                <FiLoader size={16} className="animate-spin" />
              ) : (
                <p className="font-bold">Entrar</p>
              )}
            </Link>
          )}

          <div className="flex md:hidden items-center gap-5">
            {!isAdmin && signed && (
              <Link to="/cart" className="relative pointer">
                <FiShoppingBag size={26} color="#FA2828" />
                {totalAmount > 0 && (
                  <div className="bg-[#FA2828] rounded-full flex items-center justify-center absolute h-5 w-5 text-xs text-white -top-2 -right-2">
                    <p>{totalAmount}</p>
                  </div>
                )}
              </Link>
            )}

            <AnimatePresence mode="wait">
              {isMenuOpen ? (
                <motion.button
                  type="button"
                  aria-label="close"
                  key="close"
                  className="md:hidden rounded-full p-1.5 transition-colors hover:bg-red-200"
                  initial={{ rotate: 90, scale: 0, opacity: 0 }}
                  animate={{ rotate: 0, scale: 1, opacity: 1 }}
                  exit={{ rotate: -90, scale: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <IoMdClose onClick={toggleMenu} color="#FA2828" size={35} />
                </motion.button>
              ) : (
                <motion.button
                  type="button"
                  aria-label="menu"
                  key="menu"
                  className="md:hidden rounded-full p-1.5 transition-colors hover:bg-red-200"
                  initial={{ rotate: -90, scale: 0, opacity: 0 }}
                  animate={{ rotate: 0, scale: 1, opacity: 1 }}
                  exit={{ rotate: 90, scale: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <FiMenu onClick={toggleMenu} color="#FA2828" size={35} />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>

        {isMenuOpen && (
          <motion.nav
            className="md:hidden px-3 pt-2 text-center flex flex-col gap-3 mt-3 border-t border-gray-300"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive
                  ? "bg-red-400 text-white py-2 rounded-md text-lg active:bg-red-300 active:scale-98"
                  : "py-2 text-lg"
              }
              onClick={toggleMenu}
            >
              Início
            </NavLink>
            <NavLink
              to="/menu"
              className={({ isActive }) =>
                isActive
                  ? "bg-red-400 text-white py-2 rounded-md text-lg active:bg-red-300 active:scale-98"
                  : "py-2 text-lg"
              }
              onClick={toggleMenu}
            >
              Cardápio
            </NavLink>
            {isAdmin && (
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  isActive
                    ? "bg-red-400 text-white py-2 rounded-md text-lg active:bg-red-300 active:scale-98"
                    : "py-2 text-lg"
                }
                onClick={toggleMenu}
              >
                Painel
              </NavLink>
            )}
            {signed ? (
              <div
                className="flex items-center justify-center gap-2 py-2 rounded-md text-white font-semibold bg-[#e48080] transition-colors duration-300"
                onClick={handleLogout}
              >
                Sair <MdLogout size={18} />
              </div>
            ) : (
              <Link
                className="flex items-center justify-center py-2 rounded-md text-white font-semibold bg-[#FA2828]"
                to="/login"
              >
                Entrar
              </Link>
            )}
          </motion.nav>
        )}
      </header>
      {isMenuOpen && (
        <motion.div
          className="fixed bg-black/30 backdrop-blur-xs h-screen inset-0 w-full z-5 transition-all duration-300"
          onClick={toggleMenu}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        ></motion.div>
      )}
    </>
  );
}
