import express from 'express'
import { addDoctor } from '../controllers/adminController.js'
import upload from '../middleweares/multer.js'

const adminRouter = express.Router()

adminRouter.post('/add-docotr',upload.single('image'),addDoctor)

export default adminRouter