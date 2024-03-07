import { useNavigate, useParams } from "react-router";
import {
  useDeleteProductMutation,
  useGetProductByIdQuery,
  useUpLoadProductImageMutation,
  useUpdateProductMutation,
} from "../../redux/api/productApiSlice";
import { useEffect, useState } from "react";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
import AdminMenu from "./AdminMenu";
import { toast } from "react-toastify";

const ProductUpdate = () => {
  const params = useParams();
  const { data: productData } = useGetProductByIdQuery(params._id);
  const [image, setImage] = useState(productData?.image || "");
  const [name, setName] = useState(productData?.name || "");
  const [description, setDescription] = useState(
    productData?.description || ""
  );
  const [price, setPrice] = useState(productData?.price || "");
  const [category, setCategory] = useState(productData?.category || "");
  const [quantity, setQuantity] = useState(productData?.quantity || "");
  const [brand, setBrand] = useState(productData?.brand || "");
  const [stock, setStock] = useState(productData?.countInStock || 0);
  const navigate = useNavigate();
  const { data: categories } = useFetchCategoriesQuery();
  const [uploadProductImage] = useUpLoadProductImageMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();
  useEffect(() => {
    if (productData && productData._id) {
      setName(productData.name);
      setDescription(productData.description);
      setPrice(productData.price);
      setCategory(productData.category);
      setQuantity(productData.quantity);
      setBrand(productData.brand);
      setStock(productData.countInStock);
      setImage(productData.image);
    }
  }, [productData]);
  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append("image", e.target.files[0]);
    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success("Image upload successfully");
      setImage(res.image);
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const productData = new FormData();
      productData.append("image", image);
      productData.append("name", name);
      productData.append("description", description);
      productData.append("price", price);
      productData.append("category", category);
      productData.append("quantity", quantity);
      productData.append("brand", brand);
      productData.append("countInStock", stock);

      const res = await updateProduct({
        productId: params._id,
        formData: productData,
      }).unwrap();
      toast.success(`${res.name} is updated`);
      navigate("/admin/allproductslist");
    } catch (error) {
      console.error(error);
      toast.error("Product update fail. Try again");
    }
  };
  const handleDelete = async () => {
    try {
      let answer = window.confirm(
        `Are you sure that you want to delete this product ?`
      );
      if (!answer) return;
      const res = deleteProduct(params._id).unwrap();
      toast.success(`${(res, name)} is deleted`);
      navigate("/admin/allproductslist");
    } catch (error) {
      console.error(error);
      toast.error("Product delete fail. Try again");
    }
  };
  return (
    <div className="container xl:mx-[9rem] sm:mx-[0]">
      <div className="flex lg:fex-col md:flex-row">
        <AdminMenu />
        <div className="md:w-3/4 p-3">
          <div className="h-12"> Create Product</div>
          {image && (
            <div className="text-center">
              <img
                src={image}
                alt="product"
                className="block mx-auto max-h-[200px]"
              />
            </div>
          )}
          <div className="mb-3">
            <label
              className="border text-white px-4 block w-full text-center
            rounded-lg cursor-pointer font-bold py-11 "
            >
              {image ? image.name : "Upload Image"}
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={uploadFileHandler}
                className={!image ? "hidden" : "text-white"}
              />
            </label>
          </div>
          <div className="p-3 ">
            <div className="flex flex-wrap">
              <div className="one">
                <label htmlFor="name">Name</label>
                <br />
                <input
                  type="text"
                  className="p-4 mb-3 w-[30rem] rounded-lg bg-[#101011] text-white"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="two lg:ml-10">
                <label htmlFor="name block">Price</label>
                <br />
                <input
                  type="number"
                  className="p-4 mb-3 w-[30rem] rounded-lg bg-[#101011] text-white"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
            </div>
            <div className="flex flex-wrap">
              <div className="one">
                <label htmlFor="name block">Quantity</label>
                <br />
                <input
                  type="number"
                  className="p-4 mb-3 w-[30rem] rounded-lg bg-[#101011] text-white"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>
              <div className="two lg:ml-10">
                <label htmlFor="name block">Brand</label>
                <br />
                <input
                  type="text"
                  className="p-4 mb-3 w-[30rem] rounded-lg bg-[#101011] text-white"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                />
              </div>
            </div>
            <label className="my-5">Description</label>
            <textarea
              type="text"
              className="p-2 mb-3 bg-[#101011] border rounded-lg w-[95%] text-white"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
            <div className="flex lg:flex-row md:flex-col">
              <div>
                <label>Count In Stock</label>
                <br />
                <input
                  type="number"
                  className="p-4 mb-3 w-[30rem] border rounded-lg bg-[#101011] text-white"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                />
              </div>
              <div className="lg:ml-10">
                <label>Category</label>
                <br />
                <select
                  placeholder="Choose Category"
                  className="p-4 mb-3 w-[30rem] border rounded-lg bg-[#101011] text-white"
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {categories?.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <button
                onClick={handleSubmit}
                className="py-4 px-10 mt-5 mr-6 rounded-lg text-lg font-bold bg-green-600 hover:bg-green-700 cursor-pointer"
              >
                Update
              </button>
              <button
                onClick={handleDelete}
                className="py-4 px-10 mt-5 rounded-lg text-lg font-bold bg-pink-600 hover:bg-pink-700 cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductUpdate;
