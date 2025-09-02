import express from 'express'
import { addDoctor,allDoctors,loginAdmin } from '../controllers/adminController.js'
import upload from '../middleweares/multer.js'
import authAdmin from '../middleweares/authAdmin.js'
import { changeAvailablity } from '../controllers/doctorController.js'

const adminRouter = express.Router()

adminRouter.post('/add-doctor',authAdmin,upload.single('image'),addDoctor)

adminRouter.post('/login',loginAdmin)
adminRouter.post('/all-doctors',authAdmin,allDoctors)
adminRouter.post('/change-availability',authAdmin,changeAvailablity)

export default adminRouter