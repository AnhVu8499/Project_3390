import React, { useState, useEffect } from 'react';
import './styles.css';
import LogoFB from '../img/Facebook_Logo_2023.png';
import LogoInsta from '../img/Logo-instagram.png';

const ServiceList = ({ bookingSectionRef }) => {
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
                alert('Kérjük, ellenőrizze az emailjeit a megerősítő kódért.');
                setShowverfied(true);
            } else {
                alert('Foglalás sikertelen.');
            }
        } catch (err) {
            console.error('Hiba a beküldés során.', err);
            alert('Hálózati hiba.');
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
                alert('Email sikeresen ellenőrizve.');
                // Clear form
                setFormData({
                    name: '',
                    email: '',
                    date: '',
                    time: ''
                });
                setShowverfied(false);
            } else {
                alert('Érvénytelen kód.');
            }
        } catch (error) {
            console.error(error);
            alert('Hálózati hiba.');
        }
    }

    useEffect(() => {
        handleShow();
    }, []);

    return (
        <div className='serviceList' ref={bookingSectionRef}>
            <h1 id="title-book">Foglaljon időpontot most</h1>
            <div className='container'>
                <form className='box' onSubmit={handleSubmit}>                
                    <input
                        id="name"
                        type="text"
                        placeholder="Az ön neve"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                    <input
                        id="email"
                        type="text"
                        placeholder="Az ön email címe"
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
                        <option value="">Időpont kiválasztása</option>
                        {times.map((time) => (
                            <option key={time} value={time}>
                                {time}
                            </option>
                        ))}
                    </select>
                    {/* Submit button below */}
                    <button type='submit' className='bookapp'>Foglaljon Időpontot Most</button>
                </form>
            </div>
            
            {/* Verification Input */}
            {showVerified && (
                <div className='verify-code-box'>
                    <h2>Adja meg a megerősítő kódot.</h2>
                    <input type="text" value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} placeholder="Megerősítő kód." required />
                    <button onClick={handleVerfication}>Kód ellenőrzése.</button>
                </div>
            )}

            {/* Fetch data from db
            <div className='reservations'>
                {data.length > 0 && (
                    <ul>
                        {data.map((item, index) => (
                            <li key={index}>
                                Name: {item.name}, Email: {item.email}, Date: {new Date(item.date).toLocaleDateString()}, Time: {item.time}
                                <button onClick={() => handleDelete(item._id)}>Delete</button>
                            </li>
                        ))}
                    </ul>
                )}
            </div> */}

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
                        <img src={LogoFB}
                        alt='Facebook logo'/>
                    </a>
                </div>
                <div className="insta">
                    <a href='https://www.instagram.com/paris_nailsbeauty68/' target='_blank' rel='noopener noreferrer'>
                        <img src={LogoInsta}
                        alt='Insta Logo'/>
                    </a>
                </div>
            </div>
        </div>
    )
}

export default ServiceList;
