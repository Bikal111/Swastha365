import React from 'react'
import { specialityData } from '../assets/assets_frontend/assets'
import {Link} from 'react-router-dom'

const SpecialityMenu = () => {
  return (
    <div className='flex flex-col items-center gap-4 py-16 text-gray-800' id='speciality'>
        <h1 className='text-3xl font-medium'>Find Doctors by Speciality </h1>
        <p className='sm:w-1/3 text-center text-sm'>Find the right doctor with ease and schedule your appointment without the wait—quality care starts here.</p>
        <div className='flex sm:justify-center gap-4 pt-5 w-full overflow-scroll'>
            {specialityData.map((item,index)=>(
            <Link onClick={()=>scrollTo(0,0)} className='flex flex-col items-center text-xs cursor-pointer flex-shrink-0 hover:translate-y-[-10px] transition-all duration-500' key={index} to={`/doctors/${item.speciality}`}>
                <img src={item.image} alt="" srcset="" className="w-16 sm:w-24 mb-2" />
                <p>{item.speciality}</p>
            </Link>
        ))}
        </div>
    </div>
  )
}

export default SpecialityMenu