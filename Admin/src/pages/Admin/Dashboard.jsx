import React, { useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext";
import { assets } from "../../assets/assets";
import { AppContext } from "../../context/AppContext";

const Dashboard = () => {
  const { aToken, getDashData, cancelAppointment, dashData } =
    useContext(AdminContext);

  const { slotDateFormat } = useContext(AppContext);

  useEffect(() => {
    if (aToken) {
      getDashData();
    }
  }, [aToken]);

  return (
    dashData && (
      <div className="m-5">
        {/* Summary Cards */}
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
            <img className="w-14" src={assets.doctor_icon} alt="" />
            <div>
              <p className="text-xl font-semibold text-gray-600">
                {dashData.doctors}
              </p>
              <p className="text-gray-400">Doctors</p>
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

        {/* Latest Appointments */}
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
                      src={item.docData?.image}
                      alt={item.docData?.name}
                    />
                    <div className="flex-1 text-sm">
                      <p className="font-semibold text-gray-800 ">
                        {item.docData?.name || "Unknown Doctor"}
                      </p>
                      <p className="text-sm text-gray-600">
                        {slotDateFormat(item.slotDate)}
                      </p>
                    </div>
                  </div>

                  <div>
                    {item.cancelled ? (
                      <p className="text-red-400 text-xs font-medium ">
                        Cancelled
                      </p>
                    ) : item.isCompleted ? (
                      <p className="text-green-500 text-xs font-medium ">
                        Completed
                      </p>
                    ) : (
                      <img
                        onClick={() => cancelAppointment(item._id)}
                        className="w-10 cursor-pointer"
                        src={assets.cancel_icon}
                        alt=""
                      />
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

export default Dashboard;
