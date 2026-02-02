import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './config/mongodb.js'
import connetCloudinary from './config/cloudinary.js'
import adminRouter from './routes/adminroute.js'
import doctorRouter from './routes/doctorRoute.js'
import userRouter from './routes/userRoute.js'

dotenv.config()

const app = express()
const port = process.env.PORT || 4000
connectDB()
connetCloudinary()

app.use(express.json())
app.use(cors())

app.use('/api/admin', adminRouter)
app.use('/api/doctor', doctorRouter)
app.use('/api/user', userRouter)

app.get('/', (req, res) => {
    res.send('API WORKING')
})

// Only listen if not running on Vercel
if (process.env.NODE_ENV !== 'production') {
    app.listen(port, () => console.log("Server Started ", port))
}

export default app; // This is the crucial part for Vercel