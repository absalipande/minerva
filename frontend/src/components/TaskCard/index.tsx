import { Task, Priority } from '@/state/api';
import { format } from 'date-fns';
import Image from 'next/image';
import React from 'react';

type Props = {
  task: Task;
  className?: string;
};

const TaskCard = ({ task }: Props) => {
  const priorityColors: Record<Priority, string> = {
    Low: 'bg-blue-200 text-blue-700',
    Medium: 'bg-green-200 text-green-700',
    High: 'bg-yellow-200 text-yellow-700',
    Urgent: 'bg-red-200 text-red-700',
    [Priority.Backlog]: 'bg-gray-200 text-gray-700',
  };

  const getPriorityColor = (priority: Priority | undefined) => {
    return priority ? priorityColors[priority] : 'bg-gray-100 text-gray-800';
  };

  return (
    <div className='transform overflow-hidden rounded-lg bg-white shadow-md transition duration-300 ease-in-out hover:scale-105 dark:bg-dark-secondary dark:text-white'>
      {task.attachments && task.attachments.length > 0 && (
        <div className='relative h-48 w-full'>
          <Image src={`/${task.attachments[0].fileURL}`} alt={task.attachments[0].fileName} layout='fill' objectFit='cover' className='rounded-t-lg' />
        </div>
      )}
      <div className='p-6'>
        <div className='mb-4 flex items-center justify-between'>
          <h3 className='text-xl font-semibold dark:text-white'>{task.title}</h3>
          {task.priority && <span className={`rounded-full px-2 py-1 text-xs font-medium ${getPriorityColor(task.priority)}`}>{task.priority}</span>}
        </div>
        <p className='mb-4 text-gray-600 dark:text-neutral-500'>{task.description || 'No description provided'}</p>
        <div className='space-y-2 text-sm text-gray-600 dark:text-neutral-500'>
          <p>
            <span className='font-medium'>Status:</span> {task.status}
          </p>
          <p>
            <span className='font-medium'>Tags:</span> {task.tags || 'No tags'}
          </p>
          <p>
            <span className='font-medium'>Start Date:</span> {task.startDate ? format(new Date(task.startDate), 'PP') : 'Not set'}
          </p>
          <p>
            <span className='font-medium'>Due Date:</span> {task.dueDate ? format(new Date(task.dueDate), 'PP') : 'Not set'}
          </p>
          <p>
            <span className='font-medium'>Author:</span> {task.author ? task.author.username : 'Unknown'}
          </p>
          <p>
            <span className='font-medium'>Assignee:</span> {task.assignee ? task.assignee.username : 'Unassigned'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
