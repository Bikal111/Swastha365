import validator from 'validator'
import bcrypt from 'bcrypt'
import userModel from '../models/userModel.js'
import jwt from 'jsonwebtoken'
import { v2 as cloudinary } from 'cloudinary'
import doctorModel from '../models/docotorModel.js'
import appointmentModel from '../models/appointmentModel.js';

// API to register user
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body

        if (!name || !email || !password) {
            return res.json({ success: false, message: "All fields are required" })
        }

        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Invalid email format" })
        }

        // Hashing user password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const userData = {
            name,
            email,
            password: hashedPassword
        }

        const newUser = new userModel(userData)
        const user = await newUser.save()

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" })

        res.json({ success: true, message: "User registered successfully", token })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API for User LOGIN
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.json({ success: false, message: "Email and password are required" })
        }

        const user = await userModel.findOne({ email })
        if (!user) {
            return res.json({ success: false, message: "User does not exist" })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (isMatch) {
            const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" })
            res.json({ success: true, message: "Login successful", token })
        } else {
            res.json({ success: false, message: "Invalid Credentials" })
        }
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API for USER PROFILE data
const getProfile = async (req, res) => {
    try {
        const userId = req.user.userId; // ✅ from authUser middleware
        const userData = await userModel.findById(userId).select("-password");

        if (!userData) {
            return res.json({ success: false, message: "User not found" });
        }

        res.json({ success: true, userData });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// API To Update user profile
const updateProfile = async (req, res) => {
    try {
        const userId = req.user.userId; // ✅ from authUser middleware
        const { name, phone, address, dob, gender } = req.body;
        const imageFile = req.file;

        if (!name || !phone || !address || !dob || !gender) {
            return res.json({ success: false, message: "Data Missing" });
        }

        // prepare update object
        const updateData = { name, phone, address, dob, gender };

        if (imageFile) {
            // upload image to cloudinary
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: 'image' });
            updateData.image = imageUpload.secure_url;
        }

        await userModel.findByIdAndUpdate(userId, updateData);

        res.json({ success: true, message: "Profile Updated" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// API to book appointment

const bookAppointment = async(req,res)=>{
    try {
        const { docId, slotDate, slotTime } = req.body;
        const userId = req.user.userId; // ✅ from middleware

        const docData = await doctorModel.findById(docId).select('-password');
        if(!docData.available){
            return res.json({success:false,message:'Doctor not available'});
        }

        let slots_booked = docData.slots_booked || {};

        // Check if slot is available
        if (slots_booked[slotDate]) {
            if (slots_booked[slotDate].includes(slotTime)) {
                return res.json({success:false,message:'Slot not available'});
            } else {
                slots_booked[slotDate].push(slotTime);
            }
        } else {
            slots_booked[slotDate] = [slotTime];
        }

        const userData = await userModel.findById(userId).select('-password');

        delete docData.slots_booked;

        const appointmentData = {
            userId,
            docId,
            userData,
            docData,
            amount: docData.fees,
            slotTime,
            slotDate,
            date: Date.now()
        };

        const newAppointment = new appointmentModel(appointmentData);
        await newAppointment.save();

        // Save updated slot data
        await doctorModel.findByIdAndUpdate(docId,{slots_booked});

        res.json({success:true,message:'Appointment Booked'});
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

//API to get user appointment  for my-appointment page


const listAppointment =  async (req, res) => {
  try {
    const userId = req.user.userId; 

    const appointments = await appointmentModel.find({ userId }).sort({ date: -1 }); 

    res.json({ success: true, appointments });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
export { registerUser, loginUser, getProfile, updateProfile, bookAppointment,listAppointment }