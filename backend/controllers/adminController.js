import validator from 'validator'
import bcrypt from 'bcrypt'
import {v2 as cloudinary} from "cloudinary"
import doctorModel from '../models/docotorModel.js'
import jwt from 'jsonwebtoken'

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

export{addDoctor,loginAdmin}