import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { useCategory } from '../components/CategoryContext';
import { notify } from '../../common/Toast';
import {
  useAddFavoriteMutation,
  useDeleteFavoriteMutation,
  useGetFavoritesIdMutation,
  useGetFavoritesMutation,
} from '../api/favorite.api';
import {
  useGetAllRecipeQuery,
  useGetRecipeByCategoryMutation,
} from '../api/Recipe.api';

interface Review {
  rating: number;
  review: string;
  favorite: number;
}

interface Recipe {
  _id: string;
  images: string;
  createdAt: string;
  updatedAt:string;
  recipe_name_eng: string;
  reviews: Review[];
  userRating?: number;
  userFavorite?: boolean;
}

const RecipeList = ({ load }: { load: boolean }) => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') as any);
  const id = user?.id || '';
  const { categoryId } = useCategory();
  const [pageIndex, setPageIndex] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { data, error } = useGetAllRecipeQuery({ pageIndex, pageSize: 10 });
  const [deleteFavorite] = useDeleteFavoriteMutation();
  const [addFavorite] = useAddFavoriteMutation();
  const [favorite] = useGetFavoritesMutation();
  const [favoriteId] = useGetFavoritesIdMutation();
  const [recipeByCategory] = useGetRecipeByCategoryMutation();

  useEffect(() => {
    if (data) {
      setRecipes(data.recipes);
      setTotalPages(data.totalPages);
    }
    if (error) {
      console.error('Error fetching recipes:', error);
    }
  }, [data, error, load]);
  const getFavorites = async () => {
    try {
      const userId = id;
      const response = await favorite({user_id:userId, pageIndex, pageSize: 10});
      setFavorites(
        response?.data?.filteredFavorites.map(
          (fav: { recipe_id: { _id: string } }) => fav.recipe_id?._id,
        ),
      );
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  const getFavoriteId = async (recipeId: string) => {
    try {
      const user_id = id;
      const response = await favoriteId(user_id);
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
      if (!userId) {
        notify('Please login', { type: 'error' });
      }
      if (favorites.includes(recipeId)) {
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

  const handleRecipeDetails = (item: any) => {
      navigate(`/recipe/details/${item}`);
  };
  const handlePageChange = (newPageIndex: number) => {
    if (newPageIndex >= 1 && newPageIndex <= totalPages) {
      setPageIndex(newPageIndex);
    }
  };
  useEffect(() => {
    if (data) {
      setRecipes(data.recipes);
    }
    if (error) {
      console.error('Error fetching recipes:', error);
    }
  }, [data, error]);

  useEffect(() => {
    getFavorites();
  }, []);
  useEffect(() => {
    if (categoryId) {
       recipeByCategory({id: categoryId, pageIndex: pageIndex, pageSize: 10 }).unwrap()
        .then(response => {
          setRecipes(response.recipes);
          setTotalPages(response.totalPages);
        })
        .catch(err => {
          console.error('Error fetching recipes:', err);
        });
    }
  }, [categoryId, pageIndex, recipeByCategory]);

  return (
    <div className="container mx-auto py-20">
      {recipes.length > 0 ?
      <>
      <div className="flex gap-10 flex-wrap">
        {recipes.map((item: any) => (
          <div key={item._id} className="">
            <div className="w-56 h-56 overflow-hidden">
              <img
                src={`http://localhost:3000/${item.images}`}
                className="w-full h-full object-cover cursor-pointer"
                alt={item.recipe_name_eng}
                onClick={() => handleRecipeDetails(item._id)}
              />
            </div>
            <div>
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
                className="text-lg font-semibold text-black cursor-pointer max-w-xs break-words"
                onClick={() => navigate(`/recipe/details/${item._id}`)}
              >
                 {item.recipe_name_eng || item.recipe_name_hindi || item.recipe_name_guj }
              </p>
              <div onClick={() => handleFavoriteClick(item._id)}>
                {favorites?.includes(item._id) ? (
                  <FaHeart className="text-red-500 cursor-pointer mt-1" />
                ) : (
                  <FaRegHeart className="text-gray-500 cursor-pointer mt-1" />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      {totalPages > 1  && (
      <div className="pagination-controls flex justify-between mt-10">
        <button
          onClick={() => handlePageChange(pageIndex - 1)}
          className={`${pageIndex === 1 ? 'cursor-not-allowed' : 'cursor-pointer'} px-5 py-2 bg-black rounded text-white`}
        >
          Previous
        </button>
        {totalPages > 0 ?
        <span>Page {pageIndex} of {totalPages}</span> : 'Page 1' }
        <button
          onClick={() => handlePageChange(pageIndex + 1)}
          className={`${pageIndex === totalPages ? 'cursor-not-allowed' : 'cursor-pointer'} px-5 py-2 bg-black rounded text-white`}
        >
          Next
        </button>
    </div>)}
    </>
    : <p className='flex justify-center items-center text-2xl font-medium'>No Records Found</p>}
    </div>
  );
};

export default RecipeList;