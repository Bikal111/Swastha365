import express from 'express'
import { addDoctor,allDoctors,loginAdmin,appointmentsAdmin, AppointmentCancel, adminDashboard } from '../controllers/adminController.js'
import upload from '../middleweares/multer.js'
import authAdmin from '../middleweares/authAdmin.js'
import { changeAvailablity } from '../controllers/doctorController.js'

const adminRouter = express.Router()

adminRouter.post('/add-doctor',authAdmin,upload.single('image'),addDoctor)

adminRouter.post('/login',loginAdmin)
adminRouter.post('/all-doctors',authAdmin,allDoctors)
adminRouter.post('/change-availability',authAdmin,changeAvailablity)
adminRouter.get('/appointments',authAdmin,appointmentsAdmin)
adminRouter.post('/cancel-appointment',authAdmin,AppointmentCancel)
adminRouter.get('/dashboard',authAdmin,adminDashboard)

export default adminRouter