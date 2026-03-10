const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")

const leadRoutes = require("./routes/leads")

const app = express()

app.use(cors())
app.use(express.json())

mongoose.connect(
"mongodb://Atharva:Atharva%4030@ac-ahnrumm-shard-00-00.ossrrng.mongodb.net:27017,ac-ahnrumm-shard-00-01.ossrrng.mongodb.net:27017,ac-ahnrumm-shard-00-02.ossrrng.mongodb.net:27017/crm?ssl=true&replicaSet=atlas-eh2fi3-shard-0&authSource=admin&retryWrites=true&w=majority"
)
.then(()=>console.log("MongoDB connected"))
.catch(err=>console.log(err))

app.use("/leads", leadRoutes)

const PORT = process.env.PORT || 5000

app.listen(PORT, ()=>{
 console.log(`Server running on port ${PORT}`)
})
