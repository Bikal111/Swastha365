import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets_frontend/assets';
import RelatedDoctors from '../components/RelatedDoctors';
import { toast } from "react-toastify";
import axios from 'axios';

const Appointment = () => {
  const { docId } = useParams();
  const { doctors, currencySymbol, backendUrl, token, getDoctorsData, triggerAppointmentsUpdate } = useContext(AppContext);
  const daysOfWeek = ['SUN','MON','TUE','WED','THU','FRI','SAT'];
  const navigate = useNavigate();

  const [docInfo, setDocInfo] = useState(null);
  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState('');

  const fetchDocInfo = async () => {
    const doc = doctors.find(doc => doc._id === docId);
    setDocInfo(doc || null);
  };

  const getAvailableSlots = async () => {
    if (!docInfo) return;
    setDocSlots([]);
    let today = new Date();
    for (let i = 0; i < 15; i++) {
      let currentDate = new Date(today); currentDate.setDate(today.getDate() + i);
      let endTime = new Date(today); endTime.setDate(today.getDate() + i); endTime.setHours(21,0,0,0);
      if (today.getDate() === currentDate.getDate()) { currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10); currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0); }
      else { currentDate.setHours(10); currentDate.setMinutes(0); }

      let timeSlots = [];
      while (currentDate < endTime) {
        let formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const slotDate = `${currentDate.getDate()}_${currentDate.getMonth()+1}_${currentDate.getFullYear()}`;
        const isSlotAvailable = !docInfo.slots_booked?.[slotDate]?.includes(formattedTime);
        if (isSlotAvailable) timeSlots.push({ datetime: new Date(currentDate), time: formattedTime });
        currentDate.setMinutes(currentDate.getMinutes()+30);
      }
      setDocSlots(prev => [...prev, timeSlots]);
    }
  };

  const bookAppointment = async () => {
    if (!token) { toast.warn('Login to Book an Appointment'); return navigate('/login'); }
    if (!docSlots[slotIndex] || !slotTime) { toast.error("Please select a slot"); return; }

    const date = docSlots[slotIndex][0].datetime;
    const slotDate = `${date.getDate()}_${date.getMonth()+1}_${date.getFullYear()}`;

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/book-appointment`,
        { docId, slotDate, slotTime },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success(data.message);
        getDoctorsData();
        triggerAppointmentsUpdate(); // <-- NEW: trigger MyAppointments refresh
        navigate('/my-appointments');
      } else toast.error(data.message);

    } catch (error) { console.error(error); toast.error(error.message); }
  };

  useEffect(() => { fetchDocInfo(); }, [doctors, docId]);
  useEffect(() => { getAvailableSlots(); }, [docInfo]);

  if (!docInfo) return null;

  return (
    <div>
      {/* Doctor Info */}
      <div className='flex flex-col sm:flex-row gap-4'>
        <div className='w-full sm:w-56'>
          <img className='bg-[#189d01] w-full sm:max-w-72 rounded-lg' src={docInfo.image} alt={docInfo.name} />
        </div>
        <div className='flex-1 border border-gray-300 rounded-md px-5 py-4 bg-white'>
          <p className='flex items-center gap-2 text-2xl font-medium text-gray-900'>{docInfo.name} <img className='w-5' src={assets.verified_icon} alt="verified" /></p>
          <div className='flex items-center gap-2 text-sm mt-1 text-gray-600'>
            <p>{docInfo.degree} - {docInfo.speciality}</p>
            <button className='py-0.5 px-2 border text-xs rounded-full'>{docInfo.experience}</button>
          </div>
          <p className='text-gray-500 font-medium mt-4'>Appointment Fee: <span className='text-gray-600'>{currencySymbol}{docInfo.fees}/-</span></p>
        </div>
      </div>

      {/* Booking Slots */}
      <div className='sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700'>
        <p>Booking Slots</p>
        <div className='flex gap-8 items-center w-full overflow-x-scroll mt-4'>
          {docSlots.map((item,index) => (
            <div key={index} onClick={()=>setSlotIndex(index)}
              className={`flex flex-col justify-center items-center w-12 h-24 rounded-2xl cursor-pointer flex-shrink-0 transition-all ${slotIndex===index?'bg-[#189d01] text-white':'border border-gray-200'}`}>
              <p>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
              <p>{item[0] && item[0].datetime.getDate()}</p>
            </div>
          ))}
        </div>
        <div className='flex items-center gap-3 w-full overflow-x-auto flex-nowrap mt-4'>
          {docSlots[slotIndex]?.map((item,index)=>(
            <p key={index} onClick={()=>setSlotTime(item.time)}
              className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer overflow-hidden ${item.time===slotTime?'bg-[#189d01] text-white':'text-gray-400 border border-gray-300'}`}>
              {item.time.toLowerCase()}
            </p>
          ))}
        </div>
        <button onClick={bookAppointment} className='bg-[#189d01] text-white text-sm font-light px-14 py-3 rounded-full mt-4'>Book an appointment</button>
      </div>

      {/* Related Doctors */}
      <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
    </div>
  );
};

export default Appointment;
