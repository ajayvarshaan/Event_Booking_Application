import React, { useEffect, useState } from 'react';
import { bookingAPI } from '../services/api';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import gsap from 'gsap';
import './Dashboard.css';

interface UserBookingStat {
  _id: string;
  userName: string;
  userEmail: string;
  totalBookings: number;
  totalSeats: number;
  totalSpent: number;
  events: {
    eventTitle: string;
    seats: number;
    totalPrice: number;
    bookingDate: string;
  }[];
}

interface CanceledBookingStat {
  _id: string;
  userName: string;
  userEmail: string;
  totalCanceled: number;
  totalSeats: number;
  totalRefunded: number;
  events: {
    eventTitle: string;
    seats: number;
    totalPrice: number;
    canceledDate: string;
  }[];
}

interface DashboardStats {
  totalUsers: number;
  totalRevenue: number;
  totalBookings: number;
  totalSeats: number;
  averageSpentPerUser: number;
  totalCanceledBookings: number;
  totalRefundedAmount: number;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [userBookingStats, setUserBookingStats] = useState<UserBookingStat[]>([]);
  const [canceledBookingStats, setCanceledBookingStats] = useState<CanceledBookingStat[]>([]);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalRevenue: 0,
    totalBookings: 0,
    totalSeats: 0,
    averageSpentPerUser: 0,
    totalCanceledBookings: 0,
    totalRefundedAmount: 0
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'revenue' | 'bookings' | 'name'>('revenue');
  const [activeTab, setActiveTab] = useState<'active' | 'canceled'>('active');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        console.log('Starting to fetch booking stats...');
        
        const activeRes = await bookingAPI.getUserBookingStats();
        console.log('Active bookings response:', activeRes);
        
        const canceledRes = await bookingAPI.getCanceledBookingStats();
        console.log('Canceled bookings response:', canceledRes);

        const activeStats = Array.isArray(activeRes.data) ? activeRes.data : [];
        const canceledStats = Array.isArray(canceledRes.data) ? canceledRes.data : [];

        console.log('Active stats array:', activeStats);
        console.log('Canceled stats array:', canceledStats);

        setUserBookingStats(activeStats);
        setCanceledBookingStats(canceledStats);

        // Calculate dashboard stats
        const totalUsers = activeStats.length;
        const totalRevenue = activeStats.reduce((sum: number, user: UserBookingStat) => sum + user.totalSpent, 0);
        const totalBookings = activeStats.reduce((sum: number, user: UserBookingStat) => sum + user.totalBookings, 0);
        const totalSeats = activeStats.reduce((sum: number, user: UserBookingStat) => sum + user.totalSeats, 0);
        const averageSpentPerUser = totalUsers > 0 ? totalRevenue / totalUsers : 0;
        const totalCanceledBookings = canceledStats.reduce((sum: number, user: CanceledBookingStat) => sum + user.totalCanceled, 0);
        const totalRefundedAmount = canceledStats.reduce((sum: number, user: CanceledBookingStat) => sum + user.totalRefunded, 0);

        console.log('Calculated dashboard stats:', {
          totalUsers,
          totalRevenue,
          totalBookings,
          totalSeats,
          averageSpentPerUser,
          totalCanceledBookings,
          totalRefundedAmount
        });

