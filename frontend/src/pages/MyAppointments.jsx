import React, { useEffect, useState, useContext } from "react";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// -------------------- Payment Modal --------------------
const PaymentModal = ({
  clientSecret,
  appointmentId,
  onClose,
  onSuccess,
  backendUrl,
  token,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: window.location.origin },
      redirect: "if_required",
    });

    if (error) {
      toast.error(error.message);
      setProcessing(false);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      try {
        await axios.post(
          `${backendUrl}/api/user/verify-payment`,
          { appointmentId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Payment Successful!");
        onSuccess();
        onClose();
      } catch {
        toast.error("Error verifying payment");
      } finally {
        setProcessing(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl animate-fadeIn">
        <h2 className="text-xl font-semibold mb-4 text-center">
          Complete Your Payment
        </h2>
        <form onSubmit={handleSubmit}>
          <PaymentElement />
          <button
            type="submit"
            disabled={processing || !stripe || !elements}
            className="mt-4 w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 transition"
          >
            {processing ? "Processing..." : "Pay Now"}
          </button>
        </form>
        <button
          onClick={onClose}
          className="mt-2 w-full py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

// -------------------- Main Component --------------------
const MyAppointments = () => {
  const { backendUrl, token, appointmentsUpdated } = useContext(AppContext);
  const [appointments, setAppointments] = useState([]);
  const [clientSecret, setClientSecret] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [cancelledAppointments, setCancelledAppointments] = useState([]);
  const [cancelledPage, setCancelledPage] = useState(1);
  const itemsPerPage = 3;

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

  // Format the slot date properly
  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split("_");
    return `${dateArray[0]} ${months[Number(dateArray[1])]} ${dateArray[2]}`;
  };

  // Fetch appointments from backend
  const getUserAppointments = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/appointments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        setAppointments(data.appointments);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Create payment intent
  const handleStripePayment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/create-payment-intent`,
        { appointmentId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        setClientSecret(data.clientSecret);
        setSelectedAppointment(appointmentId);
      } else {
        toast.error("Failed to initialize payment");
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Cancel appointment (frontend only)
  const handleCancelAppointment = (appt) => {
    toast.info(`Cancelled appointment with ${appt.docData?.name}`);
    setCancelledAppointments((prev) => [...prev, { ...appt, status: "cancelled" }]);
    setAppointments((prev) =>
      prev.filter((a) => a._id !== appt._id)
    );
  };

  // Helper to check if an appointment is in the past
  const isPastAppointment = (appt) => {
    const [d, m, y] = appt.slotDate.split("_").map(Number);
    const [h, min] = appt.slotTime.split(":").map(Number);
    const apptDate = new Date(y, m - 1, d, h, min);
    const now = new Date();
    return apptDate < now;
  };

  useEffect(() => {
    if (token) getUserAppointments();
  }, [token, appointmentsUpdated]);

  const currentAppointments = appointments.filter(
    (appt) => !isPastAppointment(appt) && !appt.cancelled
  );
  const pastAppointments = appointments.filter(
    (appt) => isPastAppointment(appt) && !appt.cancelled
  );

  // Pagination logic for cancelled appointments
  const paginatedCancelled = cancelledAppointments.slice(
    (cancelledPage - 1) * itemsPerPage,
    cancelledPage * itemsPerPage
  );
  const totalPages = Math.ceil(cancelledAppointments.length / itemsPerPage);

  const renderAppointmentCard = (item, isCurrent = false) => (
    <div
      key={item._id}
      className="border p-4 rounded-xl shadow-sm bg-white flex items-start gap-4"
    >
      <img
        src={item.docData?.image}
        alt=""
        className="w-24 h-24 object-cover rounded-lg"
      />
      <div className="flex-1 text-sm">
        <p className="font-semibold text-lg">{item.docData?.name}</p>
        <p className="text-gray-500">{item.docData?.speciality}</p>
        <p className="text-gray-600 mt-1">
          {slotDateFormat(item.slotDate)} | {item.slotTime}
        </p>
      </div>
      <div className="flex flex-col gap-2">
        {!item.payment && isCurrent && (
          <button
            onClick={() => handleStripePayment(item._id)}
            className="py-2 px-4 border rounded hover:bg-green-600 hover:text-white"
          >
            Pay Online
          </button>
        )}
        {isCurrent && (
          <button
            onClick={() => handleCancelAppointment(item)}
            className="py-2 px-4 border rounded hover:bg-red-600 hover:text-white"
          >
            Cancel Appointment
          </button>
        )}
        {item.payment && (
          <button className="py-2 border rounded bg-green-100">✅ Paid</button>
        )}
      </div>
    </div>
  );

  return (
    <div className="mt-12 space-y-10">
      <h2 className="font-semibold text-2xl mb-4">My Appointments</h2>

      {/* Current Appointments */}
      <section>
        <h3 className="text-lg font-semibold text-gray-700 mb-3">
          Current Appointments
        </h3>
        <div className="space-y-3">
          {currentAppointments.length ? (
            currentAppointments.map((appt) =>
              renderAppointmentCard(appt, true)
            )
          ) : (
            <p className="text-gray-500">No current appointments.</p>
          )}
        </div>
      </section>

      {/* Past Appointments */}
      <section>
        <h3 className="text-lg font-semibold text-gray-700 mb-3">
          Past Appointments
        </h3>
        <div className="space-y-3">
          {pastAppointments.length ? (
            pastAppointments.map((appt) => renderAppointmentCard(appt))
          ) : (
            <p className="text-gray-500">No past appointments.</p>
          )}
        </div>
      </section>

      {/* Cancelled Appointments with Pagination */}
      <section>
        <h3 className="text-lg font-semibold text-gray-700 mb-3">
          Cancelled Appointments
        </h3>
        <div className="space-y-3">
          {paginatedCancelled.length ? (
            paginatedCancelled.map((appt) => renderAppointmentCard(appt))
          ) : (
            <p className="text-gray-500">No cancelled appointments.</p>
          )}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-4">
            <button
              onClick={() => setCancelledPage((p) => Math.max(p - 1, 1))}
              disabled={cancelledPage === 1}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              Prev
            </button>
            <span className="px-3 py-1 bg-gray-100 rounded">
              Page {cancelledPage} of {totalPages}
            </span>
            <button
              onClick={() =>
                setCancelledPage((p) => Math.min(p + 1, totalPages))
              }
              disabled={cancelledPage === totalPages}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </section>

      {/* Stripe Modal */}
      {clientSecret && selectedAppointment && (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <PaymentModal
            clientSecret={clientSecret}
            appointmentId={selectedAppointment}
            onClose={() => {
              setClientSecret(null);
              setSelectedAppointment(null);
            }}
            onSuccess={() => getUserAppointments()}
            backendUrl={backendUrl}
            token={token}
          />
        </Elements>
      )}
    </div>
  );
};

export default MyAppointments;
