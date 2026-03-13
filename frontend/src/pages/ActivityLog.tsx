import React, { useEffect, useState } from 'react';
import { activityAPI } from '../services/api';
import gsap from 'gsap';
import './ActivityLog.css';

interface Activity {
  _id: string;
  userName: string;
  userEmail: string;
  action: string;
  description: string;
  eventTitle?: string;
  createdAt: string;
}

const ActivityLog: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const response = await activityAPI.getRecent(50);
      // Filter to show only booking-related activities
      const bookingActivities = response.data.filter((activity: Activity) => 
        activity.action === 'booking_created' || activity.action === 'booking_cancelled'
      );
      setActivities(bookingActivities);
    } catch (error) {
      console.error('Failed to fetch activities:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!loading && activities.length > 0) {
      gsap.fromTo('.activity-item',
        { opacity: 0, x: -30 },
        { 
          opacity: 1, 
          x: 0, 
          duration: 0.5, 
          stagger: 0.05,
          ease: 'power3.out'
        }
      );
    }
  }, [loading, activities]);

  const getActionIcon = (action: string) => {
    const icons: { [key: string]: string } = {
      booking_created: '🎫',
      booking_cancelled: '❌'
    };
    return icons[action] || '📝';
  };

  const getActionColor = (action: string) => {
    const colors: { [key: string]: string } = {
      booking_created: '#48bb78',
      booking_cancelled: '#f56565'
    };
    return colors[action] || '#718096';
  };

  const formatDate = (date: string) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return d.toLocaleDateString();
  };

  if (loading) {
    return <div className="loading">Loading activities...</div>;
  }

  return (
    <div className="activity-log">
      <div className="container">
        <div className="activity-header">
          <h1>🎫 User Bookings Activity</h1>
          <p>Track all user bookings and cancellations in real-time</p>
        </div>

        {activities.length === 0 ? (
          <div className="no-activities">
            <h2>No Booking Activities Yet</h2>
            <p>User bookings and cancellations will appear here</p>
          </div>
        ) : (
          <div className="activities-list">
            {activities.map((activity) => (
              <div 
                key={activity._id} 
                className="activity-item"
                style={{ borderLeftColor: getActionColor(activity.action) }}
              >
                <div className="activity-icon" style={{ background: getActionColor(activity.action) }}>
                  {getActionIcon(activity.action)}
                </div>
                <div className="activity-content">
                  <div className="activity-main">
                    <h3>{activity.description}</h3>
                    <span className="activity-time">{formatDate(activity.createdAt)}</span>
                  </div>
                  <div className="activity-meta">
                    <span className="activity-user">
                      👤 {activity.userName}
                    </span>
                    <span className="activity-email">
                      📧 {activity.userEmail}
                    </span>
                    {activity.eventTitle && (
                      <span className="activity-event">
                        🎉 {activity.eventTitle}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityLog;
