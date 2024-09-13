import axios from 'axios';
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import Cookies from 'js-cookie';


export default function ForgotPassword() {
    const url = "https://do-it-zk0s.onrender.com";
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [otpValue, setOtpValue] = useState(null);
    const digits = '0123456789';

    const handleOtpChange = (event) => {
        setOtpValue(event.target.value);
    };

    const sendEmail = async (e) => {
        e.preventDefault();
        try {
            let OTP = '';
            for (let i = 0; i < 6; i++) {
                OTP += digits[Math.floor(Math.random() * 10)]
            }
            setOtp(OTP);

            await axios.post(`${url}/sendEmail`, { email, OTP })
                .then(res => {
                    if (res.data === "pass") {
                        toast.success("OTP sent to your E-mail");
                        setShowPopup(true);
                    } else if (res.data === "notexists") {
                        toast.error("User not found...😕")
                    } else if (res.data === "fail") {
                        toast.error("Oops! Something went wrong...")
                    }
                }).catch(e => {
                    toast.error("Something went Wrong!");
                })
        } catch (e) {
            toast.error("Something went Wrong!");
        }
    }

    const otpCheck = () => {
        if (otp !== otpValue) {
            toast.error("Invalid OTP")
        }
        else {
            Cookies.set("resetEmail", email)
            navigate("/resetpassword")
        }
    }

    return (
        <div className='relative min-h-screen bg-black'>

            {showPopup && (
                <div className="z-20 fixed top-0 left-0 right-0 bottom-0 bg-gray-800 bg-opacity-90 flex justify-center items-center">
                    <div className="bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-lg border p-6 shadow-xl">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-white text-lg font-semibold">Enter OTP</h2>

                        </div>
                        <div className="flex justify-center items-center">
                            <input
                                type="text"
                                maxLength="6"
                                value={otpValue}
                                onChange={handleOtpChange}
                                className="bg-transparent text-white border border-gray-300 rounded-lg px-4 py-2 w-full text-center text-lg font-semibold"
                            />
                        </div>
                        <p className="text-white text-md mt-4">Enter the 6-digit code sent to your Email.</p>
                        <button onClick={otpCheck} className="mt-3 cursor-pointer text-white bg-gradient-to-br from-pink-500 to-purple-800 border-0 py-1 px-6 focus:outline-none rounded text-lg" >Submit</button>
                    </div>
                </div>
            )}


            {/* Gradient Circle Decorations */}
            <div className={`absolute top-8 right-1/3 w-64 h-64 bg-gradient-to-br from-pink-500 to-purple-800 rounded-full z-0`}></div>

            <div className={`absolute bottom-10 right-20 w-40 h-40 bg-gradient-to-br from-pink-500 to-purple-800 rounded-full z-0`}></div>

            {/* Main container */}
            <div className='lg:grid lg:grid-cols-2 items-center relative z-10'>
                <div className='p-10 w-full lg:min-h-screen flex flex-col justify-center text-white text-center lg:text-left z-10'>
                    <h1 className='text-4xl md:text-6xl font-bold relative z-20 mt-24 lg:mt-0'>
                        No Worries!
                    </h1>
                    <h2 className='text-lg md:text-2xl font-semibold mt-4 pl-2 relative z-20'>
                        We are here...😊
                    </h2>
                </div>

                {/* Auth Form */}
                <form onSubmit={sendEmail} className='px-5 lg:p-0 w-full flex items-center justify-center relative z-10'>
                    <section className='p-8 md:p-10 w-full lg:w-3/4 xl:w-1/2 bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-xl border relative z-20'>
                        {/* Form Heading */}
                        <div className='my-4 text-white'>
                            <h2 className='text-2xl md:text-3xl font-bold'>
                                Forgot Password ?
                            </h2>
                            <h3 className='text-sm md:text-base font-light'>
                                We'll help you reset it
                            </h3>
                        </div>

                        {/* Form Fields */}
                        <div className='py-4'>
                            <input
                                className='w-full border bg-transparent rounded-md p-2 text-white'
                                type="email"
                                name="email"
                                required
                                onChange={(e) => { setEmail(e.target.value) }}
                                placeholder='example@mail.com'
                            />
                        </div>

                        {/* Submit Button */}
                        <input
                            className={`w-full font-semibold mt-4 cursor-pointer text-white border-0 py-2 rounded-md text-lg bg-gradient-to-r from-pink-500 to-purple-600`}
                            type='submit'
                            value={'Reset Password'}
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
                                <h1> Take me back.! <Link className="pl-1 font-semibold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-800 cursor-pointer" to={"/login"}> Back to Login </Link> </h1>
                            </p>
                        </div>
                    </section>
                </form>
            </div>
            <ToastContainer />
        </div>
    )
}
