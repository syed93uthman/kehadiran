"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calendar } from "lucide-react"

interface Worker {
  id: number
  fullName: string
  hourlyRate: number
}

interface Attendance {
  id: number
  workerId: number
  date: string
  status: string
}

export default function AttendanceTab() {
  const [workers, setWorkers] = useState<Worker[]>([])
  const [selectedWorker, setSelectedWorker] = useState<string>("")
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  )
  const [status, setStatus] = useState("FULL_DAY")
  const [attendances, setAttendances] = useState<Attendance[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchWorkers()
    fetchAttendances()
  }, [])

  const fetchWorkers = async () => {
    try {
      const response = await fetch("/api/workers")
      const data = await response.json()
      setWorkers(data)
    } catch (error) {
      console.error("Failed to fetch workers:", error)
    }
  }

  const fetchAttendances = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/attendance")
      const data = await response.json()
      setAttendances(data)
    } catch (error) {
      console.error("Failed to fetch attendances:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    try {
      if (!selectedWorker || !selectedDate || !status) {
        alert("Please fill all fields")
        return
      }

      const response = await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workerId: parseInt(selectedWorker),
          date: selectedDate,
          status,
        }),
      })

      if (response.ok) {
        await fetchAttendances()
        setStatus("FULL_DAY")
      }
    } catch (error) {
      console.error("Failed to record attendance:", error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "FULL_DAY":
        return "bg-green-100 text-green-800"
      case "HALF_DAY":
        return "bg-yellow-100 text-yellow-800"
      case "DAY_OFF":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getWorkerName = (workerId: number) => {
    const worker = workers.find((w) => w.id === workerId)
    return worker?.fullName || "Unknown"
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4">Record Attendance</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Worker</label>
              <Select value={selectedWorker} onValueChange={setSelectedWorker}>
                <SelectTrigger>
                  <SelectValue placeholder="Select worker" />
                </SelectTrigger>
                <SelectContent>
                  {workers.map((worker) => (
                    <SelectItem key={worker.id} value={worker.id.toString()}>
                      {worker.fullName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Date</label>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FULL_DAY">Full Day</SelectItem>
                  <SelectItem value="HALF_DAY">Half Day</SelectItem>
                  <SelectItem value="DAY_OFF">Day Off</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button onClick={handleSubmit} className="w-full">
                Record
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div>
        <h3 className="text-lg font-semibold mb-4">Recent Attendance</h3>
        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {attendances.slice(0, 20).map((attendance) => (
              <Card key={attendance.id}>
                <CardContent className="pt-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">
                        {getWorkerName(attendance.workerId)}
                      </p>
                      <p className="text-sm text-gray-600">
                        <Calendar className="inline w-4 h-4 mr-1" />
                        {formatDate(attendance.date)}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(attendance.status)}`}
                    >
                      {attendance.status.replace("_", " ")}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
