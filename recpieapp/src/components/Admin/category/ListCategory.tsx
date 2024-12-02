import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../../hooks/useAuth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

interface Category {
  _id: string;
  name: string;
  status: boolean;
  subcategories: Category[];
}

const ListCategory: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const navigate = useNavigate();
  const { user, token } = useAuth();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:3000/category');
      setCategories(response.data);
      setLoading(false);
    } catch (error: any) {
      setError(error);
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    console.log("id==>" , id)
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await axios.put(
          `http://localhost:3000/category/soft-delete/${id}`,
          { userId: user!.id },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          },
        );
        fetchCategories();
      } catch (error) {
        console.error('Error soft deleting category:', error);
      }
    }
  };

  const handleEdit = (id: string) => {
    console.log("id in edit ==>" , id)

    navigate(`/admin/add-category/${id}`);

  };

  const toggleExpand = (id: string) => {
    setExpandedCategories((prevExpandedCategories) => {
      const newExpandedCategories = new Set(prevExpandedCategories);
      if (newExpandedCategories.has(id)) {
        newExpandedCategories.delete(id);
      } else {
        newExpandedCategories.add(id);
      }
      return newExpandedCategories;
    });
  };

  const renderCategories = (categories: Category[], depth = 0) => {
    return categories.map((category) => {
      const isExpanded = expandedCategories.has(category?._id);
      return (
        <div key={category?._id} style={{ marginLeft: depth * 20 }}>
          <div className="flex justify-between items-center p-2 bg-gray-100 rounded-md shadow-md mb-2">
            <div className="flex items-center">
              {category?.subcategories && category?.subcategories?.length > 0 && (
                <FontAwesomeIcon
                  icon={isExpanded ? faChevronUp : faChevronDown}
                  onClick={() => toggleExpand(category?._id)}
                  className="cursor-pointer mr-2 text-gray-600  ms-1"
                />
              )}
              <div className="border-b border-gray-300 font-bold">
                {category?.name} - Status: {category?.status ? 'Active' : 'Inactive'}
              </div>
            </div>
            <div>
              <button
                className="mr-2 px-2 py-1 bg-black text-white rounded"
                onClick={() => handleEdit(category?._id)}
              >
                <FontAwesomeIcon icon={faEdit} />
              </button>
              <button
                className="px-2 py-1 bg-black text-white rounded"
                onClick={() => handleDelete(category?._id)}
              >
                <FontAwesomeIcon icon={faTrashAlt} />
              </button>
            </div>
          </div>
          {isExpanded && category?.subcategories && category?.subcategories?.length > 0 && (
            <div className="ml-4">
              {renderCategories(category.subcategories, depth + 1)}
            </div>
          )}
        </div>
      );
    });
  };
  

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-2xl  font-semibold">Categories</h2>
        <Link to="/admin/add-category">
          <button className="px-4 py-2  border-2 font-bold rounded-md shadow-md">
            Add Category
          </button>
        </Link>
      </div>
      <div>
        {error ? (
          <p className="text-red-500">Error loading categories: {error.message}</p>
        ) : (
          <div className="p-4 border rounded shadow">
            {categories.length === 0 ? (
             <p className="flex justify-center items-center text-2xl font-medium">
             No Records Found
           </p>
            ) : (
              renderCategories(categories)
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ListCategory;
