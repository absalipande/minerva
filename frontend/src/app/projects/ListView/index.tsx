import React from 'react';
import { Loader2 } from 'lucide-react';
import Header from '@/components/Header';
import TaskCard from '@/components/TaskCard';
import { Task, useGetTasksQuery } from '@/state/api';

type Props = {
  id: string;
  setIsModalNewTaskOpen: (isOpen: boolean) => void;
};

const ListView = ({ id, setIsModalNewTaskOpen }: Props) => {
  const { data: tasks, error, isLoading } = useGetTasksQuery({ projectId: Number(id) });

  if (isLoading)
    return (
      <div className='flex h-[calc(100vh-200px)] items-center justify-center'>
        <Loader2 className='h-8 w-8 animate-spin text-blue-500' />
      </div>
    );

  if (error)
    return (
      <div className='flex flex-col items-center justify-center mt-10 py-4'>
        <p className='mb-2 text-center font-semibold text-zinc-500 dark:text-zinc-500'>Nothing to see here</p>
        <img src='/frog-waiting.png' alt='Error' className='h-64 w-64 object-cover' />
      </div>
    );

  return (
    <div className='px-4 pb-8 xl:px-6'>
      <div className='pt-5'>
        <Header
          name='List'
          buttonComponent={
            <button className='flex items-center rounded bg-zinc-700 px-3 py-2 text-white hover:bg-zinc-600' onClick={() => setIsModalNewTaskOpen(true)}>
              Add Task
            </button>
          }
          isSmallText
        />
      </div>
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6'>
        {tasks?.map((task: Task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
};

export default ListView;
