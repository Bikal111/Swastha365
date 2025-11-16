import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const TopDoctors = () => {
  const navigate = useNavigate()
  const { doctors } = useContext(AppContext)

  // ✅ Fallback to empty array to avoid crash before doctors is fetched
  const topDoctors = (doctors || []).slice(0, 10)

  return (
    <div className='flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10'>
      <h1 className='text-3xl font-medium'>Top-Rated Doctors. Book Instantly.</h1>
      <p className='sm:w-1/2 text-center text-sm'>
        Easily browse our extensive list of trusted doctors and book with confidence.
      </p>

      <div className='w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 pt-5 gap-y-6 px-3 sm:px-0'>
        {topDoctors.length > 0 ? (
          topDoctors.map((item, index) => (
            <div
              onClick={() => {
                navigate(`/appointment/${item._id}`)
                scrollTo(0, 0)
              }}
              className='border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:-translate-y-2 transition-all duration-500'
              key={index}
            >
              <img className='bg-blue-50 w-full h-40 object-cover' src={item.image} alt={item.name} />
              <div className='p-4'>
                <div className={`flex items-center gap-2 text-sm ${item.available ? ' text-green-500' : 'text-gray-500'}`}>
                  <p className={`w-2 h-2 ${item.available ? 'bg-green-500' : 'bg-gray-500'}  rounded-full`}></p>
                  <p>{item.available ? 'Available' :'Not Available'}</p>
                </div>
                <p className='text-gray-900 text-lg font-medium'>{item.name}</p>
                <p className='text-gray-600 text-sm'>{item.speciality}</p>
              </div>
            </div>
          ))
        ) : (
          <p className='col-span-full text-center text-gray-500'>Loading doctors...</p>
        )}
      </div>

      <button
        onClick={() => {
          navigate('/doctors')
          scrollTo(0, 0)
        }}
        className='bg-blue-50 text-gray-600 px-12 py-3 rounded-full mt-10'
      >
        More
      </button>
    </div>
  )
}

export default TopDoctors
