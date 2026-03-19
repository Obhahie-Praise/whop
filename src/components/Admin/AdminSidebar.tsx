"use client"
import { LayoutDashboard, Monitor, Moon, Sun, Users } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'

const AdminSidebar = () => {
    const currentPage = usePathname().split("/")[2]
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);
  return (
    <aside className='w-50 min-h-screen bg-zinc-50 dark:bg-zinc-900/40 backdrop-blur-2xl border-zinc-100 dark:border-zinc-800/80 border dark:shadow-none transition-transform'>
        <div className="flex items-center gap-2 mt-3 mx-2">
            <Image
                src="/whop-logo.jpeg"
                alt="whop-logo"
                width={30}
                height={30}
                className="rounded-full"
            />
            <h1 className='text-lg font-semibold special-font tracking-wide'>Whop Admin</h1>
        </div>
        {/* LayoutDashboard theme changer */}
        <div className="w-fit mx-auto my-2.5 border border-zinc-200 dark:border-zinc-800/60 rounded-full">
            <ul className="flex items-center gap-2 dark:bg-zinc-800/40 px-2 py-1 rounded-full">
                <li onClick={() => setTheme('light')} className={`cursor-pointer transition-opacity ${mounted && theme === 'light' ? 'opacity-100 text-blue-500' : 'opacity-50 hover:opacity-100'}`} title="Light Theme"><Sun size={14} /></li>
                <li onClick={() => setTheme('system')} className={`cursor-pointer transition-opacity ${mounted && theme === 'system' ? 'opacity-100 text-blue-500' : 'opacity-50 hover:opacity-100'}`} title="System Theme"><Monitor size={14} /></li>
                <li onClick={() => setTheme('dark')} className={`cursor-pointer transition-opacity ${mounted && theme === 'dark' ? 'opacity-100 text-blue-500' : 'opacity-50 hover:opacity-100'}`} title="Dark Theme"><Moon size={14} /></li>
            </ul>
        </div>
        <nav>
            <ul className='text-xs text-left mx-4 space-y-2'>
                <Link href={"/admin/overview"} className={`flex items-center font-medium  gap-2 py-2 px-4 rounded-lg ${currentPage === "overview" ? "bg-blue-700 dark:bg-blue-900 text-white" : "dark:bg-zinc-600/10 text-black dark:text-white"}`}>
                <LayoutDashboard size={16} />
                    <p>Overview</p>
                </Link>
                <Link href={"/admin/users"} className={`flex items-center font-medium  gap-2 py-2 px-4 rounded-lg ${currentPage === "users" ? "bg-blue-700 dark:bg-blue-900 text-white" : "dark:bg-zinc-600/10 text-black dark:text-white"}`}>
                <Users size={16} />
                    <p>Users</p>
                </Link>
            </ul>
        </nav>
        <div className="">

        </div>
    </aside>
  )
}

export default AdminSidebar