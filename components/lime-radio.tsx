'use client'

import React, { useState, useEffect, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faVolumeHigh, faVolumeMute, faPause, faPlay, faComment, faUser, faMusic } from '@fortawesome/free-solid-svg-icons'
import { faDiscord } from '@fortawesome/free-brands-svg-icons';

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function LimeRadio() {
  const [nowPlaying, setNowPlaying] = useState<{
    title: string;
    artist: string;
    albumArt: string;
  } | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(() => {
    if (typeof window !== 'undefined') {
      return parseFloat(localStorage.getItem('limeRadioVolume') || '0.5')
    }
    return 0.5
  })
  const [isMuted, setIsMuted] = useState(false)
  const [isRequestOpen, setIsRequestOpen] = useState(false)
  const [requestName, setRequestName] = useState('')
  const [requestSong, setRequestSong] = useState('')
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    const fetchNowPlaying = async () => {
      try {
        const response = await fetch('https://radio.limeradio.net/api/nowplaying/lime')
        const data = await response.json()
        setNowPlaying({
          title: data.now_playing.song.title,
          artist: data.now_playing.song.artist,
          albumArt: data.now_playing.song.art
        })
      } catch (error) {
        console.error('Failed to fetch now playing data', error)
      }
    }

    fetchNowPlaying()
    const interval = setInterval(fetchNowPlaying, 30000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    audioRef.current = new Audio('https://audio.limeradio.net:8000/radio.mp3')
    audioRef.current.volume = volume

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume
    }
    localStorage.setItem('limeRadioVolume', volume.toString())
  }, [volume, isMuted])

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
    setIsMuted(newVolume === 0)
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? volume : 0
    }
  }

  const handleRequest = () => {
    // Here you would typically send the request to your backend
    console.log(`Song request: ${requestSong} by ${requestName}`)
    setIsRequestOpen(false)
    setRequestName('')
    setRequestSong('')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-lime-900 to-lime-950 relative overflow-hidden">
      {nowPlaying && (
        <div 
          className="absolute inset-0 bg-cover bg-center filter blur-xl opacity-30 scale-110"
          style={{ backgroundImage: `url(${nowPlaying.albumArt})` }}
        />
      )}
      <div className="text-center relative z-10">
        <h1 className="text-4xl font-bold text-lime-300 mb-8">Lime Radio</h1>
        {nowPlaying && (
          <div className="mb-8">
            <img src={nowPlaying.albumArt} alt="Album Art" className="w-64 h-64 rounded-full mx-auto mb-4 shadow-lg" />
            <div className="text-lime-100 font-bold text-2xl mb-2">{nowPlaying.title}</div>
            <div className="text-lime-300 text-xl">{nowPlaying.artist}</div>
          </div>
        )}
        <div className="mb-8 flex items-center justify-center space-x-4">
          <button 
            className="text-lime-300 hover:text-lime-100"
            onClick={toggleMute}
          >
            <FontAwesomeIcon icon={isMuted ? faVolumeMute : faVolumeHigh} size="lg" />
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="w-48 h-2 bg-lime-600 rounded-lg appearance-none cursor-pointer"
          />
        </div>
        <div className="flex justify-center items-center space-x-6">
  <Dialog open={isRequestOpen} onOpenChange={setIsRequestOpen}>
    <DialogTrigger asChild>
      <button className="text-white hover:text-gray-300">
        <FontAwesomeIcon icon={faComment} size="lg" />
      </button>
    </DialogTrigger>
    <DialogContent className="sm:max-w-[425px] bg-gradient-to-b from-gray-800 to-gray-700 text-white rounded-lg p-6">
      <DialogHeader>
        <DialogTitle className="text-white">Song Request</DialogTitle>
        <DialogDescription className="text-gray-300">
          Make a song request. We'll try our best to play it!
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-1 items-center gap-4">
          <div className="flex items-center">
            <FontAwesomeIcon icon={faUser} className="text-white mr-2" />
            <Input
              id="name"
              value={requestName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRequestName(e.target.value)}
              className="flex-1 bg-gray-600 text-white rounded-full placeholder-gray-400 border-none"
              placeholder="Your Name"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 items-center gap-4">
          <div className="flex items-center">
            <FontAwesomeIcon icon={faMusic} className="text-white mr-2" />
            <Input
              id="song"
              value={requestSong}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRequestSong(e.target.value)}
              className="flex-1 bg-gray-600 text-white rounded-full placeholder-gray-400 border-none"
              placeholder="Song Title"
            />
          </div>
        </div>
      </div>
      <DialogFooter>
        <Button type="submit" className="bg-gray-500 hover:bg-gray-600 text-white" onClick={handleRequest}>
          Submit request
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
          <button onClick={togglePlay} className="bg-lime-500 hover:bg-lime-400 text-lime-900 rounded-full p-4">
            <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} size="lg" />
          </button>
          <a href="https://discord.gg/limeradio" target="_blank" rel="noopener noreferrer" className="text-lime-300 hover:text-lime-100">
          <FontAwesomeIcon icon={faDiscord}/>
          </a>
        </div>
      </div>
    </div>
  )
}