"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Inputs } from "../../../molecules/input/inputs"
import { axiosPrivate } from "../../../../libs/instance"
import toast from "react-hot-toast"
import { Textareas } from "../../../molecules/input/textAreas"

// mock current user branch & location (nanti ambil dari cookie / profile)
const CURRENT_BRANCH = "JKT"
const CURRENT_LOCATION = "Gedung A Lt. 3"

interface Item {
  asset_id: number | null
  asset_number: string
  from_branch_code: string
  to_branch_code: string
  from_location: string
  to_location: string
  notes: string
}

export default function CreateMutationPage() {
  const navigate = useNavigate()

  const [notes, setNotes] = useState("")
  const [items, setItems] = useState<Item[]>([
    {
      asset_id: null,
      asset_number: "",
      from_branch_code: CURRENT_BRANCH,
      to_branch_code: "",
      from_location: CURRENT_LOCATION,
      to_location: "",
      notes: "",
    },
  ])

  const today = new Date().toISOString().split("T")[0]

  // ─── HANDLE ITEM CHANGE ─────────────────────────

  const updateItem = (index: number, key: keyof Item, value: any) => {
    setItems((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, [key]: value } : item
      )
    )
  }

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      {
        asset_id: null,
        asset_number: "",
        from_branch_code: CURRENT_BRANCH,
        to_branch_code: "",
        from_location: CURRENT_LOCATION,
        to_location: "",
        notes: "",
      },
    ])
  }

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index))
  }

  // ─── SUBMIT ─────────────────────────────────────

  const handleSubmit = async () => {
    try {
      await axiosPrivate.post("/mutation", {
        transaction_date: today,
        notes,
        items,
      })

      toast.success("Mutation created")
      navigate("/dashboard/mutation")
    } catch (err) {
      toast.error("Failed to create mutation")
      console.error(err)
    }
  }

  return (
    <div className="w-full mx-auto space-y-6 py-6">

      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold">Create Mutation</h2>
        <p className="text-sm text-gray-500">
          Transaction Date: <b>{today}</b>
        </p>
      </div>

      {/* Notes */}
      <div className="bg-white border rounded-xl p-4">
        <Textareas
          label="Transaction Notes"
          value={notes}
          onChange={setNotes}
        />
      </div>

      {/* Items */}
      <div className="space-y-4">
        {items.map((item, index) => (
          <div
            key={index}
            className="border rounded-xl p-4 space-y-4 bg-white"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium">
                Item #{index + 1}
              </h3>

              {items.length > 1 && (
                <button
                  onClick={() => removeItem(index)}
                  className="text-xs text-red-600"
                >
                  Remove
                </button>
              )}
            </div>

            {/* Asset */}
            <div className="grid grid-cols-2 gap-4">
              <Inputs
                label="Asset Number"
                value={item.asset_number}
                onChange={(v) =>
                  updateItem(index, "asset_number", v)
                }
              />

              <Inputs
                label="Asset ID"
                value={item.asset_id?.toLocaleString() ?? ""}
                onChange={(v) =>
                  updateItem(index, "asset_id", Number(v))
                }
              />
            </div>

            {/* FROM (auto) */}
            <div className="grid grid-cols-2 gap-4">
              <Inputs
                label="From Branch"
                value={item.from_branch_code}
                disabled
              />
              <Inputs
                label="From Location"
                value={item.from_location}
                disabled
              />
            </div>

            {/* TO */}
            <div className="grid grid-cols-2 gap-4">
              <Inputs
                label="To Branch"
                value={item.to_branch_code}
                onChange={(v) =>
                  updateItem(index, "to_branch_code", v)
                }
              />
              <Inputs
                label="To Location"
                value={item.to_location}
                onChange={(v) =>
                  updateItem(index, "to_location", v)
                }
              />
            </div>

            {/* Notes */}
            <Textareas
              label="Item Notes"
              value={item.notes}
              onChange={(v) =>
                updateItem(index, "notes", v)
              }
              rows={2}
            />
          </div>
        ))}
      </div>

      {/* Add Item */}
      <button
        onClick={addItem}
        className="px-4 py-2 text-sm bg-gray-100 rounded-lg hover:bg-gray-200"
      >
        + Add Item
      </button>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={() => navigate(-1)}
          className="flex-1 border px-4 py-2 rounded-lg"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Submit
        </button>
      </div>
    </div>
  )
}