        setDashboardStats({
          totalUsers,
          totalRevenue,
          totalBookings,
          totalSeats,
          averageSpentPerUser,
          totalCanceledBookings,
          totalRefundedAmount
        });
      } catch (error) {
        console.error('Failed to fetch booking stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  useEffect(() => {
    if (!loading) {
      gsap.fromTo('.stat-card',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out' }
      );
      gsap.fromTo('.booking-card',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.05, ease: 'power3.out' }
      );
    }
  }, [loading, userBookingStats, canceledBookingStats]);

  const getFilteredAndSortedData = () => {
    const data = activeTab === 'active' ? userBookingStats : canceledBookingStats;
    let filtered = data.filter(user =>
      user.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.userEmail.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return filtered.sort((a, b) => {
      if (activeTab === 'active') {
        const aActive = a as UserBookingStat;
        const bActive = b as UserBookingStat;
        if (sortBy === 'revenue') return bActive.totalSpent - aActive.totalSpent;
        if (sortBy === 'bookings') return bActive.totalBookings - aActive.totalBookings;
        return aActive.userName.localeCompare(bActive.userName);
      } else {
        const aCanceled = a as CanceledBookingStat;
        const bCanceled = b as CanceledBookingStat;
        if (sortBy === 'revenue') return bCanceled.totalRefunded - aCanceled.totalRefunded;
        if (sortBy === 'bookings') return bCanceled.totalCanceled - aCanceled.totalCanceled;
        return aCanceled.userName.localeCompare(bCanceled.userName);
      }
    });
  };

  const filteredData = getFilteredAndSortedData();

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard">
      <div className="container">
        <h1 className="dashboard-title">📊 Admin Dashboard</h1>
        
        {/* Summary Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <h3>{dashboardStats.totalUsers}</h3>
              <p>Total Users Booked</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <h3>${dashboardStats.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
              <p>Total Revenue</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🎫</div>
            <div className="stat-content">
              <h3>{dashboardStats.totalBookings}</h3>
              <p>Total Bookings</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">💺</div>
            <div className="stat-content">
              <h3>{dashboardStats.totalSeats}</h3>
              <p>Total Seats Booked</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📈</div>
            <div className="stat-content">
              <h3>${dashboardStats.averageSpentPerUser.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
              <p>Avg. Per User</p>
            </div>
          </div>

          <div className="stat-card stat-card-canceled">
            <div className="stat-icon">❌</div>
            <div className="stat-content">
              <h3>{dashboardStats.totalCanceledBookings}</h3>
              <p>Canceled Bookings</p>
            </div>
          </div>

          <div className="stat-card stat-card-refund">
            <div className="stat-icon">💸</div>
            <div className="stat-content">
              <h3>${dashboardStats.totalRefundedAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
              <p>Total Refunded</p>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="search-filter-section">
          <div className="search-box">
            <input
              type="text"
              placeholder="🔍 Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="filter-buttons">
            <button
              className={`filter-btn ${sortBy === 'revenue' ? 'active' : ''}`}
              onClick={() => setSortBy('revenue')}
            >
              💰 By Revenue
            </button>
            <button
              className={`filter-btn ${sortBy === 'bookings' ? 'active' : ''}`}
              onClick={() => setSortBy('bookings')}
            >
              🎫 By Bookings
            </button>
            <button
              className={`filter-btn ${sortBy === 'name' ? 'active' : ''}`}
              onClick={() => setSortBy('name')}
            >
              👤 By Name
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="tab-navigation">
          <button
            className={`tab-btn ${activeTab === 'active' ? 'active' : ''}`}
            onClick={() => setActiveTab('active')}
          >
            ✅ Active Bookings ({userBookingStats.length})
          </button>
          <button
            className={`tab-btn ${activeTab === 'canceled' ? 'active' : ''}`}
            onClick={() => setActiveTab('canceled')}
          >
            ❌ Canceled Bookings ({canceledBookingStats.length})
          </button>
        </div>

        {/* User Booking Details with Event Information */}
        <div className="user-booking-details-section">
          <h2>{activeTab === 'active' ? '✅ Active Bookings' : '❌ Canceled Bookings'} ({filteredData.length})</h2>
          
          {filteredData.length === 0 ? (
            <div className="no-bookings">
              <p>No {activeTab === 'active' ? 'active' : 'canceled'} bookings available</p>
            </div>
          ) : (
            <div className="booking-details-list">
              {filteredData.map((userStat) => (
                <div key={userStat._id} className={`booking-card ${activeTab === 'canceled' ? 'canceled' : ''}`}>
                  {/* User Information Header */}
                  <div className="user-header">
                    <div className={`user-avatar ${activeTab === 'canceled' ? 'canceled' : ''}`}>
                      {userStat.userName.charAt(0).toUpperCase()}
                    </div>
                    <div className="user-basic-info">
                      <h3>{userStat.userName}</h3>
                      <p className="user-email">📧 {userStat.userEmail}</p>
                    </div>
                  </div>

                  {/* Events List */}
                  <div className="events-section">
                    <h4 className="events-title">
                      {activeTab === 'active' ? '🎉 Booked Events' : '❌ Canceled Events'}
                    </h4>
                    {userStat.events.map((event, idx) => (
                      <div key={idx} className={`event-booking-card ${activeTab === 'canceled' ? 'canceled' : ''}`}>
                        <div className="event-header">
                          <h5>{event.eventTitle}</h5>
                          <span className="booking-date">
                            {new Date(activeTab === 'active' ? event.bookingDate : event.canceledDate).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="event-details">
                          <div className="detail-item">
                            <span className="detail-label">Seats:</span>
                            <span className="detail-value">{event.seats}</span>
                          </div>
                          <div className="detail-item">
                            <span className="detail-label">{activeTab === 'active' ? 'Price' : 'Refunded'}:</span>
                            <span className="detail-value">${event.totalPrice.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* User Summary */}
                  <div className={`user-summary ${activeTab === 'canceled' ? 'canceled' : ''}`}>
                    <div className="summary-item">
                      <span className="summary-label">
                        {activeTab === 'active' ? 'Total Bookings' : 'Total Canceled'}
                      </span>
                      <span className="summary-value">
                        {activeTab === 'active' 
                          ? (userStat as UserBookingStat).totalBookings 
                          : (userStat as CanceledBookingStat).totalCanceled}
                      </span>
                    </div>
                    <div className="summary-item">
                      <span className="summary-label">Total Seats</span>
                      <span className="summary-value">{userStat.totalSeats}</span>
                    </div>
                    <div className="summary-item">
                      <span className="summary-label">
                        {activeTab === 'active' ? 'Total Spent' : 'Total Refunded'}
                      </span>
                      <span className="summary-value">
                        ${activeTab === 'active' 
                          ? (userStat as UserBookingStat).totalSpent.toFixed(2)
                          : (userStat as CanceledBookingStat).totalRefunded.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <h2>⚡ Quick Actions</h2>
          <div className="action-buttons">
            <Link to="/create-event" className="action-btn">
              <span className="action-icon">✨</span>
              <span>Create Event</span>
            </Link>
            <Link to="/home" className="action-btn">
              <span className="action-icon">🎉</span>
              <span>View Events</span>
            </Link>
            <Link to="/activity-log" className="action-btn">
              <span className="action-icon">📊</span>
              <span>Activity Log</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
