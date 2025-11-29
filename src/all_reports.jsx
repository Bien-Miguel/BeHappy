import React, { useState, useEffect } from 'react';

export default function AllReports({ onLogout }) {
  // --- STATE ---
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);
  const [isReportDetailsOpen, setIsReportDetailsOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [bulkActionOpen, setBulkActionOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');

  // Dummy Data for Reports (Simulating HTML table rows)
  const reportsData = [
    { id: '2410746', type: 'Harassment', dept: 'Marketing', severity: 'High', status: 'New', date: 'Nov 29, 05:53 PM' },
    { id: '2410747', type: 'Safety', dept: 'Engineering', severity: 'Medium', status: 'Review', date: 'Nov 29, 05:00 PM' },
    { id: '2410748', type: 'Policy', dept: 'Sales', severity: 'Low', status: 'Resolved', date: 'Nov 28, 10:30 AM' },
    { id: '2410749', type: 'Harassment', dept: 'Marketing', severity: 'Critical', status: 'Escalated', date: 'Nov 28, 09:15 AM' },
    { id: '2410750', type: 'Discrimination', dept: 'Operation', severity: 'High', status: 'Review', date: 'Nov 27, 04:20 PM' },
  ];

  // --- HANDLERS ---
  const toggleSelect = (id) => {
    setSelectedRows(prev => {
      if (prev.includes(id)) {
        return prev.filter(rowId => rowId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  // Show bulk bar if items are selected
  useEffect(() => {
    setBulkActionOpen(selectedRows.length > 0);
  }, [selectedRows]);

  const handleBulkApply = () => {
    alert(`Applied changes to ${selectedRows.length} items!`);
    setSelectedRows([]); // Reset
  };

  const handleBulkCancel = () => {
    setSelectedRows([]);
  };

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
            
            /* Status Colors */
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
            justify-content: center; font-size: 1.1rem;
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
            font-size: 1.2rem; position: relative;
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

        /* --- FILTER BUTTONS ROW --- */
        .filters-container {
            display: flex; gap: 12px; margin-bottom: 15px; flex-wrap: wrap;
        }
        .filter-btn {
            background: white; border: 2px solid var(--border-color);
            border-radius: 12px; padding: 8px 16px;
            font-family: 'Nunito', sans-serif; font-weight: 700; font-size: 0.85rem;
            color: var(--text-dark); cursor: pointer; display: flex; align-items: center; gap: 8px;
            transition: all 0.2s;
        }
        .filter-btn:hover { border-color: var(--button-blue); }
        .filter-btn.active { background: var(--button-blue); border-color: var(--button-blue); color: white; }
        
        .count-badge {
            background: #eee; color: var(--text-dark); border-radius: 6px; padding: 2px 6px; font-size: 0.75rem;
        }
        .filter-btn.active .count-badge { background: rgba(255,255,255,0.3); color: white; }

        /* --- SEARCH BAR --- */
        .search-container { margin-bottom: 25px; position: relative; }
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

        /* --- BULK ACTIONS BAR --- */
        .bulk-actions-bar {
            display: flex; /* Managed by React conditional rendering */
            background: #e3f2fd;
            border: 2px solid #bbdefb;
            border-radius: 12px;
            padding: 10px 20px;
            margin-bottom: 15px;
            align-items: center;
            gap: 20px;
            animation: fadeIn 0.2s ease;
        }
        .bulk-text { font-weight: 800; font-size: 0.9rem; color: var(--text-dark); }
        .bulk-select {
            padding: 6px 12px; border-radius: 8px; border: 1px solid #90caf9;
            font-family: 'Nunito', sans-serif; font-weight: 600; outline: none;
        }
        .bulk-apply-btn {
            background: white; border: 1px solid #90caf9; padding: 6px 15px;
            border-radius: 8px; font-weight: 700; cursor: pointer; font-size: 0.85rem;
            color: var(--button-blue); transition: all 0.2s;
        }
        .bulk-apply-btn:hover { background: var(--button-blue); color: white; }
        .bulk-cancel {
            font-weight: 700; font-size: 0.85rem; color: var(--text-grey); 
            cursor: pointer; text-decoration: none;
        }

        /* --- TABLE STYLES --- */
        .table-container {
            background: white; border: 2px solid var(--border-color);
            border-radius: 16px; overflow: hidden; box-shadow: 5px 6px 0px 0px var(--shadow-grey);
            margin-bottom: 20px;
        }
        table { width: 100%; border-collapse: collapse; }
        th { 
            background: #fcfcfc; text-align: left; padding: 15px 20px; 
            font-size: 0.85rem; font-weight: 700; color: var(--text-grey);
            border-bottom: 2px solid #f0f0f0; cursor: pointer;
        }
        th:hover { color: var(--text-dark); }
        
        td { 
            padding: 15px 20px; border-bottom: 1px solid #f0f0f0; 
            font-size: 0.9rem; font-weight: 700; vertical-align: middle;
        }
        tbody tr { transition: background-color 0.2s; }
        tbody tr:hover { background-color: #f9f9f9; }
        tbody tr.selected { background-color: #f0f9ff; } 

        /* Selection Circle */
        .select-circle {
            width: 20px; height: 20px; border-radius: 50%;
            border: 2px solid var(--text-grey); cursor: pointer;
            display: inline-block; position: relative;
        }
        .select-circle.selected {
            background-color: var(--button-blue); border-color: var(--button-blue);
        }
        .select-circle.selected::after {
            content: '\\f00c'; font-family: "Font Awesome 6 Free"; font-weight: 900;
            color: white; font-size: 10px; position: absolute;
            top: 50%; left: 50%; transform: translate(-50%, -50%);
        }

        /* Badges */
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

        .action-icon { color: var(--text-grey); cursor: pointer; }
        .action-icon:hover { color: var(--text-dark); }

        /* Pagination */
        .pagination { display: flex; justify-content: flex-end; align-items: center; gap: 5px; margin-bottom: 40px; }
        .page-btn {
            width: 35px; height: 35px; border-radius: 8px; border: 2px solid transparent;
            background: white; font-weight: 700; color: var(--text-grey);
            cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s;
        }
        .page-btn:hover { border-color: var(--border-color); color: var(--button-blue); }
        .page-btn.active { background-color: var(--button-blue); color: white; box-shadow: 2px 2px 0px var(--button-shadow-blue); }

        /* --- MODALS --- */
        .modal-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0, 0, 0, 0.5); z-index: 1000; justify-content: center; align-items: center; padding: 20px;
            display: flex; opacity: 0; visibility: hidden; transition: opacity 0.2s;
        }
        .modal-overlay.active { opacity: 1; visibility: visible; }

        .modal-container {
            background: var(--white); width: 100%; max-width: 650px; border-radius: 24px;
            padding: 30px; position: relative; max-height: 90vh; overflow-y: auto;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1); transform: translateY(20px); transition: transform 0.3s;
        }
        .modal-overlay.active .modal-container { transform: translateY(0); }

        .close-modal-btn {
            position: absolute; top: 25px; right: 25px; background: none; border: none; font-size: 1.5rem; color: var(--text-grey); cursor: pointer;
        }
        .modal-title { font-size: 1.5rem; font-weight: 900; margin: 0 0 25px 0; }

        /* Form Styles */
        .form-label { display: block; font-size: 0.9rem; font-weight: 700; margin-bottom: 8px; }
        .form-input, .form-select, .form-textarea {
            width: 100%; padding: 12px 15px; border-radius: 12px; border: 1px solid var(--border-color); background: var(--input-bg);
            font-family: 'Nunito', sans-serif; font-weight: 600; outline: none; margin-bottom: 20px; font-size: 0.95rem;
        }
        .form-textarea { resize: vertical; height: 100px; }
        .modal-actions { display: flex; justify-content: flex-end; gap: 15px; margin-top: 10px; }
        
        .btn-primary {
            background: var(--button-blue); border: none; padding: 12px 25px; border-radius: 30px;
            font-weight: 800; color: white; cursor: pointer; box-shadow: 4px 4px 0px var(--button-shadow-blue);
            transition: transform 0.1s;
        }
        .btn-primary:active { transform: translate(2px,2px); box-shadow: 2px 2px 0px var(--button-shadow-blue); }
        .btn-cancel { 
            background: var(--white); border: 2px solid #ddd; color: var(--text-grey); 
            box-shadow: 4px 4px 0px var(--button-shadow-grey); padding: 12px 25px; border-radius: 30px; font-weight: 800; cursor: pointer;
        }
        .btn-cancel:active { transform: translate(2px, 2px); box-shadow: 2px 2px 0px var(--button-shadow-grey); }

        .report-details-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-bottom: 25px; }
        .detail-box { background: var(--input-bg); padding: 15px; border-radius: 12px; }
        .detail-label { font-size: 0.75rem; color: var(--text-grey); font-weight: 700; margin-bottom: 5px; display: block;}
        .detail-value { font-size: 0.95rem; font-weight: 800; }
        .auto-flag-banner {
            background: var(--bg-high); color: var(--text-high); padding: 15px; border-radius: 12px; 
            display: flex; align-items: center; gap: 15px; margin-bottom: 25px; font-weight: 700; font-size: 0.9rem;
        }

        @media (max-width: 768px) {
            .admin-container { flex-direction: column; height: auto; overflow: auto;}
            .sidebar { width: 100%; height: auto; border-right: none; border-bottom: 2px solid #eee; }
            .top-user-area { display: none; } 
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
                <li className="nav-item"><a href="dashboard.html" className="nav-link"><i className="fa-solid fa-gauge-high"></i>Dashboard</a></li>
                <li className="nav-item"><a href="#" className="nav-link active"><i className="fa-solid fa-file-lines"></i>All Reports</a></li>
                <li className="nav-item"><a href="#" className="nav-link"><i className="fa-solid fa-users"></i>Employees</a></li>
                <li className="nav-item"><a href="#" className="nav-link"><i className="fa-solid fa-clock-rotate-left"></i>Activity Logs</a></li>
                <li className="nav-item"><a href="settings.html" className="nav-link"><i className="fa-solid fa-gear"></i>Settings</a></li>
            </ul>

            <div className="user-profile-mini">
                <div className="user-avatar-circle"><i className="fa-solid fa-user-shield"></i></div>
                <div className="user-info"><h4>Admin</h4><p>Engineering</p></div>
            </div>
            
            <button className="logout-link" onClick={onLogout}><i className="fa-solid fa-arrow-right-from-bracket"></i> Log out</button>
        </aside>

        {/* MAIN CONTENT */}
        <main className="main-content">
            
            <div className="top-user-area">
                <div className="top-user-text"><h4>Admin</h4><span>Engineering</span></div>
                <div className="top-avatar"><i className="fa-solid fa-user"></i><div class="status-dot-top"></div></div>
            </div>

            <header className="header-section">
                <div className="header-left">
                    <img src="ui/fox.png" className="mascot-head" alt="Mascot" />
                    <h1>All Reports</h1>
                    <p>Manage and review all submitted reports across departments</p>
                </div>
            </header>

            <div className="filters-container">
                <button 
                  className={`filter-btn ${activeFilter === 'All' ? 'active' : ''}`} 
                  onClick={() => setActiveFilter('All')}>
                  All
                </button>
                <button 
                  className={`filter-btn ${activeFilter === 'Engineering' ? 'active' : ''}`}
                  onClick={() => setActiveFilter('Engineering')}>
                  Engineering <span className="count-badge">2</span>
                </button>
                <button 
                  className={`filter-btn ${activeFilter === 'Marketing' ? 'active' : ''}`}
                  onClick={() => setActiveFilter('Marketing')}>
                  Marketing <span className="count-badge">2</span>
                </button>
                <button 
                  className={`filter-btn ${activeFilter === 'Sales' ? 'active' : ''}`}
                  onClick={() => setActiveFilter('Sales')}>
                  Sales <span className="count-badge">2</span>
                </button>
                <button 
                  className={`filter-btn ${activeFilter === 'Human Resources' ? 'active' : ''}`}
                  onClick={() => setActiveFilter('Human Resources')}>
                  Human Resources <span className="count-badge">1</span>
                </button>
                <button 
                  className={`filter-btn ${activeFilter === 'Operation' ? 'active' : ''}`}
                  onClick={() => setActiveFilter('Operation')}>
                  Operation <span className="count-badge">1</span>
                </button>
            </div>

            <div className="search-container">
                <i className="fa-solid fa-magnifying-glass search-icon"></i>
                <input type="text" className="search-input" placeholder="Search by ID or description..." />
            </div>

            {/* Bulk Actions */}
            {bulkActionOpen && (
                <div className="bulk-actions-bar active">
                    <span className="bulk-text">{selectedRows.length} Selected</span>
                    <select className="bulk-select">
                        <option>Change Status</option>
                        <option>Mark Resolved</option>
                        <option>Mark Under Review</option>
                        <option>Escalate</option>
                    </select>
                    <button className="bulk-apply-btn" onClick={handleBulkApply}>Apply</button>
                    <span className="bulk-cancel" onClick={handleBulkCancel}>Cancel</span>
                </div>
            )}

            <section className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th style={{width: '50px'}}></th> <th>ID</th>
                            <th>Type</th>
                            <th>Department</th>
                            <th>Severity</th>
                            <th>Status</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reportsData.map((report) => (
                            <tr 
                              key={report.id} 
                              className={`report-row ${selectedRows.includes(report.id) ? 'selected' : ''}`}
                              onClick={() => setIsReportDetailsOpen(true)}
                            >
                                <td onClick={(e) => { e.stopPropagation(); toggleSelect(report.id); }}>
                                    <div className={`select-circle ${selectedRows.includes(report.id) ? 'selected' : ''}`}></div>
                                </td>
                                <td>#{report.id}</td>
                                <td>{report.type}</td>
                                <td>{report.dept}</td>
                                <td>
                                    <span className={`badge sev-${report.severity.toLowerCase() === 'critical' ? 'crit' : report.severity.toLowerCase() === 'medium' ? 'med' : report.severity.toLowerCase()}`}>
                                        {report.severity}
                                    </span>
                                </td>
                                <td>
                                    <span className={`status-badge-table st-${report.status.toLowerCase().replace(' ', '') === 'underreview' ? 'review' : report.status.toLowerCase() === 'escalated' ? 'esc' : report.status.toLowerCase()}`}>
                                        {report.status}
                                    </span>
                                </td>
                                <td>{report.date}</td>
                                <td><i className="fa-regular fa-eye action-icon" onClick={(e) => { e.stopPropagation(); setIsReportDetailsOpen(true); }}></i></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>

            <div className="pagination">
                <button className="page-btn"><i className="fa-solid fa-chevron-left"></i></button>
                <button className="page-btn active">1</button>
                <button className="page-btn">2</button>
                <button className="page-btn">3</button>
                <button className="page-btn"><i className="fa-solid fa-chevron-right"></i></button>
            </div>
        </main>

        {/* --- MODAL: REPORT DETAILS --- */}
        <div className={`modal-overlay ${isReportDetailsOpen ? 'active' : ''}`} onClick={() => setIsReportDetailsOpen(false)}>
            <div className="modal-container" style={{maxWidth: '700px'}} onClick={(e) => e.stopPropagation()}>
                <button className="close-modal-btn" onClick={() => setIsReportDetailsOpen(false)}><i className="fa-solid fa-times"></i></button>
                <h2 className="modal-title">Report #2410746</h2>
                
                <div className="report-details-grid">
                    <div className="detail-box"> <span className="detail-label">Department</span> <span className="detail-value">Marketing</span> </div>
                    <div className="detail-box"> <span className="detail-label">Severity</span> <span className="badge sev-high">High</span> </div>
                    <div className="detail-box"> <span className="detail-label">Reporter</span> <span className="detail-value">Anonymous</span> </div>
                    <div className="detail-box"> <span className="detail-label">Submitted</span> <span className="detail-value" style={{fontSize:'0.8rem'}}>Nov 29, 05:53 PM</span> </div>
                </div>

                <div className="auto-flag-banner">
                    <i className="fa-solid fa-triangle-exclamation"></i>
                    <div>Auto-flagged: Multiple similar reports detected from this department in the past 7 days.</div>
                </div>

                <label className="form-label">Description</label>
                <div style={{background: 'var(--input-bg)', padding: '15px', borderRadius: '12px', marginBottom: '20px', fontSize: '0.95rem', lineHeight: '1.5'}}>
                    I have witnessed repeated inappropriate comments from a team lead directed at junior team members during meetings. This has created an uncomfortable work environment for several colleagues.
                </div>

                <label className="form-label">Update Status</label>
                <select className="form-select">
                    <option>New</option> <option>Under Review</option> <option>Escalated</option> <option>Resolved</option>
                </select>

                <label className="form-label">Admin Notes (Internal)</label>
                <textarea className="form-textarea" placeholder="Add notes about this report..."></textarea>

                <div className="modal-actions">
                    <button type="button" className="btn-primary btn-cancel" onClick={() => setIsReportDetailsOpen(false)}>Cancel</button>
                    <button type="button" className="btn-primary" onClick={() => {alert("Saved!"); setIsReportDetailsOpen(false);}}>Save Changes</button>
                </div>
            </div>
        </div>

      </div>
    </>
  );
}