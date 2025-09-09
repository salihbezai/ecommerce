import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"

import authRoutes from "./routes/auth.route.js"
import { connectDB } from "./lib/db.js"



dotenv.config()

const app = express()
app.use(cookieParser())
const PORT = process.env.PORT || 5000;

app.use(express.json()) // allow to parse the body of the request

app.use('/api/auth',authRoutes)
app.listen(PORT,()=>{
    console.log(`Server is running on port http://localhost:${PORT}`)    
    connectDB()
})



