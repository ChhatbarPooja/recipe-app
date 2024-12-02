import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import SwitcherOne from '../../Switchers/SwitcherOne';
import { useFetch } from '../../../hooks/useFetch';

interface Category {
  _id: string;
  name: string;
  status: boolean;
  subcategories: Category[];
}

const AddCategory: React.FC = () => {
  const { token, user } = useAuth();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [status, setStatus] = useState(true);
  const [parentCategory, setParentCategory] = useState<string | null>(null);
  const {
    data: categories,
    loading,
    error,
  } = useFetch<Category[]>('http://localhost:3000/category');

  useEffect(() => {
    if (id) {
      fetchCategory(id);
    }
  }, [id]);

  const fetchCategory = async (categoryId: string) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/category/${categoryId}`,
      );
      const { name, status, subcategory } = response.data;
      setName(name);
      setStatus(status);
      setParentCategory(
        typeof subcategory === 'object' ? subcategory._id : subcategory || null,
      );
    } catch (error) {
      console.error('Error fetching category:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const category = {
      name,
      status,
      subcategory: parentCategory,
      create_by: user?.id,
    };

    try {
      if (id) {
        await axios.put(`http://localhost:3000/category/${id}`, category, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        await axios.post('http://localhost:3000/category', category, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
      }
      // Clear form after successful submission
      setName('');
      setStatus(true);
      setParentCategory(null);
      navigate('/admin/list-category');
    } catch (err) {
      console.error(err);
    }
  };

  const renderCategoryOptions = (categories: Category[], depth = 0) => {
    return categories.map((category) => (
      <React.Fragment key={category._id}>
        <option value={category._id}>
          {'- - - - '.repeat(depth) + category.name}
        </option>
        {category.subcategories &&
          category.subcategories.length > 0 &&
          renderCategoryOptions(category.subcategories, depth + 1)}
      </React.Fragment>
    ));
  };

  return (
    <>
     <div className='text-right'>
     <Link to="/admin/list-category">
        {' '}
        <button className="mt-2 p-3 border rounded-md mb-3">Back</button>
      </Link>
     </div>
      <div className="p-4 rounded border">
        <h2 className="text-2xl mb-4">
          {id ? 'Edit Category' : 'Add Category'}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm mb-1">Parent Category</label>
            <select
              value={parentCategory || ''}
              onChange={(e) => setParentCategory(e.target.value)}
              className="w-full border rounded p-2"
            >
              <option value="">None</option>
              {loading ? (
                <option>Loading...</option>
              ) : error ? (
                <option>Error loading categories</option>
              ) : (
                categories && renderCategoryOptions(categories)
              )}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm mb-1">Category Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full border rounded p-2"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm mb-1">Status</label>
            <SwitcherOne enabled={status} onChange={setStatus} />
          </div>

          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            {id ? 'Update Category' : 'Add Category'}
          </button>
        </form>
      </div>
    </>
  );
};

export default AddCategory;
