import React from 'react';

export default function Settings({ onLogout }) {
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

        .settings-container {
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
            background: none;
            border: none;
            cursor: pointer;
        }

        /* --- MAIN CONTENT --- */
        .main-content {
            flex-grow: 1;
            padding: 40px 60px;
            overflow-y: auto;
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
            padding-left: 100px;
        }

        .mascot-head {
            position: absolute;
            left: 0;
            top: -15px;
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

        /* Header User Info */
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

        /* --- SETTINGS CARDS --- */
        .settings-card {
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
            gap: 12px;
            font-size: 1.2rem;
            font-weight: 800;
            margin-bottom: 5px;
        }
        .card-title i {
            /* Symbol container style similar to Figma design */
            width: 30px;
            height: 30px;
            border-radius: 50%;
            border: 2px solid var(--text-dark);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.9rem;
            color: var(--text-dark);
        }

        .card-subtitle {
            font-size: 0.85rem;
            color: var(--text-grey);
            font-weight: 600;
            margin-bottom: 25px;
            margin-left: 42px; /* Indent to align with text, not icon */
        }

        /* Notification Toggles */
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

        /* Toggle Switch */
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

        /* Data Export Box */
        .export-container {
            border: 1px solid #ddd;
            border-radius: 12px;
            padding: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 10px;
        }
        .export-info h4 {
            font-size: 1rem;
            font-weight: 800;
            margin: 0 0 4px 0;
        }
        .export-info p {
            font-size: 0.8rem;
            color: var(--text-grey);
            font-weight: 600;
            margin: 0;
        }
        .export-btn {
            background-color: white;
            border: 2px solid #ddd;
            padding: 10px 20px;
            border-radius: 8px;
            font-family: 'Nunito', sans-serif;
            font-weight: 700;
            color: var(--text-dark);
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
            transition: all 0.2s;
        }
        .export-btn:hover {
            border-color: var(--button-blue);
            color: var(--button-blue);
        }
        .export-btn i {
            font-size: 0.9rem;
        }


        /* Responsive */
        @media (max-width: 768px) {
            .settings-container { flex-direction: column; }
            .sidebar { width: 100%; border-right: none; border-bottom: 2px solid #eee; }
            .main-content { padding: 30px 20px; }
            .mascot-head { display: none; } 
            .header-section { flex-direction: column-reverse; align-items: flex-start; gap: 20px; }
            .header-user { align-self: flex-end; }
            .header-text { padding-left: 0; }
            .export-container { flex-direction: column; align-items: flex-start; gap: 15px; }
            .export-btn { width: 100%; justify-content: center; }
        }
      `}</style>

      <div className="settings-container">
        
        {/* Sidebar */}
        <aside className="sidebar">
            <img src="ui/logo.png" alt="SafeShift" className="logo" />

            <ul className="nav-menu">
                <li className="nav-item">
                    <a href="dashboard.html" className="nav-link">
                        <i className="fa-solid fa-gauge-high"></i>
                        Dashboard
                    </a>
                </li>
                <li className="nav-item">
                    <a href="#" className="nav-link">
                        <i className="fa-solid fa-file-lines"></i>
                        Reports
                    </a>
                </li>
                <li className="nav-item">
                    <a href="profile.html" className="nav-link">
                        <i className="fa-regular fa-user"></i>
                        Profile
                    </a>
                </li>
                <li className="nav-item">
                    <a href="#" className="nav-link active">
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
                    <h1>Settings</h1>
                    <p>Configure the basics of your SafeShift experience.</p>
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

            <section className="settings-card">
                <div className="card-title">
                    <i className="fa-regular fa-bell"></i> Notifications
                </div>
                <p className="card-subtitle">Choose what updates you want to receive</p>

                <div className="notification-row">
                    <div className="notification-info">
                        <h4>Email Notifications</h4>
                        <p>Receive updates via email</p>
                    </div>
                    <label className="switch">
                        <input type="checkbox" defaultChecked />
                        <span className="slider"></span>
                    </label>
                </div>

                <div className="notification-row">
                    <div className="notification-info">
                        <h4>Push Notifications</h4>
                        <p>Get instant browser notifications</p>
                    </div>
                    <label className="switch">
                        <input type="checkbox" defaultChecked />
                        <span className="slider"></span>
                    </label>
                </div>

                <div className="notification-row">
                    <div className="notification-info">
                        <h4>Report Status Updates</h4>
                        <p>Get notified when your reports are updated</p>
                    </div>
                    <label className="switch">
                        <input type="checkbox" defaultChecked />
                        <span className="slider"></span>
                    </label>
                </div>

                <div className="notification-row">
                    <div className="notification-info">
                        <h4>Task Reminders</h4>
                        <p>Reminders for upcoming task deadlines</p>
                    </div>
                    <label className="switch">
                        <input type="checkbox" defaultChecked />
                        <span className="slider"></span>
                    </label>
                </div>

                <div className="notification-row">
                    <div className="notification-info">
                        <h4>Wellness Check-ins</h4>
                        <p>Receive wellness tips and check-in reminders</p>
                    </div>
                    <label className="switch">
                        <input type="checkbox" defaultChecked />
                        <span className="slider"></span>
                    </label>
                </div>
            </section>

            <section className="settings-card">
                <div className="card-title">
                    <i className="fa-solid fa-database"></i> Data
                </div>
                <p className="card-subtitle">Manage your data</p>

                <div className="export-container">
                    <div className="export-info">
                        <h4>Export Your Data</h4>
                        <p>Download a copy of all your data</p>
                    </div>
                    <button className="export-btn">
                        <i className="fa-solid fa-download"></i> Data
                    </button>
                </div>
            </section>

        </main>

      </div>
    </>
  );
}