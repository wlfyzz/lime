'use client'

import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGamepad, faCode, faHome, faMessage, faBlog, faBook, faProjectDiagram, faFile } from '@fortawesome/free-solid-svg-icons'
import { faTwitter, faGithub, faDiscord, faSpotify, faBlogger } from '@fortawesome/free-brands-svg-icons'
import { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { config } from '@fortawesome/fontawesome-svg-core'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Separator } from "@/components/ui/separator"
import { motion } from 'framer-motion'
const itemsBeforeSocials = 3
config.autoAddCss = false

interface SidebarItemProps {
  icon: IconDefinition
  href: string
  ariaLabel: string
  isActive: boolean
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, href, ariaLabel, isActive }) => {
  return (
    <Link 
      href={href} 
      className="relative w-12 h-12 rounded-full flex items-center justify-center transition-colors text-gray-400 hover:text-white"
      aria-label={ariaLabel}
    >
      <FontAwesomeIcon icon={icon} className="w-6 h-6" />
      {isActive && (
        <motion.div
          className="absolute inset-0 bg-gray-600 rounded-full -z-10"
          layoutId="activeBackground"
          initial={false}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 30
          }}
        />
      )}
    </Link>
  )
}

export default function Sidebar() {
  const pathname = usePathname()

  const sidebarItems = [
    { icon: faHome, href: "/", ariaLabel: "Home" },
    { icon: faGithub, href: "/projects", ariaLabel: "Projects" },
    { icon: faFile, href: "/blog", ariaLabel: "Blog" },
    { icon: faTwitter, href: "https://x.com/wlfyzz", ariaLabel: "Twitter" },
    { icon: faGithub, href: "https://github.com/wlfyzz", ariaLabel: "GitHub" },
    { icon: faDiscord, href: "https://potatonodes.com/discord", ariaLabel: "Discord" },
    { icon: faSpotify, href: "https://open.spotify.com/user/317z66iim4mtbr6brs22y3fkuitm?si=fae99502182848cc", ariaLabel: "Spotify" }
  ]

  return (
    <motion.div 
      className="w-16 bg-gray-800 flex flex-col items-center py-4"
      initial={{ x: -64 }}
      animate={{ x: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <motion.div 
        className="space-y-4 mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.3 }}
      >
        {sidebarItems.slice(0, itemsBeforeSocials).map((item, index) => (
          <motion.div 
            key={index}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <SidebarItem {...item} isActive={pathname === item.href} />
          </motion.div>
        ))}
      </motion.div>
      <Separator className="bg-gray-700 w-8 my-4" />
      <div className="flex-grow" />
      <motion.div 
        className="space-y-4 mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.3 }}
      >
        {sidebarItems.slice(itemsBeforeSocials).map((item, index) => (
          <motion.div 
            key={index + 2}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: (index + 2) * 0.1 }}
          >
            <SidebarItem {...item} isActive={pathname === item.href} />
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  )
}