import { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarEmpty } from '@fortawesome/free-regular-svg-icons';

interface AdminReview {
  _id: string;
  user_id: string;
  recipe_id: string;
  rating: number;
  review: string;
  approved: boolean;
}

const AdminReviews = () => {
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [pageSize] = useState<number>(10);
  const [approved, setApproved] = useState<any>('all');
  const [search, setSearch] = useState<any>('')

  useEffect(() => {
    const fetchReviews = async () => {
      const response = await axios.get(
        `http://localhost:3000/admin/review-pending?pageIndex=${pageIndex}&pageSize=${pageSize}&status=${approved}&review=${search}`,
      );
      setReviews(response.data.reviews);
      setTotalPages(response.data.totalPages);
    };
    fetchReviews();
  }, [pageIndex, pageSize, approved, search]);

  const handleApprove = async (id: number) => {
    try {
      await axios.put(`http://localhost:3000/admin/approve/${id}`);
      setReviews((prevReviews) =>
        prevReviews.map((review:any) =>
          review._id === id
            ? { ...review, status: 'approved', approved: true }
            : review,
        ),
      );
    } catch (error) {
      console.error('Error approving recipe:', error);
    }
  };

  const handleReject = async (id: number) => {
    try {
      await axios.put(`http://localhost:3000/admin/reject/${id}`);
      setReviews((prevReviews) =>
        prevReviews.map((review:any) =>
          review._id === id
            ? { ...review, status: 'rejected', approved: false }
            : review,
        ),
      );
    } catch (error) {
      console.error('Error rejecting recipe:', error);
    }
  };

  const handlePending = async (recipeId: string) => {
    try {
      await axios.put(
        `http://localhost:3000/admin/pending/${recipeId}`,
      );
      setReviews((prevReviews) =>
        prevReviews.map((review) =>
          review._id === recipeId
            ? { ...review, status: 'pending', approved: false }
            : review,
        ),
      );
    } catch (error) {
      console.error('Error rejecting recipe:', error);
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
  return (
    <div className="p-4">
      <div className="overflow-x-auto">
      <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
          Review Approval Management
        </h4>
        <input type='search' name='search' value={search} onChange={(e)=>setSearch(e.target.value)} className='w-40 border-2 px-5 py-2 rounded focus:outline-none mb-2' placeholder='Search here'/>
        <table className="min-w-full bg-white">
  <thead>
    <tr className="bg-gray-100 text-left text-gray-600">
      <th className="py-3 px-4">User Name</th>
      <th className="py-3 px-4">Recipe Title</th>
      <th className="py-3 px-4">Review</th>
      <th className="py-3 px-4">Date</th>
      <th className="py-3 px-4">Rating</th>
      <th className="py-3 px-4">
        <p className="mt-10 flex justify-center">Actions</p>
        <p className="mt-2 flex justify-center">
          <select
            value={approved}
            onChange={handleSelectChange}
            className="rounded px-2 py-2 border-2 admin-recipe-select"
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
  {reviews.length > 0 ? (
    <tbody>
      {reviews?.map((review: any) => (
        <tr key={review._id}>
          <td className="py-4 px-4 text-gray-800 max-w-xs break-words">{review.user_id.user_name}</td>
          <td className="py-4 px-4 text-gray-800 max-w-xs break-words">{review.recipe_title}</td>
          <td className="py-4 px-4 text-gray-800 max-w-xs break-words">{review.review}</td>
          <td className="py-4 px-4 text-gray-800 max-w-xs break-words">
            {new Date(review.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </td>
          <td>
            {Array.from({ length: 5 }, (_, index) => (
              <FontAwesomeIcon
                key={index}
                icon={index < review.rating ? faStar : faStarEmpty}
                className="text-yellow-500"
              />
            ))}
          </td>
          <td className="py-4 px-4 text-gray-800">
            <div className="hidden items-center justify-center p-1 sm:flex xl:p-3">
              <button
                className={`ml-5 p-2 border border-gray-300 rounded ${review.status === 'approved' ? 'text-meta-3' : 'text-gray-500'}`}
                onClick={() => handleApprove(review._id)}
                disabled={review.status === 'approved'}
              >
                {review.status === 'approved' ? 'Approved' : 'Approve'}
              </button>
              <button
                className={`ml-5 p-2 border border-gray-300 rounded ${review.status === 'rejected' ? 'text-meta-1' : 'text-gray-500'}`}
                onClick={() => handleReject(review._id)}
                disabled={review.status === 'rejected'}
              >
                {review.status === 'rejected' ? 'Rejected' : 'Reject'}
              </button>
              <button
                className={`ml-5 p-2 border border-gray-300 rounded ${review.status === 'pending' ? 'text-meta-5' : 'text-gray-500'}`}
                onClick={() => handlePending(review._id)}
                disabled={review.status === 'pending'}
              >
                {review.status === 'pending' ? 'Pending' : 'Pending'}
              </button>
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  ) : (
    <tbody>
      <tr>
        <td colSpan={6} className="py-4 text-center text-2xl font-medium">
          No Records Found
        </td>
      </tr>
    </tbody>
  )}
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

export default AdminReviews;