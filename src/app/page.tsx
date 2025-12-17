import { LoginLink } from "@kinde-oss/kinde-auth-nextjs/components"
import { Users } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center space-y-6">
          {/* Logo/Icon */}
          <div className="flex justify-center">
            <div className="bg-blue-600 text-white p-4 rounded-2xl">
              <Users className="w-12 h-12" />
            </div>
          </div>

          {/* Title */}
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Kehadiran
            </h1>
            <p className="text-gray-600">
              Worker Attendance Management System
            </p>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-500">
            Track attendance, manage workers, and generate payslips with ease
          </p>

          {/* Login Button */}
          <div className="pt-4">
            <LoginLink className="inline-block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
              Login to Continue
            </LoginLink>
          </div>
        </div>
      </div>
    </div>
  )
}
