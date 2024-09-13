import axios from 'axios';
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import Cookies from "js-cookie";

export default function Signup() {
    const url = "http://localhost:8000";
    const navigate = useNavigate();
    const [form, setForm] = useState({
        username: "",
        email: '',
        password: '',
        confirmPassword: ''
    });

    const submit = async (e) => {
        e.preventDefault()
        try {
            if (form.password.length < 6) {
                toast.error("Password should be more than 6 Character");
            }
            else if (form.password !== form.confirmPassword) {
                toast.error("Password dosen't match");
            }
            else {
                await axios.post(`${url}/signup`, {
                    form
                })
                    .then(res => {
                        if (res.data === "exists") {
                            toast.error("Email already exists")
                        }
                        else if (res.data === "notexists") {
                            Cookies.set("email", form.email, { expires: 7 })
                            toast.success("Successfully registered", { autoClose: 1000 });
                            setTimeout(() => {
                                navigate("/login")
                            }, 2000)
                        }
                    }).catch(e => {
                        toast.error("Something went wrong!")
                    })
            }
        } catch (e) {
            toast.error("Something went wrong!");
        }
    }

    return (
        <div className='relative min-h-screen bg-black'>
            {/* Gradient Circle Decorations */}
            <div className={`absolute top-8 right-1/3 w-64 h-64 bg-gradient-to-br from-blue-700 to-blue-950' rounded-full z-0`}></div>

            <div className={`absolute bottom-10 right-20 w-40 h-40 bg-gradient-to-br from-blue-700 to-blue-950 rounded-full z-0`}></div>

            {/* Main container */}
            <div className='lg:grid lg:grid-cols-2 items-center relative z-10'>
                <div className='p-10 w-full lg:min-h-screen flex flex-col justify-center text-white text-center lg:text-left z-10'>
                    <h1 className='text-4xl md:text-6xl font-bold relative z-20 mt-24 lg:mt-0'>
                        Roll the Carpet!
                    </h1>
                    <h2 className='text-lg md:text-2xl font-semibold mt-4 pl-2 relative z-20'>
                        We Welcome you...✌️
                    </h2>
                </div>

                {/* Auth Form */}
                <form action='POST' method='/login' onSubmit={submit} className='px-5 lg:p-0 w-full flex items-center justify-center relative z-10'>
                    <section className='p-8 md:p-10 w-full lg:w-3/4 xl:w-1/2 bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-xl border relative z-20'>
                        {/* Form Heading */}
                        <div className='my-4 text-white'>
                            <h2 className='text-2xl md:text-3xl font-bold'>
                                Signup
                            </h2>
                            <h3 className='text-sm md:text-base font-light'>
                                Just some details to get you in!
                            </h3>
                        </div>

                        {/* Form Fields */}
                        <div className='py-4'>
                            <input className='w-full border bg-transparent rounded-md p-2 text-white'
                                type="text"
                                name="username"
                                value={form.username}
                                onChange={(e) => { setForm({ ...form, [e.target.name]: e.target.value }) }}
                                required
                                placeholder='Username'
                            />
                        </div>
                        <div className='py-4'>
                            <input className='w-full border bg-transparent rounded-md p-2 text-white'
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={(e) => { setForm({ ...form, [e.target.name]: e.target.value }) }}
                                required
                                placeholder='example@mail.com'
                            />
                        </div>
                        <div className='py-4'>
                            <input className='w-full border bg-transparent rounded-md p-2 text-white'
                                type="password"
                                name="password"
                                value={form.password}
                                onChange={(e) => { setForm({ ...form, [e.target.name]: e.target.value }) }}
                                required
                                placeholder='Password'
                            />
                        </div>
                        <div className='py-4'>
                            <input className='w-full border bg-transparent rounded-md p-2 text-white'
                                type="password"
                                name="confirmPassword"
                                value={form.confirmPassword}
                                onChange={(e) => { setForm({ ...form, [e.target.name]: e.target.value }) }}
                                required
                                placeholder='Confirm Password'
                            />
                        </div>

                        {/* Submit Button */}
                        <input
                            className={`w-full font-semibold mt-4 cursor-pointer text-white border-0 py-2 rounded-md text-lg bg-gradient-to-r from-blue-800 to-blue-950`}
                            type='submit'
                            value='Signup'
                        />

                        {/* Divider */}
                        <div className='my-6 flex items-center justify-around'>
                            <hr className='w-1/3' />
                            <h1 className='font-light text-sm text-white'>Or</h1>
                            <hr className='w-1/3' />
                        </div>

                        {/* Sign Up / Login / Take me Back */}
                        <div className='flex items-center justify-center'>
                            <p className='text-white font-light text-sm'>
                                <h1> Already Registered? <Link className="pl-1 font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-800 to-blue-950 cursor-pointer" to={"/login"}> Login </Link> </h1>
                            </p>
                        </div>
                    </section>
                </form>
            </div>
            <ToastContainer />
        </div>
    )
}
