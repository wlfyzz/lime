'use client'

import { useEffect, useState } from "react"
import { getAll, deleteById } from "@/functions/Supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trash2, RefreshCw } from "lucide-react"
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMusic, faClock, faUser, faHome, faBroadcastTower, faChartLine, faUsers, faCog } from '@fortawesome/free-solid-svg-icons'
import { useAuth, UserButton, useUser } from '@clerk/nextjs'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { redirect } from 'next/navigation';

interface Request {
  id: number
  by: string
  song: string
  created_at: string
}

interface SidebarItemProps {
  icon: typeof faHome
  href: string
  label: string
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, href, label }) => {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <Link 
      href={href} 
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
        isActive ? 'bg-lime-800 text-lime-100' : 'text-lime-300 hover:bg-lime-800 hover:text-lime-100'
      }`}
    >
      <FontAwesomeIcon icon={icon} className="w-5 h-5" />
      <span>{label}</span>
    </Link>
  )
}

const Sidebar: React.FC = () => {
  const sidebarItems: SidebarItemProps[] = [
    { icon: faHome, href: "/staff/home", label: "Dashboard" },
    { icon: faMusic, href: "/staff/requests", label: "Song Requests" },
    { icon: faBroadcastTower, href: "/staff/broadcast", label: "Broadcast" },
    { icon: faChartLine, href: "/staff/analytics", label: "Analytics" },
    { icon: faUsers, href: "/staff/users", label: "User Management" },
    { icon: faCog, href: "/staff/settings", label: "Settings" },
  ]

  return (
    <div className="w-64 bg-lime-950 p-4 space-y-4">
      {sidebarItems.map((item, index) => (
        <SidebarItem key={index} {...item} />
      ))}
    </div>
  )
}

export default function StaffPortal() {
  const AuthorisedIDS = ["1137093225576935485"];
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const [requests, setRequests] = useState<Request[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchRequests = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await getAll("requests")
      setRequests(data as Request[])
    } catch (err) {
      setError("Failed to fetch requests. Please try again.")
      console.error("Error fetching requests:", err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isSignedIn) {
      redirect('/staff/auth');
      return;
    }

    const discordId = user?.externalAccounts.find(account => account.provider === 'discord')?.providerUserId;

    if (!discordId || !AuthorisedIDS.includes(discordId)) {
      redirect("/staff/unauthorised");
      return;
    }
    fetchRequests()
  }, [])

  const handleDelete = async (id: number) => {
    try {
      await deleteById("requests", id)
      setRequests(requests.filter(request => request.id !== id))
      toast.success("Request deleted successfully")
    } catch (err) {
      toast.error("Failed to delete request. Please try again.")
      console.error("Error deleting request:", err)
    }
  }

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const requestTime = new Date(timestamp)
    const diffInMinutes = Math.floor((now.getTime() - requestTime.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'just now'
    if (diffInMinutes === 1) return '1 min ago'
    if (diffInMinutes < 60) return `${diffInMinutes} mins ago`
    
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours === 1) return '1 hour ago'
    if (diffInHours < 24) return `${diffInHours} hours ago`
    
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays === 1) return '1 day ago'
    return `${diffInDays} days ago`
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-lime-900 to-lime-950 text-lime-100">
      <Sidebar />
      <div className="flex-1 p-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-lime-300">Requests</h1>
          <div className="flex items-center space-x-4">
            <Button onClick={fetchRequests} size="icon" variant="ghost" className="text-lime-300 border-lime-300 hover:bg-lime-800">
              <RefreshCw className="h-4 w-4" />
              <span className="sr-only">Refresh requests</span>
            </Button>
            <UserButton afterSignOutUrl="/staff/home" />
          </div>
        </header>

        {isLoading ? (
          <div className="text-center text-lime-300">Loading requests...</div>
        ) : error ? (
          <div className="text-red-500 text-center">{error}</div>
        ) : requests.length === 0 ? (
          <div className="text-center text-lime-300">No requests found.</div>
        ) : (
          <div className="grid gap-6">
            {requests.map((request) => (
              <Card key={request.id} className="bg-lime-950 border-lime-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-lime-300">Request #{request.id}</CardTitle>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(request.id)}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete request</span>
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <FontAwesomeIcon icon={faUser} className="text-lime-400" />
                      <span className="text-lime-100">{request.by}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FontAwesomeIcon icon={faClock} className="text-lime-400" />
                      <span className="text-lime-100">{formatTimeAgo(request.created_at)}</span>
                    </div>
                    <div className="flex items-center space-x-2 col-span-2">
                      <FontAwesomeIcon icon={faMusic} className="text-lime-400" />
                      <span className="text-lime-100">{request.song}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <ToastContainer 
          position="bottom-right" 
          theme="dark"
          toastClassName="bg-lime-950 text-lime-100"
        />
      </div>
    </div>
  )
}