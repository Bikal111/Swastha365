import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  const currencySymbol = "Rs.";
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // -----------------------------
  // STATES
  // -----------------------------
  const [doctors, setDoctors] = useState([]);
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  const [userData, setUserData] = useState(null);
  const [appointmentsUpdated, setAppointmentsUpdated] = useState(false);

  const triggerAppointmentsUpdate = () => setAppointmentsUpdated(prev => !prev);

  // -----------------------------
  // AXIOS DEFAULTS
  // -----------------------------
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [token]);

  // -----------------------------
  // LOGOUT FUNCTION
  // -----------------------------
  const logoutUser = (manual = true) => {
    setToken(null);
    setUserData(null);
    localStorage.removeItem("token");

    if (manual) toast.success("Logout Successful");
    else toast.error("Session expired. Please log in again.");
  };

  // -----------------------------
  // FETCH DOCTORS
  // -----------------------------
  const getDoctorsData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/doctor/list`);
      if (data.success) setDoctors(data.doctors);
      else toast.error(data.message);
    } catch (error) {
      console.error("Error fetching doctors:", error.response || error);
      toast.error(error.message || "Failed to fetch doctors");
    }
  };

  // -----------------------------
  // FETCH USER PROFILE
  // -----------------------------
  const loadUserProfileData = async () => {
    if (!token) return;

    try {
      const { data } = await axios.get(`${backendUrl}/api/user/get-profile`);
      if (data.success) setUserData(data.userData);
      else setUserData(null);
    } catch (error) {
      console.error("Profile fetch error:", error.response || error);
      if (error.response && error.response.status === 401) {
        logoutUser(false); // token expired or invalid
      } else {
        toast.error(error.message || "Failed to load profile");
      }
      setUserData(null);
    }
  };

  // -----------------------------
  // PERSIST TOKEN
  // -----------------------------
  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
  }, [token]);

  // -----------------------------
  // INITIAL DATA LOAD
  // -----------------------------
  useEffect(() => {
    getDoctorsData();
  }, []);

  useEffect(() => {
    if (token) loadUserProfileData();
    else setUserData(null);
  }, [token]);

  // -----------------------------
  // CONTEXT VALUE
  // -----------------------------
  const value = {
    doctors,
    getDoctorsData,
    currencySymbol,
    token,
    setToken,
    backendUrl,
    userData,
    setUserData,
    logoutUser,
    appointmentsUpdated,
    triggerAppointmentsUpdate,
    loadUserProfileData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContextProvider;
