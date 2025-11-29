// frontend/src/admin_dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { dashboardAPI } from './services/api';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardMetrics();
  }, []);

  const fetchDashboardMetrics = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await dashboardAPI.getMetrics();
      console.log('Dashboard data:', data);
      setMetrics(data);
    } catch (err) {
      console.error('Failed to fetch dashboard metrics:', err);
      setError(err.response?.data?.detail || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontFamily: 'Nunito, sans-serif',
        backgroundColor: '#fcfcfc'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '4px solid #f0f0f0',
            borderTop: '4px solid #5ba1fc',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <p style={{ color: '#636e72', fontWeight: '700' }}>Loading dashboard...</p>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontFamily: 'Nunito, sans-serif',
        backgroundColor: '#fcfcfc'
      }}>
        <div style={{ textAlign: 'center', maxWidth: '400px', padding: '30px' }}>
          <div style={{ fontSize: '4rem', marginBottom: '20px' }}>⚠️</div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#2d3436', marginBottom: '10px' }}>
            Error Loading Dashboard
          </h2>
          <p style={{ color: '#636e72', marginBottom: '20px' }}>{error}</p>
          <button
            onClick={fetchDashboardMetrics}
            style={{
              padding: '12px 24px',
              backgroundColor: '#5ba1fc',
              color: 'white',
              border: 'none',
              borderRadius: '30px',
              fontWeight: '700',
              cursor: 'pointer',
              fontFamily: 'Nunito, sans-serif'
            }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        /* Your original CSS */
        :root {
            --primary-blue: #64a6ff; 
            --button-blue: #5ba1fc;
            --button-shadow-blue: #2f74c7;
            --button-shadow-grey: #bdc3c7;
            --accent-green: #00cd78;
            --alert-red: #ff6b6b;
            --warning-yellow: #feca57;
            --text-dark: #2d3436;
            --text-grey: #636e72;
            --white: #ffffff;
            --border-color: #e0e0e0;
            --shadow-grey: #cacaca; 
            --input-bg: #f0f2f5;
        }

        .dashboard-container {
            font-family: 'Nunito', sans-serif;
            background-color: #fcfcfc; 
            color: var(--text-dark);
            height: 100vh;
            display: flex;
            overflow: hidden; 
            width: 100%;
        }

        .sidebar {
            width: 280px;
            padding: 40px 30px;
            background-color: var(--white);
            display: flex;
            flex-direction: column;
            border-right: 2px solid #f0f0f0;
            flex-shrink: 0;
            height: 100vh;
            overflow-y: auto;
        }

        .logo { width: 160px; margin-bottom: 60px; }

        .nav-menu { list-style: none; padding: 0; margin: 0; flex-grow: 1; }
        .nav-item { margin-bottom: 12px; }

        .nav-link {
            display: flex; align-items: center; gap: 15px;
            text-decoration: none; color: var(--text-grey);
            font-weight: 700; font-size: 1.05rem;
            padding: 12px 15px; border-radius: 12px;
            transition: all 0.2s ease; cursor: pointer;
            background: none; border: none; width: 100%; text-align: left;
        }
        .nav-link:hover { background-color: #f4f9ff; color: var(--button-blue); }
        .nav-link.active { color: var(--accent-green); background-color: #e6fffa; }
        .nav-link.active i { color: var(--accent-green); }
        .nav-link i { font-size: 1.3rem; width: 24px; text-align: center; }

        .user-profile-mini {
            display: flex; align-items: center; gap: 15px; padding: 15px;
            background-color: var(--input-bg); border: 2px solid var(--border-color);
            border-radius: 50px; margin-bottom: 25px;
        }
        .user-avatar-circle {
            width: 40px; height: 40px; background-color: var(--text-dark);
            color: white; border-radius: 50%; display: flex; align-items: center;
            justify-content: center; font-size: 1.1rem; font-weight: 800;
        }
        .user-info h4 { font-size: 0.95rem; font-weight: 800; margin: 0; }
        .user-info p { font-size: 0.8rem; color: var(--text-grey); font-weight: 600; margin: 0; }

        .logout-link {
            display: flex; align-items: center; gap: 10px; color: var(--alert-red);
            text-decoration: none; font-weight: 800; margin-left: 15px; font-size: 0.95rem;
            background: none; border: none; cursor: pointer;
        }

        .main-content {
            flex-grow: 1; padding: 40px 60px; overflow-y: auto; position: relative;
        }

        .top-user-area {
            position: absolute; top: 20px; right: 60px;
            display: flex; align-items: center; gap: 12px; z-index: 10;
        }
        .top-user-text { text-align: right; display: flex; flex-direction: column; justify-content: center; line-height: 1.3; }
        .top-user-text h4 { font-size: 0.95rem; font-weight: 800; margin: 0; }
        .top-user-text span { font-size: 0.75rem; color: var(--text-grey); font-weight: 700; display: block; }
        .top-avatar {
            width: 45px; height: 45px; background: var(--text-dark); color: white;
            border-radius: 50%; display: flex; align-items: center; justify-content: center;
            font-size: 1.2rem; font-weight: 800; position: relative;
        }
        .status-dot-top {
            width: 12px; height: 12px; background: var(--accent-green);
            border: 2px solid white; border-radius: 50%; position: absolute; top: 0; right: 0;
        }

        .metrics-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 25px;
            margin-bottom: 40px;
        }

        .metric-card {
            background: white;
            border: 2px solid var(--border-color);
            border-radius: 16px;
            padding: 25px;
            box-shadow: 5px 6px 0px 0px var(--shadow-grey);
            transition: transform 0.2s;
        }
        .metric-card:hover { transform: translateY(-3px); }

        .metric-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
        }

        .metric-label {
            font-size: 0.9rem;
            color: var(--text-grey);
            font-weight: 700;
            text-transform: uppercase;
        }

        .metric-icon {
            font-size: 2rem;
            filter: grayscale(0.3);
        }

        .metric-value {
            font-size: 2.5rem;
            font-weight: 900;
            color: var(--text-dark);
            line-height: 1;
        }

        .metric-footer {
            margin-top: 10px;
            font-size: 0.85rem;
            font-weight: 600;
        }

        .metric-footer.positive { color: var(--accent-green); }
        .metric-footer.negative { color: var(--alert-red); }
        .metric-footer.neutral { color: var(--text-grey); }
      `}</style>

      <div className="dashboard-container">
        
        {/* SIDEBAR */}
        <aside className="sidebar">
            <img src="/ui/logo.png" alt="SafeShift" className="logo" />
            <ul className="nav-menu">
                <li className="nav-item">
                  <button onClick={() => navigate('/admin/dashboard')} className="nav-link active">
                    <i className="fa-solid fa-gauge-high"></i>Dashboard
                  </button>
                </li>
                <li className="nav-item">
                  <button onClick={() => navigate('/admin/reports')} className="nav-link">
                    <i className="fa-solid fa-file-lines"></i>All Reports
                  </button>
                </li>
                <li className="nav-item">
                  <button onClick={() => navigate('/admin/employees')} className="nav-link">
                    <i className="fa-solid fa-users"></i>Employees
                  </button>
                </li>
                <li className="nav-item">
                  <button onClick={() => navigate('/admin/activity-logs')} className="nav-link">
                    <i className="fa-solid fa-clock-rotate-left"></i>Activity Logs
                  </button>
                </li>
                <li className="nav-item">
                  <button onClick={() => navigate('/admin/settings')} className="nav-link">
                    <i className="fa-solid fa-gear"></i>Settings
                  </button>
                </li>
            </ul>
            <div className="user-profile-mini">
                <div className="user-avatar-circle">
                  {user?.full_name?.charAt(0).toUpperCase() || 'AD'}
                </div>
                <div className="user-info">
                  <h4>{user?.full_name || 'Admin'}</h4>
                  <p>{user?.department || 'Engineering'}</p>
                </div>
            </div>
            <button className="logout-link" onClick={handleLogout}>
              <i className="fa-solid fa-arrow-right-from-bracket"></i> Log out
            </button>
        </aside>

        {/* MAIN CONTENT */}
        <main className="main-content">
            
            <div className="top-user-area">
                <div className="top-user-text">
                  <h4>{user?.full_name || 'Admin'}</h4>
                  <span>{user?.department || 'Engineering'}</span>
                </div>
                <div className="top-avatar">
                  {user?.full_name?.charAt(0).toUpperCase() || 'AD'}
                  <div className="status-dot-top"></div>
                </div>
            </div>

            {/* METRICS GRID */}
            <div className="metrics-grid">
                
                {/* Total Employees */}
                <div className="metric-card">
                    <div className="metric-header">
                        <span className="metric-label">Total Employees</span>
                        <span className="metric-icon">👥</span>
                    </div>
                    <div className="metric-value">
                      {metrics?.metrics?.total_employees || 0}
                    </div>
                    <div className="metric-footer positive">
                        ↑ Active workforce
                    </div>
                </div>

                {/* Active Reports */}
                <div className="metric-card">
                    <div className="metric-header">
                        <span className="metric-label">Active Reports</span>
                        <span className="metric-icon">📝</span>
                    </div>
                    <div className="metric-value">
                      {metrics?.metrics?.active_reports || 0}
                    </div>
                    <div className="metric-footer neutral">
                        Pending review
                    </div>
                </div>

                {/* Flagged Reports */}
                <div className="metric-card">
                    <div className="metric-header">
                        <span className="metric-label">Flagged Reports</span>
                        <span className="metric-icon">🚩</span>
                    </div>
                    <div className="metric-value">
                      {metrics?.metrics?.flagged_reports || 0}
                    </div>
                    <div className="metric-footer negative">
                        Requires attention
                    </div>
                </div>

                {/* Total Departments */}
                <div className="metric-card">
                    <div className="metric-header">
                        <span className="metric-label">Departments</span>
                        <span className="metric-icon">🏢</span>
                    </div>
                    <div className="metric-value">
                      {metrics?.metrics?.total_departments || 0}
                    </div>
                    <div className="metric-footer neutral">
                        Active units
                    </div>
                </div>

            </div>

        </main>

      </div>
    </>
  );
}