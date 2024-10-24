'use client'

import { useEffect, useState } from "react"
import { getAll, deleteById, getStaffByID } from "@/functions/Supabase"
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

  useEffect(() => {
    if (!isSignedIn) {
      redirect('/staff/auth');
      return;
    }

    const discordId = user?.externalAccounts.find(account => account.provider === 'discord')?.providerUserId;
    const dbUser = getStaffByID(Number(discordId));
    console.log(discordId)
    console.log(dbUser)

    if (!discordId || !AuthorisedIDS.includes(discordId)) {
      redirect("/staff/unauthorised");
      return;
    }
  }, [])
  

  return (
    
    <div className="flex min-h-screen bg-gradient-to-br from-lime-900 to-lime-950 text-lime-100">
      <Sidebar />
      <div className="flex-1 p-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-lime-300">Broadcast information.</h1>
          <div className="flex items-center space-x-4">
            <UserButton afterSignOutUrl="/staff/home" />
          </div>
        </header>
        <ToastContainer 
          position="bottom-right" 
          theme="dark"
          toastClassName="bg-lime-950 text-lime-100"
        />
      </div>
    </div>
  )
}