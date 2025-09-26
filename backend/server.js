// backend/server.js
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './config/mongodb.js'
import connetCloudinary from './config/cloudinary.js'
import adminRouter from './routes/adminroute.js'
import doctorRouter from './routes/doctorRoute.js'
import userRouter from './routes/userRoute.js'
import cookieParser from "cookie-parser";

dotenv.config()
const app = express()
const port = process.env.PORT || 4000

// middlewares
app.use(express.json())
app.use(cors())
app.use(cookieParser());


// connect services
connectDB()
connetCloudinary()

// api endpoints
app.use('/api/admin', adminRouter)
app.use('/api/doctor', doctorRouter)
app.use('/api/user', userRouter)

app.get('/', (req, res) => res.send('API WORKING'))

app.listen(port, () => console.log("Server Started ", port))
