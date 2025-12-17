
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
import { redirect } from "next/navigation"
import DashboardContent from "@/components/DashboardContent"

export default async function Dashboard() {
  const {isAuthenticated} = getKindeServerSession();
  if (!(await isAuthenticated())) {
    redirect("/");
  }

  return <DashboardContent />;
}