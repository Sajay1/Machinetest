import { useQuery,useMutation, gql } from '@apollo/client';
import { useState } from 'react';
import Link from 'next/link';
import { format, isValid } from 'date-fns';
import { FiPlus, FiCalendar, FiCircle, FiClock, FiCheckCircle } from 'react-icons/fi';


const GET_TASKS = gql`
  query Tasks($status: String) {
    tasks(status: $status) {
      id
      title
      status
      dueDate
    }
  }
`;


const statusIcons = {
  'Todo': <FiCircle className="text-gray-400" />,
  'In Progress': <FiClock className="text-blue-500" />,
  'Done': <FiCheckCircle className="text-green-500" />,
};


function safeFormatDate(dateString, fallback = 'No due date') {
  const date = new Date(dateString);
  return isValid(date) ? format(date, 'MMM dd, yyyy') : fallback;
}

export default function TaskList() {


  const [statusFilter, setStatusFilter] = useState('');
  const { loading, error, data } = useQuery(GET_TASKS, {
    variables: { status: statusFilter || undefined },
  });





  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Task Manager</h1>
        <Link href="/add-task">
          <button className="flex items-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            <FiPlus className="mr-2" /> Add Task
          </button>
        </Link>
      </div>

      <div className="mb-4">
        <label className="mr-2">Filter by status:</label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All</option>
          <option value="Todo">Todo</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
        </select>
      </div>

      <div className="space-y-4 p-4 bg-white rounded-lg shadow-md">
        {data.tasks.length === 0 ? (
          <p>No tasks found</p>
        ) : (
          data.tasks.map((task) => (
            <Link key={task.id} href={`/task/${task.id}`}>
              <div className="border p-4 rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    <span className="mr-2">{statusIcons[task.status]}</span>
                    <h2 className="text-lg font-semibold">{task.title}</h2>
                  </div>
                  <div className="flex items-center text-gray-500">
                    <FiCalendar className="mr-1" />
                    <span>{safeFormatDate(task.dueDate)}</span>
                  </div>
                </div>
                <div className="mt-2">
                 <span
  className={`px-2 py-1 text-xs rounded-full ${
    {
      'Todo': 'bg-gray-100 text-gray-800',
      'In Progress': 'bg-blue-100 text-blue-800',
      'Done': 'bg-green-100 text-green-800',
    }[task.status] || 'bg-gray-50 text-gray-500'
  }`}
>
  {task.status}
</span>

                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
