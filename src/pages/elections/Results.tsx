import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '../../components/Card';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '../../components/Table';
import React from 'react';
import { electionsResults } from './constants';

export default function Results() {
  return (
    <div className='flex flex-col w-full space-y-4'>
      <main className='grid min-h-[calc(100vh_-_theme(spacing.16))] grid-cols-1 gap-4 p-4 md:gap-8 md:p-10'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between pb-2 space-y-0'>
            <div className='flex items-center space-x-2'>
              <div className='flex flex-col'>
                <CardTitle className='text-base font-bold'>
                  2026 Computing Club Election Results
                </CardTitle>
                <CardDescription className='text-sm'>
                  Results of the recent election
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className='flex flex-col gap-4'>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between pb-2 space-y-0'>
                  <CardTitle className='text-sm font-medium'>
                    Highest Valid-Vote Count
                  </CardTitle>
                  <UsersIcon className='w-4 h-4 text-gray-500 dark:text-gray-400' />
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>131</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between pb-2 space-y-0'>
                  <CardTitle className='text-sm font-medium'>
                    Total Candidates
                  </CardTitle>
                  <UsersIcon className='w-4 h-4 text-gray-500 dark:text-gray-400' />
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>17</div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between pb-2 space-y-0'>
            <CardTitle className='text-base font-bold'>Results</CardTitle>
          </CardHeader>
          <CardContent className='p-2'>
            <Table className='w-full table table-auto'>
              <TableHeader>
                <TableRow>
                  <TableHead>No.</TableHead>
                  <TableHead>Candidate</TableHead>
                  <TableHead>For</TableHead>
                  <TableHead>Against</TableHead>
                  <TableHead>Valid Votes</TableHead>
                  <TableHead>Final Supporting Rate</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {electionsResults.sort((a, b) => ('' + a.name).localeCompare(b.name)).map((result, index) => (
                  <TableRow key={index}>
                    <TableCell className='font-semibold'>
                      {index + 1}
                    </TableCell>
                    <TableCell>{result.name}</TableCell>
                    <TableCell>{result.for}</TableCell>
                    <TableCell>{result.against}</TableCell>
                    <TableCell>{result.validVotes}</TableCell>
                    <TableCell
                      className={`${result.final >= 50 ? 'text-green-500' : 'text-red-500'} font-semibold`}
                    >
                      {result.final.toFixed(2)}%
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

function UsersIcon(props) {
  return (
    <svg
      {...props}
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <path d='M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2' />
      <circle cx='9' cy='7' r='4' />
      <path d='M22 21v-2a4 4 0 0 0-3-3.87' />
      <path d='M16 3.13a4 4 0 0 1 0 7.75' />
    </svg>
  );
}
