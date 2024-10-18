'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLock } from '@fortawesome/free-solid-svg-icons'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { redirect } from 'next/navigation'

export default function StaffLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const result = await signIn('credentials', {
      redirect: false,
      username,
      password,
    })

    if (result?.error) {
      setError('Invalid username or password')
    } else {
      redirect('/staff/home')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-lime-900 to-lime-950">
      <Card className="w-[350px] bg-gray-900 border-lime-600">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-lime-400">Staff Login</CardTitle>
          <CardDescription className="text-center text-lime-300">Enter your credentials to access the DJ portal</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-lime-300">Username</Label>
                <Input
                  id="username"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-gray-800 border-lime-600 text-lime-300 placeholder-lime-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-lime-300">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-gray-800 border-lime-600 text-lime-300 placeholder-lime-500"
                />
              </div>
            </div>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            <Button type="submit" className="w-full mt-6 bg-lime-600 hover:bg-lime-500 text-gray-900">
              <FontAwesomeIcon icon={faLock} className="mr-2" />
              Login
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-center text-lime-400 text-sm">
          Forgot your password? Contact an administrator.
        </CardFooter>
      </Card>
    </div>
  )
}