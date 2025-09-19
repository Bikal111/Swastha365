import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const currencySymbol = "Rs.";
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [doctors, setDoctors] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token") || false);
  const [userData, setUserData] = useState(null);
  
  // NEW: trigger for appointments update
  const [appointmentsUpdated, setAppointmentsUpdated] = useState(false);
  const triggerAppointmentsUpdate = () => setAppointmentsUpdated(prev => !prev);

  // Fetch doctors
  const getDoctorsData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/doctor/list`);
      if (data.success) setDoctors(data.doctors);
      else toast.error(data.message);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  // Fetch user profile
  const loadUserProfileData = async () => {
    if (!token) return;
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/get-profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) setUserData(data.userData);
      else {
        setUserData(null);
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      setUserData(null);
      toast.error(error.message);
    }
  };

  useEffect(() => { getDoctorsData(); }, []);
  useEffect(() => { if (token) loadUserProfileData(); else setUserData(null); }, [token]);

  const value = {
    doctors,
    getDoctorsData,
    currencySymbol,
    token,
    setToken,
    backendUrl,
    userData,
    setUserData,
    loadUserProfileData,
    appointmentsUpdated,       
    triggerAppointmentsUpdate  
  };

  return <AppContext.Provider value={value}>{props.children}</AppContext.Provider>;
};

export default AppContextProvider;