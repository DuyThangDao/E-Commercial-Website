import { Link } from "react-router-dom";
import HeartIcon from "./HeartIcon";

const SmallProduct = ({ product }) => {
  return (
    <div className="w-[20rem] ml-[2rem] p-3">
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="h-[15rem] w-[30rem] rounded object-cover"
        />
        <HeartIcon product={product} />
        <div className="p-54">
          <Link to={`/product/${product._id}`}>
            <h2 className="flex justify-between items-center">
              <div>{product.name}</div>
              <span
                className="bg-pink-900 text-pink-300 text-sm font-medium 
              mr-2.5 px-2.5 py-0.5 rounded-full"
              >
                $ {product.price}
              </span>
            </h2>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SmallProduct;
