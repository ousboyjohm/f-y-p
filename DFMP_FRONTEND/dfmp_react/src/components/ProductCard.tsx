import { Link } from "react-router-dom";
// import { useNavigate } from "react-router-dom";

type ProductCardProps = {
  id: number;
  name: string;
  price: number;
  image: string;
};

export default function ProductCard({ id, name, price, image }: ProductCardProps){
        // const navigate = useNavigate();

    return (
        <div className="flex gap-4 flex-wrap">
            
        <div className="bg-white rounded-lg shadow hover:shadow-lg transition p-4">
            <Link to={`/product/${id}`}>
            <img src={image} alt={name} className="rounded-md h-40 w-40 object-cover" />

            <h3 className="text-lg font-semibold mt-3 text-gray-800">
                {name}
            </h3>

            <p className="text-blue-900 font-bold mt-1">D{price}</p>
            </Link>

            <Link to={`/product/${id}`}>
                <button className="bg-blue-600 hover:bg-blue-700 text-white rounded-md w-40 mt-3 py-2">
                    Add to Cart
                </button>
            </Link>
        </div>
        

        {/* <div className="bg-white rounded-lg shadow hover:shadow-lg transition p-4">
            <img src={image} alt={name} className="rounded-md h-40 w-40 object-cover" />

            <h3 className="text-lg font-semibold mt-3 text-gray-800">
                {name}
            </h3>

            <p className="text-blue-900 font-bold mt-1">D{price}</p>

            <button className="bg-blue-600 hover:bg-blue-700 text-white rounded-md w-40 mt-3 py-2">
                Add to Cart
            </button>
        </div>

        <div className="bg-white rounded-lg shadow hover:shadow-lg transition p-4">
            <img src={image} alt={name} className="rounded-md h-40 w-40 object-cover" />

            <h3 className="text-lg font-semibold mt-3 text-gray-800">
                {name}
            </h3>

            <p className="text-blue-900 font-bold mt-1">D{price}</p>

            <button className="bg-blue-600 hover:bg-blue-700 text-white rounded-md w-40 mt-3 py-2">
                Add to Cart
            </button>
        </div>

        <div className="bg-white rounded-lg shadow hover:shadow-lg transition p-4">
            <img src={image} alt={name} className="rounded-md h-40 w-40 object-cover" />

            <h3 className="text-lg font-semibold mt-3 text-gray-800">
                {name}
            </h3>

            <p className="text-blue-900 font-bold mt-1">D{price}</p>

            <button className="bg-blue-600 hover:bg-blue-700 text-white rounded-md w-40 mt-3 py-2">
                Add to Cart
            </button>
        </div> */}

        </div>
        
    );
}