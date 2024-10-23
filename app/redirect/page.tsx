"use client"
import { useEffect, useState } from 'react';

export default function Redirect() {
  const [countdown, setCountdown] = useState(2);
  const allowedHosts: string | string[] = ["limeradio.net"]

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown - 1);
    }, 1000);
    const redirectUrl = new URLSearchParams(window.location.search).get('r');

    if (countdown === 2) {
      clearInterval(timer);
      if (redirectUrl?.split("https://")[1]) {
        const host = redirectUrl?.split("https://")[1]
        if (!allowedHosts.includes(host)) {return window.location.href = "/"}
      }

      if (redirectUrl) {
        window.location.href = redirectUrl;
      } else {
        window.location.href = '/';
      }
    }

    return () => clearInterval(timer);
  }, [countdown]);

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-screen bg-lime-900 text-white`}
    >
      <h1 className="text-6xl font-bold mb-4">Redirecting...</h1>
      <p className="mb-4 text-center">You will be redirected in {countdown} seconds.</p>
    </div>
  );
}