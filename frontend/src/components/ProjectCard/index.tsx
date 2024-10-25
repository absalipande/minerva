import { Project } from '@/state/api';
import { format } from 'date-fns';
import React from 'react';

type Props = {
  project: Project;
};

const ProjectCard = ({ project }: Props) => {
  return (
    <div className='transform overflow-hidden rounded-lg bg-white shadow-md transition duration-300 ease-in-out hover:scale-105 dark:bg-dark-secondary dark:text-white'>
      <div className='p-6'>
        <div className='mb-4 flex items-center justify-between'>
          <h3 className='text-xl font-semibold dark:text-white'>{project.name}</h3>
        </div>
        <p className='mb-4 text-gray-600 dark:text-neutral-500'>{project.description || 'No description provided'}</p>
        <div className='space-y-2 text-sm text-gray-600 dark:text-neutral-500'>
          <p>
            <span className='font-medium'>Start Date:</span> {project.startDate ? format(new Date(project.startDate), 'PP') : 'Not set'}
          </p>
          <p>
            <span className='font-medium'>End Date:</span> {project.endDate ? format(new Date(project.endDate), 'PP') : 'Not set'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
