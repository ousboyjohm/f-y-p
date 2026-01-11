import '../components/hero.css';
import { Link } from "react-router-dom";

export default function Hero() {

  return (
   <section className="hero-bg relative h-137.5 flex items-center justify-center">
      <div className="absolute inset-0  bg-opacity-30"></div>

      <div className="relative z-10 text-center text-white px-6 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Fresh Seafood Delivered Daily
        </h1>
        <p className="mb-6 text-lg md:text-xl">
          Direct from the ocean to your table.
        </p>
        <Link
          to="/shop"
          className="inline-block bg-blue-900 hover:bg-blue-800 text-white font-semibold px-6 py-3 rounded"
        >
          Shop Now
        </Link>
      </div>
  </section>
  );
}
