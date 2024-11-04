'use client';

import { useGetUsersQuery } from '@/state/api';
import React from 'react';
import { useAppSelector } from '../redux';
import { Loader2 } from 'lucide-react';
import Header from '@/components/Header';
import { DataGrid, GridColDef, GridToolbarContainer, GridToolbarExport, GridToolbarFilterButton } from '@mui/x-data-grid';
import Image from 'next/image';
import { dataGridClassNames, dataGridSxStyles } from '@/lib/utils';

const CustomToolbar = () => (
  <GridToolbarContainer className='toolbar flex gap-2'>
    <GridToolbarFilterButton />
    <GridToolbarExport />
  </GridToolbarContainer>
);

const columns: GridColDef[] = [
  { field: 'userId', headerName: 'ID', width: 100 },
  { field: 'username', headerName: 'Username', width: 150 },
  {
    field: 'profilePictureUrl',
    headerName: 'Profile Picture',
    width: 100,
    renderCell: (params) => (
      <div className='flex h-full w-full items-center justify-center'>
        <div className='h-9 w-9'>
          <Image src={`https://minerva-s3-images.s3.ap-southeast-1.amazonaws.com/${params.value}`} alt={params.row.username} width={100} height={50} className='h-full rounded-full object-cover' />
        </div>
      </div>
    ),
  },
];

const Users = () => {
  const { data: users, isLoading, isError } = useGetUsersQuery();
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  if (isLoading)
    return (
      <div className='flex h-[calc(100vh-200px)] items-center justify-center'>
        <Loader2 className='h-8 w-8 animate-spin text-blue-500' />
      </div>
    );

  if (isError || !users)
    return (
      <div className='mt-10 flex flex-col items-center justify-center py-4'>
        <p className='mb-2 text-center font-semibold text-zinc-500 dark:text-zinc-500'>Nothing to see here</p>
        <img src='/frog-waiting.png' alt='Error' className='h-64 w-64 object-cover' />
      </div>
    );

  return (
    <div className='flex w-full flex-col p-8'>
      <Header name='Users' />
      <div style={{ height: 650, width: '100%' }}>
        <DataGrid
          rows={users || []}
          columns={columns}
          getRowId={(row) => row.userId}
          pagination
          slots={{
            toolbar: CustomToolbar,
          }}
          className={dataGridClassNames}
          sx={dataGridSxStyles(isDarkMode)}
        />
      </div>
    </div>
  );
};

export default Users;
