import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Recipe } from '../../../types/recepeTypes';
import {
  useDeleteRecipeMutation,
  useGetUserRecipeListMutation,
} from '../../../UserLayout/api/Recipe.api';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { notify } from '../../../common/Toast';
import ConfirmationDialog from '../../../common/Alert';

const ListRecipe = () => {
  const [recipes, setRecipes] = useState<any>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [pageSize] = useState<number>(10);
  const [search, setSearch] = useState<any>('')
  const [showDialog, setShowDialog] = useState(false);
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);
  const navigate = useNavigate();
  const [userRecipeList] = useGetUserRecipeListMutation();
  const [deleteRecipe] = useDeleteRecipeMutation();
  const user = JSON.parse(localStorage.getItem('user') as any);
  const id = user?.id || '';
  useEffect(() => {
    if (id) {
      userRecipeList({ id, pageIndex, pageSize, search }).unwrap()
        .then(response => {
          setRecipes(response.recipes);
          setTotalPages(response.totalPages);
        })
        .catch(err => {
          console.error('Error fetching recipes:', err);
        });
    }
  }, [id, pageIndex, userRecipeList , search]);

  const handleEditClick = (recipe: Recipe) => {
    navigate(`/admin/add-recipe`, { state: { recipe } });
  };

  const handleRecipeDetails = (item: any) => {
    const userId = id;
    if (!userId) {
      notify('Please login', { type: 'error' });
    } else {
      navigate(`/admin/recipe/details/${item}`);
    }
  };

  const handleDeleteClick = (_id: string) => {
    setSelectedRecipeId(_id);
    setShowDialog(true);
  };

  const confirmDelete = async () => {
    if (selectedRecipeId) {
      try {
        await deleteRecipe(selectedRecipeId).unwrap();
        notify('Deleted successfully', { type: 'success' });
        setRecipes((prevRecipes: any[]) =>
          prevRecipes.filter((recipe) => recipe._id !== selectedRecipeId),
        );
      } catch (error) {
        notify('Error deleting recipe:', { type: 'error' });
      }
      setShowDialog(false);
      setSelectedRecipeId(null);
    }
  };

  const cancelDelete = () => {
    setShowDialog(false);
    setSelectedRecipeId(null);
  };

  const handlePageChange = (newPageIndex: number) => {
    if (newPageIndex >= 1 && newPageIndex <= totalPages) {
      setPageIndex(newPageIndex);
    }
  };

  return (
    <>
      <div className="mb-4 flex justify-between">
        <h2 className="text-2xl font-medium"> Admin Recipe List</h2>
        <Link to="/admin/add-recipe">
          <button className="p-3 border rounded-md me-5">Add recipe</button>
        </Link>
      </div>
      <input type='search' name='search' value={search} onChange={(e)=>setSearch(e.target.value)} className='w-40 border-2 px-5 py-2 rounded focus:outline-none mb-2' placeholder='Search here'/>

      <div className="container mx-auto py-10">
        {recipes.length > 0 ?
        <>
        <div className="flex flex-wrap gap-10">
          {recipes?.map((item: Recipe) => (
            <div key={item._id} className="">
              <div className="w-59 h-59 overflow-hidden">
                <img
                  src={`http://localhost:3000/${item.images}`}
                  className="w-full h-full object-cover cursor-pointer"
                  alt={item.recipe_name_eng}
                  onClick={() => handleRecipeDetails(item._id)}
                  // onClick={() => navigate(`/admin/recipe/details/${item._id}`)}
                />
              </div>
              <div className="">
              <div className='flex mt-2'>
                <p className='text-xs font-normal mr-2'>Created at:</p>
              <p className="text-xs text-[#40ba37] font-normal">
                {new Date(item.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
              </div>
              <div className='flex'>
                <p className='text-xs font-normal mr-2 mt-1'>Updated at:</p>
              <p className="text-xs text-[#40ba37] font-normal mt-1">
                {new Date(item.updatedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
              </div>
                <p
                  className="text-lg font-semibold text-black cursor-pointer"
                  onClick={() => navigate(`/recipe/details/${item._id}`)}
                >
                  {item.recipe_name_eng}
                </p>
              </div>
              <div className="flex gap-5">
                <p>
                  <button onClick={() => handleEditClick(item)}>
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                </p>
                <p className="">
                  <button onClick={() => handleDeleteClick(item._id)}>
                    <FontAwesomeIcon icon={faTrashAlt} />
                  </button>
                </p>
              </div>
              {showDialog && (
              <ConfirmationDialog
                message="Are you sure you want to delete this recipe?"
                onConfirm={confirmDelete}
                onCancel={cancelDelete}
              />
             )}
            </div>
          ))}
        </div>
        {totalPages > 1 ?
        <div className="pagination-controls flex justify-between mt-10">
            <button
              onClick={() => handlePageChange(pageIndex - 1)}
              className={`${pageIndex === 1 ? 'cursor-not-allowed' : 'cursor-pointer'} px-5 py-2 bg-black rounded text-white`}
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
              className={`${pageIndex === totalPages ? 'cursor-not-allowed' : 'cursor-pointer'} px-5 py-2 bg-black rounded text-white`}
              >
              Next
            </button>
          </div>
          :""}  </>

          : <p className="flex justify-center items-center text-2xl font-medium">
          No Records Found
        </p>}
      </div>
    </>
  );
};

export default ListRecipe;