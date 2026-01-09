import { Link, useLocation, useNavigate } from "react-router-dom";
import { HiOutlineShoppingBag, HiOutlineShoppingCart, HiOutlineHome, HiOutlineUser } from "react-icons/hi";
import { MdLogin, MdLogout, MdEdit, MdDelete, MdPerson, MdAdd, MdAddCircle, MdAddAPhoto } from "react-icons/md";
import { useState } from "react";
import { FiLogIn, FiLogOut, FiEdit, FiTrash2, FiUser, FiPlus } from "react-icons/fi";
import { FaEdit, FaTrash, FaUser, FaPlus, FaPlusSquare } from "react-icons/fa";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(sessionStorage.getItem("userId"));

  const handleLogOut = async () => {
      sessionStorage.clear();
      navigate("/login")
  };

    return (

    <nav className=" bg-blue-900 text-white fixed top-0 left-0 right-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 h-16">
        
        <Link to="/" className="text-2xl font-bold tracking-wide">
          FishMarket
        </Link>

        <div className="flex space-x-6">
          <Link className="hover:text-blue-300 transition" to="/"><HiOutlineHome size={30}/></Link>
          {location.pathname !== "/shop" && (
          <Link className="hover:text-blue-300 transition" to="/shop"><HiOutlineShoppingBag size={30}/></Link>
          )}
           {/* Hide Cart link if already on Cart page */}
          {location.pathname !== "/cart" && loggedIn &&(
            <Link to="/cart" className="hover:underline hover:text-blue-300">
              <HiOutlineShoppingCart size={30}/>
            </Link>
          )}
          {(location.pathname !== "/login" && location.pathname !== "/shop" && location.pathname !== "/checkout" && location.pathname !== "/cart") && !loggedIn &&(
          <Link
            to="/login"
            className="bg-blue text-white-900  rounded-md hover:text-blue-300 transition font-medium"
          >
            <FiLogIn size={30}/>
          </Link>
          )}

          {loggedIn && 
            <button
            onClick ={handleLogOut}
              className="bg-blue text-white-900  rounded-md hover:text-blue-300 transition font-medium"
            >
              <FiLogOut size={30}/>
            </button>
          }
        </div>
      </div>
    </nav>

    );
}

// {user && (
//           <>
//             <span className="mr-6">Hello, {user.name}</span>
//             <button
//               onClick={logout}
//               className="mr-6 hover:underline hover:cursor-pointer"
//             >
//               Logout
//             </button>
//           </>
//         )}

      
