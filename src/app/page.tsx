"use client"

import { useState } from "react"
import WorkersTab from "@/components/WorkersTab"
import AttendanceTab from "@/components/AttendanceTab"
import PayslipTab from "@/components/PayslipTab"
import { Users, Clock, FileText } from "lucide-react"

export default function Home() {
  const [activeTab, setActiveTab] = useState("workers")

  const tabs = [
    { id: "workers", label: "Workers", icon: Users },
    { id: "attendance", label: "Attendance", icon: Clock },
    { id: "payslip", label: "Payslip", icon: FileText },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 text-white p-2 rounded-lg">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Worker Attendance System
              </h1>
              <p className="text-sm text-gray-600">
                Manage workers, track attendance, and generate payslips
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b border-slate-200 bg-white sticky top-[88px] z-30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-4 font-medium text-sm border-b-2 transition-colors flex items-center gap-2 ${
                    activeTab === tab.id
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === "workers" && <WorkersTab />}
        {activeTab === "attendance" && <AttendanceTab />}
        {activeTab === "payslip" && <PayslipTab />}
      </main>
    </div>
  )
}
