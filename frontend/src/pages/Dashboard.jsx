
import { useEffect, useState } from "react"
import API from "../api/api"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"

function Dashboard(){

  const [leads,setLeads] = useState([])

  const [newLead,setNewLead] = useState({
    name:"",
    phone:"",
    source:""
  })

  const stages = [
    "New Lead",
    "Contacted",
    "Requirement Collected",
    "Property Suggested",
    "Visit Scheduled",
    "Visit Completed",
    "Booked",
    "Lost"
  ]

  const totalLeads = leads.length
  const visitsScheduled = leads.filter(l => l.status === "Visit Scheduled").length
  const booked = leads.filter(l => l.status === "Booked").length
  const lost = leads.filter(l => l.status === "Lost").length

  useEffect(()=>{
    fetchLeads()
  },[])

  const fetchLeads = async()=>{
    const res = await API.get("/leads")
    setLeads(res.data)
  }

  const createLead = async ()=>{
    await API.post("/leads/create",{
      ...newLead,
      assignedAgent:"Agent1"
    })

    setNewLead({
      name:"",
      phone:"",
      source:""
    })

    fetchLeads()
  }

  const handleDragEnd = async (result)=>{

    if(!result.destination) return

    const leadId = result.draggableId
    const newStatus = result.destination.droppableId

    await API.put(`/leads/${leadId}`,{
      status:newStatus
    })

    fetchLeads()
  }

  const isInactive = (lead)=>{
    const created = new Date(lead.createdAt)
    const now = new Date()

    const hours = (now - created) / (1000 * 60 * 60)

    return hours > 24 && lead.status !== "Booked" && lead.status !== "Lost"
  }

  return(

    <div className="min-h-screen bg-gray-100 p-6">

      <h1 className="text-3xl font-bold mb-6">
        CRM Dashboard
      </h1>

      {/* Add Lead */}
      <div className="bg-white p-4 rounded shadow mb-6 flex gap-3">

        <input
        className="border p-2 rounded w-40"
        placeholder="Name"
        value={newLead.name}
        onChange={(e)=>setNewLead({...newLead,name:e.target.value})}
        />

        <input
        className="border p-2 rounded w-40"
        placeholder="Phone"
        value={newLead.phone}
        onChange={(e)=>setNewLead({...newLead,phone:e.target.value})}
        />

        <input
        className="border p-2 rounded w-40"
        placeholder="Source"
        value={newLead.source}
        onChange={(e)=>setNewLead({...newLead,source:e.target.value})}
        />

        <button
        className="bg-blue-600 text-white px-4 rounded"
        onClick={createLead}
        >
        Add Lead
        </button>

      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">

        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-gray-500">Total Leads</h3>
          <p className="text-2xl font-bold">{totalLeads}</p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-gray-500">Visits Scheduled</h3>
          <p className="text-2xl font-bold">{visitsScheduled}</p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-gray-500">Bookings</h3>
          <p className="text-2xl font-bold">{booked}</p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-gray-500">Lost</h3>
          <p className="text-2xl font-bold">{lost}</p>
        </div>

      </div>

      {/* Pipeline */}
      <DragDropContext onDragEnd={handleDragEnd}>

      <div className="flex gap-4 overflow-x-auto">

        {stages.map(stage=>(
          <Droppable droppableId={stage} key={stage}>
          {(provided)=>(
          <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className="bg-gray-50 p-3 rounded min-w-[260px]"
          >

            <h3 className="font-semibold mb-3">
              {stage}
            </h3>

            {leads
              .filter(lead => lead.status === stage)
              .map((lead,index)=>(

                <Draggable
                key={lead._id}
                draggableId={lead._id}
                index={index}
                >
                {(provided)=>(
                <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                className="bg-white shadow rounded p-3 mb-3"
                >

                  <strong>{lead.name}</strong>
                  <p className="text-sm text-gray-600">{lead.phone}</p>
                  <p className="text-sm">Agent: {lead.assignedAgent}</p>

                  {isInactive(lead) && (
                    <p className="text-red-500 text-sm font-semibold">
                      ⚠ Follow-up needed
                    </p>
                  )}

                  <select
                    className="border p-1 mt-2 w-full rounded"
                    value={lead.status}
                    onChange={async (e)=>{
                      await API.put(`/leads/${lead._id}`,{status:e.target.value})
                      fetchLeads()
                    }}
                  >
                    {stages.map(s=>(
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>

                  <input
                    className="border p-1 mt-2 w-full rounded"
                    type="text"
                    placeholder="Property name"
                    defaultValue={lead.property || ""}
                    onBlur={async (e)=>{
                      await API.put(`/leads/property/${lead._id}`,{
                        property:e.target.value
                      })
                      fetchLeads()
                    }}
                  />

                  {lead.property && (
                    <p className="text-sm mt-1">
                      Property: {lead.property}
                    </p>
                  )}

                  {lead.visitDate && (
                    <p className="text-sm">
                      Visit: {new Date(lead.visitDate).toLocaleDateString()}
                    </p>
                  )}

                </div>
                )}
                </Draggable>

              ))
            }

            {provided.placeholder}

          </div>
          )}
          </Droppable>
        ))}

      </div>

      </DragDropContext>

    </div>
  )
}

export default Dashboard

