import express from "express"
import cors from "cors"
import bodyParser from "body-parser"
import "dotenv/config.js"
import authRoutes from "./routes/authRoutes.js"
import suggestionGroup from "./routes/suggestionGroupRoutes.js"
import organizationRoutes from "./routes/organizationRoutes.js"
import academicRoutes from "./routes/academicRoutes.js"
import { connectDB } from "./lib/db.js"
import reportTypeRoutes from "./routes/reportTypeRoutes.js"


const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(bodyParser.json())

app.use('/api/auth', authRoutes)
app.use('/api/suggestions', suggestionGroup)
app.use('/api/organizations', organizationRoutes)
app.use('/api/report_types', reportTypeRoutes)
app.use('/api/academic', academicRoutes)



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
    connectDB()
})
