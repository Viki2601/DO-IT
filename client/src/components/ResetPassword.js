import axios from 'axios';
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify'
import Cookies from 'js-cookie';


export default function ResetPassword() {
    const url = "https://do-it-zk0s.onrender.com";
    const navigate = useNavigate();
    const [password, setPassword] = useState('')
    const [repassword, setRepassword] = useState('')


    const submit = async (e) => {
        e.preventDefault();
        try {
            if (password !== repassword) {
                toast.error("Oops! Password doesn't match");
            } else if (password.length < 6) {
                toast.error("Password must be atleast 6 characters");
            } else {
                const cookie = Cookies.get("resetEmail")
                await axios.post(`${url}/resetPassword`, { cookie, password })
                    .then(res => {
                        if (res.data === "pass") {
                            toast.success("Password changed Successfully");
                            Cookies.remove("resetEmail")
                            navigate("/login")
                        } else if (res.data === "fail") {
                            toast.error("Oops! Something went wrong");
                        }
                    }).catch(e => {
                        toast.error("Oops! Something went wrong");
                    })
            }
        } catch (e) {
            toast.error("Oops! Something went wrong");
        }
    }

    return (
        <div className='relative min-h-screen bg-black'>
            {/* Gradient Circle Decorations */}
            <div className={`absolute top-8 right-1/3 w-64 h-64 bg-gradient-to-br from-emerald-700 to-cyan-600 rounded-full z-0`}></div>

            <div className={`absolute bottom-10 right-20 w-40 h-40 bg-gradient-to-br from-emerald-700 to-cyan-600 rounded-full z-0`}></div>

            {/* Main container */}
            <div className='lg:grid lg:grid-cols-2 items-center relative z-10'>
                <div className='p-10 w-full lg:min-h-screen flex flex-col justify-center text-white text-center lg:text-left z-10'>
                    <h1 className='text-4xl md:text-6xl font-bold relative z-20 mt-24 lg:mt-0'>
                        Don't forgot it again.!
                    </h1>
                    <h2 className='text-lg md:text-2xl font-semibold mt-4 pl-2 relative z-20'>
                        We won't help you...😒
                    </h2>
                </div>

                {/* Auth Form */}
                <form className='px-5 lg:p-0 w-full flex items-center justify-center relative z-10' onSubmit={submit}>
                    <section className='p-8 md:p-10 w-full lg:w-3/4 xl:w-1/2 bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-xl border relative z-20'>
                        {/* Form Heading */}
                        <div className='my-4 text-white'>
                            <h2 className='text-2xl md:text-3xl font-bold'>
                                Reset Password
                            </h2>
                            <h3 className='text-sm md:text-base font-light'>
                                Next step, update with your new Password.!
                            </h3>
                        </div>

                        {/* Form Fields */}
                        <div className='py-4'>
                            <input
                                className='w-full border bg-transparent rounded-md p-2 text-white'
                                type="password"
                                name="password"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                required
                                placeholder='Password'
                            />
                        </div>

                        <div className='py-4'>
                            <input
                                className='w-full border bg-transparent rounded-md p-2 text-white'
                                type="password"
                                name="repassword"
                                value={repassword}
                                onChange={(event) => setRepassword(event.target.value)}
                                required
                                placeholder='Confirm Password'
                            />
                        </div>

                        {/* Submit Button */}
                        <input
                            className={`w-full font-semibold mt-4 cursor-pointer text-white border-0 py-2 rounded-md text-lg bg-gradient-to-r from-[#50C878] to-[#00ACC1]`}
                            type='submit'
                            value='Reset Password'
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
                                <h1> Did your 🧠 remember your Old Password? <Link className="pl-1 font-semibold bg-clip-text text-transparent bg-gradient-to-r from-emerald-700 to-cyan-600 cursor-pointer" to={"/login"}> Get back to Login </Link> </h1>
                            </p>
                        </div>
                    </section>
                </form>
            </div>
            <ToastContainer />
        </div>)
}
