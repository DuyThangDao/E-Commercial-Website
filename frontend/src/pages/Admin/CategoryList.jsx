import { useEffect, useState } from "react";
import {
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useFetchCategoriesQuery,
  useUpdateCategoryMutation,
} from "../../redux/api/categoryApiSlice";
import CategoryForm from "../../components/CategoryForm";
import { toast } from "react-toastify";
import Modal from "../../components/Modal";
import AdminMenu from "./AdminMenu";

const CategoryList = () => {
  const { data: categories, refetch } = useFetchCategoriesQuery();
  const [name, setName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [updatingName, setUpdatingName] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();
  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!name) {
      toast.error("Category name is required");
      return;
    }
    try {
      const result = await createCategory({ name }).unwrap();
      if (result.error) {
        toast.error(result.error);
      } else {
        setName("");
        toast.success(`Successfully created ${result.name}`);
        refetch();
      }
    } catch (error) {
      console.error(error);
      toast.error("Creating category failed, try again.");
    }
  };
  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    if (!updatingName) {
      toast.error("Category name is required");
    }
    try {
      const result = await updateCategory({
        categoryId: selectedCategory._id,
        updatedCategory: { name: updatingName },
      }).unwrap();
      setModalVisible(false);
      refetch();
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`${result.name} is updated.`);
        selectedCategory(null);
        setUpdatingName("");
      }
    } catch (error) {
      console.error(error);
    }
  };
  const handleDeleteCategory = async () => {
    try {
      const result = await deleteCategory(selectedCategory._id).unwrap();
      setSelectedCategory(null);
      setModalVisible(false);
      refetch();
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`${result.name} is deleted.`);
      }
    } catch (error) {
      console.error(error);
      toast.error("Category deleting failed, try again.");
    }
  };
  useEffect(() => {
    refetch();
  }, [refetch]);
  return (
    <div className="ml-[10rem] flex lg:flex-col lg:w-4/6 md:flex-row ">
      <AdminMenu />
      <div className="h-12">Manage Categories</div>
      <CategoryForm
        value={name}
        setValue={setName}
        handleSubmit={handleCreateCategory}
      />
      <br />
      <hr className="mr-[1rem] ml-[0.5rem]" />
      <div className="flex flex-wrap">
        {categories?.map((category) => (
          <div key={category._id}>
            <button
              className="bg-black border border-pink-500 text-pink-500 py-2 px-4
                rounded-lg m-3 hover:bg-pink-500 hover:text-white  focus:outline-none 
                focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50"
              onClick={() => {
                setModalVisible(true);
                setSelectedCategory(category);
                setUpdatingName(category.name);
              }}
            >
              {category.name}
            </button>
          </div>
        ))}
      </div>
      <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
        <CategoryForm
          value={updatingName}
          setValue={setUpdatingName}
          handleSubmit={handleUpdateCategory}
          buttonText="Update"
          handleDelete={handleDeleteCategory}
        />
      </Modal>
    </div>
  );
};

export default CategoryList;
