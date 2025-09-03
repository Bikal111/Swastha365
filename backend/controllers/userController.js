import validator from 'validator'
import bcrypt from 'bcrypt'
import userModel from '../models/userModel.js'
import jwt from 'jsonwebtoken'









// API to register user
const registerUser = async (req,res) =>{
    try {
        const {name,email,password} = req.body

        if (!name || !password || !email) {
            return res.json({success:false,message:"Missing Details"})
        } 
        if (!validator.isEmail(email)) {
            return res.json({success:false,message:"Enter a Valid Email"})
        }
        if (password.length <8) {
            return res.json({success:false,message:"Enter a Strong Password"})
        }
        if (!/[A-Z]/.test(password)) {
            return res.json({ success: false, message: "Password must contain at least one uppercase letter" });
        }
        if (!/[0-9]/.test(password)) {
            return res.json({ success: false, message: "Password must contain at least one number" });
        }
        if (!/[^A-Za-z0-9]/.test(password)) {
            return res.json({ success: false, message: "Password must contain at least one special character" });
        }

        //hasing user password
        const salt = await bcrypt.genSalt(14)
        const hashedPassword = await bcrypt.hash(password,salt)

        const userData ={
            name,
            email,
            password: hashedPassword
        }

        const newUser = new userModel(userData)
        const user = await newUser.save()

        const token = jwt.sign({id:user._id},process.env.JWT_SECRET)

        res.json({success:true,token})



    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
        
    }
}

//API for User LOGIN

export {registerUser}
