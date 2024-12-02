import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { notify } from '../../../common/Toast';
import { useAuth } from '../../../hooks/useAuth';
import { useGetEditAdminRecipeMutation, useUpdateEditAdminRecipeMutation, useAddAdminRecipeMutation } from '../api/Admin.recipe.api';
import { faPray } from '@fortawesome/free-solid-svg-icons';

interface IFormInput {
  recipe_name_eng: string;
  recipe_name_hindi?: string;
  recipe_name_guj?: string;
  ingredients_eng: string;
  ingredients_hindi?: string;
  ingredients_guj?: string;
  recipe_steps_eng: string;
  recipe_steps_hindi?: string;
  recipe_steps_guj?: string;
  category: any;
  num_of_people_to_served: number;
  cooking_time: string;
  preparation_time: string;
  difficulty_level: string;
  images: File | null;
  video_url?: string;
  status?: string;
  approved?: boolean;
}

interface Category {
  _id: string;
  name: string;
  status: boolean;
  subcategories: Category[];
}

const AddUserRecipe: React.FC = () => {
  const { token, user } = useAuth();
  const { state } = useLocation();
  const navigate = useNavigate();
  const [formErrors, setFormErrors] = useState({
    recipe_name_eng: '',
    ingredients_eng: '',
    category: '',
    image: '',
    recipe_steps_eng:''
  });
  const recipe = state?.recipe;
  const [getAdminEditRecipe] = useGetEditAdminRecipeMutation();
  const [updateEditAdminRecipe] = useUpdateEditAdminRecipeMutation();
  const [addAdminRecipe] = useAddAdminRecipeMutation();
  const [activeTab, setActiveTab] = useState<'eng' | 'hindi' | 'guj'>('eng');
  const [categories, setCategories] = useState<Category[]>([]);
  const [videoUrl, setVideoUrl] = useState('');
  const [isValid, setIsValid] = useState(true);
  const [formValues, setFormValues] = useState<IFormInput>({
    recipe_name_eng: '',
    ingredients_eng: '',
    recipe_steps_eng: '',
    recipe_name_hindi: '',
    ingredients_hindi: '',
    recipe_steps_hindi: '',
    recipe_name_guj: '',
    ingredients_guj: '',
    recipe_steps_guj: '',
    category: '',
    num_of_people_to_served: 0,
    cooking_time: '',
    preparation_time: '',
    difficulty_level: '',
    images: null,
    video_url: '',
    status: 'approved',
    approved: true,
  });
  
  useEffect(() => {
    if (recipe) {
      setFormValues({
        recipe_name_eng: recipe.recipe_name_eng || '',
        ingredients_eng: recipe.ingredients_eng || '',
        recipe_steps_eng: recipe.recipe_steps_eng || '',
        recipe_name_hindi: recipe.recipe_name_hindi || '',
        ingredients_hindi: recipe.ingredients_hindi || '',
        recipe_steps_hindi: recipe.recipe_steps_hindi || '',
        recipe_name_guj: recipe.recipe_name_guj || '',
        ingredients_guj: recipe.ingredients_guj || '',
        recipe_steps_guj: recipe.recipe_steps_guj || '',
        category: recipe.category || '',
        num_of_people_to_served: recipe.num_of_people_to_served || 0,
        cooking_time: recipe.cooking_time || '',
        preparation_time: recipe.preparation_time || '',
        difficulty_level: recipe.difficulty_level || '',
        images: recipe.images || '',
        video_url: recipe.video_url || '',
        status: recipe.status || '',
        approved: recipe.approved || true,
      });
    }
  }, [recipe]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get<Category[]>(
        'http://localhost:3000/category',
      );
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const getEditUserRecipes = async () => {
    if (recipe) {
      const recipeId = recipe._id;
      try {
        const response = await getAdminEditRecipe(recipeId).unwrap();
        const fetchedRecipe = response.data;
        setFormValues({
          recipe_name_eng: fetchedRecipe.recipe_name_eng || '',
          ingredients_eng: fetchedRecipe.ingredients_eng || '',
          recipe_steps_eng: fetchedRecipe.recipe_steps_eng || '',
          recipe_name_hindi: fetchedRecipe.recipe_name_hindi || '',
          ingredients_hindi: fetchedRecipe.ingredients_hindi || '',
          recipe_steps_hindi: fetchedRecipe.recipe_steps_hindi || '',
          recipe_name_guj: fetchedRecipe.recipe_name_guj || '',
          ingredients_guj: fetchedRecipe.ingredients_guj || '',
          recipe_steps_guj: fetchedRecipe.recipe_steps_guj || '',
          category: fetchedRecipe.category._id || '',
          num_of_people_to_served: fetchedRecipe.num_of_people_to_served || 0,
          cooking_time: fetchedRecipe.cooking_time || '',
          preparation_time: fetchedRecipe.preparation_time || '',
          difficulty_level: fetchedRecipe.difficulty_level || '',
          images: fetchedRecipe.images || '',
          video_url: fetchedRecipe.video_url || '',
          status: fetchedRecipe.status || true,
          approved: fetchedRecipe.approved || true,
        });
      } catch (error) {
        console.error('Error fetching recipes:', error);
      }
    }
  };

  useEffect(() => {
    getEditUserRecipes();
  }, []);

  const videoUrlPattern = /^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be|vimeo\.com)\/.+$/;

  const handleInputVIDEOChange = (e: any) => {
    const url = e.target.value;
    setVideoUrl(url);
    setIsValid(videoUrlPattern.test(url));
  };

  const handleInputChange = (
    key: keyof IFormInput,
    value: string | number | boolean | File | null,
  ) => {
    setFormValues({
      ...formValues,
      [key]: value,
    });
  };
  
  const renderCategoryOptions = (categories: Category[], depth = 0) => {
    return categories.map((category) => (
      <React.Fragment key={category._id}>
        <option value={category._id} className="">
          {'- '.repeat(depth) + category.name}
        </option>
        {category.subcategories.length > 0 &&
          renderCategoryOptions(category.subcategories, depth + 1)}
      </React.Fragment>
    ));
  };

  const validateForm = () => {
    const errors = {
      recipe_name_eng: '',
      recipe_name_guj: '',
      recipe_name_hindi: '',
      ingredients_eng: '',
      ingredients_hindi: '',
      ingredients_guj: '',
      category: '',
      image: '',
      recipe_steps_eng: '',
      recipe_steps_hindi: '',
      recipe_steps_guj: '',
      video_url: '',
    };

    if (!formValues.recipe_name_eng && activeTab == 'eng') {
      errors.recipe_name_eng = 'Recipe name in English is required';
    }
    if (!formValues.recipe_name_hindi && activeTab == 'hindi') {
      errors.recipe_name_hindi = 'Recipe name in Hindi is required';
    }
    if (!formValues.recipe_name_guj && activeTab == 'guj') {
      errors.recipe_name_guj = 'Recipe name in Gujarati is required';
    }
    if (!formValues.ingredients_eng && activeTab == 'eng') {
      errors.ingredients_eng = 'Ingredients in English are required';
    }
    if (!formValues.ingredients_hindi && activeTab == 'hindi') {
      errors.ingredients_hindi = 'Ingredients in Hindi are required';
    }
    if (!formValues.ingredients_guj && activeTab == 'guj') {
      errors.ingredients_guj = 'Ingredients in Gujarati are required';
    }
    if (!formValues.category) {
      errors.category = 'Category is required';
    }
    if (!formValues.images) {
      errors.image = 'Image is required';
    }
    if (!formValues.recipe_steps_eng && activeTab == 'eng') {
      errors.recipe_steps_eng = 'Recipe steps in English required';
    }
    if (!formValues.recipe_steps_hindi && activeTab == 'hindi') {
      errors.recipe_steps_hindi = 'Recipe steps in Hindi required';
    }
    if (!formValues.recipe_steps_guj && activeTab == 'guj') {
      errors.recipe_steps_guj = 'Recipe steps in Gujarati required';
    }
    setFormErrors(errors);
    return !Object.values(errors).some((error) => error);
  };
  
  const handleSubmit = async (e:any) => {
    e.preventDefault()
    if (!validateForm()) {
      return;
    }
    if (!isValid) {
      return;
    }
    const formData = new FormData();
    formData.append('recipe_name_eng', formValues.recipe_name_eng!);
    formData.append('ingredients_eng', formValues.ingredients_eng!);
    formData.append('recipe_steps_eng', formValues.recipe_steps_eng!);
    formData.append('recipe_name_hindi', formValues.recipe_name_hindi!);
    formData.append('ingredients_hindi', formValues.ingredients_hindi!);
    formData.append('recipe_steps_hindi', formValues.recipe_steps_hindi!);
    formData.append('recipe_name_guj', formValues.recipe_name_guj!);
    formData.append('ingredients_guj', formValues.ingredients_guj!);
    formData.append('recipe_steps_guj', formValues.recipe_steps_guj!);
    formData.append('category', formValues.category);
    formData.append(
      'num_of_people_to_served',
      formValues.num_of_people_to_served.toString(),
    );
    formData.append('cooking_time', formValues.cooking_time);
    formData.append('preparation_time', formValues.preparation_time);
    formData.append('difficulty_level', formValues.difficulty_level);
    formData.append('status', formValues.status as any);
    formData.append('create_by', user!.id);
    formData.append('approved', String(formValues.approved));

    if (isValid && videoUrl) {
      formData.append('video_url', videoUrl);
    }

    if (formValues.images) {
      formData.append('images', formValues.images);
    }

    const id = recipe?._id;
    try {
      const response = id
      ? await axios.put(`http://localhost:3000/recipe/${recipe._id}`, formData)
      : await axios.post('http://localhost:3000/recipe', formData);
      notify(id ? 'Recipe updated successfully' : 'Recipe added successfully', {
        type: 'success',
      });
      if (response) {
        navigate('/admin/list-recipe');
      }
    } catch (error: any) {
      notify(error.data?.message, { type: 'error' });
    }
  };

  return (
    <div className="bg-white">
      <h2 className="text-2xl font-semibold  mb-4 text-center">
        {recipe ? 'Update Recipe' : 'Add New Recipe'}
      </h2>
      <form
        className="space-y-4 lg:ps-20 lg:pe-20"
        onSubmit={handleSubmit}
      >
        <div>
          <label className="block  font-bold">Category</label>
          <select
           value={formValues.category}
            onChange={(e) => handleInputChange('category', e.target.value || '')}
            className="w-full border rounded p-2"
          >
            <option>
              Select Category<span className="text-red-500">*</span>
            </option>
            {renderCategoryOptions(categories)}
          </select>
          {formErrors.category && <p className='text-red-500'>{formErrors.category}</p>}
          </div>

        <div className="mb-4">
          <div className="flex justify-center space-x-4 mb-4 ">
            <button
              type="button"
              className={`py-2 px-4 ${
                activeTab === 'eng'
                  ? 'bg-green-500 text-white '
                  : 'bg-gray-300  font-bold'
              } rounded`}
              onClick={() => setActiveTab('eng')}
            >
              English
            </button>
            <button
              type="button"
              className={`py-2 px-4 ${
                activeTab === 'hindi'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-300  font-bold'
              } rounded`}
              onClick={() => setActiveTab('hindi')}
            >
              Hindi
            </button>
            <button
              type="button"
              className={`py-2 px-4 ${
                activeTab === 'guj'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-300  font-bold'
              } rounded`}
              onClick={() => setActiveTab('guj')}
            >
              Gujarati
            </button>
          </div>
          {activeTab === 'eng' && (
            <div className="  ">
              <div>
                <label className="block font-bold">
                  Recipe Name in English<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full border border-[#ccc] rounded p-2"
                  placeholder="Add recipe name in english"
                  value={formValues.recipe_name_eng}
                  onChange={(e) =>
                    handleInputChange('recipe_name_eng', e.target.value)
                  }
                />
                {formErrors.recipe_name_eng && <p className='text-red-500'>{formErrors.recipe_name_eng}</p>}
                </div>
              <div className="mt-2">
                <label className="block font-bold ">Ingredients<span className="text-red-500">*</span></label>
                <ReactQuill
                  value={formValues.ingredients_eng}
                  onChange={(value) =>
                    handleInputChange('ingredients_eng', value)
                  }
                  className=" rounded data"
                />
                {formErrors.ingredients_eng && <p className='text-red-500'>{formErrors.ingredients_eng}</p>}
              </div>
              <div className="mt-2">
                <label className="block font-bold">Recipe Steps<span className="text-red-500">*</span></label>
                <ReactQuill
                  value={formValues.recipe_steps_eng}
                  onChange={(value) =>
                    handleInputChange('recipe_steps_eng', value)
                  }
                  className="rounded data"
                />
                {formErrors.recipe_steps_eng && <p className='text-red-500'>{formErrors.recipe_steps_eng}</p>}
              </div>
            </div>
          )}
          {activeTab === 'hindi' && (
            <div className="">
              <div>
                <label className="block  font-bold">Recipe Name in Hindi<span className="text-red-500">*</span></label>
                <input
                  type="text"
                  className="w-full border border-[#ccc] rounded p-2"
                  placeholder="Add recipe name in hindi"
                  value={formValues.recipe_name_hindi}
                  onChange={(e) =>
                    handleInputChange('recipe_name_hindi', e.target.value)
                  }
                />
              </div>
              <div className="mt-2">
                <label className="block  font-bold">Ingredients<span className="text-red-500">*</span></label>
                <ReactQuill
                  value={formValues.ingredients_hindi}
                  onChange={(value) =>
                    handleInputChange('ingredients_hindi', value)
                  }
                />
              </div>
              <div className="mt-2">
                <label className="block  font-bold">Recipe Steps<span className="text-red-500">*</span></label>
                <ReactQuill
                  value={formValues.recipe_steps_hindi}
                  onChange={(value) =>
                    handleInputChange('recipe_steps_hindi', value)
                  }
                />
              </div>
            </div>
          )}
          {activeTab === 'guj' && (
            <div className="">
              <div>
                <label className="block  font-bold">
                  Recipe Name in Gujarati<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full border border-[#ccc] rounded p-2"
                  placeholder="Add recipe name in gujrati"
                  value={formValues.recipe_name_guj}
                  onChange={(e) =>
                    handleInputChange('recipe_name_guj', e.target.value)
                  }
                />
              </div>
              <div className="mt-2">
                <label className="block  font-bold">Ingredients<span className="text-red-500">*</span></label>
                <ReactQuill
                  value={formValues.ingredients_guj}
                  onChange={(value) =>
                    handleInputChange('ingredients_guj', value)
                  }
                />
              </div>
              <div className="mt-2">
                <label className="block  font-bold">Recipe Steps<span className="text-red-500">*</span></label>
                <ReactQuill
                  value={formValues.recipe_steps_guj}
                  onChange={(value) =>
                    handleInputChange('recipe_steps_guj', value)
                  }
                />
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block  font-bold">
              Number of People to Serve
            </label>
            <input
              type="number"
              className="w-full border border-[#ccc]  rounded p-2"
              value={formValues.num_of_people_to_served}
              onChange={(e) =>
                handleInputChange(
                  'num_of_people_to_served',
                  Number(e.target.value),
                )
              }
            />
          </div>
          <div>
            <label className="block  font-bold">Cooking Time</label>
            <input
              type="text"
              className="w-full border border-[#ccc]  rounded p-2"
              placeholder="Ex - 20 min"
              value={formValues.cooking_time}
              onChange={(e) =>
                handleInputChange('cooking_time', e.target.value)
              }
            />
          </div>
          <div>
            <label className="block  font-bold">Preparation Time</label>
            <input
              type="text"
              className="w-full border border-[#ccc]  rounded p-2"
              placeholder="Ex - 1 hr 20 min"
              value={formValues.preparation_time}
              onChange={(e) =>
                handleInputChange('preparation_time', e.target.value)
              }
            />
          </div>
          <div>
            <label className="block  font-bold">Difficulty Level</label>
            <input
              type="text"
              className="w-full border border-[#ccc]  rounded p-2"
              value={formValues.difficulty_level}
              placeholder="Ex - For Begginers"
              onChange={(e) =>
                handleInputChange('difficulty_level', e.target.value)
              }
            />
          </div>
          <div>
            <label className="block  font-bold">Image<span className="text-red-500">*</span></label>
            <input
              type="file"
              accept="image/png, image/jpeg, image/jpg"
              className="w-full border border-[#ccc]  rounded p-2"
              onChange={(e) =>
                handleInputChange(
                  'images',
                  e.target.files ? e.target.files[0] : null,
                )
              }
            />
           {formErrors.image && <p className='text-red-500'>{formErrors.image}</p>}
          </div>
          <div>
            <label className="block  font-bold">Video URL</label>
            <input
              type="text"
              className="w-full border border-[#ccc]  rounded p-2"
              value={videoUrl || formValues.video_url}
              onChange={handleInputVIDEOChange}
              placeholder="Add Your video URL"
              style={{ borderColor: isValid ? '#ccc' : 'red' }}
            />
              {!isValid && (
              <p style={{ color: 'red' }}>Please enter a valid video URL.</p>
            )}
          </div>
        </div>

        <div className="flex justify-center mt-4">
          <button
            type="submit"
            className="bg-green-900 text-white py-2 px-4 rounded hover:bg-green-600 font-bold"
          >
            {recipe ? 'Update Recipe' : 'Add Recipe'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddUserRecipe;
