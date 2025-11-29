import React from 'react';

export default function Profile({ onLogout }) {
  return (
    <>
      <style>{`
        /* --- GLOBAL VARIABLES --- */
        :root {
            --primary-blue: #64a6ff; 
            --button-blue: #5ba1fc;
            --button-shadow-blue: #2f74c7;
            --accent-green: #00cd78;
            --alert-red: #ff6b6b;
            --warning-yellow: #feca57;
            --text-dark: #2d3436;
            --text-grey: #636e72;
            --white: #ffffff;
            --border-color: #f0f0f0;
            --shadow-grey: #cacaca; 
            --input-bg: #f0f2f5;
        }

        .profile-container {
            font-family: 'Nunito', sans-serif;
            background-color: #fcfcfc; 
            color: var(--text-dark);
            height: 100vh;
            display: flex;
            width: 100%;
        }

        /* --- SIDEBAR --- */
        .sidebar {
            width: 280px;
            padding: 40px 30px;
            background-color: var(--white);
            display: flex;
            flex-direction: column;
            border-right: 2px solid #f0f0f0;
            flex-shrink: 0;
        }

        .logo {
            width: 160px;
            margin-bottom: 60px;
        }

        .nav-menu {
            list-style: none;
            padding: 0;
            margin: 0;
            flex-grow: 1;
        }

        .nav-item {
            margin-bottom: 12px;
        }

        .nav-link {
            display: flex;
            align-items: center;
            gap: 15px;
            text-decoration: none;
            color: var(--text-grey);
            font-weight: 700;
            font-size: 1.05rem;
            padding: 12px 15px;
            border-radius: 12px;
            transition: all 0.2s ease;
            cursor: pointer;
        }

        .nav-link:hover {
            background-color: #f4f9ff;
            color: var(--button-blue);
        }

        .nav-link.active {
            color: var(--accent-green);
            background-color: #e6fffa;
        }
        
        .nav-link.active i {
            color: var(--accent-green);
        }

        .nav-link i {
            font-size: 1.3rem;
            width: 24px;
            text-align: center;
        }

        .user-profile-mini {
            display: flex;
            align-items: center;
            gap: 15px;
            padding: 15px;
            background-color: var(--white);
            border: 2px solid var(--border-color);
            border-radius: 50px;
            margin-bottom: 25px;
        }
        
        .user-avatar-circle {
            width: 40px;
            height: 40px;
            background-color: var(--text-dark);
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.1rem;
        }

        .user-info h4 {
            font-size: 0.95rem;
            font-weight: 800;
            margin: 0;
        }
        .user-info p {
            font-size: 0.8rem;
            color: var(--text-grey);
            font-weight: 600;
            margin: 0;
        }

        .logout-link {
            display: flex;
            align-items: center;
            gap: 10px;
            color: var(--alert-red);
            text-decoration: none;
            font-weight: 800;
            margin-left: 15px;
            font-size: 0.95rem;
            cursor: pointer;
            background: none;
            border: none;
        }

        /* --- MAIN CONTENT --- */
        .main-content {
            flex-grow: 1;
            padding: 40px 60px;
            overflow-y: auto;
            /* Hide Scrollbar */
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
        .main-content::-webkit-scrollbar {
            display: none;
        }

        /* Header */
        .header-section {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            margin-bottom: 40px;
        }

        .header-text {
            position: relative;
            padding-left: 100px; /* Space for fox */
        }

        .mascot-head {
            position: absolute;
            left: 0;
            top: -10px;
            width: 90px;
            transform: rotate(-5deg); 
        }

        .header-text h1 {
            font-size: 2.4rem;
            font-weight: 900;
            color: var(--text-dark);
            line-height: 1.1;
            margin: 0 0 8px 0;
        }

        .header-text p {
            color: var(--text-grey);
            font-weight: 700;
            font-size: 1.1rem;
            margin: 0;
        }

        /* Top Right User Info */
        .header-user {
            display: flex;
            align-items: center;
            gap: 15px;
        }
        .header-user-info {
            text-align: right;
        }
        .header-user-info h3 {
            font-size: 1rem;
            font-weight: 800;
            margin: 0;
        }
        .header-user-info span {
            font-size: 0.8rem;
            color: var(--text-grey);
            font-weight: 700;
        }
        .header-avatar {
            width: 50px;
            height: 50px;
            background-color: var(--text-dark);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 1.5rem;
            position: relative;
        }
        .status-dot {
            width: 14px;
            height: 14px;
            background-color: var(--accent-green);
            border: 2px solid white;
            border-radius: 50%;
            position: absolute;
            bottom: 0;
            right: 0;
        }

        /* --- PROFILE CARDS --- */
        .profile-card {
            background: white;
            border: 2px solid var(--border-color);
            border-radius: 20px;
            padding: 30px;
            margin-bottom: 30px;
            box-shadow: 5px 6px 0px 0px var(--shadow-grey);
        }

        .card-title {
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 1.1rem;
            font-weight: 800;
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 2px solid #f9f9f9;
        }
        .card-title i {
            color: var(--button-blue); 
        }
        .card-title.no-border {
            border-bottom: none;
            padding-bottom: 0;
            margin-bottom: 15px;
        }

        /* Personal Info Section */
        .profile-header {
            display: flex;
            align-items: center;
            gap: 20px;
            margin-bottom: 30px;
        }
        .big-avatar {
            width: 80px;
            height: 80px;
            background-color: #e0e7ff; 
            color: var(--button-blue);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 2rem;
            font-weight: 900;
            position: relative;
        }
        .camera-icon {
            position: absolute;
            bottom: 0;
            right: 0;
            background: var(--button-blue);
            color: white;
            width: 28px;
            height: 28px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.8rem;
            border: 2px solid white;
            cursor: pointer;
        }
        .profile-name h2 {
            font-weight: 900;
            font-size: 1.4rem;
            margin: 0 0 5px 0;
        }
        .profile-name p {
            color: var(--text-grey);
            font-weight: 600;
            margin: 0;
        }

        /* Form Grid */
        .form-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
        }

        .form-group {
            display: flex;
            flex-direction: column;
            gap: 8px;
            margin-bottom: 15px;
        }

        .form-group label {
            font-size: 0.9rem;
            font-weight: 700;
            color: var(--text-dark);
        }

        .form-input {
            width: 100%;
            padding: 14px 18px;
            border-radius: 10px;
            border: 1px solid transparent;
            background-color: var(--input-bg);
            font-family: 'Nunito', sans-serif;
            font-size: 0.95rem;
            font-weight: 600;
            color: var(--text-dark);
            outline: none;
            transition: all 0.2s;
        }

        .form-input:focus {
            background-color: white;
            border-color: var(--button-blue);
            box-shadow: 0 0 0 3px rgba(91, 161, 252, 0.1);
        }

        /* Button Styling */
        .update-btn {
            background-color: var(--button-blue);
            color: white;
            border: none;
            padding: 14px 24px;
            border-radius: 50px;
            font-family: 'Nunito', sans-serif;
            font-weight: 800;
            font-size: 1rem;
            cursor: pointer;
            box-shadow: 5px 6px 0px 0px var(--button-shadow-blue);
            transition: all 0.1s ease;
            width: fit-content;
            margin-top: 10px;
        }

        .update-btn:active {
            transform: translate(2px, 2px);
            box-shadow: 2px 3px 0px 0px var(--button-shadow-blue);
        }

        /* Toggle Switches */
        .notification-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px 0;
            border-bottom: 1px solid #f0f0f0;
        }
        .notification-row:last-child {
            border-bottom: none;
        }
        
        .notification-info h4 {
            font-size: 0.95rem;
            font-weight: 800;
            margin: 0 0 4px 0;
        }
        .notification-info p {
            font-size: 0.8rem;
            color: var(--text-grey);
            font-weight: 600;
            margin: 0;
        }

        /* The Switch Container */
        .switch {
            position: relative;
            display: inline-block;
            width: 50px;
            height: 26px;
        }
        .switch input { 
            opacity: 0;
            width: 0;
            height: 0;
        }
        .slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #ccc;
            transition: .4s;
            border-radius: 34px;
        }
        .slider:before {
            position: absolute;
            content: "";
            height: 18px;
            width: 18px;
            left: 4px;
            bottom: 4px;
            background-color: white;
            transition: .4s;
            border-radius: 50%;
        }
        input:checked + .slider {
            background-color: var(--button-blue);
        }
        input:checked + .slider:before {
            transform: translateX(24px);
        }

        /* Account Activity List */
        .activity-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background-color: #f0f7ff;
            padding: 12px 15px;
            border-radius: 8px;
            margin-bottom: 10px;
        }
        .activity-details h5 {
            font-size: 0.9rem;
            font-weight: 800;
            margin: 0;
        }
        .activity-details p {
            font-size: 0.75rem;
            color: var(--text-grey);
            margin: 0;
        }
        .activity-time {
            font-size: 0.75rem;
            font-weight: 700;
            color: var(--text-grey);
        }

        /* Responsive */
        @media (max-width: 1024px) {
            .form-grid {
                grid-template-columns: 1fr;
            }
        }
        @media (max-width: 768px) {
            .profile-container { flex-direction: column; }
            .sidebar { width: 100%; border-right: none; border-bottom: 2px solid #eee; }
            .main-content { padding: 30px 20px; }
            .mascot-head { display: none; } 
            .header-section { flex-direction: column-reverse; align-items: flex-start; gap: 20px; }
            .header-user { align-self: flex-end; }
            .header-text { padding-left: 0; }
        }
      `}</style>

      <div className="profile-container">
        
        {/* Sidebar */}
        <aside className="sidebar">
            <img src="ui/logo.png" alt="SafeShift" className="logo" />

            <ul className="nav-menu">
                <li className="nav-item">
                    <a className="nav-link">
                        <i className="fa-solid fa-gauge-high"></i>
                        Dashboard
                    </a>
                </li>
                <li className="nav-item">
                    <a className="nav-link">
                        <i className="fa-solid fa-file-lines"></i>
                        Reports
                    </a>
                </li>
                <li className="nav-item">
                    <a className="nav-link active">
                        <i className="fa-regular fa-user"></i>
                        Profile
                    </a>
                </li>
                <li className="nav-item">
                    <a className="nav-link">
                        <i className="fa-solid fa-gear"></i>
                        Settings
                    </a>
                </li>
            </ul>

            <div className="user-profile-mini">
                <div className="user-avatar-circle">
                    <i className="fa-solid fa-user"></i>
                </div>
                <div className="user-info">
                    <h4>Employee</h4>
                    <p>Engineering</p>
                </div>
            </div>
            
            <button className="logout-link" onClick={onLogout}>
                <i className="fa-solid fa-arrow-right-from-bracket"></i> Log out
            </button>
        </aside>

        {/* Main Content */}
        <main className="main-content">
            
            <header className="header-section">
                <div className="header-text">
                    <img src="ui/fox.png" className="mascot-head" alt="Mascot" />
                    <h1>My Account</h1>
                    <p>Manage your account settings and preferences</p>
                </div>

                <div className="header-user">
                    <div className="header-user-info">
                        <h3>Employee</h3>
                        <span>Engineering</span>
                    </div>
                    <div className="header-avatar">
                        <i className="fa-solid fa-user"></i>
                        <div className="status-dot"></div>
                    </div>
                </div>
            </header>

            <section className="profile-card">
                <div className="card-title">
                    <i className="fa-regular fa-id-card"></i> Personal Information
                </div>

                <div className="profile-header">
                    <div className="big-avatar">
                        e
                        <div className="camera-icon">
                            <i className="fa-solid fa-camera"></i>
                        </div>
                    </div>
                    <div className="profile-name">
                        <h2>Employee</h2>
                        <p>Engineering Team</p>
                    </div>
                </div>

                <form className="form-grid">
                    <div className="form-group">
                        <label>Email Address</label>
                        <input type="email" className="form-input" defaultValue="you@gmail.com" />
                    </div>
                    <div className="form-group">
                        <label>Employee ID</label>
                        <input type="text" className="form-input" defaultValue="2410746" readOnly />
                    </div>
                    <div className="form-group">
                        <label>Department</label>
                        <input type="text" className="form-input" defaultValue="Engineering" />
                    </div>
                    <div className="form-group">
                        <label>Role</label>
                        <input type="text" className="form-input" defaultValue="Employee" readOnly />
                    </div>
                </form>
            </section>

            <section className="profile-card">
                <div className="card-title">
                    <i className="fa-solid fa-lock"></i> Change Password
                </div>
                <form>
                    <div className="form-group">
                        <label>Current Password</label>
                        <input type="password" className="form-input" placeholder="Enter current password" />
                    </div>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>New Password</label>
                            <input type="password" className="form-input" placeholder="Enter new password" />
                        </div>
                        <div className="form-group">
                            <label>Confirm New Password</label>
                            <input type="password" className="form-input" placeholder="Enter new password again" />
                        </div>
                    </div>
                    <button type="button" className="update-btn">Update Password</button>
                </form>
            </section>

            <section className="profile-card">
                <div className="card-title no-border">
                    <i className="fa-regular fa-bell"></i> Notification Preferences
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-grey)', marginBottom: '20px' }}>
                    Choose how you want to be notified
                </p>

                <div className="notification-row">
                    <div className="notification-info">
                        <h4>Email notification for reports</h4>
                        <p>Get notified when your reports are updated</p>
                    </div>
                    <label className="switch">
                        <input type="checkbox" defaultChecked />
                        <span className="slider"></span>
                    </label>
                </div>

                <div className="notification-row">
                    <div className="notification-info">
                        <h4>Email notification for tasks</h4>
                        <p>Get reminders about upcoming task deadlines</p>
                    </div>
                    <label className="switch">
                        <input type="checkbox" defaultChecked />
                        <span className="slider"></span>
                    </label>
                </div>

                <div className="notification-row">
                    <div className="notification-info">
                        <h4>Push notifications</h4>
                        <p>Receive push notifications in your browser</p>
                    </div>
                    <label className="switch">
                        <input type="checkbox" defaultChecked />
                        <span className="slider"></span>
                    </label>
                </div>

                <div className="notification-row">
                    <div className="notification-info">
                        <h4>Weekly digest</h4>
                        <p>Get a summary of your activity each week</p>
                    </div>
                    <label className="switch">
                        <input type="checkbox" defaultChecked />
                        <span className="slider"></span>
                    </label>
                </div>
            </section>

            <section className="profile-card">
                <div className="card-title no-border">
                    <i className="fa-solid fa-clock-rotate-left"></i> Account Activity
                </div>
                
                <div className="activity-item">
                    <div className="activity-details">
                        <h5>Logged in</h5>
                        <p>IP: 192.168.1.***</p>
                    </div>
                    <div className="activity-time">Nov 28, 2025, 11:08 PM</div>
                </div>

                <div className="activity-item">
                    <div className="activity-details">
                        <h5>Submitted report #REP-847</h5>
                        <p>IP: 192.168.1.***</p>
                    </div>
                    <div className="activity-time">Nov 28, 2025, 11:08 PM</div>
                </div>

                <div className="activity-item">
                    <div className="activity-details">
                        <h5>Updated profile picture</h5>
                        <p>IP: 192.168.1.***</p>
                    </div>
                    <div className="activity-time">Nov 28, 2025, 11:08 PM</div>
                </div>

                <div className="activity-item">
                    <div className="activity-details">
                        <h5>Changed password</h5>
                        <p>IP: 192.168.1.***</p>
                    </div>
                    <div className="activity-time">Nov 28, 2025, 11:08 PM</div>
                </div>
            </section>

        </main>
      </div>
    </>
  );
}