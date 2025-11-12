import React from "react";
import { useContext } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { useEffect } from "react";
import { assets } from "../../assets/assets";
import { AppContext } from "../../context/AppContext";

const DoctorDashboard = () => {
  const { dToken, dashData, setDashData, getDashData, completeAppointment,cancelAppointment } =
    useContext(DoctorContext);

  const { currency, slotDateFormat } = useContext(AppContext);
  useEffect(() => {
    if (dToken) {
      getDashData();
    }
  }, [dToken]);

  return (
    dashData && (
      <div className="m-5">
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
            <img className="w-14" src={assets.earning_icon} alt="" />
            <div>
              <p className="text-xl font-semibold text-gray-600">
                {currency} {dashData.earnings}
              </p>
              <p className="text-gray-400">Earnings</p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
            <img className="w-8" src={assets.appointment_icon} alt="" />
            <div>
              <p className="text-xl font-semibold text-gray-600">
                {dashData.appointments}
              </p>
              <p className="text-gray-400">Appointments</p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
            <img className="w-14" src={assets.patients_icon} alt="" />
            <div>
              <p className="text-xl font-semibold text-gray-600">
                {dashData.patients}
              </p>
              <p className="text-gray-400">Patients</p>
            </div>
          </div>
        </div>

        <div className="bg-white mt-10 rounded border">
          <div className="flex items-center gap-2.5 px-4 py-4 rounded-t border-b">
            <img src={assets.list_icon} alt="" />
            <p className="font-semibold">Latest Appointment Booking</p>
          </div>

          <div className="pt-4 px-4">
            {dashData.latestAppointments &&
            dashData.latestAppointments.length > 0 ? (
              dashData.latestAppointments.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center border-b py-3 px-6 gap-3 hover:bg-gray-100"
                >
                  <div className="flex items-center gap-3">
                    <img
                      className="w-12 h-12 object-cover rounded-full"
                      src={item.userData?.image}
                      alt={item.userData?.name}
                    />
                    <div className="flex-1 text-sm">
                      <p className="font-semibold text-gray-800 ">
                        {item.userData?.name || "Unknown Doctor"}
                      </p>
                      <p className="text-sm text-gray-600">
                        {slotDateFormat(item.slotDate)}
                      </p>
                    </div>
                  </div>

                  <div>
                    {item.cancelled ? (
                      <p className="text-red-500 font-medium text-xs">
                        Cancelled
                      </p>
                    ) : item.isCompleted ? (
                      <p className="text-green-600 font-medium text-xs">
                        Completed
                      </p>
                    ) : (
                      <div className="flex">
                        <img
                          onClick={() => cancelAppointment(item._id)}
                          className="w-10 cursor-pointer"
                          src={assets.cancel_icon}
                          alt="Cancel"
                        />
                        <img
                          onClick={() => completeAppointment(item._id)}
                          className="w-10 cursor-pointer"
                          src={assets.tick_icon}
                          alt="Complete"
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-sm py-4 text-center">
                No recent appointments found.
              </p>
            )}
          </div>
        </div>
      </div>
    )
  );
};

export default DoctorDashboard;
