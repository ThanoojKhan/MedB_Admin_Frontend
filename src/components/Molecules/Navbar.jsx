import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setAuthenticated } from "../../redux/slices/authSlice";
import useAuth from "../../hooks/useAuth";
import logo from "../../assets/medb-logo.svg";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { logout } = useAuth();
  const { authenticated } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    const confirmation = confirm("Are you sure you want to logout?");
    if (!confirmation) return;

    dispatch(setAuthenticated(false));
    await logout();
    navigate("/login");
  };

  const handleAddDoctorClick = () => {
    navigate("/addDoctor"); 
  };

  return (
    <nav className="flex justify-between items-center p-4 bg-gray-800 text-white">
      <div className="flex items-center">
        <img
          src={logo}
          alt="Logo"
          className="max-w-[150px] h-auto object-contain"
        />
      </div>
      <div className="flex items-center space-x-4">
        {authenticated && (
          <>
            <button
              onClick={handleAddDoctorClick}
              className="px-4 py-2 text-black rounded-lg hover:transform hover:scale-105 transition duration-100"
            >
              Add Doctor
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition duration-300"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
