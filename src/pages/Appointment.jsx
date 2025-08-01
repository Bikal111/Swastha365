import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { assets } from '../assets/assets_frontend/assets'
import RelatedDoctors from '../components/RelatedDoctors'

const Appointment = () => {

  const {docId} = useParams()
  const {doctors,currencySymbol} = useContext(AppContext)
  const daysOfWeek = ['SUN','MON','TUE','WED','THU','FRI','SAT']

  const [docInfo,setDocInfo] = useState(null)

  const [docSlots,setDocSlots] = useState([])
  const[slotIndex,setSlotIndex] = useState(0)
  const [slotTime,setSlotime] = useState('')

  const fetchDocInfo = async () => {
    const docInfo = doctors.find(doc => doc._id === docId)
    setDocInfo(docInfo)
  }

  const getAvailableSlots = async () =>{
    setDocSlots([])
    // getting current date
    let today = new Date()

    for(let i = 0; i<15; i++ ){
      //getting date with index
      let currentDate = new Date(today)
      currentDate.setDate(today.getDate()+i)

      // setting end time of the date with index
      let endTime = new Date()
      endTime.setDate(today.getDate()+i)
      endTime.setHours(21,0,0,0)

      //setting hours
      if (today.getDate() === currentDate.getDate()) {
        currentDate.setHours(currentDate.getHours()>10 ? currentDate.getHours()+1 : 10)
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 :0)
      }else{
        currentDate.setHours(10)
        currentDate.setMinutes(0)
      }

      let timeSlots = []

      while (currentDate < endTime) {
        let formattedTime = currentDate.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})

        //add slots  to array
        timeSlots.push({
          datetime: new Date(currentDate),
          time: formattedTime
        })

        // current time incresases by 30 mins
        currentDate.setMinutes(currentDate.getMinutes() + 30)
        
      }

      setDocSlots(prev =>([...prev,timeSlots]))
    }


  }

  useEffect(()=>{
    fetchDocInfo()
  },[doctors,docId])  

  useEffect(()=>{
    getAvailableSlots()
  },[docInfo])
  
  useEffect(()=>{
    console.log(docSlots);
    
  },[docSlots])

  return docInfo && (
    <div>
      <div className='flex flex-col sm:flex-row gap-4 '>
        <div className='w-full sm:w-56'>
          <img className='bg-primary w-full sm:max-w-72 rounded-lg ' src={docInfo.image} alt=""/>
        </div>

        <div className='flex-1 border border-gray-300 rounded-md px-5 py-4 bg-white'>
            <p className='flex items-center gap-2 text-2xl font-medium text-gray-900'>
              {docInfo.name} 
              <img className='w-5' src={assets.verified_icon} alt="" srcset="" /> 
            </p>
            <div className='flex items-center gap-2 text-sm mt-1 text-gray-600'>
              <p>
                {docInfo.degree} - {docInfo.speciality}
              </p>
              <button className='py-0.5 px-2 border text-xs rounded-full '>{docInfo.experience}</button>
            </div>

            <div>
              <p className='flex items-center gap-1 text-sm font-medium text-gray-900 mt-3 '>
                About <img src={assets.info_icon} alt="" srcset="" /> 
                </p>
              <p className='text-sm text-gray-500 max-w-[700px] mt-1'>
                {docInfo.about}
                </p>
            </div>
            <p className='text-gray-500 font-medium mt-4'>
              Appointment Fee : <span className='text-gray-600'>{currencySymbol}{docInfo.fees}/-</span>
            </p>

        </div>
      </div>
      {/* {/* BOOKING Slots */}

      <div className='sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700'>
        <p>
          Booking Slots
        </p>
        <div className='flex gap-8 items-center w-full overflow-x-scroll mt-4'>
          {
            docSlots.length && docSlots.map((item,index)=>(
              <div onClick={()=> setSlotIndex(index)} className= {`flex flex-col justify-center items-center w-12 h-24 rounded-2xl cursor-pointer flex-shrink-0 transition-all  ${slotIndex=== index ? 'bg-primary text-white':'border border-gray-200'}`} key={index}>
                <p>{item[0]&& daysOfWeek[item[0].datetime.getDay()]}</p>
                <p>{item[0]&& item[0].datetime.getDate()}</p>
              </div>
            ))
          }
        </div>

        <div className='flex items-center gap-3 w-full overflow-x-auto flex-nowrap mt-4'>
          {docSlots.length && docSlots[slotIndex].map((item,index)=>(
            <p onClick={()=>setSlotime(item.time)} className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer overflow-hidden ${item.time === slotTime ? 'bg-primary text-white' :'text-gray-400 border border-gray-300' }`} key={index}>
              {item.time.toLowerCase()}
            </p>
          ))}
        </div>

        <button className='bg-primary text-white text-sm font-light px-14 py-3 rounded-full mt-4'>Book an appointment</button>

      </div>
      {/* Listing Related Doctors */}
      <RelatedDoctors docId={docId} speciality={docInfo.speciality}/>
    </div>
  )
}

export default Appointment