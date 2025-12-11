"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Download, Loader2 } from "lucide-react"

interface Worker {
  id: number
  fullName: string
  hourlyRate: number
}

interface Attendance {
  id: number
  workerId: number
  date: string
  status: "FULL_DAY" | "HALF_DAY" | "DAY_OFF"
}

interface PayslipData {
  workerId: number
  workerName: string
  hourlyRate: number
  startDate: string
  endDate: string
  totalDays: number
  totalWorkDays: number
  dayOffCount: number
  totalHours: number
  totalAmount: number
  attendances: Attendance[]
}

export default function PayslipTab() {
  const [busyMessage, setBusyMessage] = useState<string | null>(null)
  const [workers, setWorkers] = useState<Worker[]>([])
  const [selectedWorker, setSelectedWorker] = useState<string>("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [payslips, setPayslips] = useState<PayslipData[]>([])
  const [loading, setLoading] = useState(false)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [selectedPayslip, setSelectedPayslip] = useState<PayslipData | null>(null)

  useEffect(() => {
    fetchWorkers()
  }, [])

  const fetchWorkers = async () => {
    try {
      setBusyMessage("Loading workers…")
      const response = await fetch("/api/workers")
      const data = await response.json()
      setWorkers(data)
    } catch (error) {
      console.error("Failed to fetch workers:", error)
    } finally {
      setBusyMessage(null)
    }
  }

  const handleGeneratePayslip = async () => {
    try {
      if (!selectedWorker || !startDate || !endDate) {
        alert("Please fill all fields")
        return
      }

      setBusyMessage("Generating payslip…")
      setLoading(true)
      const response = await fetch(
        `/api/payslip?workerId=${selectedWorker}&startDate=${startDate}&endDate=${endDate}`
      )
      const data = await response.json()
      setPayslips([data])
    } catch (error) {
      console.error("Failed to generate payslip:", error)
    } finally {
      setLoading(false)
      setBusyMessage(null)
    }
  }

  const handleSavePayslip = async (payslip: PayslipData) => {
    try {
      const response = await fetch("/api/payslip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workerId: payslip.workerId,
          startDate: payslip.startDate,
          endDate: payslip.endDate,
        }),
      })
      if (response.ok) {
        alert("Payslip saved successfully")
      }
    } catch (error) {
      console.error("Failed to save payslip:", error)
    }
  }

  const handleDownloadPDF = (payslip: PayslipData) => {
    // Simple PDF generation logic
    const content = `
PAYSLIP
${payslip.workerName}
Period: ${new Date(payslip.startDate).toLocaleDateString()} - ${new Date(payslip.endDate).toLocaleDateString()}

Hourly Rate: RM${payslip.hourlyRate.toFixed(2)}/hour
Total Days Worked: ${payslip.totalDays.toFixed(1)} days
Total Hours: ${payslip.totalHours.toFixed(1)} hours (1 day = 8 hours)
Total Amount: RM${payslip.totalAmount.toFixed(2)}

Work Entries: ${payslip.totalWorkDays}
Days Off: ${payslip.dayOffCount}

Note: Full Day = 1 day (8 hours), Half Day = 0.5 days (4 hours)
    `.trim()

    const element = document.createElement("a")
    element.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," + encodeURIComponent(content)
    )
    element.setAttribute(
      "download",
      `payslip_${payslip.workerName}_${payslip.startDate}.txt`
    )
    element.style.display = "none"
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="space-y-6">
      {busyMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-sm">
          <div className="flex items-center gap-2 rounded-md bg-white px-4 py-3 shadow">
            <Loader2 className="h-4 w-4 animate-spin text-gray-700" />
            <span className="text-sm font-medium text-gray-800">{busyMessage}</span>
          </div>
        </div>
      )}
      <Card>
        <CardHeader>
          <CardTitle>Generate Payslip</CardTitle>
        </CardHeader>
        <CardContent>
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
              <label className="block text-sm font-medium mb-2">Start Date</label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">End Date</label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>

            <div className="flex items-end">
              <Button
                onClick={handleGeneratePayslip}
                disabled={loading}
                className="w-full"
              >
                {loading ? "Generating..." : "Generate"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {payslips.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Payslip Summary</h3>
          {payslips.map((payslip, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>{payslip.workerName}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Period</p>
                    <p className="font-semibold">
                      {formatDate(payslip.startDate)} -{" "}
                      {formatDate(payslip.endDate)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Hourly Rate</p>
                    <p className="font-semibold">
                      RM {payslip.hourlyRate.toFixed(2)}/hr
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Days</p>
                    <p className="font-semibold">
                      {payslip.totalDays.toFixed(1)} days
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Amount</p>
                    <p className="font-semibold text-green-600 text-lg">
                      RM {payslip.totalAmount.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded">
                  <div>
                    <p className="text-sm text-gray-600">Total Hours</p>
                    <p className="font-semibold">{payslip.totalHours.toFixed(1)} hrs</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Work Entries</p>
                    <p className="font-semibold">{payslip.totalWorkDays}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Days Off</p>
                    <p className="font-semibold">{payslip.dayOffCount}</p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-semibold text-sm mb-3">Attendance Summary</h4>
                  <div className="max-h-60 overflow-y-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 sticky top-0">
                        <tr>
                          <th className="text-left p-2 font-medium">Date</th>
                          <th className="text-left p-2 font-medium">Status</th>
                          <th className="text-right p-2 font-medium">Days</th>
                          <th className="text-right p-2 font-medium">Hours</th>
                        </tr>
                      </thead>
                      <tbody>
                        {payslip.attendances && payslip.attendances.length > 0 ? (
                          payslip.attendances.map((attendance) => (
                            <tr key={attendance.id} className="border-b">
                              <td className="p-2">{formatDate(attendance.date)}</td>
                              <td className="p-2">
                                <span
                                  className={`px-2 py-1 rounded text-xs ${
                                    attendance.status === "FULL_DAY"
                                      ? "bg-green-100 text-green-800"
                                      : attendance.status === "HALF_DAY"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-gray-100 text-gray-800"
                                  }`}
                                >
                                  {attendance.status === "FULL_DAY"
                                    ? "Full Day"
                                    : attendance.status === "HALF_DAY"
                                    ? "Half Day"
                                    : "Day Off"}
                                </span>
                              </td>
                              <td className="p-2 text-right">
                                {attendance.status === "FULL_DAY"
                                  ? "1.0"
                                  : attendance.status === "HALF_DAY"
                                  ? "0.5"
                                  : "0.0"}
                              </td>
                              <td className="p-2 text-right">
                                {attendance.status === "FULL_DAY"
                                  ? "8"
                                  : attendance.status === "HALF_DAY"
                                  ? "4"
                                  : "0"}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={4} className="p-4 text-center text-gray-500">
                              No attendance records for this period
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedPayslip(payslip)
                      setIsPreviewOpen(true)
                    }}
                  >
                    Preview
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleDownloadPDF(payslip)}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                  <Button onClick={() => handleSavePayslip(payslip)}>
                    Save to Database
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-2xl max-h-96 overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Payslip Preview</DialogTitle>
          </DialogHeader>
          {selectedPayslip && (
            <div className="space-y-4 text-sm">
              <div className="border-b pb-4">
                <h3 className="font-bold text-lg">{selectedPayslip.workerName}</h3>
                <p className="text-gray-600">
                  Period: {formatDate(selectedPayslip.startDate)} -{" "}
                  {formatDate(selectedPayslip.endDate)}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600">Hourly Rate</p>
                  <p className="font-semibold">
                    RM {selectedPayslip.hourlyRate.toFixed(2)}/hour
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Total Days Worked</p>
                  <p className="font-semibold">
                    {selectedPayslip.totalDays.toFixed(1)} days
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Total Hours</p>
                  <p className="font-semibold">{selectedPayslip.totalHours.toFixed(1)} hours</p>
                </div>
                <div>
                  <p className="text-gray-600">Days Off</p>
                  <p className="font-semibold">{selectedPayslip.dayOffCount}</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center text-lg">
                  <span className="font-semibold">Total Amount</span>
                  <span className="text-green-600 font-bold">
                    ${selectedPayslip.totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
