const mongoose = require("mongoose")

const LeadSchema = new mongoose.Schema({
  name: String,
  phone: String,
  source: String,
  status: { type: String, default: "New Lead" },
  assignedAgent: String,

  property: String,
  visitDate: Date,

  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model("Lead", LeadSchema)