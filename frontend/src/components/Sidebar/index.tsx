'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { setIsSidebarCollapsed } from '@/state';
import { useGetProjectsQuery } from '@/state/api';
import { useAppDispatch, useAppSelector } from '@/app/redux';
import { AlertCircle, AlertOctagon, AlertTriangle, Briefcase, ChevronDown, ChevronUp, Home, Layers3, LockIcon, LucideIcon, Search, Settings, ShieldAlert, User, Users, X } from 'lucide-react';

interface SidebarLinkProps {
  href: string;
  icon: LucideIcon;
  label: string;
}

const Sidebar = () => {
  const [showProjects, setShowProjects] = useState(true);
  const [showPriority, setShowPriority] = useState(true);

  const { data: projects } = useGetProjectsQuery();
  const dispatch = useAppDispatch();
  const isSidebarCollapsed = useAppSelector((state) => state.global.isSidebarCollapsed);
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  const sidebarClassNames = `fixed flex flex-col h-[100%] justify-between shadow-xl
  transition-all duration-300 ease-in-out h-full z-40 dark:bg-black overflow-y-auto bg-white
  ${isSidebarCollapsed ? 'w-0 min-w-0 opacity-0' : 'w-64 min-w-64 opacity-100'}
`;

  return (
    <div className={sidebarClassNames}>
      <div className='flex h-full w-full flex-col justify-start'>
        {/* TOP LOGO */}
        <div className='z-50 flex min-h-[56px] w-64 items-center justify-between bg-white px-6 pt-3 dark:bg-black'>
          <div className='text-xl font-bold text-gray-800 dark:text-white'>Minerva</div>
          {isSidebarCollapsed ? null : (
            <button
              className='py-3'
              onClick={() => {
                dispatch(setIsSidebarCollapsed(!isSidebarCollapsed));
              }}
            >
              <X className={isDarkMode ? 'h-6 w-6 text-white rounded hover:bg-zinc-900' : 'h-6 w-6 text-gray-800 rounded hover:bg-zinc-200'} />
            </button>
          )}
        </div>

        {/* TEAM */}
        <div className='flex items-center gap-5 border-y-[1.5px] border-zinc-200 px-8 py-4 dark:border-zinc-700'>
          <Image src='/logo.png' alt='Logo' width={40} height={40} />
          <div>
            <h3 className='text-md font-bold tracking-wide dark:text-gray-200'>Minerva Team</h3>
            <div className='mt-1 flex items-start gap-2'>
              <LockIcon className='mt-[0.1rem] h-3 w-3 text-gray-500 dark:text-gray-400' />
              <p className='text-xs text-gray-500'>Private</p>
            </div>
          </div>
        </div>

        {/* NAVBAR LINKS */}
        <nav className='z-10 w-full'>
          <SidebarLink icon={Home} label='Home' href='/' />
          <SidebarLink icon={Briefcase} label='Timeline' href='/timeline' />
          <SidebarLink icon={Search} label='Search' href='/search' />
          <SidebarLink icon={Settings} label='Settings' href='/settings' />
          <SidebarLink icon={User} label='Users' href='/users' />
          <SidebarLink icon={Users} label='Team' href='/teams' />
        </nav>

        {/* PROJECTS LINKS */}
        <button onClick={() => setShowProjects((prev) => !prev)} className='flex w-full items-center justify-between px-8 py-3 text-gray-500'>
          <span className=''>Projects</span>
          {showProjects ? <ChevronUp className='h-5 w-5' /> : <ChevronDown className='h-5 w-5' />}
        </button>

        {/* PROJECTS LIST */}
        {showProjects && projects?.map((project) => <SidebarLink key={project.id} icon={Briefcase} href={`/projects/${project.id}`} label={project.name} />)}

        {/* PRIORITIES LINKS */}
        <button onClick={() => setShowPriority((prev) => !prev)} className='flex w-full items-center justify-between px-8 py-3 text-gray-500'>
          <span className=''>Priority</span>
          {showPriority ? <ChevronUp className='h-5 w-5' /> : <ChevronDown className='h-5 w-5' />}
        </button>
        {showPriority && (
          <>
            <SidebarLink icon={AlertCircle} label='Urgent' href='/priority/urgent' />
            <SidebarLink icon={ShieldAlert} label='High' href='/priority/high' />
            <SidebarLink icon={AlertTriangle} label='Medium' href='/priority/medium' />
            <SidebarLink icon={AlertOctagon} label='Low' href='/priority/low' />
            <SidebarLink icon={Layers3} label='Backlog' href='/priority/backlog' />
          </>
        )}
      </div>
    </div>
  );
};

const SidebarLink = ({ href, icon: Icon, label }: SidebarLinkProps) => {
  const pathname = usePathname();
  const isActive = pathname === href || (pathname === '/' && href === '/dashboard');

  return (
    <Link href={href} className='w-full'>
      <div
        className={`relative flex cursor-pointer items-center gap-3 transition-colors hover:bg-zinc-200 dark:bg-black dark:hover:bg-zinc-800 ${
          isActive ? 'bg-zinc-200 text-white dark:bg-zinc-800' : ''
        } justify-start px-8 py-3`}
      >
        {isActive && <div className='absolute left-0 top-0 h-[100%] w-[5px] bg-zinc-200 dark:bg-zinc-800' />}

        <Icon className='h-6 w-6 text-gray-800 dark:text-gray-100' />
        <span className='font-medium text-gray-800 dark:text-gray-100'>{label}</span>
      </div>
    </Link>
  );
};

export default Sidebar;
