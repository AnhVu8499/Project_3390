import React, { useState } from 'react';
import './styles.css';

const ServiceList = () => {
    const times = [];
    /* Data models */
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        date: '',
        time: ''
    });
    const [data, setData] = useState([]);

    for (let i = 0; i<24*60; i+=15) {
        const hrs = Math.floor(i/60);
        const mins = i%60;
        const time = `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
        if (hrs >= 8 && hrs < 17) {
            times.push(time);
        }
    }  
        /* Get today's date in format:    
            2024-08-20T12:34:56.789Z */

    const today = new Date().toISOString().split('T')[0];

    const handleShow = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:3001/storage', {
                method:'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            
            if (res.ok) {
                const fetcheddata = await res.json();
                setData(fetcheddata); // Update data
                console.log("Got data", fetcheddata);
            } else {
                alert("Failed to get data");
            }
        } catch (err) {
            console.error('Error submitting', err);
            alert('Network error');
        }
    }

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [id]:value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:3001/storage', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                alert('Submitted successfully');
                // Clear form
                setFormData({
                    name: '',
                    phone: '',
                    date: '',
                    time: ''
                });
            } else {
                alert('Failed to reserve');
            }
        } catch (err) {
            console.error('Error submitting', err);
            alert('Network error');
        }
    }

    return (
        <div className='serviceList'>
            <h1>Book Your Appointment Now</h1>
            <div className='container'>
                <form className='box' onSubmit={handleSubmit}>                
                    <input
                        id="name"
                        type="text"
                        placeholder="Your name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                    <input
                        id="phone"
                        type="text"
                        placeholder="Your phone number"
                        value={formData.phone} 
                        onChange={handleChange}
                        required
                    />
                    <input
                        id="date"
                        type="date"
                        required
                        min={today} 
                        value={formData.date}
                        onChange={handleChange}
                    />
                    <select id="time" required value={formData.time} onChange={handleChange}>
                        <option value="">Select time</option>
                        {times.map((time) => (
                            <option key={time} value={time}>
                                {time}
                            </option>
                        ))}
                    </select>
                    {/* Submit button below */}
                    <button type='submit'>Book Your Appointment</button>
                </form>
                <button onClick={handleShow}>Show All Appointment</button>
                {/* Fetch data from db */}
                <div className='reservations'>
                    {data.length > 0 ? (
                        <ul>
                            {data.map((item, index) => (
                                <li key={index}>
                                    Name: {item.name}, Phone: {item.phone}, Date: {new Date(item.date).toLocaleDateString()}, Time: {item.time}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No reservations found</p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ServiceList;
