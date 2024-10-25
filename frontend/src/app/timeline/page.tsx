'use client';

import { useAppSelector } from '@/app/redux';
import Header from '@/components/Header';
import { useGetProjectsQuery } from '@/state/api';
import { DisplayOption, Gantt, ViewMode } from 'gantt-task-react';
import 'gantt-task-react/dist/index.css';
import { Loader2 } from 'lucide-react';
import React, { useMemo, useState } from 'react';

type TaskTypeItems = 'task' | 'milestone' | 'project';

const Timeline = () => {
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const { data: projects, isLoading, isError } = useGetProjectsQuery();

  const [displayOptions, setDisplayOptions] = useState<DisplayOption>({
    viewMode: ViewMode.Month,
    locale: 'en-US',
  });

  const ganttTasks = useMemo(() => {
    return (
      projects?.map((project) => ({
        start: new Date(project.startDate as string),
        end: new Date(project.endDate as string),
        name: project.name,
        id: `Project-${project.id}`,
        type: 'project' as TaskTypeItems,
        progress: 50,
        isDisabled: false,
      })) || []
    );
  }, [projects]);

  const handleViewModeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setDisplayOptions((prev) => ({
      ...prev,
      viewMode: event.target.value as ViewMode,
    }));
  };

  if (isLoading)
    return (
      <div className='flex h-[calc(100vh-200px)] items-center justify-center'>
        <Loader2 className='h-8 w-8 animate-spin text-blue-500' />
      </div>
    );

  if (isError || !projects)
    return (
      <div className='mt-10 flex flex-col items-center justify-center py-4'>
        <p className='mb-2 text-center font-semibold text-zinc-500 dark:text-zinc-500'>Nothing to see here</p>
        <img src='/frog-waiting.png' alt='Error' className='h-64 w-64 object-cover' />
      </div>
    );

  return (
    <div className='max-w-full p-8'>
      <header className='mb-4 flex items-center justify-between'>
        <Header name='Projects Timeline' />
        <div className='relative inline-block w-64'>
          <select
            className='focus:shadow-outline block w-full appearance-none rounded border border-gray-400 bg-white px-4 py-2 pr-8 leading-tight shadow hover:border-gray-500 focus:outline-none dark:border-dark-secondary dark:bg-dark-secondary dark:text-white'
            value={displayOptions.viewMode}
            onChange={handleViewModeChange}
          >
            <option value={ViewMode.Day}>Day</option>
            <option value={ViewMode.Week}>Week</option>
            <option value={ViewMode.Month}>Month</option>
          </select>
        </div>
      </header>

      <div className='overflow-hidden rounded-md bg-white shadow dark:bg-dark-secondary dark:text-white'>
        <div className='timeline'>
          <Gantt
            tasks={ganttTasks}
            {...displayOptions}
            columnWidth={displayOptions.viewMode === ViewMode.Month ? 150 : 100}
            listCellWidth='100px'
            projectBackgroundColor={isDarkMode ? '#101214' : '#1f2937'}
            projectProgressColor={isDarkMode ? '#1f2937' : '#aeb8c2'}
            projectProgressSelectedColor={isDarkMode ? '#000' : '#9ba1a6'}
          />
        </div>
      </div>
    </div>
  );
};

export default Timeline;
