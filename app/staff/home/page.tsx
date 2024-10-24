'use client';

import { useState, useEffect } from 'react';
import { useAuth, useUser, UserButton } from '@clerk/nextjs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMusic, faClock, faUser, faHome, faBroadcastTower, faChartLine, faUsers, faCog, faMicrophone } from '@fortawesome/free-solid-svg-icons'
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { redirect, useRouter } from 'next/navigation';
import Link from 'next/link';
import { usePathname } from 'next/navigation'

interface NowPlaying {
  listeners: {
    current: number;
    unique: number;
    total: number;
  };
  live: {
    is_live: boolean;
    streamer_name: string;
  };
  now_playing: {
    elapsed: number;
    remaining: number;
    sh_id: number;
    played_at: number;
    duration: number;
    playlist: string;
    streamer: string;
    is_request: boolean;
    song: {
      id: string;
      text: string;
      artist: string;
      title: string;
      album: string;
      genre: string;
      isrc: string;
      lyrics: string;
      art: string;
      custom_fields: Array<any>;
    };
  };
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

interface ApiResponse {
  data: NowPlaying;
}

export default function StaffHome() {
  const AuthorisedIDS = ["1137093225576935485"];
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const [currentListeners, setCurrentListeners] = useState(0);
  const [currentTrack, setCurrentTrack] = useState({ title: '', artist: '' });
  const [peakListeners, setPeakListeners] = useState(0);
  const router = useRouter();

  useEffect(() => {
    if (!isSignedIn) {
      redirect('/staff/home');
      return;
    }

    const discordId = user?.externalAccounts.find(account => account.provider === 'discord')?.providerUserId;

    if (!discordId || !AuthorisedIDS.includes(discordId)) {
      redirect("/staff/unauthorised");
      return;
    }

    const fetchData = async () => {
      try {
        const response = await fetch(`/api/stats?t=${new Date().toISOString()}`);
        const x: ApiResponse = await response.json();
        
        if (x.data) {
          setCurrentListeners(x.data.listeners.current);
          setPeakListeners(prev => Math.max(prev, x.data.listeners.current));
          setCurrentTrack({
            title: x.data.now_playing.song.title,
            artist: x.data.now_playing.song.artist,
          });
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 20000);
    
    return () => clearInterval(interval);
  }, [isSignedIn, user]);

  const handleBroadcast = () => {
    router.push('/staff/broadcast');
  };

  return (
    <div className="min-h-screen flex">
      <Sidebar/>
      <div className="flex-1 bg-gradient-to-br from-lime-900 to-lime-950 text-lime-100 p-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-lime-300">Staff Dashboard</h1>
          <UserButton afterSignOutUrl="/staff/home" />
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-lime-950 border-lime-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-lime-300">Current Listeners</CardTitle>
              <FontAwesomeIcon icon={faUsers} className="text-lime-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-lime-100">{currentListeners}</div>
            </CardContent>
          </Card>

          <Card className="bg-lime-950 border-lime-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-lime-300">Now Playing</CardTitle>
              <FontAwesomeIcon icon={faMusic} className="text-lime-400" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-semibold text-lime-100">{currentTrack.title}</div>
              <div className="text-sm text-lime-400">{currentTrack.artist}</div>
            </CardContent>
          </Card>

          <Card className="bg-lime-950 border-lime-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-lime-300">Peak Listeners</CardTitle>
              <FontAwesomeIcon icon={faChartLine} className="text-lime-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-lime-100">{peakListeners}</div>
            </CardContent>
          </Card>

          <Card className="bg-lime-950 border-lime-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-lime-300">Go Live</CardTitle>
              <FontAwesomeIcon icon={faMicrophone} className="text-lime-400" />
            </CardHeader>
            <CardContent>
              <Button onClick={handleBroadcast} className="w-full bg-lime-600 hover:bg-lime-500 text-lime-950">Start Broadcasting</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
