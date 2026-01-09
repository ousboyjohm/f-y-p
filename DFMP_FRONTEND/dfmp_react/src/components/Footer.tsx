import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";


export default function Footer() {

    return (
    <footer className="bg-blue-900 text-white py-8 ">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between gap-6">

        <div>
          <h3 className="text-lg font-bold mb-2">FishMarket</h3>
          <p className="text-sm text-blue-200 max-w-sm">
            Fresh seafood sourced sustainably and delivered right to your home.
          </p>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Quick Links</h4>
          <ul className="space-y-1">
            <li><Link to="/about" className="hover:text-blue-300">About</Link></li>
            <li><Link to="/contact" className="hover:text-blue-300">Contact</Link></li>
            <li><Link to="/faq" className="hover:text-blue-300">FAQ</Link></li>
            <li><Link to="/terms" className="hover:text-blue-300">Terms</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Follow Us</h4>
          <div className="flex space-x-4 text-xl">
            <FaFacebook className="hover:text-blue-300 cursor-pointer" />
            <FaInstagram className="hover:text-blue-300 cursor-pointer" />
            <FaTwitter className="hover:text-blue-300 cursor-pointer" />
          </div>
        </div>

      </div>

      <p className="text-center text-blue-200 text-sm mt-6">
        © {new Date().getFullYear()} FishMarket — All rights reserved.
      </p>
    </footer>
  );
}