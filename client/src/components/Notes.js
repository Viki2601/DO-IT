import React, { useEffect, useState } from 'react';
import Cookies from "js-cookie";
import { FaPlus } from 'react-icons/fa';
import { GiCheckMark, GiCrossMark } from 'react-icons/gi';
import axios from 'axios';
import { toast } from 'react-toastify';
import '../tailwind.output.css'
import { useNavigate } from 'react-router-dom';

export default function Notes() {
    const url = "http://localhost:8000";
    const cookie = Cookies.get("email");
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [notes, setNotes] = useState([]);
    const [newNote, setNewNote] = useState({
        name: '',
    });

    const handleNewNoteChange = (e) => {
        const { name, value } = e.target;
        setNewNote({ ...newNote, [name]: value });
    };

    const fetchNotes = async () => {
        try {
            const res = await axios.get(`${url}/getNotes/${cookie}`);
            const sortedNotes = res.data.notes.sort((a, b) => {
                return new Date(b.createdAt) - new Date(a.createdAt); // Latest tasks first
            });
            setNotes(sortedNotes);
        } catch (error) {
            toast.error("Failed to load notes");
            console.error(error);
        }
    };

    useEffect(() => {
        if (cookie) {
            fetchNotes();
        }
    }, [cookie])

    const handleAddNotes = async (e) => {
        e.preventDefault();
        const note = {
            email: cookie,
            name: newNote.name
        };
        if (!cookie) {
            navigate("/login");
        } else {
        await axios.post(`${url}/addNewNote`, { note })
            .then(res => {
                setNotes([...notes, ...res.data.notes]);
                fetchNotes();
                setIsModalOpen(false);
                setNewNote({ name: '' });
            }).catch(e => {
                toast.error("Oops! Something went wrong...")
            });
        }
    };

    return (
        <div className="flex flex-col justify-center items-center h-80 bg-opacity-50 backdrop-filter backdrop-blur-lg shadow-lg rounded-3xl p-6 max-w-md w-full">
            <div className='w-full'>
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold">Notes</h2>
                </div>

                <div className="h-56 overflow-y-auto scrollbar-thin scrollbar-thumb-rounded space-y-4">
                    {/* Note Item */}
                    <div className="bg-transparent py-2">
                        {notes.length > 0 ? (
                            notes.map((note, index) => {
                                // Convert the ISO date to MM/DD/YYYY
                                const formattedDate = new Date(note.createdAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: '2-digit',
                                    day: '2-digit'
                                });
                                return (
                                    <div key={index} className="bg-transparent border-b border-fuchsia-200 py-3 shadow-sm">
                                        <p className="text-xs mb-2 font-semibold text-pink-700">{formattedDate}</p>
                                        <p className="text-sm text-gray-700">{note.name}</p>
                                    </div>
                                );
                            })
                        ) : (
                            <p className="text-sm text-gray-700 ">No notes</p>
                        )}
                    </div>

                </div>
            </div>
            <div className="my-2">
                <button className="flex items-center justify-center w-10 h-10 bg-pink-500 text-white rounded-full" onClick={() => setIsModalOpen(true)}>
                    <FaPlus className='text-center' />
                </button>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center rounded-lg">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-3/4">
                        <h3 className="text-lg font-bold mb-4">Add a New Note</h3>
                        <form onSubmit={handleAddNotes}>
                            <div className="mb-3">
                                <textarea
                                    name="name"
                                    value={newNote.name}
                                    onChange={handleNewNoteChange}
                                    className="w-full mt-1 p-1 border border-gray-300 rounded outline-none"
                                    placeholder="Enter task"
                                    required
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
