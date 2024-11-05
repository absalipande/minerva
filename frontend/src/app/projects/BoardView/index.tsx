import React from 'react';
import Image from 'next/image';
import { format } from 'date-fns';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { EllipsisVertical, Loader2, MessageSquareMore, Plus } from 'lucide-react';

import { Task as TaskType } from '@/state/api';
import { useGetTasksQuery, useUpdateTaskStatusMutation } from '@/state/api';

type BoardProps = {
  id: string;
  setIsModalNewTaskOpen: (isOpen: boolean) => void;
};

type TaskProps = {
  task: TaskType;
};

type TaskColumnProps = {
  status: string;
  tasks: TaskType[];
  moveTask: (taskId: number, toStatus: string) => void;
  setIsModalNewTaskOpen: (isOpen: boolean) => void;
};

const taskStatus = ['To Do', 'Work In Progress', 'Under Review', 'Completed'];

const BoardView = ({ id, setIsModalNewTaskOpen }: BoardProps) => {
  const {
    data: tasks,
    isLoading,
    error,
  } = useGetTasksQuery({
    projectId: Number(id),
  });
  const [updateTaskStatus] = useUpdateTaskStatusMutation();

  const moveTask = (taskId: number, toStatus: string) => {
    updateTaskStatus({ taskId, status: toStatus });
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
    <DndProvider backend={HTML5Backend}>
      <div className='grid grid-cols-1 gap-4 p-4 md:grid-cols-2 xl:grid-cols-4'>
        {taskStatus.map((status) => (
          <TaskColumn key={status} status={status} tasks={tasks || []} moveTask={moveTask} setIsModalNewTaskOpen={setIsModalNewTaskOpen} />
        ))}
      </div>
    </DndProvider>
  );
};

const TaskColumn = ({ status, tasks, moveTask, setIsModalNewTaskOpen }: TaskColumnProps) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'task',
    drop: (item: { id: number }) => moveTask(item.id, status),
    collect: (monitor: any) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const tasksCount = tasks.filter((task) => task.status === status).length;

  const statusColor: any = {
    'To Do': '#2563EB',
    'Work In Progress': '#059669',
    'Under Review': '#D97706',
    Completed: '#000000',
  };

  return (
    <div
      ref={(instance) => {
        drop(instance);
      }}
      className={`sl:py-4 rounded-lg py-2 xl:px-2 ${isOver ? 'bg-zinc-200 dark:bg-zinc-800' : ''}`}
    >
      <div className='mb-3 flex w-full'>
        <div className={`w-2 !bg-[${statusColor[status]}] rounded-s-lg`} style={{ backgroundColor: statusColor[status] }} />
        <div className='flex w-full items-center justify-between rounded-e-lg bg-white px-5 py-4 dark:bg-dark-secondary'>
          <h3 className='flex items-center text-lg font-semibold dark:text-white'>
            {status}{' '}
            <span className='ml-2 inline-block rounded-full bg-gray-300 p-1 text-center text-sm leading-none dark:bg-dark-tertiary' style={{ width: '1.5rem', height: '1.5rem' }}>
              {tasksCount}
            </span>
          </h3>
          <div className='flex items-center gap-1'>
            <button className='flex h-6 w-5 items-center justify-center dark:text-neutral-500'>
              <EllipsisVertical size={26} />
            </button>
            <button className='flex h-6 w-6 items-center justify-center rounded bg-gray-200 dark:bg-dark-tertiary dark:text-white' onClick={() => setIsModalNewTaskOpen(true)}>
              <Plus size={16} />
            </button>
          </div>
        </div>
      </div>

      {tasks
        .filter((task) => task.status === status)
        .map((task) => (
          <Task key={task.id} task={task} />
        ))}
    </div>
  );
};

const Task = ({ task }: TaskProps) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'task',
    item: { id: task.id },
    collect: (monitor: any) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const taskTagsSplit = task.tags ? task.tags.split(',') : [];

  const formattedStartDate = task.startDate ? format(new Date(task.startDate), 'P') : '';
  const formattedDueDate = task.dueDate ? format(new Date(task.dueDate), 'P') : '';

  const numberOfComments = (task.comments && task.comments.length) || 0;

  const PriorityTag = ({ priority }: { priority: TaskType['priority'] }) => (
    <div
      className={`rounded-full px-2 py-1 text-xs font-semibold ${
        priority === 'Urgent'
          ? 'bg-red-200 text-red-700'
          : priority === 'High'
          ? 'bg-yellow-200 text-yellow-700'
          : priority === 'Medium'
          ? 'bg-green-200 text-green-700'
          : priority === 'Low'
          ? 'bg-blue-200 text-blue-700'
          : 'bg-gray-200 text-gray-700'
      }`}
    >
      {priority}
    </div>
  );

  return (
    <div
      ref={(instance) => {
        drag(instance);
      }}
      className={`mb-4 rounded-md bg-white shadow dark:bg-dark-secondary ${isDragging ? 'opacity-50' : 'opacity-100'}`}
    >
      {task.attachments && task.attachments.length > 0 && (
        <Image src={`/${task.attachments[0].fileURL}`} alt={task.attachments[0].fileName} width={400} height={200} className='h-auto w-full rounded-t-md' />
      )}

      <div className='p-4 md:p-6'>
        <div className='flex items-start justify-between'>
          <div className='flex flex-1 flex-wrap items-center gap-2'>
            {task.priority && <PriorityTag priority={task.priority} />}
            <div className='flex gap-2'>
              {taskTagsSplit.map((tag) => (
                <div key={tag} className='rounded-full bg-blue-100 px-2 py-1 text-sm'>
                  {' '}
                  {tag}
                </div>
              ))}
            </div>
          </div>
          <button className='flex h-6 w-4 flex-shrink-0 items-center justify-center dark:text-neutral-500'>
            <EllipsisVertical size={26} />
          </button>
        </div>

        <div className='my-3 flex justify-between'>
          <h4 className='text-md font-bold dark:text-white'>{task.title}</h4>
          {typeof task.points === 'number' && <div className='text-xs font-semibold dark:text-white'>{task.points} pts</div>}
        </div>

        <div className='text-xs text-gray-500 dark:text-neutral-500'>
          {formattedStartDate && <span>{formattedStartDate} - </span>}
          {formattedDueDate && <span>{formattedDueDate}</span>}
        </div>
        <p className='text-sm text-gray-600 dark:text-neutral-500'>{task.description}</p>
        <div className='mt-4 border-t border-gray-200 dark:border-stroke-dark' />

        {/* Users */}
        <div className='mt-3 flex items-center justify-between'>
          <div className='flex -space-x-[6px] overflow-hidden'>
            {task.assignee && (
              <Image
                src={`/${task.assignee.profilePictureUrl!}`}
                key={task.assignee.userId}
                alt={task.assignee.username}
                width={30}
                height={30}
                className='h-8 w-8 rounded-full border-2 border-white object-cover dark:border-dark-secondary'
              />
            )}
            {task.author && (
              <Image
                src={`/${task.author.profilePictureUrl!}`}
                key={task.author.userId}
                alt={task.author.username}
                width={30}
                height={30}
                className='h-8 w-8 rounded-full border-2 border-white object-cover dark:border-dark-secondary'
              />
            )}
          </div>
          <div className='flex items-center text-gray-500 dark:text-neutral-500'>
            <MessageSquareMore size={20} />
            <span className='text--sm ml-1 dark:text-neutral-400'>{numberOfComments}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoardView;
