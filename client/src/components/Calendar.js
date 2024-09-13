import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import DatePicker from "react-datepicker";
import axios from "axios";
import "react-datepicker/dist/react-datepicker.css";

export default function Calendar() {
    const url = "https://do-it-zk0s.onrender.com";
    const email = Cookies.get("email");
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState(null);
    const [events, setEvents] = useState([]);
    const [newEvent, setNewEvent] = useState("");
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const daysInMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate();

    const handleDateChange = (day) => {
        const newDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day);
        setSelectedDate(newDate);
    };

    const fetchEvents = async () => {
        const dateKey = selectedDate.toLocaleDateString("en-US");
        try {
            const response = await axios.get(`${url}/getEvents`, {
                params: { email, date: dateKey }
            });
            setEvents(response.data);
        } catch (error) {
            console.error("Error fetching events:", error);
        }
    };

    const addEvent = async () => {
        if (!newEvent || !selectedTime) return;
        const dateKey = selectedDate.toLocaleDateString("en-US");
        const eventTime = selectedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        try {
            await axios.post(`${url}/addEvents`, {
                email,
                date: dateKey,
                time: eventTime,
                description: newEvent
            }).then(res => {
                setEvents([...events, ...res.data.userEvents.events])
                fetchEvents();
                setNewEvent("");
                setSelectedTime(null);
            })
        } catch (error) {
            console.error("Error adding event:", error);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, [selectedDate]);

    return (
        <div className="min-h-screen p-5 flex flex-col items-center">
            <div className="font-montserrat bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-3xl shadow-lg p-6">
                <div className="flex items-center">
                    <div className="text-xl font-bold">
                        {selectedDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                    </div>
                </div>
                <div className="grid grid-cols-7 gap-2 mt-4 text-center">
                    {daysOfWeek.map((day) => (
                        <div key={day} className="text-sm font-bold text-pink-500">
                            {day}
                        </div>
                    ))}
                    {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => (
                        <button
                            key={day}
                            onClick={() => handleDateChange(day)}
                            className={`w-10 h-10 rounded-full ${selectedDate.getDate() === day ? "shadow-md bg-pink-500 text-white font-semibold" : "text-black font-semibold"
                                }`}
                        >
                            {day}
                        </button>
                    ))}
                </div>
            </div>

            {/* Below Calendar - Time Slot Section */}
            <div className="font-montserrat bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-3xl shadow-lg p-6 mt-4 w-full max-w-md">
                <h2 className="text-xl font-bold">Events on {selectedDate.toLocaleDateString()}</h2>
                {/* Add Event Form */}
                <div className="mt-4">
                    <div className="space-y-4">
                        <input
                            type="text"
                            value={newEvent}
                            onChange={(e) => setNewEvent(e.target.value)}
                            className="w-full p-1 border rounded bg-transparent outline-none"
                            placeholder="Add new event"
                        />
                        <div className="w-full flex justify-between items-center">
                            <DatePicker
                                selected={selectedTime}
                                onChange={(time) => setSelectedTime(time)}
                                showTimeSelect
                                showTimeSelectOnly
                                timeIntervals={15}
                                timeCaption="Time"
                                dateFormat="h:mm aa"
                                className="w-1/2 px-2 py-1 border rounded bg-transparent"
                                placeholderText="Event time"
                            />
                            <button
                            onClick={addEvent}
                            className="bg-pink-500 text-white px-4 py-1 rounded"
                        >
                            Add
                        </button>
                        </div>
                        
                    </div>

                    {/* Display Events for the Selected Date */}
                    <div className="mt-4 h-32 overflow-y-auto scrollbar-thin scrollbar-thumb-rounded p-1">
                        {events.length > 0 ? (
                            events.map((event, index) => (
                                <div key={index} className="flex items-center gap-3 border-b-2 border-fuchsia-200 text-gray-900">
                                    <p className="text-zinc-500 text-xs font-bold py-1">{event.time}</p>
                                    <p className="text-black text-base py-1">{event.description}</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500">No events for this day.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
