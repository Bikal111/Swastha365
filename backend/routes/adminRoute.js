import express from 'express';
import { addDoctor, allDoctors, loginAdmin } from '../controllers/adminController.js';
import upload from '../middleweares/multer.js';
import { protect } from '../middleweares/authAdmin.js'; // <-- fixed import
import { changeAvailablity } from '../controllers/doctorController.js';

const adminRouter = express.Router();

// Use `protect` middleware for admin-protected routes
adminRouter.post('/add-doctor', protect, upload.single('image'), addDoctor);
adminRouter.post('/all-doctors', protect, allDoctors);
adminRouter.post('/change-availability', protect, changeAvailablity);

// Login route does not need protection
adminRouter.post('/login', loginAdmin);

export default adminRouter;
