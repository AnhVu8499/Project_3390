import React, { useState } from 'react';

const ServiceList = () => {
    const [service, setService] = useState('');
    const [price, setPrice] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newService = {
            service: service.trim(),
            price: parseFloat(price),
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
                alert('Added');
                setService('');
                setPrice('');
            } else {
                alert('Failed to add');
            }
        } catch (error) {
            console.error('Error adding service:', error);
            alert('Error while adding');
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
            <button type="submit">Add Service</button>
        </form>
    );
};

export default ServiceList;