import React, { useState } from 'react';

export default function ActivityLogs({ onLogout }) {
  // --- STATE ---
  const [activeFilter, setActiveFilter] = useState('all');

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
            --border-color: #e0e0e0;
            --shadow-grey: #cacaca; 
            --input-bg: #f0f2f5;
            
            /* Action Badge Colors */
            --bg-status: #e3f2fd; --text-status: #2196f3;
            --bg-report: #fff3e0; --text-report: #ff9800;
            --bg-login: #e8eaf6; --text-login: #3f51b5;
            --bg-create: #e8f5e9; --text-create: #4caf50;
            --bg-role: #f3e5f5; --text-role: #9c27b0;
        }

        .activity-container {
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

        .logo { width: 160px; margin-bottom: 60px; }

        .nav-menu { list-style: none; padding: 0; margin: 0; flex-grow: 1; }
        .nav-item { margin-bottom: 12px; }

        .nav-link {
            display: flex; align-items: center; gap: 15px;
            text-decoration: none; color: var(--text-grey);
            font-weight: 700; font-size: 1.05rem;
            padding: 12px 15px; border-radius: 12px;
            transition: all 0.2s ease; cursor: pointer;
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

        /* --- MAIN CONTENT --- */
        .main-content {
            flex-grow: 1; padding: 40px 60px; overflow-y: auto; position: relative;
        }

        /* Top User Area */
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

        /* Header */
        .header-section {
            display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 30px;
        }
        .header-left {
            position: relative; padding-left: 100px; display: flex; flex-direction: column; justify-content: flex-end; min-height: 80px;
        }
        .mascot-head {
            position: absolute; left: 0; top: -15px; width: 90px; transform: rotate(-5deg);
        }
        .header-left h1 {
            font-size: 2.2rem; font-weight: 900; color: var(--text-dark); line-height: 1.1; margin: 0;
        }
        .header-left p { color: var(--text-grey); font-weight: 600; margin-top: 5px; margin-bottom: 0; }

        .header-actions {
            display: flex; gap: 15px; align-items: center;
        }
        
        .btn-outline {
            background: white; border: 2px solid #ddd; padding: 10px 20px;
            border-radius: 30px; font-weight: 700; color: var(--text-grey);
            cursor: pointer; display: flex; align-items: center; gap: 8px; transition: all 0.2s;
            font-family: 'Nunito', sans-serif; font-size: 0.9rem;
        }
        .btn-outline:hover { border-color: var(--button-blue); color: var(--button-blue); }

        /* --- FILTERS & SEARCH --- */
        .log-controls {
            display: flex; gap: 20px; margin-bottom: 30px; align-items: center;
        }
        .search-container { flex-grow: 1; position: relative; }
        .search-input {
            width: 100%; padding: 12px 15px 12px 45px;
            border-radius: 12px; border: 2px solid var(--border-color);
            background: white; font-family: 'Nunito', sans-serif; font-weight: 600;
            outline: none; transition: border-color 0.2s; font-size: 0.95rem;
        }
        .search-input:focus { border-color: var(--button-blue); }
        .search-icon {
            position: absolute; left: 15px; top: 50%; transform: translateY(-50%); color: var(--text-grey);
        }
        
        .filter-btn {
            background: white; border: 2px solid var(--border-color);
            border-radius: 12px; padding: 10px 20px;
            font-family: 'Nunito', sans-serif; font-weight: 700; font-size: 0.9rem;
            color: var(--text-dark); cursor: pointer; display: flex; align-items: center; gap: 8px;
            transition: all 0.2s;
        }
        .filter-btn:hover { border-color: var(--button-blue); color: var(--button-blue); }

        /* --- ACTIVITY FEED --- */
        .feed-container {
            display: flex; flex-direction: column; gap: 20px; padding-bottom: 40px;
        }

        .log-entry {
            background: white; border: 2px solid var(--border-color);
            border-radius: 16px; padding: 20px;
            display: flex; gap: 20px; align-items: flex-start;
            transition: transform 0.2s;
            box-shadow: 5px 6px 0px 0px var(--shadow-grey);
        }
        .log-entry:hover { transform: translateX(5px); border-color: #d1d1d1; }

        .log-icon-circle {
            width: 45px; height: 45px; border-radius: 50%;
            border: 2px solid var(--text-grey); display: flex; align-items: center; justify-content: center;
            font-size: 1.2rem; color: var(--text-grey); flex-shrink: 0;
        }

        .log-content { flex-grow: 1; }
        
        .log-header {
            display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;
        }
        
        .badges-row { display: flex; gap: 10px; align-items: center; margin-bottom: 5px; }
        
        .action-badge {
            padding: 4px 10px; border-radius: 8px; font-size: 0.7rem; font-weight: 800; text-transform: uppercase;
        }
        .ab-status { background: var(--bg-status); color: var(--text-status); }
        .ab-report { background: var(--bg-report); color: var(--text-report); }
        .ab-login { background: var(--bg-login); color: var(--text-login); }
        .ab-create { background: var(--bg-create); color: var(--text-create); }
        .ab-role { background: var(--bg-role); color: var(--text-role); }

        .role-badge {
            background: #eee; color: var(--text-grey); padding: 4px 8px; border-radius: 6px; font-size: 0.7rem; font-weight: 700;
        }

        .log-title { font-size: 1rem; font-weight: 700; color: var(--text-dark); line-height: 1.4; margin-bottom: 8px; }
        
        .log-meta {
            display: flex; gap: 15px; align-items: center; font-size: 0.8rem; color: var(--text-grey); font-weight: 600;
        }
        .meta-item { display: flex; align-items: center; gap: 6px; }
        .meta-icon { font-size: 0.9rem; }

        /* Mini Profile Avatar for Metadata */
        .meta-avatar {
            width: 24px; height: 24px; border-radius: 50%;
            color: white; font-weight: 700; font-size: 0.7rem;
            display: flex; align-items: center; justify-content: center;
            margin-right: 2px; flex-shrink: 0;
        }

        .log-time { font-size: 0.9rem; font-weight: 800; color: var(--text-grey); }

        @media (max-width: 768px) {
            .activity-container { flex-direction: column; height: auto; overflow: auto;}
            .sidebar { width: 100%; height: auto; border-right: none; border-bottom: 2px solid #eee; }
            .top-user-area { display: none; } 
            .log-controls { flex-direction: column; align-items: stretch; }
            .header-left { padding-left: 0; }
            .mascot-head { display: none; }
        }
      `}</style>

      <div className="activity-container">
        
        {/* SIDEBAR */}
        <aside className="sidebar">
            <img src="ui/logo.png" alt="SafeShift" className="logo" />
            <ul className="nav-menu">
                <li className="nav-item"><a href="dashboard.html" className="nav-link"><i className="fa-solid fa-gauge-high"></i>Dashboard</a></li>
                <li className="nav-item"><a href="all_reports.html" className="nav-link"><i className="fa-solid fa-file-lines"></i>All Reports</a></li>
                <li className="nav-item"><a href="employees.html" className="nav-link"><i className="fa-solid fa-users"></i>Employees</a></li>
                <li className="nav-item"><a href="#" className="nav-link active"><i className="fa-solid fa-clock-rotate-left"></i>Activity Logs</a></li>
                <li className="nav-item"><a href="settings.html" className="nav-link"><i className="fa-solid fa-gear"></i>Settings</a></li>
            </ul>
            <div className="user-profile-mini">
                <div className="user-avatar-circle">AD</div>
                <div className="user-info"><h4>Admin</h4><p>Engineering</p></div>
            </div>
            <button className="logout-link" onClick={onLogout}><i className="fa-solid fa-arrow-right-from-bracket"></i> Log out</button>
        </aside>

        {/* MAIN CONTENT */}
        <main className="main-content">
            
            <div className="top-user-area">
                <div className="top-user-text"><h4>Admin</h4><span>Engineering</span></div>
                <div className="top-avatar">AD<div className="status-dot-top"></div></div>
            </div>

            <header className="header-section">
                <div className="header-left">
                    <img src="ui/fox.png" className="mascot-head" alt="Mascot" />
                    <h1>Activity Logs</h1>
                    <p>Chronological feed of all system activities</p>
                </div>
                
                <div className="header-actions">
                    <button className="btn-outline">
                        <i className="fa-solid fa-download"></i> Export
                    </button>
                </div>
            </header>

            <div className="log-controls">
                <div className="search-container">
                    <i className="fa-solid fa-magnifying-glass search-icon"></i>
                    <input type="text" className="search-input" placeholder="Search logs..." />
                </div>
                <button className="filter-btn">
                    <i className="fa-solid fa-filter"></i> Filter
                </button>
            </div>

            <div className="feed-container">
                
                {/* Log 1 */}
                <div className="log-entry">
                    <div className="log-icon-circle"><i className="fa-solid fa-pen-to-square"></i></div>
                    <div className="log-content">
                        <div className="log-header">
                            <div className="badges-row">
                                <span className="action-badge ab-status">Status Changed</span>
                                <span className="role-badge">Admin</span>
                            </div>
                            <span className="log-time">19:38</span>
                        </div>
                        <div className="log-title">
                            Changed report <strong>#REP-1847</strong> status from "New" to "Under Review"
                        </div>
                        <div className="log-meta">
                            <div className="meta-item">
                                <div className="meta-avatar" style={{backgroundColor: '#64a6ff'}}>SC</div> 
                                Sarah Chen
                            </div>
                            <div className="meta-item"><i className="fa-regular fa-clock meta-icon"></i> 3h ago</div>
                        </div>
                    </div>
                </div>

                {/* Log 2 */}
                <div className="log-entry">
                    <div className="log-icon-circle"><i className="fa-solid fa-file-arrow-up"></i></div>
                    <div className="log-content">
                        <div className="log-header">
                            <div className="badges-row">
                                <span className="action-badge ab-report">Report Submitted</span>
                                <span className="role-badge">Employee</span>
                            </div>
                            <span className="log-time">17:53</span>
                        </div>
                        <div className="log-title">
                            New harassment report submitted - Department: Marketing
                        </div>
                        <div className="log-meta">
                            <div className="meta-item">
                                <div className="meta-avatar" style={{backgroundColor: '#bdc3c7'}}><i className="fa-solid fa-user" style={{fontSize:'0.6rem'}}></i></div> 
                                Anonymous
                            </div>
                            <div className="meta-item"><i className="fa-regular fa-clock meta-icon"></i> 4h ago</div>
                        </div>
                    </div>
                </div>

                {/* Log 3 */}
                <div className="log-entry">
                    <div className="log-icon-circle"><i className="fa-solid fa-right-to-bracket"></i></div>
                    <div className="log-content">
                        <div className="log-header">
                            <div className="badges-row">
                                <span className="action-badge ab-login">Log In</span>
                                <span className="role-badge">Admin</span>
                            </div>
                            <span className="log-time">16:53</span>
                        </div>
                        <div className="log-title">
                            Admin login from IP 192.168.1.45
                        </div>
                        <div className="log-meta">
                            <div className="meta-item">
                                <div className="meta-avatar" style={{backgroundColor: '#64a6ff'}}>SC</div> 
                                Sarah Chen
                            </div>
                            <div className="meta-item"><i className="fa-regular fa-clock meta-icon"></i> 5h ago</div>
                        </div>
                    </div>
                </div>

                {/* Log 4 */}
                <div className="log-entry">
                    <div className="log-icon-circle"><i className="fa-solid fa-user-plus"></i></div>
                    <div className="log-content">
                        <div className="log-header">
                            <div className="badges-row">
                                <span className="action-badge ab-create">Account Created</span>
                                <span className="role-badge">Admin</span>
                            </div>
                            <span className="log-time">14:20</span>
                        </div>
                        <div className="log-title">
                            Created new employee account for Emily Watson (Engineering)
                        </div>
                        <div className="log-meta">
                            <div className="meta-item">
                                <div className="meta-avatar" style={{backgroundColor: '#64a6ff'}}>SC</div> 
                                Sarah Chen
                            </div>
                            <div className="meta-item"><i className="fa-regular fa-clock meta-icon"></i> 8h ago</div>
                        </div>
                    </div>
                </div>

                {/* Log 5 */}
                <div className="log-entry">
                    <div className="log-icon-circle"><i className="fa-solid fa-shield-halved"></i></div>
                    <div className="log-content">
                        <div className="log-header">
                            <div className="badges-row">
                                <span className="action-badge ab-role">Role Updated</span>
                                <span className="role-badge">Admin</span>
                            </div>
                            <span className="log-time">11:15</span>
                        </div>
                        <div className="log-title">
                            Updated permissions for role "Team Lead"
                        </div>
                        <div className="log-meta">
                            <div className="meta-item">
                                <div className="meta-avatar" style={{backgroundColor: '#9b59b6'}}>SA</div> 
                                System Admin
                            </div>
                            <div className="meta-item"><i className="fa-regular fa-clock meta-icon"></i> 1d ago</div>
                        </div>
                    </div>
                </div>

            </div>

        </main>

      </div>
    </>
  );
}