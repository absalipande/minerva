import { useAppSelector } from '@/app/redux';
import Header from '@/components/Header';
import { dataGridClassNames, dataGridSxStyles } from '@/lib/utils';
import { useGetTasksQuery } from '@/state/api';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Loader2 } from 'lucide-react';
import React from 'react';

type Props = {
  id: string;
  setIsModalNewTaskOpen: (isOpen: boolean) => void;
};

const columns: GridColDef[] = [
  {
    field: 'title',
    headerName: 'Title',
    width: 100,
  },
  {
    field: 'description',
    headerName: 'Description',
    width: 200,
  },
  {
    field: 'status',
    headerName: 'Status',
    width: 130,
    renderCell: (params) => <span className='inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800'>{params.value}</span>,
  },
  {
    field: 'priority',
    headerName: 'Priority',
    width: 75,
  },
  {
    field: 'tags',
    headerName: 'Tags',
    width: 130,
  },
  {
    field: 'startDate',
    headerName: 'Start Date',
    width: 130,
    renderCell: (params) => {
      const date = new Date(params.value);
      return <span>{date.toLocaleDateString()}</span>;
    },
  },
  {
    field: 'dueDate',
    headerName: 'Due Date',
    width: 130,
    renderCell: (params) => {
      const date = new Date(params.value);
      return <span>{date.toLocaleDateString()}</span>;
    },
  },
  {
    field: 'author',
    headerName: 'Author',
    width: 150,
    renderCell: (params) => params.value?.author || 'Unknown',
  },
  {
    field: 'assignee',
    headerName: 'Assignee',
    width: 150,
    renderCell: (params) => params.value?.assignee || 'Unassigned',
  },
];

const TableView = ({ id, setIsModalNewTaskOpen }: Props) => {
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const { data: tasks, error, isLoading } = useGetTasksQuery({ projectId: Number(id) });

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
    <div className='h-[540px] w-full px-4 pb-8 xl:px-6'>
      <div className='pt-5'>
        <Header
          name='Table'
          buttonComponent={
            <button className='flex items-center rounded bg-zinc-700 px-3 py-2 text-white hover:bg-zinc-600' onClick={() => setIsModalNewTaskOpen(true)}>
              Add Task
            </button>
          }
          isSmallText
        />
      </div>
      <DataGrid rows={tasks || []} columns={columns} className={dataGridClassNames} sx={dataGridSxStyles(isDarkMode)} />
    </div>
  );
};

export default TableView;
