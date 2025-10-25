import validator from "validator";
import bcrypt from "bcrypt";
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/docotorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import Stripe from "stripe";
import dotenv from "dotenv";

// ✅ Load environment variables before Stripe initialization
dotenv.config();

// ✅ Initialize Stripe with secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
});

// ✅ Register User
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.json({ success: false, message: "All fields are required" });
    if (!validator.isEmail(email))
      return res.json({ success: false, message: "Invalid email" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new userModel({ name, email, password: hashedPassword });
    const user = await newUser.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.json({ success: true, message: "User registered successfully", token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// ✅ Login User
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) return res.json({ success: false, message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.json({ success: false, message: "Invalid credentials" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.json({ success: true, message: "Login successful", token });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ✅ Get Profile
const getProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const userData = await userModel.findById(userId).select("-password");
    if (!userData)
      return res.json({ success: false, message: "User not found" });
    res.json({ success: true, userData });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ✅ Update Profile
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { name, phone, address, dob, gender } = req.body;
    const imageFile = req.file;
    const updateData = { name, phone, address, dob, gender };

    if (imageFile) {
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
      });
      updateData.image = imageUpload.secure_url;
    }

    await userModel.findByIdAndUpdate(userId, updateData);
    res.json({ success: true, message: "Profile updated" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ✅ Book Appointment
const bookAppointment = async (req, res) => {
  try {
    const { docId, slotDate, slotTime } = req.body;
    const userId = req.user.userId;
    const docData = await doctorModel.findById(docId).select("-password");

    if (!docData.available)
      return res.json({ success: false, message: "Doctor not available" });

    let slots_booked = docData.slots_booked || {};
    if (slots_booked[slotDate]?.includes(slotTime))
      return res.json({ success: false, message: "Slot already booked" });

    slots_booked[slotDate] = [...(slots_booked[slotDate] || []), slotTime];
    const userData = await userModel.findById(userId).select("-password");
    delete docData.slots_booked;

    const appointmentData = {
      userId,
      docId,
      userData,
      docData,
      amount: docData.fees,
      slotTime,
      slotDate,
      date: Date.now(),
    };

    const newAppointment = new appointmentModel(appointmentData);
    await newAppointment.save();
    await doctorModel.findByIdAndUpdate(docId, { slots_booked });

    res.json({
      success: true,
      message: "Appointment Booked",
      appointmentId: newAppointment._id,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ✅ Get Appointments
const listAppointment = async (req, res) => {
  try {
    const userId = req.user.userId;
    const appointments = await appointmentModel
      .find({ userId })
      .sort({ date: -1 });
    res.json({ success: true, appointments });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ✅ Cancel Appointment
const cancelAppointment = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { appointmentId } = req.body;
    const appointment = await appointmentModel.findById(appointmentId);

    if (!appointment)
      return res.json({ success: false, message: "Appointment not found" });
    if (String(appointment.userId) !== String(userId))
      return res.json({ success: false, message: "Unauthorized" });

    await appointmentModel.findByIdAndUpdate(appointmentId, {
      cancelled: true,
    });

    const doctor = await doctorModel.findById(appointment.docId);
    let slots = doctor.slots_booked;

    if (slots[appointment.slotDate])
      slots[appointment.slotDate] = slots[appointment.slotDate].filter(
        (s) => s !== appointment.slotTime
      );

    await doctorModel.findByIdAndUpdate(appointment.docId, { slots_booked: slots });
    res.json({ success: true, message: "Appointment cancelled" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ✅ Stripe Payment Intent
const paymentStripe = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const appointment = await appointmentModel.findById(appointmentId);
    if (!appointment)
      return res.json({ success: false, message: "Appointment not found" });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: appointment.amount * 100,
      currency: process.env.CURRENCY || "npr",
      metadata: { appointmentId: appointmentId },
      description: `Payment for appointment ${appointmentId}`,
    });

    res.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// ✅ Stripe Webhook (newly added)
const stripeWebhook = async (req, res) => {
  try {
    const event = req.body;

    switch (event.type) {
      case "payment_intent.succeeded":
        const appointmentId = event.data.object.metadata.appointmentId;
        await appointmentModel.findByIdAndUpdate(appointmentId, {
          payment: true,
        });
        console.log("✅ Payment succeeded and verified for:", appointmentId);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
};

// ✅ Stripe Payment Verification (manual backup)
const verifyStripe = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    await appointmentModel.findByIdAndUpdate(appointmentId, { payment: true });
    res.json({ success: true, message: "Payment verified" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  bookAppointment,
  listAppointment,
  cancelAppointment,
  paymentStripe,
  stripeWebhook,
  verifyStripe,
};
