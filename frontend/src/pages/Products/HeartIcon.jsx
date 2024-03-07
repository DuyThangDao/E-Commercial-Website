import { useEffect } from "react";
import {
  addToFavorites,
  removeFromFavorites,
  setFavorites,
} from "../../redux/features/favorites/favoriteSlice";
import {
  addFavoriteToLocalStorage,
  removeFavoriteFromLocalStorage,
  getFavoritesFromLocalStorage,
} from "../../Utils/localStorage.js";
import { useDispatch, useSelector } from "react-redux";
import { FaHeart, FaRegHeart } from "react-icons/fa";

const HeartIcon = ({ product }) => {
  const dispatch = useDispatch();
  const favorites = useSelector((state) => state.favorites) || [];
  const isFavorites = favorites.some((p) => p._id === product._id);
  useEffect(() => {
    const favoritesFromLocalStorage = getFavoritesFromLocalStorage();
    dispatch(setFavorites(favoritesFromLocalStorage));
  }, [dispatch]);
  const toggleFavorites = () => {
    if (isFavorites) {
      dispatch(removeFromFavorites(product));
      removeFavoriteFromLocalStorage(product._id);
    } else {
      dispatch(addToFavorites(product));
      addFavoriteToLocalStorage(product);
    }
  };
  return (
    <div
      onClick={toggleFavorites}
      className="absolute top-2 right-5 cursor-pointer"
    >
      {isFavorites ? (
        <FaHeart className="text-pink-500" />
      ) : (
        <FaRegHeart className="text-gray-500" />
      )}
    </div>
  );
};

export default HeartIcon;
