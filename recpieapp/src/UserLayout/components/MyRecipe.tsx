import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { notify } from '../../common/Toast';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import {
  useDeleteRecipeMutation,
  useGetUserRecipeListMutation,
} from '../api/Recipe.api';
import {
  useAddFavoriteMutation,
  useDeleteFavoriteMutation,
  useGetFavoritesIdMutation,
  useGetFavoritesMutation,
} from '../api/favorite.api';
import ConfirmationDialog from '../../common/Alert';

interface Review {
  rating: number;
  review: string;
}

interface Recipe {
  _id: string;
  images: string;
  createdAt: string;
  updatedAt: string;
  recipe_name_eng: string;
  recipe_name_hindi: string;
  recipe_name_guj: string;
  reviews: Review[];
  userRating?: number;
  userFavorite?: boolean;
  approved?: boolean;
}

const MyRecipe = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [pageIndex, setPageIndex] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState<any>('');
  const [deleteRecipe] = useDeleteRecipeMutation();
  const [deleteFavorite] = useDeleteFavoriteMutation();
  const [addFavorite] = useAddFavoriteMutation();
  const [userRecipeList] = useGetUserRecipeListMutation();
  const [favoriteId] = useGetFavoritesIdMutation();
  const [favorite] = useGetFavoritesMutation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') as any);
  const id = user.id;
  const [showDialog, setShowDialog] = useState(false);
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);
  useEffect(() => {
    if (id) {
      userRecipeList({ id, pageIndex, pageSize: 10, search })
        .unwrap()
        .then((response) => {
          setRecipes(response.recipes);
          setTotalPages(response.totalPages);
        })
        .catch((err) => {
          console.error('Error fetching recipes:', err);
        });
    }
  }, [id, pageIndex, userRecipeList, search]);

  const handleEditClick = (recipe: Recipe) => {
    navigate(`/add-recipe`, { state: { recipe } });
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
        setRecipes((prevRecipes) =>
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

  const getFavorites = async () => {
    try {
      const userId = id;
      const response = await favorite({
        user_id: userId,
        pageIndex,
        pageSize: 10,
      });
      setFavorites(
        response.data.filteredFavorites.map(
          (fav: { recipe_id: { _id: string } }) => fav.recipe_id?._id,
        ),
      );
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };
  const getFavoriteId = async (recipeId: string) => {
    try {
      const userId = id;
      const response = await favoriteId(userId);
      const favorite = response.data.filteredFavorites.find(
        (fav: { recipe_id: { _id: string } }) => fav.recipe_id._id === recipeId,
      );
      return favorite?._id;
    } catch (error) {
      console.error('Error fetching favorite ID:', error);
    }
  };
  const handleFavoriteClick = async (recipeId: string) => {
    try {
      const userId = id;
      if (favorites?.includes(recipeId)) {
        const favoriteId = await getFavoriteId(recipeId);
        if (favoriteId) {
          await deleteFavorite(favoriteId);
          setFavorites(favorites.filter((fav) => fav !== recipeId));
        }
      } else {
        await addFavorite({ user_id: userId, recipe_id: recipeId }).unwrap();
        setFavorites([...favorites, recipeId]);
      }
    } catch (error) {
      console.error('Error updating favorite:', error);
    }
  };
  const handlePageChange = (newPageIndex: number) => {
    if (newPageIndex >= 1 && newPageIndex <= totalPages) {
      setPageIndex(newPageIndex);
    }
  };
  useEffect(() => {
    getFavorites();
  }, []);
  return (
    <>
      <div className="container mx-auto">
        <div className="flex justify-end py-10">
          <NavLink to="/add-recipe">
            <button className="py-2 px-10 bg-[#40ba37] text-white">
              Add Recipe
            </button>
          </NavLink>
        </div>
        <div>
          <p className="text-xl font-medium">My Recipes</p>
          {recipes.length > 0 ? (
            <>
              <div className="container mx-auto py-20">
                <div className="flex flex-wrap gap-10">
                  {recipes?.map((item) => (
                    <div key={item._id} className="">
                      {item.approved === true && (
                        <>
                          <div className="w-56 h-56 overflow-hidden">
                            <img
                              src={`http://localhost:3000/${item.images}`}
                              className="w-full h-50 object-cover cursor-pointer"
                              alt={item.recipe_name_eng}
                              onClick={() =>
                                navigate(`/recipe/details/${item._id}`)
                              }
                            />
                          </div>
                          <div className="">
                            <div className="flex">
                              <p className="text-xs font-normal mr-2">
                                Created at:
                              </p>
                              <p className="text-xs text-[#40ba37] font-normal">
                                {new Date(item.createdAt).toLocaleDateString(
                                  'en-US',
                                  {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                  },
                                )}
                              </p>
                            </div>
                            <div className="flex">
                              <p className="text-xs font-normal mr-2 mt-1">
                                Updated at:
                              </p>
                              <p className="text-xs text-[#40ba37] font-normal mt-1">
                                {new Date(item.updatedAt).toLocaleDateString(
                                  'en-US',
                                  {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                  },
                                )}
                              </p>
                            </div>
                            <p
                              className="text-lg font-semibold text-black cursor-pointer max-w-xs break-words"
                              onClick={() =>
                                navigate(`/recipe/details/${item._id}`)
                              }
                            >
                              {item.recipe_name_eng ||
                                item.recipe_name_hindi ||
                                item.recipe_name_guj}
                            </p>
                          </div>
                          <div className="flex gap-5">
                            <p>
                              <button onClick={() => handleEditClick(item)}>
                                <FontAwesomeIcon icon={faEdit} />
                              </button>
                            </p>
                            <div onClick={() => handleFavoriteClick(item._id)}>
                              {favorites.includes(item._id) ? (
                                <FaHeart className="text-red-500 cursor-pointer mt-1" />
                              ) : (
                                <FaRegHeart className="text-gray-500 cursor-pointer mt-1" />
                              )}
                            </div>
                            <p className="">
                              <button
                                onClick={() => handleDeleteClick(item._id)}
                              >
                                <FontAwesomeIcon icon={faTrashAlt} />
                              </button>
                            </p>
                            {showDialog && (
                              <ConfirmationDialog
                                message="Are you sure you want to delete this recipe?"
                                onConfirm={confirmDelete}
                                onCancel={cancelDelete}
                              />
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div className="pagination-controls flex justify-between mt-10">
                {totalPages > 1 ? (
                  <>
                    <button
                      onClick={() => handlePageChange(pageIndex - 1)}
                      className={`${
                        pageIndex === 1
                          ? 'cursor-not-allowed'
                          : 'cursor-pointer'
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
            </>
          ) : (
            <p className="flex justify-center items-center text-2xl font-medium">
              No Records Found
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default MyRecipe;
