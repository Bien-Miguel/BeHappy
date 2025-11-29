import React, { useState } from 'react';

export default function AdminDashboard({ onLogout }) {
  // --- STATE MANAGEMENT ---
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);
  const [isReportDetailsOpen, setIsReportDetailsOpen] = useState(false);

  // Handlers
  const openAddEmployee = () => setIsAddEmployeeOpen(true);
  const closeAddEmployee = () => setIsAddEmployeeOpen(false);

  const openReportDetails = () => setIsReportDetailsOpen(true);
  const closeReportDetails = () => setIsReportDetailsOpen(false);

  return (
    <>
      <style>{`
        /* --- GLOBAL VARIABLES --- */
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
            --border-color: #f0f0f0;
            --shadow-grey: #cacaca; 
            --input-bg: #f0f2f5;
            
            /* Tag Colors */
            --bg-high: #ffecec; --text-high: #ff6b6b;
            --bg-med: #fff4e5; --text-med: #ff9f43;
            --bg-low: #f0f2f5; --text-low: #636e72;
            --bg-crit: #ffdede; --text-crit: #ff4757;
            
            --bg-new: #e3f2fd; --text-new: #2196f3;
            --bg-review: #fff3e0; --text-review: #ff9800;
            --bg-resolved: #e8f5e9; --text-resolved: #4caf50;
            --bg-esc: #ffebee; --text-esc: #f44336;
        }

        .admin-container {
            font-family: 'Nunito', sans-serif;
            background-color: #fcfcfc; 
            color: var(--text-dark);
            height: 100vh;
            display: flex;
            overflow: hidden; 
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
            height: 100vh;
            overflow-y: auto;
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
            background-color: var(--input-bg);
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

        .user-info h4 { font-size: 0.95rem; font-weight: 800; margin: 0; }
        .user-info p { font-size: 0.8rem; color: var(--text-grey); font-weight: 600; margin: 0; }

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

        .header-left {
            position: relative;
            padding-left: 100px;
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            min-height: 80px;
        }

        .mascot-head {
            position: absolute;
            left: 0;
            top: -15px;
            width: 90px;
            transform: rotate(-5deg); 
        }

        .header-left h1 {
            font-size: 2.2rem;
            font-weight: 900;
            color: var(--text-dark);
            line-height: 1.1;
            margin: 0;
        }
        .header-left p {
            color: var(--text-grey);
            font-weight: 600;
            margin-top: 5px;
            margin-bottom: 0;
        }

        .header-actions {
            display: flex;
            gap: 15px;
            align-items: center;
        }

        .btn-primary {
            background: var(--button-blue);
            border: none;
            padding: 12px 25px;
            border-radius: 30px;
            font-weight: 800;
            color: white;
            cursor: pointer;
            box-shadow: 4px 4px 0px var(--button-shadow-blue);
            transition: transform 0.1s;
            display: flex; align-items: center; gap: 8px;
            font-family: 'Nunito', sans-serif;
            font-size: 1rem;
        }
        .btn-primary:active { transform: translate(2px,2px); box-shadow: 2px 2px 0px var(--button-shadow-blue); }

        /* Top User (Top Right Corner) */
        .top-user-area {
            position: absolute;
            top: 20px;
            right: 60px;
            display: flex;
            align-items: center;
            gap: 12px;
            z-index: 10;
        }
        .top-user-text { 
            text-align: right; 
            display: flex; 
            flex-direction: column; 
            justify-content: center;
            line-height: 1.3; 
        }
        .top-user-text h4 { 
            font-size: 0.95rem; 
            font-weight: 800; 
            margin: 0; 
        }
        .top-user-text span { 
            font-size: 0.75rem; 
            color: var(--text-grey); 
            font-weight: 700; 
            display: block; 
        }
        .top-avatar {
            width: 45px; height: 45px;
            background: var(--text-dark);
            color: white;
            border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
            font-size: 1.2rem;
            position: relative;
        }
        .status-dot-top {
            width: 12px; height: 12px; background: var(--accent-green);
            border: 2px solid white; border-radius: 50%;
            position: absolute; top: 0; right: 0;
        }

        /* --- STATS ROW --- */
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 20px;
            margin-bottom: 30px;
        }
        .stat-box {
            background: white;
            border: 2px solid var(--border-color);
            border-radius: 16px;
            padding: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .stat-text span { font-size: 0.8rem; color: var(--text-grey); font-weight: 700; display: block; margin-bottom: 5px; }
        .stat-text h2 { font-size: 1.8rem; font-weight: 900; line-height: 1; margin: 0; }
        
        .stat-icon { 
            width: 45px; height: 45px; 
            border-radius: 50%; 
            background-color: var(--input-bg);
            color: var(--button-blue);
            display: flex; align-items: center; justify-content: center;
            font-size: 1.2rem;
        }

        /* --- DEPARTMENTS ROW --- */
        .section-title { font-size: 1.1rem; font-weight: 800; margin-bottom: 15px; margin-top: 0; }
        
        .dept-grid {
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            gap: 15px;
            margin-bottom: 40px;
        }
        .dept-card {
            background: white;
            border: 2px solid var(--border-color);
            border-radius: 16px;
            padding: 20px 15px;
            text-align: center;
            position: relative;
        }
        .alert-dot {
            position: absolute; top: 15px; right: 15px;
            width: 10px; height: 10px; background: var(--alert-red); border-radius: 50%;
        }
        .dept-icon {
            width: 50px; height: 50px; border-radius: 50%; 
            background: var(--input-bg); color: var(--text-dark);
            margin: 0 auto 10px auto;
            display: flex; align-items: center; justify-content: center;
            font-size: 1.3rem;
        }
        .dept-card h3 { font-size: 0.95rem; font-weight: 800; margin-bottom: 2px; margin-top: 0; }
        .status-tag { 
            display: inline-block; font-size: 0.65rem; font-weight: 800; 
            padding: 2px 8px; border-radius: 10px; margin-bottom: 15px;
        }
        .status-tag.healthy { background: #e6fffa; color: var(--accent-green); }
        
        .dept-metrics {
            display: flex;
            justify-content: space-around;
            border-top: 2px solid #f5f5f5;
            padding-top: 10px;
        }
        .metric-item { display: flex; flex-direction: column; align-items: center; }
        .metric-val { font-size: 1rem; font-weight: 800; }
        .metric-label { font-size: 0.6rem; color: var(--text-grey); font-weight: 700; margin-top: 2px; }

        /* --- REPORTS TABLE --- */
        .table-container {
            background: white;
            border: 2px solid var(--border-color);
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 5px 6px 0px 0px var(--shadow-grey);
        }
        table { width: 100%; border-collapse: collapse; }
        th { 
            background: #f4f4f4; text-align: left; padding: 15px 20px; 
            font-size: 0.85rem; font-weight: 700; color: var(--text-grey);
        }
        tbody tr { cursor: pointer; transition: background-color 0.2s; }
        tbody tr:hover { background-color: #f9f9f9; }

        td { 
            padding: 15px 20px; border-bottom: 1px solid #f0f0f0; 
            font-size: 0.9rem; font-weight: 700; vertical-align: middle;
        }
        tr:last-child td { border-bottom: none; }
        
        .badge { padding: 5px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 800; display: inline-block; }
        
        .sev-high { background: var(--bg-high); color: var(--text-high); }
        .sev-med { background: var(--bg-med); color: var(--text-med); }
        .sev-low { background: var(--bg-low); color: var(--text-low); }
        .sev-crit { background: var(--bg-crit); color: var(--text-crit); }

        .status-badge-table { 
            padding: 4px 10px; border-radius: 15px; font-size: 0.75rem; font-weight: 800;
            display: inline-flex; align-items: center; gap: 5px;
            border: 1px solid transparent; background: transparent;
        }
        .status-badge-table::before { content: ""; width: 8px; height: 8px; border-radius: 50%; display: block; border: 1px solid currentColor; }
        
        .st-new { color: var(--text-new); background: var(--bg-new); }
        .st-review { color: var(--text-review); background: var(--bg-review); }
        .st-resolved { color: var(--text-resolved); background: var(--bg-resolved); }
        .st-esc { color: var(--text-esc); background: var(--bg-esc); }

        .action-icon { color: var(--text-grey); }

        /* --- MODALS --- */
        .modal-overlay {
            position: fixed;
            top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 1000;
            justify-content: center; align-items: center;
            padding: 20px;
            display: flex;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.2s;
        }
        .modal-overlay.active { opacity: 1; visibility: visible; }

        .modal-container {
            background: var(--white);
            width: 100%; max-width: 650px;
            border-radius: 24px;
            padding: 30px;
            position: relative;
            max-height: 90vh; overflow-y: auto;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            transform: translateY(20px);
            transition: transform 0.3s;
        }
        .modal-overlay.active .modal-container { transform: translateY(0); }

        .close-modal-btn {
            position: absolute; top: 25px; right: 25px;
            background: none; border: none; font-size: 1.5rem; color: var(--text-grey); cursor: pointer;
        }
        .modal-title { font-size: 1.5rem; font-weight: 900; margin: 0 0 25px 0; }

        /* Form Styles */
        .form-label { display: block; font-size: 0.9rem; font-weight: 700; margin-bottom: 8px; }
        .form-input, .form-select, .form-textarea {
            width: 100%; padding: 12px 15px; border-radius: 12px;
            border: 1px solid var(--border-color); background: var(--input-bg);
            font-family: 'Nunito', sans-serif; font-weight: 600; outline: none;
            margin-bottom: 20px;
            font-size: 0.95rem;
        }
        .form-textarea { resize: vertical; height: 100px; }

        .modal-actions { display: flex; justify-content: flex-end; gap: 15px; margin-top: 10px; }
        
        .btn-cancel { 
            background: var(--white); 
            border: 2px solid #ddd; 
            color: var(--text-grey); 
            box-shadow: 4px 4px 0px var(--button-shadow-grey);
        }
        .btn-cancel:active {
            transform: translate(2px, 2px);
            box-shadow: 2px 2px 0px var(--button-shadow-grey);
        }

        /* Report Details */
        .report-details-grid {
            display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-bottom: 25px;
        }
        .detail-box { background: var(--input-bg); padding: 15px; border-radius: 12px; }
        .detail-label { font-size: 0.75rem; color: var(--text-grey); font-weight: 700; margin-bottom: 5px; display: block;}
        .detail-value { font-size: 0.95rem; font-weight: 800; }

        .auto-flag-banner {
            background: var(--bg-high); color: var(--text-high);
            padding: 15px; border-radius: 12px; display: flex; align-items: center; gap: 15px;
            margin-bottom: 25px; font-weight: 700; font-size: 0.9rem;
        }

        /* Responsive */
        @media (max-width: 1200px) {
            .dept-grid { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 992px) {
             .stats-grid { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 768px) {
            .admin-container { flex-direction: column; height: auto; overflow: auto;}
            .sidebar { width: 100%; height: auto; border-right: none; border-bottom: 2px solid #eee; }
            .top-user-area { display: none; } 
            .dept-grid { grid-template-columns: 1fr; }
            .table-container { overflow-x: auto; }
            .header-left { padding-left: 0; }
            .mascot-head { display: none; }
            .report-details-grid { grid-template-columns: 1fr 1fr; }
        }
      `}</style>

      <div className="admin-container">
        
        {/* SIDEBAR */}
        <aside className="sidebar">
            <img src="ui/logo.png" alt="SafeShift" className="logo" />

            <ul className="nav-menu">
                <li className="nav-item">
                    <a className="nav-link active">
                        <i className="fa-solid fa-gauge-high"></i>
                        Dashboard
                    </a>
                </li>
                <li className="nav-item">
                    <a className="nav-link">
                        <i className="fa-solid fa-file-lines"></i>
                        All Reports
                    </a>
                </li>
                <li className="nav-item">
                    <a className="nav-link">
                        <i className="fa-solid fa-users"></i>
                        Employees
                    </a>
                </li>
                <li className="nav-item">
                    <a className="nav-link">
                        <i className="fa-solid fa-clock-rotate-left"></i>
                        Activity Logs
                    </a>
                </li>
                <li className="nav-item">
                    <a href="#" className="nav-link">
                        <i className="fa-solid fa-gear"></i>
                        Settings
                    </a>
                </li>
            </ul>

            <div className="user-profile-mini">
                <div className="user-avatar-circle">
                    <i className="fa-solid fa-user-shield"></i>
                </div>
                <div className="user-info">
                    <h4>Admin</h4>
                    <p>Engineering</p>
                </div>
            </div>
            
            <button className="logout-link" onClick={onLogout}>
                <i className="fa-solid fa-arrow-right-from-bracket"></i> Log out
            </button>
        </aside>

        {/* MAIN CONTENT */}
        <main className="main-content">
            
            <div className="top-user-area">
                <div className="top-user-text">
                    <h4>Admin</h4>
                    <span>Engineering</span>
                </div>
                <div className="top-avatar">
                    <i className="fa-solid fa-user"></i>
                    <div className="status-dot-top"></div>
                </div>
            </div>

            <header className="header-section">
                <div className="header-left">
                    <img src="ui/fox.png" className="mascot-head" alt="Mascot" />
                    <h1>Admin Dashboard</h1>
                    <p>Overview of organizational health and reports</p>
                </div>
                
                <div className="header-actions">
                    <button className="btn-primary" onClick={openAddEmployee}>
                        <i className="fa-solid fa-plus"></i> Add Employee
                    </button>
                </div>
            </header>

            <section className="stats-grid">
                <div className="stat-box">
                    <div className="stat-text">
                        <span>Total Employees</span>
                        <h2>60</h2>
                    </div>
                    <div className="stat-icon">
                        <i className="fa-solid fa-users"></i>
                    </div>
                </div>
                <div className="stat-box">
                    <div className="stat-text">
                        <span>Active Reports</span>
                        <h2>4</h2>
                    </div>
                    <div className="stat-icon">
                        <i className="fa-solid fa-file-contract"></i>
                    </div>
                </div>
                <div className="stat-box">
                    <div className="stat-text">
                        <span>Flagged Items</span>
                        <h2>7</h2>
                    </div>
                    <div className="stat-icon">
                        <i className="fa-regular fa-flag"></i>
                    </div>
                </div>
                <div className="stat-box">
                    <div className="stat-text">
                        <span>Avg Wellness</span>
                        <h2>68%</h2>
                    </div>
                    <div className="stat-icon">
                        <i className="fa-solid fa-heart-pulse"></i>
                    </div>
                </div>
            </section>

            <h3 className="section-title">Departments</h3>
            <section className="dept-grid">
                {/* DEPT 1 */}
                <div className="dept-card">
                    <div className="dept-icon"><i className="fa-solid fa-gears"></i></div>
                    <h3>Engineering</h3>
                    <span className="status-tag healthy"><i className="fa-solid fa-chart-line"></i> Healthy</span>
                    <div className="dept-metrics">
                        <div className="metric-item"><span className="metric-val">12</span><span className="metric-label">Employees</span></div>
                        <div className="metric-item"><span className="metric-val">3</span><span className="metric-label">Active Reports</span></div>
                        <div className="metric-item" style={{color:'var(--accent-green)'}}><span className="metric-val">72</span><span className="metric-label">Wellness</span></div>
                    </div>
                </div>
                {/* DEPT 2 */}
                <div className="dept-card">
                    <div className="alert-dot"></div>
                    <div className="dept-icon"><i className="fa-solid fa-bullhorn"></i></div>
                    <h3>Marketing</h3>
                    <span className="status-tag healthy"><i className="fa-solid fa-chart-line"></i> Healthy</span>
                    <div className="dept-metrics">
                        <div className="metric-item"><span className="metric-val">8</span><span className="metric-label">Employees</span></div>
                        <div className="metric-item" style={{color:'var(--alert-red)'}}><span className="metric-val">5</span><span className="metric-label">Active Reports</span></div>
                        <div className="metric-item" style={{color:'var(--alert-red)'}}><span className="metric-val">28</span><span className="metric-label">Wellness</span></div>
                    </div>
                </div>
                {/* DEPT 3 */}
                <div className="dept-card">
                    <div className="dept-icon"><i className="fa-solid fa-handshake-simple"></i></div>
                    <h3>Sales</h3>
                    <span className="status-tag healthy"><i className="fa-solid fa-chart-line"></i> Healthy</span>
                    <div className="dept-metrics">
                        <div className="metric-item"><span className="metric-val">15</span><span className="metric-label">Employees</span></div>
                        <div className="metric-item"><span className="metric-val">0</span><span className="metric-label">Active Reports</span></div>
                        <div className="metric-item" style={{color:'var(--accent-green)'}}><span className="metric-val">85</span><span className="metric-label">Wellness</span></div>
                    </div>
                </div>
                {/* DEPT 4 */}
                <div className="dept-card">
                    <div className="dept-icon"><i className="fa-solid fa-user-group"></i></div>
                    <h3>Human Resources</h3>
                    <span className="status-tag healthy"><i className="fa-solid fa-chart-line"></i> Healthy</span>
                    <div className="dept-metrics">
                        <div className="metric-item"><span className="metric-val">6</span><span className="metric-label">Employees</span></div>
                        <div className="metric-item"><span className="metric-val">1</span><span className="metric-label">Active Reports</span></div>
                        <div className="metric-item" style={{color:'var(--accent-green)'}}><span className="metric-val">90</span><span className="metric-label">Wellness</span></div>
                    </div>
                </div>
                {/* DEPT 5 */}
                <div className="dept-card">
                    <div className="dept-icon"><i className="fa-solid fa-truck-fast"></i></div>
                    <h3>Operation</h3>
                    <span className="status-tag healthy"><i className="fa-solid fa-chart-line"></i> Healthy</span>
                    <div className="dept-metrics">
                        <div className="metric-item"><span className="metric-val">10</span><span className="metric-label">Employees</span></div>
                        <div className="metric-item"><span className="metric-val">2</span><span className="metric-label">Active Reports</span></div>
                        <div className="metric-item" style={{color:'#f39c12'}}><span className="metric-val">65</span><span className="metric-label">Wellness</span></div>
                    </div>
                </div>
            </section>

            <h3 className="section-title">All Reports</h3>
            <section className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Report ID</th>
                            <th>Type</th>
                            <th>Department</th>
                            <th>Severity</th>
                            <th>Status</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr onClick={openReportDetails}>
                            <td>#2410746</td>
                            <td>Harassment</td>
                            <td>Marketing</td>
                            <td><span className="badge sev-high">High</span></td>
                            <td><span className="status-badge-table st-new">New</span></td>
                            <td>Nov 29, 05:53 PM</td>
                            <td><i className="fa-regular fa-eye action-icon"></i></td>
                        </tr>
                        <tr>
                            <td>#2410747</td>
                            <td>Safety</td>
                            <td>Engineering</td>
                            <td><span className="badge sev-med">Medium</span></td>
                            <td><span className="status-badge-table st-review">Review</span></td>
                            <td>Nov 29, 05:00 PM</td>
                            <td><i className="fa-regular fa-eye action-icon"></i></td>
                        </tr>
                        <tr>
                            <td>#2410748</td>
                            <td>Policy</td>
                            <td>Sales</td>
                            <td><span className="badge sev-low">Low</span></td>
                            <td><span className="status-badge-table st-resolved">Resolved</span></td>
                            <td>Nov 28, 10:30 AM</td>
                            <td><i className="fa-regular fa-eye action-icon"></i></td>
                        </tr>
                    </tbody>
                </table>
            </section>

        </main>

        {/* --- MODAL: ADD EMPLOYEE --- */}
        <div className={`modal-overlay ${isAddEmployeeOpen ? 'active' : ''}`} onClick={closeAddEmployee}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                <button className="close-modal-btn" onClick={closeAddEmployee}><i className="fa-solid fa-times"></i></button>
                <h2 className="modal-title">Create New Employee Account</h2>
                
                <form>
                    <label className="form-label">Full Name</label>
                    <input type="text" className="form-input" placeholder="Enter full name" />

                    <label className="form-label">Email</label>
                    <input type="email" className="form-input" placeholder="Enter email address" />

                    <label className="form-label">Department</label>
                    <select className="form-select">
                        <option value="">Select department</option>
                        <option>Engineering</option>
                        <option>Marketing</option>
                        <option>Sales</option>
                        <option>HR</option>
                    </select>

                    <label className="form-label">Role</label>
                    <input type="text" className="form-input" placeholder="Enter role/position" />

                    <p style={{fontSize: '0.85rem', color: 'var(--text-grey)', marginBottom: '25px'}}>
                        A temporary password will be generated and sent to the employee's email.
                    </p>

                    <div className="modal-actions">
                        <button type="button" className="btn-primary btn-cancel" onClick={closeAddEmployee}>Cancel</button>
                        <button type="submit" className="btn-primary">Save Changes</button>
                    </div>
                </form>
            </div>
        </div>

        {/* --- MODAL: REPORT DETAILS --- */}
        <div className={`modal-overlay ${isReportDetailsOpen ? 'active' : ''}`} onClick={closeReportDetails}>
            <div className="modal-container" style={{maxWidth: '700px'}} onClick={(e) => e.stopPropagation()}>
                <button className="close-modal-btn" onClick={closeReportDetails}><i className="fa-solid fa-times"></i></button>
                <h2 className="modal-title">Report #2410746</h2>
                
                <div className="report-details-grid">
                    <div className="detail-box">
                        <span className="detail-label">Department</span>
                        <span className="detail-value">Marketing</span>
                    </div>
                    <div className="detail-box">
                        <span className="detail-label">Severity</span>
                        <span className="badge sev-high">High</span>
                    </div>
                     <div className="detail-box">
                        <span className="detail-label">Reporter</span>
                        <span className="detail-value">Anonymous</span>
                    </div>
                     <div className="detail-box">
                        <span className="detail-label">Submitted</span>
                        <span className="detail-value" style={{fontSize:'0.8rem'}}>Nov 29, 05:53 PM</span>
                    </div>
                </div>

                <div className="auto-flag-banner">
                    <i className="fa-solid fa-triangle-exclamation"></i>
                    <div>
                        Auto-flagged: Multiple similar reports detected from this department in the past 7 days.
                    </div>
                </div>

                <label className="form-label">Description</label>
                <div style={{background: 'var(--input-bg)', padding: '15px', borderRadius: '12px', marginBottom: '20px', fontSize: '0.95rem', lineHeight: '1.5'}}>
                    I have witnessed repeated inappropriate comments from a team lead directed at junior team members during meetings. This has created an uncomfortable work environment for several colleagues.
                </div>

                <label className="form-label">Update Status</label>
                <select className="form-select">
                    <option>New</option>
                    <option>Under Review</option>
                    <option>Escalated</option>
                    <option>Resolved</option>
                </select>

                <label className="form-label">Admin Notes (Internal)</label>
                <textarea className="form-textarea" placeholder="Add notes about this report..."></textarea>

                <div className="modal-actions">
                    <button type="button" className="btn-primary btn-cancel" onClick={closeReportDetails}>Cancel</button>
                    <button type="button" className="btn-primary">Save Changes</button>
                </div>
            </div>
        </div>

      </div>
    </>
  );
}