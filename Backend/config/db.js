const mongoose = require("mongoose")

mongoose.connect("mongodb+srv://Atharva:Atharva@30@cluster0.ossrrng.mongodb.net/?appName=Cluster0")

const db = mongoose.connection

db.on("connected", () => {
    console.log("MongoDB connected")
})