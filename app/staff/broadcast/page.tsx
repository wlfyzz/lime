"use client";
import { useEffect, useState } from "react";
import { getStaffByID } from "@/functions/Supabase";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMusic, faHome, faBroadcastTower, faChartLine, faUsers, faCog, faEye, faEyeSlash, faCopy } from '@fortawesome/free-solid-svg-icons';
import { useAuth, UserButton, useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { redirect } from 'next/navigation';

interface StaffInfo {
  id: number;
  name: string;
  userid: string;
  broadcaster: boolean;
  credentials: string;
  managementPermission: boolean;
  active: boolean;
  azuracastUserID: number;
}

interface SidebarItemProps {
  icon: any;
  href: string;
  label: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, href, label }) => {
  const pathname = usePathname();
  const isActive = pathname === href;

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
  );
};

const Sidebar: React.FC = () => {
  const sidebarItems: SidebarItemProps[] = [
    { icon: faHome, href: "/staff/home", label: "Dashboard" },
    { icon: faMusic, href: "/staff/requests", label: "Song Requests" },
    { icon: faBroadcastTower, href: "/staff/broadcast", label: "Broadcast" },
    { icon: faChartLine, href: "/staff/analytics", label: "Analytics" },
    { icon: faUsers, href: "/staff/users", label: "User Management" },
    { icon: faCog, href: "/staff/settings", label: "Settings" },
  ];

  return (
    <div className="w-64 bg-lime-950 p-4 space-y-4">
      {sidebarItems.map((item, index) => (
        <SidebarItem key={index} {...item} />
      ))}
    </div>
  );
};

export default function StaffPortal() {
  const AuthorisedIDS = ["1137093225576935485"];
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const [connectionInfo, setConnectionInfo] = useState<StaffInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [passwordVisible, setPasswordVisible] = useState(false);

  useEffect(() => {
    if (!isSignedIn) {
      redirect('/staff/auth');
      return;
    }

    const discordId = user?.externalAccounts.find(account => account.provider === 'discord')?.providerUserId;

    if (!discordId || !AuthorisedIDS.includes(discordId)) {
      redirect("/staff/unauthorised");
      return;
    }

    const fetchConnectionInfo = async () => {
      try {
        const info = await getStaffByID(discordId);
        setConnectionInfo(info as StaffInfo);
        setIsLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to load connection info.");
        setIsLoading(false);
      }
    };

    fetchConnectionInfo();
  }, [isSignedIn, user]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Password copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-lime-900 to-lime-950 text-lime-100">
      <Sidebar />
      <div className="flex-1 p-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-lime-300">Broadcast Information</h1>
          <div className="flex items-center space-x-4">
            <UserButton afterSignOutUrl="/staff/home" />
          </div>
        </header>

        <div className="mt-8">
          {isLoading ? (
            <p className="text-lime-200">Loading connection info...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <>
              <div className="bg-red-600 text-white p-4 rounded-lg mb-4">
                <strong>Warning:</strong> Sharing your connection info will result in termination.
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-lime-800 rounded-lg">
                  <tbody>
                    <tr>
                      <td className="px-4 py-2 border-b border-lime-600">Server</td>
                      <td className="px-4 py-2 border-b border-lime-600">radio.limeradio.net</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 border-b border-lime-600">Username</td>
                      <td className="px-4 py-2 border-b border-lime-600">{connectionInfo?.name ?? 'N/A'}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 border-b border-lime-600">Port</td>
                      <td className="px-4 py-2 border-b border-lime-600">8005</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 border-b border-lime-600">Type</td>
                      <td className="px-4 py-2 border-b border-lime-600">Icecast</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 border-b border-lime-600">Password</td>
                      <td className="px-4 py-2 border-b border-lime-600 relative">
                        <span className={`absolute inset-0 bg-lime-900 transition-all duration-300 ${passwordVisible ? 'opacity-0' : 'opacity-100'}`}>
                          {connectionInfo?.credentials ?? 'N/A'}
                        </span>
                        <span className={`absolute inset-0 transition-all duration-300 ${passwordVisible ? 'opacity-100' : 'opacity-0'}`}>
                          {passwordVisible ? connectionInfo?.credentials : '••••••••••'}
                        </span>
                        <button 
                          className="ml-2 text-lime-300" 
                          onClick={() => setPasswordVisible(!passwordVisible)}
                        >
                          <FontAwesomeIcon icon={passwordVisible ? faEyeSlash : faEye} />
                        </button>
                        <button 
                          className="ml-2 text-lime-300" 
                          onClick={() => copyToClipboard(connectionInfo?.credentials ?? '')}
                        >
                          <FontAwesomeIcon icon={faCopy} />
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 border-b border-lime-600">Azuracast User ID</td>
                      <td className="px-4 py-2 border-b border-lime-600">{connectionInfo?.azuracastUserID ?? 'N/A'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
