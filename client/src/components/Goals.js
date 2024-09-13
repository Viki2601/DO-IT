import React, { useEffect, useState } from 'react';
import { FiEdit } from 'react-icons/fi';
import { GiCheckMark } from 'react-icons/gi';
import Cookies from "js-cookie";
import axios from 'axios';

export default function Goals() {
    const url = "http://localhost:8000";
    const email = Cookies.get("email");
    const [newGoal, setNewGoal] = useState('');
    const [goals, setGoals] = useState([]);
    const [editingIndex, setEditingIndex] = useState(null);
    const [editedGoal, setEditedGoal] = useState('');
    const [month] = useState(new Date().toLocaleString('default', { month: 'long' })); // Current month

    const handleInputChange = (e) => {
        setNewGoal(e.target.value);
    };

    const handleEditInputChange = (e) => {
        setEditedGoal(e.target.value);
    };

    const fetchGoals = async () => {
        try {
            const res = await axios.get(`${url}/getGoals/${email}`);
            setGoals(res.data.goals);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (email) {
            fetchGoals();
        }
    }, [email]);

    const handleSubmit = async () => {
        try {
            await axios.post(`${url}/addGoals`, {
                email,
                description: newGoal,
                month: month
            }).then(res => {
                setGoals([...goals, ...res.data]);
                fetchGoals();
                setNewGoal(' ');
            });
        } catch (error) {
            console.log(error);
        }
    };

    const handleUpdateGoal = async (index) => {
        try {
            const updatedGoal = editedGoal;
            await axios.put(`${url}/updateGoal`, {
                email,
                goalId: goals[index]._id,
                description: updatedGoal
            });
            fetchGoals();
            setEditingIndex(null);
        } catch (error) {
            console.error(error);
        }
    };

    const handleEditClick = (index) => {
        setEditingIndex(index);
        setEditedGoal(goals[index].description);
    };

    // Filter goals by the current month
    const filteredGoals = goals.filter(goal => goal.month === month);

    return (
        <div className="w-full font-montserrat flex flex-col items-center p-4">
            <h3 className="p-3 text-xl font-bold">Monthly Goals - {month}</h3>
            <div className="w-full mt-4 lg:flex justify-center">
                <input
                    type="text"
                    value={newGoal}
                    onChange={handleInputChange}
                    className="lg:w-3/4 border border-gray-300 outline-none bg-transparent px-2 py-1 rounded-md"
                    placeholder="Enter your goal"
                />
                <button className="ml-2 bg-pink-500 text-white py-1 px-2 rounded-md" onClick={handleSubmit}>
                    Add Goal
                </button>
            </div>
            <div className='w-full h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-rounded'>
                {filteredGoals.length > 0 ? filteredGoals.map((goal, index) => (
                    <div key={goal._id} className="w-full mt-4 py-2 flex items-center justify-evenly border-b border-fuchsia-200 shadow-sm">
                        {editingIndex === index ? (
                            <textarea
                                rows={5}
                                value={editedGoal}
                                onChange={handleEditInputChange}
                                className="w-3/4 outline-none bg-transparent px-2 py-1 text-sm rounded-md scrollbar-thin scrollbar-thumb-rounded"
                            />
                        ) : (
                            <div className="text-sm w-3/4">
                                <span>{goal.description}</span>
                            </div>
                        )}
                        {editingIndex !== index && (
                            <FiEdit className="ml-2 cursor-pointer" onClick={() => handleEditClick(index)} />
                        )}
                        {editingIndex === index && (
                            <button className="ml-2 text-white py-1 px-2 rounded-md" onClick={() => handleUpdateGoal(index)}>
                                <GiCheckMark className='text-green-700 h-6 w-10' />
                            </button>
                        )}
                    </div>
                )) : (
                    <p>No goals for {month} yet!</p>
                )}
            </div>
        </div>
    );
}
