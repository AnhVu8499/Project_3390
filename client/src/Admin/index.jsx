import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import './styles.css';  

const Admin = (bookingSectionRef) => {
    const [reservations, setReservations] = useState([]);

    useEffect(() => {
        // Fetch reservations from the API when the component mounts
        const fetchReservations = async () => {
            try {
                const response = await fetch('http://localhost:3001/storage');
                if (!response.ok) {
                    throw new Error('Failed to fetch reservations');
                }
                const data = await response.json();
                setReservations(data);
            } catch (error) {
                console.error('Error fetching reservations:', error);
            }
        };

        fetchReservations();
    }, []);

    return (
        <div className="admin-dashboard">
            <h1>Admin Dashboard</h1>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {reservations.length > 0 ? (
                        reservations.map((reservation) => (
                            <tr key={reservation._id}>
                                <td>{reservation.name}</td>
                                <td>{reservation.email}</td>
                                <td>{new Date(reservation.date).toLocaleDateString()}</td>
                                <td>{reservation.time}</td>
                                <td>{reservation.verified ? 'Verified' : 'Pending'}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5">No reservations found</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default Admin;
