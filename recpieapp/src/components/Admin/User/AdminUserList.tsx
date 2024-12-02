import axios from 'axios';
import { useEffect, useState } from 'react';

const AdminUserList = () => {
  const [users, setUsers] = useState<any>();
  const [totalPages, setTotalPages] = useState(1);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [pageSize] = useState<number>(10);
  const [search, setSearch] = useState<any>('');
  const [approved, setApproved] = useState<any>('all');

  useEffect(() => {
    const fetchQueries = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/auth/userDetails?search=${search}&pageIndex=${pageIndex}&pageSize=${pageSize}&status=${approved}`,
        );
        setUsers(response.data.users);
        setTotalPages(response.data.totalPages);
      } catch (error) {}
    };
    fetchQueries();
  }, [pageIndex, pageSize, search, approved]);

  const handleStatus = async (userId: string, status: string) => {
    try {
      await axios.put(`http://localhost:3000/auth/update-status`, {
        userId,
        status,
      });
      setUsers((prevUsers: any) =>
        prevUsers.map((user: any) =>
          user._id === userId ? { ...user, status: status } : user,
        ),
      );
    } catch (error) {
      console.error('Error approving recipe:', error);
    }
  };

  const handlePageChange = (newPageIndex: number) => {
    if (newPageIndex >= 1 && newPageIndex <= totalPages) {
      setPageIndex(newPageIndex);
    }
  };
  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    setApproved(selectedValue);
  };
  return (
    <>
      <div className="overflow-x-auto">
        <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
          Users
        </h4>
        <input
          type="search"
          name="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-40 border-2 px-5 py-2 rounded focus:outline-none mb-2"
          placeholder="Search here"
        />
        <div>
          <table className="w-full">
            <thead>
              <tr className="bg-gray text-left ">
                <th className="py-3 px-4">User Name</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">
                  <p className="mt-10 flex justify-center">Status</p>
                  <p className="mt-2 flex justify-center">
                    <select
                      value={approved}
                      onChange={handleSelectChange}
                      className="rounded px-2 py-2 border-2 mt-2 admin-recipe-select"
                    >
                      <option value="all">All</option>
                      <option value="approved">Activated</option>
                      <option value="rejected">Inactivated</option>
                      <option value="pending">Pending</option>
                    </select>
                  </p>
                </th>
              </tr>
            </thead>
            {users?.length > 0 ? (
              <tbody>
                {users?.map((item: any, index: any) => (
                  <tr key={index}>
                    <td className="py-4 px-4 text-gray-800">
                      {item.user_name}
                    </td>
                    <td className="py-4 px-4 text-gray-800">{item.email}</td>
                    <td className="py-4 px-4 text-gray-800">{item.role}</td>
                    <td className="py-4 px-4 text-gray-800">
                    <div className="hidden items-center justify-center p-1 sm:flex xl:p-3">
                <button
                  className={`ml-5 p-2 border border-gray-300 rounded ${item.status === 'approved' ? 'text-meta-3' : 'text-gray-500'}`}
                  onClick={() => handleStatus(item._id, 'approved')}
                  disabled={item.status === 'approved'}
                >
                  {item.status === 'approved' ? 'Activated' : 'Active'}
                </button>
                <button
                  className={`ml-5 p-2 border border-gray-300 rounded ${item.status === 'rejected' ? 'text-meta-1' : 'text-gray-500'}`}
                  onClick={() => handleStatus(item._id, 'rejected')}
                  disabled={item.status === 'rejected'}
                >
                  {item.status === 'rejected' ? 'Inactivated' : 'Inactive'}
                </button>
                <button
                  className={`ml-5 p-2 border border-gray-300 rounded ${item.status === 'pending' ? 'text-meta-5' : 'text-gray-500'}`}
                  onClick={() => handleStatus(item._id, 'pending')}
                  disabled={item.status === 'pending'}
                >
                  {item.status === 'pending' ? 'Pending' : 'Pending'}
                </button>
              </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            ) : (
              <tbody>
                <tr>
                  <td
                    colSpan={6}
                    className="py-4 text-center text-2xl font-medium"
                  >
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
    </>
  );
};

export default AdminUserList;
