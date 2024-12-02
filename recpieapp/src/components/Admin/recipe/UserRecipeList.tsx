import { useEffect, useState } from 'react';
import { Recipe } from '../../../types/recepeTypes';
import { useNavigate } from 'react-router-dom';
import {
  useGetUserRecipeListMutation,
} from '../../../UserLayout/api/Recipe.api';
import { notify } from '../../../common/Toast';

const UserRecipeList = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const navigate = useNavigate();
  const [userRecipeList] = useGetUserRecipeListMutation();
  const user = JSON.parse(localStorage.getItem('user') as any);
  const id = user?.id || '';
console.log(recipes)
  const getUserRecipesList = async () => {
    const user = JSON.parse(localStorage.getItem('user') as any);
    const id = user.id;

    try {
      const response = await userRecipeList(id);
      setRecipes(response.data.recipes);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    }
  };
  const handleRecipeDetails = (item: any) => {
    const userId = id;
    if (!userId) {
      notify('Please login', { type: 'error' });
    } else {
      navigate(`/admin/recipe/details/${item}`);
    }
  };
  
  useEffect(() => {
    getUserRecipesList();
  }, []);

  return (
    <>
      <div>
        <p className="text-2xl font-medium">User Recipe List</p>
        <div className="container mx-auto py-20">
          <div className="flex gap-10 flex-wrap">
            {recipes.map((item: any) => (
              <div key={item._id} className="">
                <div className="w-30 h-30 overflow-hidden">
                  <img
                    src={`http://localhost:3000/${item.images}`}
                    className="w-full h-50 object-cover cursor-pointer"
                    alt={item.recipe_name_eng}
                    onClick={() => handleRecipeDetails(item._id)}
                  />
                </div>
                <p>{item.role}</p>
                <div>
                  <p className="text-xs text-[#40ba37] font-normal mt-2">
                    {new Date(item.create_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                  <p
                    className="text-lg font-semibold text-black cursor-pointer"
                    onClick={() => navigate(`/recipe/details/${item._id}`)}
                  >
                    {item.recipe_name_eng}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default UserRecipeList;
