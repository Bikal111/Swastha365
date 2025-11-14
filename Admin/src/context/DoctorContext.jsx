import React, { createContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const DoctorContext = createContext();

const DoctorContextProvider = (props) => {
  const navigate = useNavigate();
  const [dToken, setDToken] = useState(localStorage.getItem("dToken"));
  const [appointments, setAppointments] = useState([]);
 
  const [dashData,setDashData] = useState(false)

  const [profileData,setProfileData] = useState(false)

  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

  // ✅ Logout helper
  const logoutDoctor = () => {
    localStorage.removeItem("dToken");
    setDToken(null);
    toast.error("Session expired. Please log in again.");
    navigate("/doctor-login"); // 👈 Redirect to login page automatically
  };

  // ✅ Centralized auth error handler
  const handleAuthError = (error) => {
    if (error.response && error.response.status === 401) {
      logoutDoctor();
    }
  };

  // ✅ Fetch doctor appointments
  const getAppointments = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/doctor/appointments`, {
        headers: { Authorization: `Bearer ${dToken}` },
      });
      if (response.data.success) {
        setAppointments(response.data.appointments);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      handleAuthError(error);
      console.error(error);
    }
  };

  // ✅ Mark appointment complete
  const completeAppointment = async (appointmentId) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/doctor/complete-appointment`,
        { appointmentId },
        { headers: { Authorization: `Bearer ${dToken}` } }
      );

      if (response.data.success) {
        toast.success("Appointment marked as completed");
        getAppointments();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      handleAuthError(error);
      console.error(error);
    }
  };

  // ✅ Cancel appointment
  const cancelAppointment = async (appointmentId) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/doctor/cancel-appointment`,
        { appointmentId },
        { headers: { Authorization: `Bearer ${dToken}` } }
      );

      if (response.data.success) {
        toast.success("Appointment cancelled");
        getAppointments();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      handleAuthError(error);
      console.error(error);
    }
  };

  const getDashData = async () =>{
    try {

      const {data} = await axios.get(backendUrl+'/api/doctor/dashboard',{
      headers: { Authorization: `Bearer ${dToken}` }})
      if (data.success) {
        setDashData(data.dashData)
        
        
      }else{
        toast.error(data.message)
      }
      
    } catch (error) {
      console.log(error);
      toast.error(error.message)
      
    }
  }

  const getProfileData = async ()=>{
    try {

      const {data} = await axios.get(backendUrl+'/api/doctor/profile',{
      headers: { Authorization: `Bearer ${dToken}` }})

      if (data.success) {
        setProfileData(data.profileData)
        console.log(data.profileData);
        
      }
      
    } catch (error) {
       console.log(error);
      toast.error(error.message)
    }
  }

  // ✅ Context value
  const value = {
    dToken,
    setDToken,
    appointments,
    getAppointments,
    completeAppointment,
    cancelAppointment,
    dashData,setDashData,getDashData,
    profileData,setProfileData,getProfileData,
  };

  return (
    <DoctorContext.Provider value={value}>
      {props.children}
    </DoctorContext.Provider>
  );
};

export default DoctorContextProvider;
