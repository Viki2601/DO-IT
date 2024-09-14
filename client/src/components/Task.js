import axios from 'axios';
import Cookies from "js-cookie";
import React, { useEffect, useState } from 'react';
import { FaPlus } from "react-icons/fa";
import { GiCheckMark, GiCrossMark } from "react-icons/gi";
import { toast } from 'react-toastify';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';

export default function Task() {
    const url = "https://do-it-zk0s.onrender.com";
    const navigate = useNavigate();
    const cookie = Cookies.get("email");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState({
        name: '',
        due: '',
        label: ''
    });

    const handleNewTaskChange = (e) => {
        const { name, value } = e.target;
        setNewTask({ ...newTask, [name]: value });
    };

    const fetchTasks = async () => {
        try {
            const res = await axios.get(`${url}/getTasks/${cookie}`);
            const sortedTasks = res.data.tasks.sort((a, b) => {
                return new Date(b.createdAt) - new Date(a.createdAt);
            });
            setTasks(sortedTasks);
        } catch (error) {
            toast.error("Failed to load notes");
            console.error(error);
        }
    };

    useEffect(() => {
        if (cookie) {
            fetchTasks();
        }
    }, [cookie]);

    const formatDueDate = (dueDate) => {
        const today = moment().startOf('day');
        const taskDate = moment(dueDate);

        if (taskDate.isSame(today, 'day')) {
            return 'Today';
        } else if (taskDate.isSame(today.add(1, 'day'), 'day')) {
            return 'Tomorrow';
        } else if (taskDate.isBefore(today)) {
            return 'Yesterday';
        } else {
            return taskDate.format('dddd');
        }
    };

    const handleAddTask = async (e) => {
        e.preventDefault();
        const task = {
            email: cookie,
            name: newTask.name,
            status: 'pending',
            label: newTask.label,
            due: newTask.due
        };
        if (!cookie) {
            navigate("/login");
            toast.info("You have to Login...")
        } else {
            await axios.post(`${url}/addNewTask`, { task })
                .then(res => {
                    setTasks([...tasks, res.data.tasks]);
                    fetchTasks();
                    setIsModalOpen(false);
                    setNewTask({ name: '', due: '', label: '' });
                }).catch(e => {
                    console.log(e);
                    toast.error("Something went wrong!");
                });
        }
    };

    const handleStatusChange = async (taskId, currentStatus) => {
        const newStatus = currentStatus === 'done' ? 'pending' : 'done';
        const email = cookie;
        try {
            await axios.put(`${url}/updateTaskStatus/${taskId}`, { status: newStatus, email: email });
            fetchTasks();
        } catch (error) {
            console.error(error);
            toast.error("Failed to update task status");
        }
    };


    return (
        <div className="flex flex-col justify-center items-center h-80 bg-opacity-50 backdrop-filter backdrop-blur-lg shadow-lg rounded-3xl p-6 max-w-md w-full">
            <div className='w-full'>
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold">Tasks</h2>
                </div>
                <ul className="mt-1 h-56 overflow-y-auto scrollbar-thin scrollbar-thumb-rounded space-y-2">
                    {tasks.map(task => (
                        <li key={task.id} className="flex justify-between items-center border-b border-fuchsia-200 shadow-sm p-3">
                            <div className="flex items-center w-3/5">
                                <input
                                    type="checkbox"
                                    checked={task.status === 'done'}
                                    onChange={() => handleStatusChange(task._id, task.status)}
                                    className="form-checkbox rounded-md h-3 w-3 text-pink-500"
                                />
                                <span className={`ml-3 ${task.status === 'done' ? 'line-through text-gray-500' : ''}`}>
                                    {task.name}
                                </span>
                            </div>
                            <div className="w-full flex items-center justify-end space-x-2">
                                {task.label && (
                                    <span className="text-xs bg-yellow-100 text-yellow-700 font-semibold px-2 py-1 rounded-full">
                                        {task.label}
                                    </span>
                                )}
                                <span className="flex flex-col items-center text-sm text-gray-800 lg:text-gray-500">
                                    <span className='text-xs bg-pink-100 text-pink-700 font-semibold px-2 py-1 rounded-full'>Due on </span>
                                    <span>{formatDueDate(task.due)}</span>
                                </span>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            <div className='my-2'>
                <button className="flex items-center justify-center w-10 h-10 bg-pink-500 text-white rounded-full" onClick={() => setIsModalOpen(true)}>
                    <FaPlus className='text-center' />
                </button>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center rounded-lg">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-3/4">
                        <h3 className="text-lg font-bold mb-4">Add a New Task</h3>
                        <form onSubmit={handleAddTask}>
                            <div className="mb-3">
                                <textarea
                                    name="name"
                                    value={newTask.name}
                                    onChange={handleNewTaskChange}
                                    className="w-full mt-1 p-1 border border-gray-300 rounded outline-none"
                                    placeholder="Enter task"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <input
                                    type="date"
                                    name="due"
                                    value={newTask.due}
                                    onChange={handleNewTaskChange}
                                    className="w-full mt-1 p-1 border border-gray-300 rounded outline-none"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <input
                                    type="text"
                                    name="label"
                                    value={newTask.label}
                                    onChange={handleNewTaskChange}
                                    className="w-full mt-1 p-1 border border-gray-300 rounded outline-none"
                                    placeholder="Enter assignee"
                                />
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                >
                                    <GiCrossMark className='text-red-700 h-5 w-10' />
                                </button>
                                <button type="submit">
                                    <GiCheckMark className='text-green-700 h-6 w-10' />
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
