import { useQuery, useMutation, gql } from '@apollo/client';
import { useRouter } from 'next/router';
import { format, isValid } from 'date-fns';
import { FiArrowLeft, FiCalendar, FiCircle, FiClock, FiCheckCircle } from 'react-icons/fi';

const GET_TASK = gql`
  query Task($id: ID!) {
    task(id: $id) {
      id
      title
      description
      status
      dueDate
      createdAt
    }
  }
`;

const UPDATE_TASK_STATUS = gql`
  mutation UpdateTaskStatus($id: ID!, $status: String!) {
    updateTaskStatus(id: $id, status: $status) {
      id
      status
    }
  }
`;

const DELETE_TASK = gql`
  mutation DeleteTask($id: ID!) {
    deleteTask(id: $id) {
      id
    }
  }
`;

const statusOptions = ['Todo', 'In Progress', 'Done'];
const statusIcons = {
  'Todo': <FiCircle className="text-gray-400" />,
  'In Progress': <FiClock className="text-blue-500" />,
  'Done': <FiCheckCircle className="text-green-500" />,
};


function safeFormatDate(dateString, formatStr = 'MMM dd, yyyy', fallback = 'No due date') {
  const date = new Date(dateString);
  return isValid(date) ? format(date, formatStr) : fallback;
}


export default function TaskDetails() {
  const router = useRouter();
  const { id } = router.query;

  const { loading, error, data } = useQuery(GET_TASK, {
    variables: { id },
    skip: !id,
  });

  const [updateTaskStatus] = useMutation(UPDATE_TASK_STATUS, {
    refetchQueries: [{ query: GET_TASK, variables: { id } }],
  });

   const [deleteTask] = useMutation(DELETE_TASK);


   const handleDelete = async (id) => {
     const confirmed = confirm('Are you sure you want to delete this task?');
     if (!confirmed) return;
   
     try {
       const { data } = await deleteTask({ variables: { id } });
       console.log('Task deleted:', data.deleteTask.id);
       // Optionally refetch or update cache here
     } catch (error) {
       console.error('Delete error:', error);
     }
   };
   
   

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!data?.task) return <p>Task not found</p>;

  const task = data.task;

  const handleStatusChange = async (newStatus) => {
    try {
      await updateTaskStatus({ variables: { id, status: newStatus } });
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <button
        onClick={() => router.back()}
        className="flex items-center text-blue-500 mb-4"
      >
        <FiArrowLeft className="mr-1" /> Back to tasks
      </button>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center">
            <span className="mr-2">{statusIcons[task.status]}</span>
            <h1 className="text-2xl font-bold">{task.title}</h1>
          </div>
          <div className="flex items-center text-gray-500">
            <FiCalendar className="mr-1" />
            <span>{safeFormatDate(task.dueDate)}</span>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <label className="font-medium">Status:</label>
            <select
              value={task.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="border p-2 rounded"
            >
              {statusOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <h2 className="font-medium mb-2">Description</h2>
            <p className="text-gray-700 whitespace-pre-line">
              {task.description || 'No description provided.'}
            </p>
          </div>

          <div className="text-sm text-gray-500">
<p>Created: {safeFormatDate(task.createdAt, 'MMM dd, yyyy HH:mm', 'Unknown')}</p>
          </div>
            <button onClick={() => handleDelete(task.id)}>Delete</button>
        </div>
      </div>
    </div>
  );
}
