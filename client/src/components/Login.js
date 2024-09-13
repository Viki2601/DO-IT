import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import Cookies from "js-cookie";
import { Link } from 'react-router-dom';


export default function Login() {
    const url = 'http://localhost:8000';
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    // Handle form input changes
    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Handle form submission
    const submit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${url}/login`, {
                formData
            })
                .then(res => {
                    if (res.data === "loginPass") {
                        Cookies.set("email", formData.email, { expires: 7 })
                        toast.success("Successfully Login...")
                    }
                    else if (res.data === "nouser") {
                        toast.error("The Email is not registered");
                    }
                    else if (res.data === "loginFail") {
                        toast.error("Invalid Credential");
                    }
                    else if (res.data === "fail") {
                        toast.error("Something went Wrong!");
                    }
                }).catch(e => {
                    toast.error("Something went Wrong!");
                })

        } catch (e) {
            toast.error("Something went Wrong!");
        }
    };

    return (
        <div className='relative min-h-screen bg-black'>
            {/* Gradient Circle Decorations */}
            <div className={`absolute top-8 right-1/3 w-64 h-64 bg-gradient-to-br from-purple-800 to-blue-800 rounded-full z-0`}></div>
            <div className={`absolute bottom-10 right-20 w-40 h-40 bg-gradient-to-br from-purple-800 to-blue-800 rounded-full z-0`}></div>

            {/* Main container */}
            <div className='lg:grid lg:grid-cols-2 items-center relative z-10'>
                <div className='p-10 w-full lg:min-h-screen flex flex-col justify-center text-white text-center lg:text-left z-10'>
                    <h1 className='text-4xl md:text-6xl font-bold relative z-20 mt-24 lg:mt-0'>
                        Welcome Back!
                    </h1>
                    <h2 className='text-lg md:text-2xl font-semibold mt-4 pl-2 relative z-20'>
                        We Missed You...🥺
                    </h2>
                </div>

                {/* Auth Form */}
                <form className='px-5 lg:p-0 w-full flex items-center justify-center relative z-10' onSubmit={submit}>
                    <section className='p-8 md:p-10 w-full lg:w-3/4 xl:w-1/2 bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-xl border relative z-20'>
                        {/* Form Heading */}
                        <div className='my-4 text-white'>
                            <h2 className='text-2xl md:text-3xl font-bold'>
                                Login
                            </h2>
                            <h3 className='text-sm md:text-base font-light'>
                                Glad you're back.!
                            </h3>
                        </div>

                        {/* Form Fields */}
                        <div className='py-4'>
                            <input
                                className='w-full border bg-transparent rounded-md p-2 text-white'
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                                placeholder='example@mail.com'
                            />
                        </div>

                        <div className='py-4'>
                            <input
                                className='w-full border bg-transparent rounded-md p-2 text-white'
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                required
                                placeholder='Password'
                            />
                        </div>

                        {/* Submit Button */}
                        <input
                            className={`w-full font-semibold mt-4 cursor-pointer text-white border-0 py-2 rounded-md text-lg bg-gradient-to-r from-[#628EFF] via-[#8740CD] to-[#580475]`}
                            type='submit'
                            value='Login'
                        />

                        {/* Forgot Password Link */}
                            <div className='mt-4 flex justify-center'>
                                <Link className='text-white text-sm font-light cursor-pointer' to={"/forgotPassword"}>
                                    Forgot Password?
                                </Link>
                            </div>

                        {/* Divider */}
                        <div className='my-6 flex items-center justify-around'>
                            <hr className='w-1/3' />
                            <h1 className='font-light text-sm text-white'>Or</h1>
                            <hr className='w-1/3' />
                        </div>

                        {/* Sign Up / Login / Take me Back */}
                        <div className='flex items-center justify-center'>
                            <p className='text-white font-light text-sm'>
                                <h1> Don't have an account? <Link className="pl-1 font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-900 cursor-pointer" to={"/signup"}> Sign Up </Link> </h1>
                            </p>
                        </div>
                    </section>
                </form>
            </div>
            <ToastContainer />
        </div>
    );
}
