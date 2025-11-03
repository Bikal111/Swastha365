import validator from 'validator'
import bcrypt from 'bcrypt'
import {v2 as cloudinary} from "cloudinary"
import doctorModel from '../models/docotorModel.js'
import jwt from 'jsonwebtoken'
import appointmentModel from '../models/appointmentModel.js'
import userModel from '../models/userModel.js'

// API FOR Adding doc
const addDoctor = async(req,res) =>{
    try {
        const{name,email,password,speciality,degree,experience,about,fees,address} = req.body
        const imageFile = req.file
        //checking for all data to add doctor
        if (!name || !email || !password|| !speciality || !degree|| !experience || !about|| !fees || !address) {
            return res.json({success:false,message:"Missing Details"})
        }
        //checking image 
         if (!imageFile) {
            return res.json({ success: false, message: "Doctor image is required" })
        }

        //validating email
        if (!validator.isEmail(email)) {
             return res.json({success:false,message:"Please enter a valid Email"})
        }

         //validating password
        if (!validator.isStrongPassword(password, {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1
        })) {
            return res.json({
                success: false,
                message: "Password must be stronger. Include uppercase, lowercase, number, and special character."
            })
        }

        // hashing doc password

        const salt = await bcrypt.genSalt(14)
        const hashedPassword = await bcrypt.hash(password,salt)

        //upload image to cloudinary
        const imageUpload = await cloudinary.uploader.upload(imageFile.path,{resource_type:"image"})
        const imageUrl = imageUpload.secure_url

        const doctorData={
            name,
            email,
            image:imageUrl,
            password:hashedPassword,
            speciality,
            degree,
            experience,
            about,
            fees,
            address:JSON.parse(address),
            date:Date.now()
        }

        const newDoctor = new doctorModel(doctorData)
        await newDoctor.save()
        res.json({success:true,message:"Doctor Added "})


    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
        
    }
}

//Api for admin login

const loginAdmin = async (req,res) =>{
    try {
        const {email,password} = req.body

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            
            const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1d' })
            res.json({success:true,token})


        } else{
            res.json({success:false,message:"Invalid Password or Email "})
        }

        
    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
    }
}


// API to get all doctor list

const allDoctors = async(req,res)=>{
    try {
        const doctors = await doctorModel.find({}).select('-password')
        res.json({success:true,doctors})

    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
    }
}

//
const appointmentsAdmin = async (req,res) =>{
    try {
        const appointments = await appointmentModel.find({})
        res.json({success:true,appointments})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
    }
}

//api for appointment cancellition
const AppointmentCancel = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const appointment = await appointmentModel.findById(appointmentId);

   
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

// API to get dashboard data

const adminDashboard = async (req,res) =>{
    try {
        const doctors = await doctorModel.find({})
        const users = await userModel.find({})
        const appointments = await appointmentModel.find({})

        const dashData = {
            doctors: doctors.length,
            appointments:appointments.length,
            patients: users.length,
            latestAppointments: appointments.reverse().slice(0,5)

        }

        res.json({success:true,dashData})

    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
    }
}


export{addDoctor,loginAdmin,allDoctors,appointmentsAdmin,AppointmentCancel,adminDashboard}