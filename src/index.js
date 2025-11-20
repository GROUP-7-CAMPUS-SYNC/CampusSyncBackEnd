import express from "express"
import cors from "cors"
import bodyParser from "body-parser"
import "dotenv/config.js"
import authRoutes from "./routes/authRoutes.js"
import { connectDB } from "./lib/db.js"


const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(bodyParser.json())

app.use('/api/auth', authRoutes)


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
    connectDB()
})
