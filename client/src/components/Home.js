import React, { useEffect, useState } from 'react';
import Calendar from './Calendar';
import Task from './Task';
import Notes from './Notes';
import { LuLogOut } from "react-icons/lu";
import { useNavigate } from 'react-router-dom';
import Cookies from "js-cookie";
import axios from 'axios';
import Goals from './Goals';


export default function Home() {
    const navigate = useNavigate();
    const url = "https://do-it-zk0s.onrender.com";
    const cookie = Cookies.get("email");
    const [user, setUser] = useState([]);

    const fetchUser = async () => {
        try {
            const res = await axios.get(`${url}/user/${cookie}`);
            setUser(res.data);
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        fetchUser();
    }, [])

    const logout = () => {
        Cookies.remove('email');
        navigate("/login");
    };

    return (
        <div className='min-h-screen w-full bg-gradient-to-br from-pink-100 via-blue-100 to-sky-100 relative'>
            {/* Gradient Circle Decorations */}
            <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-pink-500 to-purple-800 rounded-full z-0`}></div>
            <div className={`absolute bottom-10 right-44 w-40 h-40 bg-gradient-to-br from-pink-500 to-purple-800 rounded-full z-0`}></div>
            <div className={`absolute top-10 left-6 w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-800 rounded-full z-0`}></div>
            <div className={`absolute top-24 left-0 w-5 h-5 bg-gradient-to-br from-pink-500 to-purple-800 rounded-full z-0`}></div>
            <div className={`absolute top-40 left-10 w-14 h-14 bg-gradient-to-br from-pink-500 to-purple-800 rounded-full z-0`}></div>
            <div className={`absolute top-72 lg:left-96 w-28 h-28 bg-gradient-to-br from-pink-500 to-purple-800 rounded-full z-0`}></div>

            <div className='lg:flex'>
                <div className='relative min-h-screen w-20 lg:flex hidden justify-center shadow-lg bg-opacity-50 backdrop-filter backdrop-blur-lg'>
                    <div className='h-screen flex flex-col items-center justify-center gap-8 text-6xl font-extrabold font-tenorSans'>
                        <h1 className='transform -rotate-90'>T</h1>
                        <h1 className='transform -rotate-90'>I</h1>
                        <h1 className='transform -rotate-90'>O</h1>
                        <h1 className='transform -rotate-90'>D</h1>
                        <LuLogOut className='absolute bottom-5 text-4xl text-pink-500' onClick={logout} />
                    </div>
                </div>
                <div className='lg:flex flex-row-reverse items-center lg:w-10/12'>
                    <div className='lg:w-2/3 lg:h-screen flex flex-col items-start justify-start gap-5 p-5'>
                        <div className='w-full flex items-center justify-between shadow-lg bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-xl'>
                            <div className='font-tenorSans p-3 gap-4'>
                                <h1 className='text-2xl font-semibold'>DOIT</h1>
                            </div>
                            <div className='p-3'>
                                <p className='text-lg text-pink-500 font-semibold '>{user ? user.name : 'U'}</p>
                            </div>
                        </div>
                        <div className='w-full h-screen flex items-start justify-between shadow-lg bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-xl'>
                            <Goals />
                        </div>
                    </div>
                    <div className='lg:w-1/2 flex flex-col justify-center gap-5 p-5'>
                        <Task />
                        <Notes />
                    </div>
                </div>
                <div className='shadow-lg bg-slate-50 bg-opacity-50 backdrop-filter backdrop-blur-lg'>
                    <Calendar />
                </div>
            </div>
        </div>
    );
}
