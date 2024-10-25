import React from 'react';
import { Settings2, User, Mail, Users, Shield } from 'lucide-react';

interface UserSettings {
  username: string;
  email: string;
  teamName: string;
  roleName: string;
}

const SettingsField: React.FC<{
  label: string;
  value: string;
  icon: React.ReactNode;
}> = ({ label, value, icon }) => (
  <div className='space-y-2'>
    <label className='flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300'>
      {icon}
      {label}
    </label>
    <div className='flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3 shadow-sm dark:border-zinc-800 dark:bg-dark-secondary'>
      <span className='text-sm text-gray-900 dark:text-gray-100'>{value}</span>
    </div>
  </div>
);

const Settings = () => {
  const userSettings: UserSettings = {
    username: 'johndoe',
    email: 'john.doe@example.com',
    teamName: 'Development Team',
    roleName: 'Developer',
  };

  return (
    <div className='container mx-auto max-w-2xl p-6'>
      <div className='mb-8 flex items-center justify-between'>
        <div className='space-y-1'>
          <h2 className='text-2xl font-semibold tracking-tight text-gray-900 dark:text-white'>Settings</h2>
          <p className='text-sm text-gray-500 dark:text-gray-400'>Manage your account settings and preferences</p>
        </div>
        <span className='rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-800 dark:bg-dark-secondary dark:text-gray-200'>{userSettings.roleName}</span>
      </div>

      <div className='overflow-hidden rounded-lg border border-zinc-200 bg-white shadow dark:border-zinc-800 dark:bg-dark-secondary'>
        <div className='border-b border-zinc-200 px-6 py-4 dark:border-zinc-800 dark:bg-dark-secondary'>
          <h3 className='flex items-center gap-2 text-lg font-medium text-gray-900 dark:text-white'>
            <Settings2 className='h-5 w-5' />
            Account Information
          </h3>
        </div>
        <div className='space-y-6 p-6'>
          <SettingsField label='Username' value={userSettings.username} icon={<User className='h-4 w-4' />} />
          <SettingsField label='Email' value={userSettings.email} icon={<Mail className='h-4 w-4' />} />
          <SettingsField label='Team' value={userSettings.teamName} icon={<Users className='h-4 w-4' />} />
          <SettingsField label='Role' value={userSettings.roleName} icon={<Shield className='h-4 w-4' />} />
        </div>
      </div>
    </div>
  );
};

export default Settings;
