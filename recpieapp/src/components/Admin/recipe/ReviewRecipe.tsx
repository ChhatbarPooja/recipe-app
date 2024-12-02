import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { notify } from '../../../common/Toast';

interface Recipe {
  _id: string;
  images: string;
  create_at: string;
  recipe_name_eng: string;
  category: {
    id:number,
    name:string
  };
  difficulty_level: string;
  approved: boolean;
  status: string;
}

const AdminRecipeManagement: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [pageSize] = useState<number>(10);
  const [approved, setApproved] = useState<any>('all');
  const [search, setSearch] = useState<any>('')
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') as any);
  const id = user?.id || '';

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        let url = `http://localhost:3000/admin/recipe-pending?pageIndex=${pageIndex}&pageSize=${pageSize}&status=${approved}&search=${search}`;
        const response = await axios.get(url);
        setRecipes(response.data.recipes);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error('Error fetching recipes for admin:', error);
      }
    };

    fetchRecipes();
  }, [pageIndex, pageSize, approved ,search ]);

  const handleRecipeDetails = (item: any) => {
    const userId = id;
    if (!userId) {
      notify('Please login', { type: 'error' });
    } else {
      navigate(`/admin/recipe/details/${item}`);
    }
  };

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    setApproved(selectedValue);
    };
  const handlePageChange = (newPageIndex: number) => {
    if (newPageIndex >= 1 && newPageIndex <= totalPages) {
      setPageIndex(newPageIndex);
    }
  };

  const handleApprove = async (recipeId: string) => {
    try {
      await axios.put(`http://localhost:3000/admin/approveRecipe/${recipeId}`);
      setRecipes((prevRecipes) =>
        prevRecipes.map((recipe) =>
          recipe._id === recipeId
            ? { ...recipe, status: 'approved', approved: true }
            : recipe,
        ),
      );
    } catch (error) {
      console.error('Error approving recipe:', error);
    }
  };

  const handleReject = async (recipeId: string) => {
    try {
      await axios.delete(
        `http://localhost:3000/admin/rejectRecipe/${recipeId}`,
      );
      setRecipes((prevRecipes) =>
        prevRecipes.map((recipe) =>
          recipe._id === recipeId
            ? { ...recipe, status: 'rejected', approved: false }
            : recipe,
        ),
      );
    } catch (error) {
      console.error('Error rejecting recipe:', error);
    }
  };

  const handlePending = async (recipeId: string) => {
    try {
      await axios.put(
        `http://localhost:3000/admin/pendingRecipe/${recipeId}`,
      );
      setRecipes((prevRecipes) =>
        prevRecipes.map((recipe) =>
          recipe._id === recipeId
            ? { ...recipe, status: 'pending', approved: false }
            : recipe,
        ),
      );
    } catch (error) {
      console.error('Error rejecting recipe:', error);
    }
  };

  return (
    <div className="admin-container">
      <div className="overflow-x-auto">
<h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
Recipe Approval Management
</h4>
  <input type='search' name='search' value={search} onChange={(e)=>setSearch(e.target.value)} className='w-40 border-2 px-5 py-2 rounded focus:outline-none mb-2' placeholder='Search here'/>
  <table className="min-w-full bg-white">
    <thead>
      <tr className="bg-gray-100 text-left text-gray-600">
        <th className="py-3 px-4"> Image</th>
        <th className="py-3 px-4">Name</th>
        <th className="py-3 px-4">Category</th>
        <th className="py-3 px-4">Difficulty Level</th>
        <th className="py-3 px-4">
          <p className="mt-10 flex justify-center">Status</p>
          <p className="mt-2 flex justify-center">
          <select
                value={approved}
                onChange={handleSelectChange}
                className="rounded px-2 py-2 border-2 mt-2 admin-recipe-select"
              >
                <option value="all">All</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="pending">Pending</option>
              </select>
          </p>
        </th>
      </tr>
    </thead>
    {recipes.length > 0 ? <>
    <tbody>
      {recipes?.map((recipe: any) => (
        <tr key={recipe._id}>
          <td className="py-4 px-4 text-gray-800">
          <img
            className="h-30 w-30 cursor-pointer"
            src={`http://localhost:3000/${recipe.images}`}
            alt="Recipe-image"
            onClick={()=>handleRecipeDetails(recipe._id)}
          />
          </td>
          <td className="py-4 px-4 text-gray-800 max-w-xs break-words">
          {recipe.recipe_name_eng}
          </td>
          <td className="py-4 px-4 text-gray-800 max-w-xs break-words">{recipe.category?.name}</td>
          <td className="py-4 px-4 text-gray-800 max-w-xs break-words">
          {recipe.difficulty_level}
          </td>
          <td className="py-4 px-4 text-gray-800 max-w-xs break-words">
          <div className="hidden items-center justify-center p-1 sm:flex xl:p-3">
                <button
                  className={`ml-5 p-2 border border-gray-300 rounded ${recipe.status === 'approved' ? 'text-meta-3' : 'text-gray-500'}`}
                  onClick={() => handleApprove(recipe._id)}
                  disabled={recipe.status === 'approved'}
                >
                  {recipe.status === 'approved' ? 'Approved' : 'Approve'}
                </button>
                <button
                  className={`ml-5 p-2 border border-gray-300 rounded ${recipe.status === 'rejected' ? 'text-meta-1' : 'text-gray-500'}`}
                  onClick={() => handleReject(recipe._id)}
                  disabled={recipe.status === 'rejected'}
                >
                  {recipe.status === 'rejected' ? 'Rejected' : 'Reject'}
                </button>
                <button
                  className={`ml-5 p-2 border border-gray-300 rounded ${recipe.status === 'pending' ? 'text-meta-5' : 'text-gray-500'}`}
                  onClick={() => handlePending(recipe._id)}
                  disabled={recipe.status === 'pending'}
                >
                  {recipe.status === 'pending' ? 'Pending' : 'Pending'}
                </button>
              </div>
          </td>
        </tr>
      ))}
    </tbody>
</> : <tbody>
<tr>
  <td colSpan={6} className="py-4 text-center text-2xl font-medium">
    No Records Found
  </td>
</tr>
</tbody>}
  </table>
  <div className="pagination-controls flex justify-between mt-10">
    {totalPages > 1 ? (
      <>
        <button
          onClick={() => handlePageChange(pageIndex - 1)}
          className={`${
            pageIndex === 1 ? 'cursor-not-allowed' : 'cursor-pointer'
          } px-5 py-2 bg-black rounded text-white`}
        >
          Previous
        </button>
        {totalPages > 0 ? (
          <span>
            Page {pageIndex} of {totalPages}
          </span>
        ) : (
          'Page 1'
        )}
        <button
          onClick={() => handlePageChange(pageIndex + 1)}
          className={`${
            pageIndex === totalPages
              ? 'cursor-not-allowed'
              : 'cursor-pointer'
          } px-5 py-2 bg-black rounded text-white`}
        >
          Next
        </button>
      </>
    ) : (
      ''
    )}
  </div>
</div>
    </div>
  );
};

export default AdminRecipeManagement;
