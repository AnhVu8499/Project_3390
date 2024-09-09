import React, { useState, useEffect } from 'react';
import './styles.css';
import InputService from '../InputService';
import LogoFB from '../img/Facebook_Logo_2023.png';
import LogoInsta from '../img/Logo-instagram.png';
import LogoMain from '../img/nailsLogo.png';
import Admin from '../Admin/';
import Verification from '../Verification';
import axios from 'axios';

const ServiceList = ({ bookingSectionRef, handleGoBack, showAdmin, showVerification, setShowVerification, handleVerified }) => {
    const times = [];   
    const today = new Date().toISOString().split('T')[0];
    const [serviceTypes, setServiceTypes] = useState([]);
    const [subServices, setSubServices] = useState([]); 
    const [data, setData] = useState([]);
    const [showVerified, setShowverfied] = useState(false);
    const [verificationCode, setVerificationCode] = useState([]);
    const [showUpdatemenu, setShowUpdatemenu] = useState(false);
    const [services, setServices] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        date: '',
        time: '',
        serviceType: '',
        subService: ''
    });
    
    for (let i = 0; i<24*60; i+=15) {
        const hrs = Math.floor(i/60);
        const mins = i%60;
        const time = `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
        if (hrs >= 9 && hrs < 20) {
            times.push(time);
        }
    }  

    const handleShow = async () => {
        try {
            //const res = await fetch('http://localhost:3001/storage', {
            const res = await fetch('https://salonbe-mcw5.onrender.com/storage', {
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
            [id]: value
        }));

        if (id === 'serviceType') {
            // Filter subservices based on the selected serviceType
            const filteredSubServices = services.filter(service => service.serviceType === value);
            setSubServices(filteredSubServices);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            //const res = await fetch('http://localhost:3001/storage', {
            const res = await fetch('https://salonbe-mcw5.onrender.com/storage', {
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
            //const res = await fetch('http://localhost:3001/storage/verify-email', {
            const res = await fetch('https://salonbe-mcw5.onrender.com/storage/verify-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: formData.email.trim(), code: verificationCode.trim() })
            });

            if (res.ok) {
                alert('Email sikeresen ellenőrizve.');
                setFormData({
                    name: '',
                    email: '',
                    date: '',
                    time: '',
                    serviceType: '',
                    subService: ''
                });
                setShowverfied(false);
            } else {
                alert('Érvénytelen kód.');
            }
        } catch (error) {
            console.error(error);
            alert('Hálózati hiba.');
        }
    };

    // show or hide admin info
    const handleAdminButtonClick = () => {
      setShowVerification(!showVerification);
      setShowUpdatemenu(!showUpdatemenu);
    };

    useEffect(() => {
        handleShow();
        if (bookingSectionRef.current) {
            console.log('Booking section ref is ready:', bookingSectionRef.current);
        }
        //axios.get('http://localhost:3001/services')
        axios.get('https://salonbe-mcw5.onrender.com/services')
            .then(response => {
                setServices(response.data);
                const types = response.data.map(service => service.serviceType);
                setServiceTypes([...new Set(types)]); // Remove duplicates if needed
            })
            .catch(error => {
                console.error('Error fetching services:', error);
            });
    }, []);

    return (
        <div className='public-content'>
            {/* Conditional Rendering for Admin and Verification */}
            {(showAdmin || showVerification) ? (
                <div className='restricted-access'>
                    {showVerification && !showAdmin && <Verification onVerified={handleVerified} handleGoBack={handleGoBack}/>}
                    {showAdmin && !showVerification && <Admin handleGoBack={handleGoBack} />}
                </div>
            ) : (
                <div className='serviceList'>
                    {/* Display the rest of the content if Admin/Verification is not shown */}
                    <h1>Szolgáltatások listája</h1>
                    <ul className='menu'>
                        {services.map((service, index) => (
                            <li key={index} className="menu-item">
                                <h3>{service.serviceType}</h3>
                                <div id="menu-container">
                                    <p id="menu-service">Service: {service.service}</p>
                                    <p id="menu-price">Price: {service.price} ft</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <h1 id="title-book">Foglaljon időpontot most</h1>
                    <div className='container' ref={bookingSectionRef}>
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
                            <select id="serviceType" required value={formData.serviceType} onChange={handleChange}>
                                <option value="">Válasszon szolgáltatást</option>
                                {serviceTypes.map((serviceType) => (
                                    <option key={serviceType} value={serviceType}>
                                        {serviceType}
                                    </option>
                                ))}
                            </select>
    
                            {formData.serviceType && (
                                <select id="subService" required value={formData.subService} onChange={handleChange}>
                                    <option value="">Válasszon alapszolgáltatást</option>
                                    {subServices.length > 0 ? (
                                        subServices.map((subService, index) => (
                                            <option key={index} value={subService.name}>
                                                {subService.service} - {subService.price} ft
                                            </option>
                                        ))
                                    ) : (
                                        <option value="">Nincsenek elérhető alapszolgáltatások</option>
                                    )}
                                </select>
                            )}
    
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
    
                            <button type='submit' className='bookapp'>Foglaljon Időpontot Most</button>
                        </form>
                    </div>
    
                    {showVerified && (
                        <div className='verify-code-box'>
                            <h2>Adja meg a megerősítő kódot.</h2>
                            <input 
                                type="text" 
                                value={verificationCode} 
                                onChange={(e) => setVerificationCode(e.target.value)} 
                                placeholder="Megerősítő kód." 
                                required 
                            />
                            <button onClick={handleVerfication}>Kód ellenőrzése.</button>
                        </div>
                    )}
    
                    <div className='map'>
                        <iframe 
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2694.755198778713!2d19.04719007572231!3d47.51415849435741!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4741dc0f31d1f56b%3A0xb92a87a4704f5e7c!2sBudapest%2C%20Holl%C3%A1n%20Ern%C5%91%20u.%2012%2C%201136%20Hungary!5e0!3m2!1svi!2sus!4v1725568690612!5m2!1svi!2sus" 
                            width="600" height="300" 
                            style={{ border: 0 }}
                            allowFullScreen 
                            loading="lazy" 
                            referrerPolicy="no-referrer-when-downgrade">
                        </iframe>
                    </div>
    
                    <div className='social'>
                        <div className="fb">
                            <a href='https://www.facebook.com/profile.php?id=61563459404860' target='_blank' rel='noopener noreferrer'>
                                <img src={LogoFB} alt='Facebook logo'/>
                            </a>
                        </div>
                        <div className="insta">
                            <a href='https://www.instagram.com/paris_nailsbeauty68/' target='_blank' rel='noopener noreferrer'>
                                <img src={LogoInsta} alt='Insta Logo'/>
                            </a>
                        </div>
                        <div className='main-logo' onClick={handleAdminButtonClick}>
                            <a>
                                <img src={LogoMain} alt='Main Logo'/>
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
    
}

export default ServiceList;
