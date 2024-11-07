import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { signOut } from 'aws-amplify/auth';
import { useGetAuthUserQuery } from '@/state/api';
import { useAppDispatch, useAppSelector } from '@/app/redux';
import { setIsDarkMode, setIsSidebarCollapsed } from '@/state';
import { Menu, Moon, Search, Settings, Sun, User } from 'lucide-react';

const Navbar = () => {
  const dispatch = useAppDispatch();
  const isSidebarCollapsed = useAppSelector((state) => state.global.isSidebarCollapsed);
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  const { data: currentUser } = useGetAuthUserQuery({});
  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:", error');
    }
  };

  if (!currentUser) return null;
  const currentUserDetails = currentUser?.userDetails;

  return (
    <div className='flex items-center justify-between bg-white px-4 py-3 dark:bg-black'>
      {/* Search Bar */}
      <div className='flex items-center gap-8'>
        {!isSidebarCollapsed ? null : (
          <button onClick={() => dispatch(setIsSidebarCollapsed(!isSidebarCollapsed))}>
            <Menu className={isDarkMode ? 'h-8 w-8 text-white hover:bg-zinc-900' : 'h-8 w-8 text-gray-800 hover:bg-zinc-200'} />
          </button>
        )}
        <div className='relative flex h-min w-[200px] md:w-[500px]'>
          <Search
            className={
              isDarkMode
                ? 'absolute left-[4px] top-1/2 mr-2 h-5 w-5 -translate-y-1/2 transform cursor-pointer text-white'
                : 'absolute left-[4px] top-1/2 mr-2 h-5 w-5 -translate-y-1/2 transform cursor-pointer text-gray-800'
            }
          />
          <input
            type='search'
            placeholder='Search...'
            className='w-full rounded border-none bg-gray-100 p-2 pl-8 placeholder-gray-500 focus:border-transparent focus:outline-none dark:bg-dark-secondary dark:text-white dark:placeholder-white'
          />
        </div>
      </div>

      {/* Icons */}
      <div className='flex items-center'>
        <button onClick={() => dispatch(setIsDarkMode(!isDarkMode))} className={isDarkMode ? `rounded p-2 dark:hover:bg-zinc-900` : `rounded p-2 hover:bg-zinc-200`}>
          {isDarkMode ? <Sun className='h-6 w-6 cursor-pointer dark:text-white' /> : <Moon className='h-6 w-6 cursor-pointer dark:text-white' />}
        </button>
        <Link href='/settings' className={isDarkMode ? `h-min w-min rounded p-2 dark:hover:bg-zinc-900` : `h-min w-min rounded p-2 hover:bg-zinc-200`}>
          <Settings className='h-6 w-6 cursor-pointer dark:text-white' />
        </Link>
        <div className='ml-2 mr-5 hidden min-h-[2em] w-[0.1rem] bg-gray-200 dark:bg-gray-600 md:inline-block'></div>
        <div className='hidden items-center justify-between md:flex'>
          <div className='align-center flex h-9 w-9 justify-center'>
            {!!currentUserDetails?.profilePictureUrl ? (
              <Image
                src={`https://minerva-s3-images.s3.ap-southeast-1.amazonaws.com/${currentUserDetails?.profilePictureUrl}`}
                alt={currentUserDetails?.username || 'User Profile Picture'}
                width={100}
                height={50}
                className='h-full rounded-full object-cover'
              />
            ) : (
              <User className='h-6 w-6 cursor-pointer self-center rounded-full dark:text-white' />
            )}
          </div>
          <span className='mx-3 text-gray-800 dark:text-white'>{currentUserDetails?.username}</span>
          <button onClick={handleSignOut} className='hidden rounded bg-zinc-800 px-4 py-2 text-xs font-bold text-white hover:bg-zinc-700 md:block'>Sign out</button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
