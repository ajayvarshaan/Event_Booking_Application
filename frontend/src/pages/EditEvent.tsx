import React, { useRef, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { eventAPI } from '../services/api';
import { fadeInUp, scaleIn } from '../animations/gsapAnimations';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';
import './CreateEvent.css';

const EditEvent: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    category: '',
    price: 0,
    capacity: 0,
    image: ''
  });
  const [imagePreview, setImagePreview] = useState('https://via.placeholder.com/400x300?text=Event+Image');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/home');
      return;
    }

    const fetchEvent = async () => {
      try {
        const response = await eventAPI.getOne(eventId!);
        const event = response.data;
        
        // Format date for input (YYYY-MM-DD)
        const dateObj = new Date(event.date);
        const formattedDate = dateObj.toISOString().split('T')[0];
        
        setFormData({
          title: event.title,
          description: event.description,
          date: formattedDate,
          time: event.time,
          location: event.location,
          category: event.category,
          price: event.price,
          capacity: event.capacity,
          image: event.image
        });
        setImagePreview(event.image);
      } catch (error) {
        console.error('Failed to fetch event:', error);
        setToast({ message: 'Failed to load event', type: 'error' });
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId, user, navigate]);

  useEffect(() => {
    if (!loading) {
      fadeInUp(titleRef.current);
      scaleIn(formRef.current);
    }
  }, [loading]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'price' || name === 'capacity' ? parseFloat(value) : value
    }));
    
    if (name === 'image' && value) {
      setImagePreview(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      await eventAPI.update(eventId!, formData);
      setToast({ message: 'Event updated successfully! Redirecting...', type: 'success' });
      setTimeout(() => navigate('/home'), 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update event');
      setToast({ message: 'Failed to update event', type: 'error' });
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading event...</div>;
  }

  return (
    <div className="create-event">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      
      <div className="container">
        <h1 ref={titleRef}>Edit Event</h1>
        <div ref={formRef} className="event-form card">
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="image-preview-section">
              <label>Event Image Preview</label>
              <div className="image-preview">
                <img src={imagePreview} alt="Event preview" onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Invalid+Image+URL';
                }} />
              </div>
            </div>

            <div className="form-group">
              <label>Image URL</label>
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg (or use Unsplash URLs)"
              />
              <small className="form-hint">Tip: Use Unsplash for free images - https://unsplash.com/</small>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Event Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select name="category" value={formData.category} onChange={handleChange} required>
                  <option value="">Select Category</option>
                  <option value="music">Music</option>
                  <option value="sports">Sports</option>
                  <option value="tech">Technology</option>
                  <option value="business">Business</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Time</label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Price per Seat ($)</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Capacity</label>
              <input
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                min="1"
                required
              />
            </div>

            <div className="form-actions">
              <button 
                type="button" 
                className="btn-secondary" 
                onClick={() => navigate('/home')}
                disabled={saving}
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary" disabled={saving}>
                {saving ? 'Updating...' : 'Update Event'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditEvent;
