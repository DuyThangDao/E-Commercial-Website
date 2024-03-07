import { useSelector } from "react-redux";

const FavoritesCount = () => {
  const favorites = useSelector((state) => state.favorites);
  const favoritesCount = favorites.length;
  return (
    <span className="px-1 py-2 text-sm text-white bg-pink-500 rounded-full">
      {favoritesCount}
    </span>
  );
};

export default FavoritesCount;
