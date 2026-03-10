const express = require("express")
const router = express.Router()
const Lead = require("../models/Lead")

// GET all leads
router.get("/", async (req, res) => {
    const leads = await Lead.find()
    res.json(leads)
})

// CREATE lead
router.post("/create", async (req, res) => {
    const lead = new Lead(req.body)
    await lead.save()
    res.json(lead)
})
router.put("/property/:id", async (req,res)=>{
  const { property } = req.body

  const lead = await Lead.findByIdAndUpdate(
    req.params.id,
    { property },
    { new:true }
  )

  res.json(lead)
})
router.put("/:id", async (req, res) => {
  const { status } = req.body

  const updatedLead = await Lead.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  )

  res.json(updatedLead)
})

module.exports = router