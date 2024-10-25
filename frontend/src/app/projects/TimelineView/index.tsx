import { useAppSelector } from '@/app/redux';
import { useGetTasksQuery } from '@/state/api';
import { DisplayOption, Gantt, ViewMode } from 'gantt-task-react';
import 'gantt-task-react/dist/index.css';
import { Loader2 } from 'lucide-react';
import React, { useMemo, useState } from 'react';

type Props = {
  id: string;
  setIsModalNewTaskOpen: (isOpen: boolean) => void;
};

type TaskTypeItems = 'task' | 'milestone' | 'project';

const Timeline = ({ id, setIsModalNewTaskOpen }: Props) => {
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const { data: tasks, error, isLoading } = useGetTasksQuery({ projectId: Number(id) });

  const [displayOptions, setDisplayOptions] = useState<DisplayOption>({
    viewMode: ViewMode.Month,
    locale: 'en-US',
  });

  const ganttTasks = useMemo(() => {
    return (
      tasks?.map((task) => ({
        start: new Date(task.startDate as string),
        end: new Date(task.dueDate as string),
        name: task.title,
        id: `Task-${task.id}`,
        type: 'task' as TaskTypeItems,
        progress: task.points ? (task.points / 10) * 100 : 0,
        isDisabled: false,
      })) || []
    );
  }, [tasks]);

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

  if (error)
    return (
      <div className='mt-10 flex flex-col items-center justify-center py-4'>
        <p className='mb-2 text-center font-semibold text-zinc-500 dark:text-zinc-500'>Nothing to see here</p>
        <img src='/frog-waiting.png' alt='Error' className='h-64 w-64 object-cover' />
      </div>
    );

  return (
    <div className='px-4 xl:px-6'>
      <div className='flex flex-wrap items-center justify-between gap-2 py-5'>
        <h1 className='me-2 text-lg font-bold dark:text-white'>Project Tasks Timeline</h1>
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
      </div>

      <div className='overflow-hidden rounded-md bg-white shadow dark:bg-dark-secondary dark:text-white'>
        <div className='timeline'>
          <Gantt
            tasks={ganttTasks}
            {...displayOptions}
            columnWidth={displayOptions.viewMode === ViewMode.Month ? 150 : 100}
            listCellWidth='100px'
            barBackgroundColor={isDarkMode ? '#101214' : '#aeb8c2'}
            barBackgroundSelectedColor={isDarkMode ? '#000' : '#9ba1a6'}
          />
        </div>
        <div className='px-4 pb-5 pt-1'>
          <button className='flex items-center rounded bg-zinc-700 px-3 py-2 text-white hover:bg-zinc-600' onClick={() => setIsModalNewTaskOpen(true)}>
            Add New Task
          </button>
        </div>
      </div>
    </div>
  );
};

export default Timeline;
