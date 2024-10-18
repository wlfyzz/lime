'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUsers, faMusic, faChartLine, faMicrophone, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { signOut } from 'next-auth/react'
import { redirect } from 'next/navigation'

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

export default function StaffHome() {
  const { data: session, status } = useSession()
  const [currentListeners, setCurrentListeners] = useState(0)
  const [currentTrack, setCurrentTrack] = useState({ title: '', artist: '' })
  const [peakListeners, setPeakListeners] = useState(0)

  useEffect(() => {
    if (status === 'unauthenticated') {
      redirect("/staff/login")
    }
  }, [status])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://radio.limeradio.net/api/nowplaying/lime')
        const data: NowPlaying = await response.json()
        setCurrentListeners(data.listeners.current)
        setPeakListeners(Math.max(peakListeners, data.listeners.current))
        setCurrentTrack({
          title: data.now_playing.song.title,
          artist: data.now_playing.song.artist
        })
      } catch (error) {
        console.error('Failed to fetch data:', error)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [peakListeners])

  const handleLogout = () => {
    signOut({ callbackUrl: '/staff/login' })
  }

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-lime-900 to-lime-950 text-lime-100 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-lime-300">DJ Dashboard</h1>
          <Button onClick={handleLogout} variant="outline" className="text-lime-300 border-lime-300 hover:bg-lime-800">
            <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
            Logout
          </Button>
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
              <Button className="w-full bg-lime-600 hover:bg-lime-500 text-lime-950">Start Broadcasting</Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <Card className="bg-lime-950 border-lime-700">
            <CardHeader>
              <CardTitle className="text-lime-300">Upcoming Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex justify-between">
                  <span>Morning Mix</span>
                  <span>08:00 - 10:00</span>
                </li>
                <li className="flex justify-between">
                  <span>Lunch Beats</span>
                  <span>12:00 - 14:00</span>
                </li>
                <li className="flex justify-between">
                  <span>Evening Chill</span>
                  <span>18:00 - 20:00</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}