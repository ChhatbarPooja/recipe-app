import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import {
  useDeleteFavoriteMutation,
  useEditFavoriteMutation,
  useGetFavoritesIdMutation,
  useGetFavoritesMutation,
} from '../api/favorite.api';

interface Review {
  rating: number;
  review: string;
}

interface Recipe {
  _id: string;
  createdAt: string;
  updatedAt:string;
  recipe_id: {
    images: string;
    recipe_name_eng: string;
    recipe_name_guj: string;
    recipe_name_hindi: string;
    _id: string;
  };
  reviews: Review[];
  userRating?: number;
  userFavorite?: boolean;
}

const MyFavorite = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [pageIndex, setPageIndex] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [deleteFavorite] = useDeleteFavoriteMutation();
  const [favorite] = useGetFavoritesMutation();
  const [favoriteId] = useGetFavoritesIdMutation();
  const [editFavorite] = useEditFavoriteMutation();
  const [userFavoriteRecipeList] = useGetFavoritesMutation();

  const user = JSON.parse(localStorage.getItem('user') as any);
  const id = user.id;

  const getUserRecipesList = async () => {
    try {
      const response = await userFavoriteRecipeList({user_id:id, pageIndex, pageSize: 10});
      console.log(response)
      setRecipes(response.data?.filteredFavorites);
      setTotalPages(response.data.totalPgaes)
    } catch (error) {
      console.error('Error fetching recipes:', error);
    }
  };

  const getFavorites = async () => {
    try {
      const response = await favorite({user_id:id, pageIndex, pageSize: 10});
      setFavorites(
        response.data?.filteredFavorites.map(
          (fav: { recipe_id: { _id: string } }) => fav.recipe_id?._id!,
        ),
      );
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  const getFavoriteId = async (recipeId: string) => {
    try {
      const response = await favoriteId(id);
      const favorite = response.data.filteredFavorites.find(
        (fav: { recipe_id: { _id: string } }) => fav.recipe_id?._id=== recipeId,
      );
      return favorite?._id;
    } catch (error) {
      console.error('Error fetching favorite ID:', error);
    }
  };

  const handleFavoriteClick = async (recipeId: string) => {
    try {
      if (favorites.includes(recipeId)) {
        const favoriteId = await getFavoriteId(recipeId);
        if (favoriteId) {
          await deleteFavorite(favoriteId);
          setFavorites(favorites.filter((fav) => fav !== recipeId));
          setRecipes(
            recipes.filter((recipe) => recipe.recipe_id!._id !== recipeId),
          );
        }
      } else {
        await editFavorite({ user_id: id, recipe_id: recipeId }).unwrap();
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
    getUserRecipesList();
    getFavorites();
  }, [pageIndex]);

  return (
    <>
      <div className="container mx-auto mb-auto">
        <div>
          <p className="text-xl font-medium mt-10">My Favorite</p>
          <div className="container mx-auto py-20">
            {recipes?.length > 0 ?
            <>
            <div className="flex flex-wrap gap-10">
              {recipes?.map((item) => (
                <div key={item._id} className="">
                  <div className="w-56 h-56 overflow-hidden">
                    <img
                      src={`http://localhost:3000/${
                        item.recipe_id?.images ?? ''
                      }`}
                      className="w-full h-full object-cover cursor-pointer"
                      onClick={() =>
                        navigate(`/recipe/details/${item.recipe_id!._id}`)
                      }
                      alt={item.recipe_id?.recipe_name_eng}
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
                      onClick={() =>
                        navigate(`/recipe/details/${item.recipe_id?._id}`)
                      }
                    >
                     {item.recipe_id?.recipe_name_eng || item.recipe_id?.recipe_name_hindi || item.recipe_id?.recipe_name_guj }
                    </p>
                  </div>
                  <div className="flex items-end">
                    <div
                      onClick={() => handleFavoriteClick(item.recipe_id?._id)}
                      className="cursor-pointer"
                    >
                      {favorites.includes(item.recipe_id?._id) ? (
                        <FaHeart className="text-red-500 my-1" />
                      ) : (
                        <FaRegHeart className="text-gray-500 my-1" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
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
            : <p className='flex justify-center items-center text-2xl font-medium'>No Records Found</p> }
          </div>
        </div>
      </div>
    </>
  );
};

export default MyFavorite;