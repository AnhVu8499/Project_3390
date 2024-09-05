import React, { useState, useEffect } from 'react';
import './styles.css';

const ServiceList = () => {
    const times = [];
    /* Data models */
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        date: '',
        time: ''
    });
    const [data, setData] = useState([]);
    const [showVerified, setShowverfied] = useState(false);
    const [verificationCode, setVerificationCode] = useState([]);

    for (let i = 0; i<24*60; i+=15) {
        const hrs = Math.floor(i/60);
        const mins = i%60;
        const time = `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
        if (hrs >= 9 && hrs < 20) {
            times.push(time);
        }
    }  
        /* Get today's date in format:    
            2024-08-20T12:34:56.789Z */

    const today = new Date().toISOString().split('T')[0];

    // handle DELETE request
    const handleDelete = async (id) => {
        try {
            const res = await fetch(`http://localhost:3001/storage/${id}`, {
                method: 'DELETE',
            });

            if(res.ok) {
                alert("Deleted");
                handleShow();
            } else {
                alert("Failed to delete");
            }

        } catch (error) {
            console.error("Error deleting: ", error);
            alert('Network error');
        }
    } 

    // handle GET request
    const handleShow = async () => {
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

    // handle POST request
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
                alert('Please check your email for verified code');
                setShowverfied(true);
            } else {
                alert('Failed to reserve');
            }
        } catch (err) {
            console.error('Error submitting', err);
            alert('Network error');
        }
    }
    
    const handleVerfication = async () => {
        try {
            const res = await fetch('http://localhost:3001/storage/verify-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: formData.email.trim(), code: verificationCode.trim() })
            });

            if (res.ok) {
                alert('Verified email successfully');
                // Clear form
                setFormData({
                    name: '',
                    email: '',
                    date: '',
                    time: ''
                });
                setShowverfied(false);
            } else {
                alert('Invalid code');
            }
        } catch (error) {
            console.error(error);
            alert('Network error');
        }
    }

    useEffect(() => {
        handleShow();
    }, []);

    return (
        <div className='serviceList'>
            <h1 id="title-book">Book Your Appointment Now</h1>
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
                        id="email"
                        type="text"
                        placeholder="Your email address"
                        value={formData.email} 
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
                    <button type='submit' className='bookapp'>Book Your Appointment</button>
                    {/* <button onClick={handleShow}>Show All Appointment</button> */}
                </form>
            </div>
            
            {/* Verification Input */}
            {showVerified && (
                <div>
                    <h2>Enter Verification Code</h2>
                    <input type="text" value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} placeholder="Verification code" required />
                    <button onClick={handleVerfication}>Verify Code</button>
                </div>
            )}

            {/* Fetch data from db */}
            <div className='reservations'>
                {data.length > 0 ? (
                    <ul>
                        {data.map((item, index) => (
                            <li key={index}>
                                Name: {item.name}, Email: {item.email}, Date: {new Date(item.date).toLocaleDateString()}, Time: {item.time}
                                <button onClick={() => handleDelete(item._id)}>Delete</button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p id="not-found">No reservations found</p>
                )}
            </div>
            {/* Google map embedded */}
            <div className='map'>
                <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d26035.121880774972!2d-118.9445632!3d35.34596059999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sus!4v1724775612016!5m2!1sen!2sus" 
                    width="600" height="280" 
                    style={{ border: 0 }}
                    allowfullscreen="" 
                    loading="lazy" 
                    referrerpolicy="no-referrer-when-downgrade"
                ></iframe>
            </div>

            {/* Social media */}
            <div className='social'>
                <div className="fb">
                    <a href='https://www.facebook.com/profile.php?id=61563459404860' target='_blank' rel='noopener noreferrer'>
                        <img src='https://upload.wikimedia.org/wikipedia/commons/6/6c/Facebook_Logo_2023.png'
                        alt='Facebook logo'/>
                    </a>
                </div>
                <div className="insta">
                    <a href='https://www.instagram.com/paris_nailsbeauty68/' target='_blank' rel='noopener noreferrer'>
                        <img src='https://upload.wikimedia.org/wikipedia/commons/9/9a/Logo-instagram-1.png' 
                        alt='Insta Logo'/>
                    </a>
                </div>
            </div>
        </div>
    )
}

export default ServiceList;
