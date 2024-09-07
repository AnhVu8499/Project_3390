import React, { useState } from 'react';
import './styles.css';

const InputService = () => {
    const [service, setService] = useState('');
    const [price, setPrice] = useState('');
    const [serviceType, setServiceType] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newService = {
            service: service.trim(),
            price: parseFloat(price),
            serviceType: serviceType.trim()
        };

        try {
            const response = await fetch('http://localhost:3001/main', { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newService),
            });

            if (response.ok) {
                alert('Service added successfully');
                setService('');
                setPrice('');
                setServiceType('');
            } else {
                const errorData = await response.json();
                alert(`Failed to add service: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Error adding service:', error);
            alert('Network error while adding service');
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <input 
                type="text" 
                value={service} 
                onChange={(e) => setService(e.target.value)} 
                placeholder="Service Name" 
                required 
            />
            <input 
                type="number" 
                value={price} 
                onChange={(e) => setPrice(e.target.value)} 
                placeholder="Price" 
                required 
            />
            <input 
                type="text" 
                value={serviceType} 
                onChange={(e) => setServiceType(e.target.value)} 
                placeholder="Service Type" 
                required 
            />
            <button type="submit">Add Service</button>
        </form>
    );
};

export default InputService;
