import axios from 'axios'
import { useEffect, useState } from 'react'

const AdminContactUser = () => {
    const [contact, setContact] = useState<any>()
    const [totalPages, setTotalPages] = useState(1);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [pageSize] = useState<number>(10);
  const [search, setSearch] = useState<any>('')

  useEffect(() => {
      const fetchQueries = async () => {
          try {
              const response = await axios.get(`http://localhost:3000/contact/?id=123&search=${search}&pageIndex=${pageIndex}&pageSize=${pageSize}`)
              setContact(response.data.contacts)
              setTotalPages(response.data.totalPages)
          } catch (error) {

          }
      }
      fetchQueries()
    }, [pageIndex, pageSize ,search ])

    const handlePageChange = (newPageIndex: number) => {
        if (newPageIndex >= 1 && newPageIndex <= totalPages) {
          setPageIndex(newPageIndex);
        }
      };
    return (
        <div className='overflow-x-auto'>
            <h4 className='text-xl font-semibold mb-10'> Contact </h4>
            <input type='search' name='search' value={search} onChange={(e)=>setSearch(e.target.value)} className='w-40 border-2 px-5 py-2 rounded focus:outline-none mb-2' placeholder='Search here'/>

            <div>
                <table className='w-full'>
                    <thead>
                        <tr className="bg-gray text-left ">
                            <th className="py-3 px-4">Name</th>
                            <th className="py-3 px-4">Email</th>
                            <th className="py-3 px-4">Message</th>
                            <th className="py-3 px-4">Subject</th>
                        </tr>
                    </thead>
                        {contact?.length > 0 ?
                    <tbody>
                        {contact?.map((item: any, index: any) => (
                            <tr key={index}>
                                <td className="py-4 px-4 text-gray-800 max-w-xs break-words">{item.name}</td>
                                <td className="py-4 px-4 text-gray-800 max-w-xs break-words">{item.email}</td>
                                <td className="py-4 px-4 text-gray-800 max-w-xs break-words">{item.message}</td>
                                <td className="py-4 px-4 text-gray-800 max-w-xs break-words">{item.subject}</td>
                            </tr>
                        ))}
                    </tbody> :
           <tbody>
           <tr>
             <td colSpan={6} className="py-4 text-center text-2xl font-medium">
               No Records Found
             </td>
           </tr>
           </tbody>}
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
    )
}

export default AdminContactUser
