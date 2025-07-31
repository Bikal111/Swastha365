import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './config/mongodb.js'
import connetCloudinary from './config/cloudinary.js'
import adminRoute from './routes/adminroute.js'

dotenv.config()

//app config

const app = express()
const port = process.env.PORT || 4000
connectDB()
connetCloudinary()


//middlewares
app.use(express.json())
app.use(cors())

//api endpoints
app.use('/api/admin',adminRoute)


app.get('/',(req,res)=>{
    res.send('API WORKING')
})

app.listen(port,()=> console.log("Server Started ",port ))