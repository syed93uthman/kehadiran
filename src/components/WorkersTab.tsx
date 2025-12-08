"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Trash2, Edit2, Plus } from "lucide-react"

interface Worker {
  id: number
  fullName: string
  hourlyRate: number
  createdAt: string
}

export default function WorkersTab() {
  const [workers, setWorkers] = useState<Worker[]>([])
  const [loading, setLoading] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    fullName: "",
    hourlyRate: "",
  })

  useEffect(() => {
    fetchWorkers()
  }, [])

  const fetchWorkers = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/workers")
      const data = await response.json()
      setWorkers(data)
    } catch (error) {
      console.error("Failed to fetch workers:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddClick = () => {
    setEditingId(null)
    setFormData({ fullName: "", hourlyRate: "" })
    setIsDialogOpen(true)
  }

  const handleEditClick = (worker: Worker) => {
    setEditingId(worker.id)
    setFormData({
      fullName: worker.fullName,
      hourlyRate: worker.hourlyRate.toString(),
    })
    setIsDialogOpen(true)
  }

  const handleSubmit = async () => {
    try {
      if (!formData.fullName || !formData.hourlyRate) {
        alert("Please fill all fields")
        return
      }

      if (editingId) {
        // Update
        const response = await fetch(`/api/workers/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        })
        if (response.ok) {
          await fetchWorkers()
          setIsDialogOpen(false)
        }
      } else {
        // Create
        const response = await fetch("/api/workers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        })
        if (response.ok) {
          await fetchWorkers()
          setIsDialogOpen(false)
        }
      }
    } catch (error) {
      console.error("Failed to save worker:", error)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure?")) return

    try {
      const response = await fetch(`/api/workers/${id}`, {
        method: "DELETE",
      })
      if (response.ok) {
        await fetchWorkers()
      }
    } catch (error) {
      console.error("Failed to delete worker:", error)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Workers</h2>
        <Button onClick={handleAddClick}>
          <Plus className="w-4 h-4 mr-2" />
          Add Worker
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <div className="grid gap-4">
          {workers.map((worker) => (
            <Card key={worker.id}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{worker.fullName}</h3>
                    <p className="text-sm text-gray-600">
                      Hourly Rate: RM {worker.hourlyRate.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditClick(worker)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(worker.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Edit Worker" : "Add New Worker"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Full Name
              </label>
              <Input
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                placeholder="Enter worker name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Hourly Rate (RM)
              </label>
              <Input
                type="number"
                step="0.01"
                value={formData.hourlyRate}
                onChange={(e) =>
                  setFormData({ ...formData, hourlyRate: e.target.value })
                }
                placeholder="Enter hourly rate"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {editingId ? "Update" : "Add"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
