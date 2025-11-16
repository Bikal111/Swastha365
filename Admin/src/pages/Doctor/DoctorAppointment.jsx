import React, { useContext, useEffect } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets'

const DoctorAppointment = () => {

  const { dToken, appointments, getAppointments, completeAppointment, cancelAppointment } = useContext(DoctorContext)
  const { calculateAge, slotDateFormat, currency } = useContext(AppContext)

  useEffect(() => {
    if (dToken) {
      getAppointments()
    }
  }, [dToken])

  return (
    <div className='w-full max-e-6xl m5'>
      <p className='mb-3 text-lg font-medium'>All Appointments</p>

      <div className='bg-white border rounded text-sm max-h-[80vh] min-h-[50vh] overflow-y-scroll'>

        {/* Header */}
        <div className='max-sm:hidden grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 py-3 px-6 border-b'>
          <p>S.N</p>
          <p>Patient</p>
          <p>Payment Status</p>
          <p>Patient Age</p>
          <p>Appointment Date & Time</p>
          <p>Fees</p>
          <p>Action</p>
        </div>

        {appointments.map((item, index) => (
          <div
            className='flex flex-wrap justify-between max-sm:gap-5 sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50'
            key={index}
          >
            <p className='max-sm:hidden'>{index + 1}</p>

            {/* Patient */}
            <div className='flex items-center gap-2'>
              <img className='w-8 h-8 rounded-full object-cover' src={item.userData.image} alt="" />
              <p>{item.userData.name}</p>
            </div>

            {/* Payment */}
            <div>
              <p className='text-xs inline border border-[#189d01] px-2 rounded-full'>
                {item.payment ? 'Online' : 'Cash'}
              </p>
            </div>

            {/* Age */}
            <p className='max-sm:hidden'>{calculateAge(item.userData.dob)}</p>

            {/* Date */}
            <p>{slotDateFormat(item.slotDate)} , {item.slotTime}</p>

            {/* Fees */}
            <p>{currency}{item.amount}</p>

            {/* ================================
                ✔️ Status & Icons Logic
            ================================= */}
            {item.cancelled ? (
              <p className='text-red-500 font-medium text-xs flex items-center gap-1'>
                <img src={assets.cancel_icon} className='w-3' alt="cross" /> Cancelled
              </p>
            ) : item.isCompleted ? (
              <p className='text-green-600 font-medium text-xs flex items-center gap-1'>
                <img src={assets.tick_icon} className='w-3' alt="tick" /> Completed
              </p>
            ) : (
              // Show Both Icons for NEW Appointment
              <div className='flex items-center gap-3'>

                {/* Cancel */}
                <img
                  onClick={() => cancelAppointment(item._id)}
                  className='w-6 cursor-pointer hover:opacity-70'
                  src={assets.cancel_icon}
                  alt='Cancel'
                />

                {/* Complete */}
                <img
                  onClick={() => completeAppointment(item._id)}
                  className='w-6 cursor-pointer hover:opacity-70'
                  src={assets.tick_icon}
                  alt='Complete'
                />
              </div>
            )}

          </div>
        ))}
      </div>
    </div>
  )
}

export default DoctorAppointment
