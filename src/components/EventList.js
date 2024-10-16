import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import eventsData from '../data/events.json';

const EventList = () => {
  const { isLoggedIn, logout } = useAuth();
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    try {
      setEvents(eventsData);
      setError(null);
    } catch {
      setError('Failed to load events');
    } finally {
      setLoading(false);
    }
  }, []);

  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  const handleBooking = (id) => {
    setEvents((prev) =>
      prev.map((event) =>
        event.id === id && event.availableSeats > 0
          ? { ...event, availableSeats: event.availableSeats - 1 }
          : event
      )
    );
    alert('Ticket booked successfully!');
  };

  const filteredEvents = events.filter((event) => {
    const matchesTitle = event.title.toLowerCase().includes(search.toLowerCase());
    const matchesCat = category === 'All' || event.category === category;
    return matchesTitle && matchesCat;
  });

  const categories = ['All', ...new Set(events.map((event) => event.category))];

  if (loading) return <p>Loading events...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Event List</h2>
        <button onClick={logout}>Logout</button>
      </div>
      <div className="filter-container">
        <input
          type="text"
          placeholder="Search by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="select"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <ul className="event-list">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <li key={event.id} className="event-item">
              <h3>{event.title}</h3>
              <p>{event.description}</p>
              <p>Category: {event.category}</p>
              <p>Date: {new Date(event.date).toLocaleDateString()}</p>
              <p>Available Seats: {event.availableSeats}</p>
              <p>Price: ${event.price}</p>
              <button
                onClick={() => handleBooking(event.id)}
                disabled={event.availableSeats === 0}
                className="button"
              >
                {event.availableSeats > 0 ? 'Book Ticket' : 'Fully Booked'}
              </button>
            </li>
          ))
        ) : (
          <p>No events found.</p>
        )}
      </ul>
    </div>
  );
};

export default EventList;
