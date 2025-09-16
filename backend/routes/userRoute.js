import express from 'express'
import { registerUser,loginUser, getProfile , updateProfile,bookAppointment,listAppointment } from '../controllers/userController.js'
import authUser from '../middleweares/authUser.js'
import upload from '../middleweares/multer.js'

const userRouter = express.Router()

userRouter.post('/register',registerUser)
userRouter.post('/login',loginUser)
userRouter.get('/get-profile',authUser,getProfile)
userRouter.post('/update-profile',upload.single('image'),authUser,updateProfile)
userRouter.post('/book-appointment',authUser,bookAppointment)
userRouter.get('/appointments',authUser,listAppointment)









export default userRouter