import React, { useEffect, useState, useContext } from "react";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";

const MyAppointments = () => {
  const { backendUrl, token, appointmentsUpdated, getDoctorsData } =
    useContext(AppContext);

  const [currentAppointments, setCurrentAppointments] = useState([]);
  const [pastAppointments, setPastAppointments] = useState([]);
  const [cancelledAppointments, setCancelledAppointments] = useState([]);

  const months = [
    "",
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];

  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split("_");
    return (
      dateArray[0] +
      " " +
      months[Number(dateArray[1])] +
      " " +
      dateArray[2]
    );
  };

  const getUserAppointments = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/appointments`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        const now = new Date();

        // Categorize appointments
        const current = [];
        const past = [];
        const cancelled = [];

        data.appointments.forEach((appt) => {
          const [day, month, year] = appt.slotDate
            .split("_")
            .map((x) => parseInt(x, 10));
          const [hour, minute] = appt.slotTime
            .split(":")
            .map((x) => parseInt(x, 10));
          const apptDate = new Date(year, month - 1, day, hour, minute);

          if (appt.cancelled) {
            cancelled.push(appt);
          } else if (apptDate < now) {
            past.push(appt);
          } else {
            current.push(appt);
          }
        });

        // Sort each list (latest first for past/cancelled)
        const sortByDate = (arr) =>
          arr.sort((a, b) => {
            const [da, ma, ya] = a.slotDate.split("_").map(Number);
            const [db, mb, yb] = b.slotDate.split("_").map(Number);
            const [ha, mina] = a.slotTime.split(":").map(Number);
            const [hb, minb] = b.slotTime.split(":").map(Number);
            const dateA = new Date(ya, ma - 1, da, ha, mina);
            const dateB = new Date(yb, mb - 1, db, hb, minb);
            return dateB - dateA;
          });

        setCurrentAppointments(sortByDate(current));
        setPastAppointments(sortByDate(past));
        setCancelledAppointments(sortByDate(cancelled));
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/cancel-appointment`,
        { appointmentId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success(data.message);
        getUserAppointments();
        getDoctorsData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  // ❌ Just remove from UI (frontend only)
  const deleteFromUI = (appointmentId, category) => {
    if (category === "current") {
      setCurrentAppointments((prev) =>
        prev.filter((a) => a._id !== appointmentId)
      );
    } else if (category === "past") {
      setPastAppointments((prev) =>
        prev.filter((a) => a._id !== appointmentId)
      );
    } else if (category === "cancelled") {
      setCancelledAppointments((prev) =>
        prev.filter((a) => a._id !== appointmentId)
      );
    }
  };

  const renderAppointmentCard = (item, category) => (
    <div
      className="grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b"
      key={item._id}
    >
      <div>
        <img
          className="w-32 bg-indigo-50"
          src={item.docData?.image}
          alt=""
        />
      </div>
      <div className="flex-1 text-sm text-zinc-600">
        <p className="text-neutral-800 font-semibold">
          {item.docData?.name}
        </p>
        <p>{item.docData?.speciality}</p>
        <p className="text-zinc-700 font-medium mt-1">Address:</p>
        <p className="text-xs">{item.docData?.address?.line1}</p>
        <p className="text-xs">{item.docData?.address?.line2}</p>
        <p className="text-sm mt-1">
          <span className="text-sm text-neutral-700 font-medium">
            Date & Time:{" "}
          </span>
          {slotDateFormat(item.slotDate)} | {item.slotTime}
        </p>
      </div>
      <div className="flex flex-col gap-2 justify-end">
        {category === "current" && (
          <>
            <button className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-[#189d01] hover:text-white transition-all duration-300">
              Pay Online
            </button>
            <button
              onClick={() => cancelAppointment(item._id)}
              className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300 px-4"
            >
              Cancel Appointment
            </button>
          </>
        )}

        {/* 🗑️ Delete button for all categories */}
        <button
          onClick={() => deleteFromUI(item._id, category)}
          className="text-sm text-red-500 text-center sm:min-w-48 py-2 border border-red-500 rounded hover:bg-red-500 hover:text-white transition-all duration-300"
        >
          Delete 
        </button>
      </div>
    </div>
  );

  useEffect(() => {
    if (token) getUserAppointments();
  }, [token, appointmentsUpdated]);

  return (
    <div className="mt-12">
      <p className="pb-3 font-medium text-zinc-700 border-b">
        My Appointments
      </p>

      {/* ✅ Current Appointments */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">Current Appointments</h2>
        {currentAppointments.length > 0 ? (
          currentAppointments.map((item) =>
            renderAppointmentCard(item, "current")
          )
        ) : (
          <p className="text-sm text-gray-500">No current appointments.</p>
        )}
      </div>

      {/* 🕒 Past Appointments */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">Past Appointments</h2>
        {pastAppointments.length > 0 ? (
          pastAppointments.map((item) =>
            renderAppointmentCard(item, "past")
          )
        ) : (
          <p className="text-sm text-gray-500">No past appointments.</p>
        )}
      </div>

      {/* ❌ Cancelled Appointments */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">Cancelled Appointments</h2>
        {cancelledAppointments.length > 0 ? (
          cancelledAppointments.map((item) =>
            renderAppointmentCard(item, "cancelled")
          )
        ) : (
          <p className="text-sm text-gray-500">
            No cancelled appointments.
          </p>
        )}
      </div>
    </div>
  );
};

export default MyAppointments;
