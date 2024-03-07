import { useDispatch, useSelector } from "react-redux";
import { useFetchCategoriesQuery } from "../redux/api/categoryApiSlice";
import { useGetFilterProductsQuery } from "../redux/api/productApiSlice";
import { useEffect, useState } from "react";
import {
  setCategories,
  setChecked,
  setProducts,
} from "../redux/features/shop/shopSlice";
import Loader from "../components/Loader";
import ProductCard from "./Products/ProductCard";

const Shop = () => {
  const dispatch = useDispatch();
  const { categories, products, checked, radio } = useSelector(
    (state) => state.shop
  );
  const { data: categoriesQuery, isLoadingCategories } =
    useFetchCategoriesQuery();
  const [priceFilter, setPriceFilter] = useState("");
  const { data: filterProduct, isLoading: filterIsLoading } =
    useGetFilterProductsQuery({ checked, radio });
  useEffect(() => {
    if (!isLoadingCategories) {
      dispatch(setCategories(categoriesQuery));
    }
  }, [categoriesQuery, dispatch, isLoadingCategories]);
  useEffect(() => {
    if (!checked.length || !radio.length) {
      if (!filterIsLoading) {
        const filteredProducts = filterProduct.filter((product) => {
          return (
            product.price.toString().includes(priceFilter) ||
            product.price === parseInt(priceFilter, 10)
          );
        });
        dispatch(setProducts(filteredProducts));
      }
    }
  }, [checked, radio, filterIsLoading, filterProduct, dispatch, priceFilter]);

  const handleBrandClick = (brand) => {
    const productsByBrand = filterProduct?.filter(
      (product) => product.brand === brand
    );
    dispatch(setProducts(productsByBrand));
  };
  const handleCheck = (value, id) => {
    const updatedChecked = value
      ? [...checked, id]
      : checked.filter((c) => c !== id);
    dispatch(setChecked(updatedChecked));
    console.log(updatedChecked);
  };
  const uniqueBrands = [
    ...Array.from(
      new Set(
        filterProduct
          ?.map((product) => product.brand)
          .filter((brand) => brand !== undefined)
      )
    ),
  ];
  const handlePriceChange = (e) => {
    setPriceFilter(e.target.value);
  };
  return (
    <>
      <div className="container mx-auto">
        <div className="flex md:flex-row">
          <div className="bg-[#151515] p-3 mt-2 mb-2">
            <h2 className="text-center py-2 bg-black rounded-full mb-2">
              Filter by Categories
            </h2>
            <div className="p-5 w-[15rem]">
              {categories?.map((c) => (
                <div key={c._id} className="mb-2 ">
                  <div className="flex items-center mr-4">
                    <input
                      type="checkbox"
                      id="red-checkbox"
                      onChange={(e) => handleCheck(e.target.checked, c._id)}
                      className="w-4 h-4 text-pink-600 bg-gray-700 border-gray-600 
                      rounded focus:ring-pink-500 dark:focus:ring-pink-600 dark:ring-offset-gray-800 
                      focus:ring-2 "
                    />
                    <label
                      htmlFor="red-checkbox"
                      className="ml-2 text-sm font-medium text-white"
                    >
                      {c.name}
                    </label>
                  </div>
                </div>
              ))}
            </div>
            <h2 className="h4 text-center py-2 bg-black rounded-full mb-2">
              Filter by Brands
            </h2>
            <div className="p-5">
              {uniqueBrands?.map((brand) => (
                <div key={brand._id}>
                  <div className="flex items-center mr-4 mb-5">
                    <input
                      type="radio"
                      id={brand}
                      name="brand"
                      onChange={() => handleBrandClick(brand)}
                      className="w-4 h-4 text-pink-400 bg-gray-700 border-gray-300 
                      focus:ring-pink-600 dark:ring-offset-gray-800 
                      focus:ring-2 dark:border-gray-600"
                    />
                    <label
                      htmlFor="pink-radio"
                      className="ml-2 text-sm font-medium text-white"
                    >
                      {brand}
                    </label>
                  </div>
                </div>
              ))}
            </div>
            <h2 className="h4 text-center py-2 bg-black rounded-full mb-2">
              Filter by Price
            </h2>
            <div className="p-5 w-[15rem]">
              <input
                type="text"
                placeholder="Enter Price"
                value={priceFilter}
                onChange={(e) => handlePriceChange(e)}
                className="w-full bg-gray-700 px-3 py-2 placeholder-gray-400 border rounded-lg 
                focus:outline-none focus:ring focus:ring-pink-600 focus:border-pink-300"
              />
            </div>
            <div className="p-5 pt-0">
              <button
                className="w-full border rounded border-gray-700 my-4"
                onClick={() => window.location.reload()}
              >
                Reset
              </button>
            </div>
          </div>
          <div className="p-3">
            <h2 className="h4 text-center mb-2">{products?.length} Products</h2>
            <div className="flex flex-wrap">
              {products.length === 0 ? (
                <Loader />
              ) : (
                products?.map((p) => (
                  <div key={p._id} className="p-3">
                    <ProductCard p={p} />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Shop;
