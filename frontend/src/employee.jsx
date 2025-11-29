import React, { useState } from 'react';

export default function SafeShiftEmployeesAdmin() {
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isAddEmployeeModalOpen, setIsAddEmployeeModalOpen] = useState(false);
  const [isReportDetailsModalOpen, setIsReportDetailsModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const employees = [
    { id: 1, name: 'Jared Batumbakal', email: 'jared@safeshift.com', initials: 'JB', color: '#64a6ff', department: 'Engineering', role: 'Senior Developer', status: 'Active', lastActive: 'Nov 29, 05:53 PM' },
    { id: 2, name: 'Michael Jordan', email: 'michael@safeshift.com', initials: 'MJ', color: '#feca57', department: 'Marketing', role: 'Team Lead', status: 'On Leave', lastActive: 'Nov 25, 10:00 AM' },
    { id: 3, name: 'Bien Lamar', email: 'bien@safeshift.com', initials: 'BL', color: '#ff6b6b', department: 'Sales', role: 'Sales Rep', status: 'Active', lastActive: 'Nov 29, 04:30 PM' },
    { id: 4, name: 'Calo Forge', email: 'calo@safeshift.com', initials: 'CF', color: '#00cd78', department: 'Engineering', role: 'Junior Developer', status: 'Inactive', lastActive: 'Oct 12, 09:00 AM' },
    { id: 5, name: 'Sen xd', email: 'sen@safeshift.com', initials: 'SX', color: '#a29bfe', department: 'HR', role: 'HR Manager', status: 'Active', lastActive: 'Nov 29, 02:15 PM' },
  ];

  const toggleEmployeeSelection = (id) => {
    setSelectedEmployees(prev => 
      prev.includes(id) ? prev.filter(empId => empId !== id) : [...prev, id]
    );
  };

  const clearSelection = () => {
    setSelectedEmployees([]);
  };

  const toggleDropdown = (id) => {
    setActiveDropdown(activeDropdown === id ? null : id);
  };

  const getStatusClass = (status) => {
    if (status === 'Active') return 'st-active';
    if (status === 'On Leave') return 'st-leave';
    return 'st-inactive';
  };

  const handleSaveEmployee = () => {
    alert('Employee created!');
    setIsAddEmployeeModalOpen(false);
  };

  const handleSaveReport = () => {
    alert('Report updated!');
    setIsReportDetailsModalOpen(false);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
        @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');

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
            --bg-active: #e8f5e9; --text-active: #4caf50;
            --bg-leave: #fff3e0; --text-leave: #ff9800;
            --bg-inactive: #f0f2f5; --text-inactive: #636e72;
            --bg-high: #ffecec; --text-high: #ff6b6b;
            --bg-med: #fff4e5; --text-med: #ff9f43;
            --bg-low: #f0f2f5; --text-low: #636e72;
            --bg-crit: #ffdede; --text-crit: #ff4757;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
            font-family: 'Nunito', sans-serif;
            background-color: #fcfcfc; 
            color: var(--text-dark);
        }

        .admin-container {
            display: flex;
            min-height: 100vh;
            overflow: hidden;
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

        .nav-menu { list-style: none; flex-grow: 1; }
        .nav-item { margin-bottom: 12px; }

        .nav-link {
            display: flex; align-items: center; gap: 15px;
            text-decoration: none; color: var(--text-grey);
            font-weight: 700; font-size: 1.05rem;
            padding: 12px 15px; border-radius: 12px;
            transition: all 0.2s ease;
            cursor: pointer;
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
        .user-info h4 { font-size: 0.95rem; font-weight: 800; }
        .user-info p { font-size: 0.8rem; color: var(--text-grey); font-weight: 600; }

        .logout-link {
            display: flex; align-items: center; gap: 10px; color: var(--alert-red);
            text-decoration: none; font-weight: 800; margin-left: 15px; font-size: 0.95rem;
            cursor: pointer;
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
            font-size: 1.2rem; position: relative;
        }
        .status-dot-top {
            width: 12px; height: 12px; background: var(--accent-green);
            border: 2px solid white; border-radius: 50%; position: absolute; top: 0; right: 0;
        }

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
            font-size: 2.2rem; font-weight: 900; color: var(--text-dark); line-height: 1.1;
        }
        .header-left p { color: var(--text-grey); font-weight: 600; margin-top: 5px; }

        .filters-container { display: flex; gap: 12px; margin-bottom: 15px; flex-wrap: wrap; }
        .filter-btn {
            background: white; border: 2px solid var(--border-color); border-radius: 12px; padding: 8px 16px;
            font-family: 'Nunito', sans-serif; font-weight: 700; font-size: 0.85rem; color: var(--text-dark); 
            cursor: pointer; display: flex; align-items: center; gap: 8px; transition: all 0.2s;
        }
        .filter-btn:hover { border-color: var(--button-blue); }
        .filter-btn.active { background: var(--button-blue); border-color: var(--button-blue); color: white; }
        .count-badge { background: #eee; color: var(--text-dark); border-radius: 6px; padding: 2px 6px; font-size: 0.75rem; }
        .filter-btn.active .count-badge { background: rgba(255,255,255,0.3); color: white; }

        .search-container { margin-bottom: 25px; position: relative; }
        .search-input {
            width: 100%; padding: 12px 15px 12px 45px; border-radius: 12px; border: 2px solid var(--border-color);
            background: white; font-family: 'Nunito', sans-serif; font-weight: 600; outline: none; transition: border-color 0.2s;
        }
        .search-input:focus { border-color: var(--button-blue); }
        .search-icon { position: absolute; left: 15px; top: 50%; transform: translateY(-50%); color: var(--text-grey); }

        .bulk-actions-bar {
            display: none; background: #e3f2fd; border: 2px solid #bbdefb; border-radius: 12px;
            padding: 10px 20px; margin-bottom: 15px; align-items: center; gap: 20px; animation: fadeIn 0.2s ease;
        }
        .bulk-actions-bar.active { display: flex; }
        .bulk-text { font-weight: 800; font-size: 0.9rem; color: var(--text-dark); }
        .bulk-select { padding: 6px 12px; border-radius: 8px; border: 1px solid #90caf9; font-family: 'Nunito', sans-serif; font-weight: 600; outline: none; }
        .bulk-apply-btn {
            background: white; border: 1px solid #90caf9; padding: 6px 15px; border-radius: 8px; font-weight: 700;
            cursor: pointer; font-size: 0.85rem; color: var(--button-blue); transition: all 0.2s;
        }
        .bulk-apply-btn:hover { background: var(--button-blue); color: white; }
        .bulk-cancel { font-weight: 700; font-size: 0.85rem; color: var(--text-grey); cursor: pointer; text-decoration: none; }

        .table-container {
            background: white; 
            border: 2px solid var(--border-color); 
            border-radius: 16px; 
            overflow: visible;
            box-shadow: 5px 6px 0px 0px var(--shadow-grey); 
            margin-bottom: 20px;
        }
        
        table { 
            width: 100%; 
            border-collapse: separate;
            border-spacing: 0; 
        }
        
        th { 
            background: #fcfcfc; text-align: left; padding: 15px 20px; 
            font-size: 0.85rem; font-weight: 700; color: var(--text-grey);
            border-bottom: 2px solid #f0f0f0; cursor: pointer; 
        }

        th:first-child { border-top-left-radius: 14px; }
        th:last-child { border-top-right-radius: 14px; }
        
        td { 
            padding: 15px 20px; 
            border-bottom: 1px solid #f0f0f0; 
            font-size: 0.9rem; font-weight: 700; vertical-align: middle; 
        }
        
        tbody tr:last-child td { border-bottom: none; }
        tbody tr:last-child td:first-child { border-bottom-left-radius: 14px; }
        tbody tr:last-child td:last-child { border-bottom-right-radius: 14px; }

        tbody tr { transition: background-color 0.2s; }
        tbody tr:hover { background-color: #f9f9f9; }
        tbody tr.selected { background-color: #f0f9ff; } 

        .employee-cell { display: flex; align-items: center; gap: 12px; }
        .profile-pic {
            width: 36px; height: 36px; border-radius: 50%; background-color: var(--button-blue); color: white;
            display: flex; align-items: center; justify-content: center; font-size: 0.85rem; font-weight: 800; flex-shrink: 0;
        }
        .emp-details { display: flex; flex-direction: column; }
        .emp-name { font-size: 0.95rem; font-weight: 800; color: var(--text-dark); line-height: 1.2; }
        .emp-email { font-size: 0.75rem; color: var(--text-grey); font-weight: 600; }

        .status-badge { 
            padding: 4px 10px; border-radius: 15px; font-size: 0.75rem; font-weight: 800;
            display: inline-flex; align-items: center; gap: 5px; border: 1px solid transparent; background: transparent;
        }
        .status-badge::before { content: ""; width: 8px; height: 8px; border-radius: 50%; display: block; border: 1px solid currentColor; }
        .st-active { color: var(--text-active); background: var(--bg-active); }
        .st-leave { color: var(--text-leave); background: var(--bg-leave); }
        .st-inactive { color: var(--text-inactive); background: var(--bg-inactive); }

        .select-circle {
            width: 20px; height: 20px; border-radius: 50%; border: 2px solid var(--text-grey); cursor: pointer;
            display: inline-block; position: relative;
        }
        .select-circle.selected { background-color: var(--button-blue); border-color: var(--button-blue); }
        .select-circle.selected::after {
            content: '\\f00c'; font-family: "Font Awesome 6 Free"; font-weight: 900; color: white; font-size: 10px;
            position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
        }

        .action-wrapper { display: flex; align-items: center; gap: 15px; }

        .action-icon { color: var(--text-grey); cursor: pointer; font-size: 1rem; transition: color 0.2s; }
        .action-icon:hover { color: var(--button-blue); }
        
        .action-btn { 
            background: none; border: none; font-size: 1.1rem; color: var(--text-grey); 
            cursor: pointer; padding: 0; border-radius: 50%; transition: color 0.2s;
        }
        .action-btn:hover { color: var(--text-dark); }
        
        .action-container { position: relative; }

        .action-dropdown {
            display: none;
            position: absolute;
            right: 0;
            top: 100%;
            width: 180px;
            background: white;
            border: 1px solid var(--border-color);
            border-radius: 12px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            z-index: 100;
            padding: 8px;
        }
        .action-dropdown.active { display: block; }

        .dropdown-item {
            display: flex; align-items: center; gap: 10px;
            padding: 10px 12px;
            font-size: 0.85rem; font-weight: 700; color: var(--text-dark);
            cursor: pointer;
            border-radius: 8px;
            transition: background 0.2s;
        }
        .dropdown-item:hover { background-color: var(--input-bg); }
        .dropdown-item i { width: 16px; text-align: center; color: var(--text-grey); }
        .dropdown-item:hover i { color: var(--button-blue); }
        .dropdown-item.danger { color: var(--alert-red); }
        .dropdown-item.danger i { color: var(--alert-red); }
        .dropdown-item.danger:hover { background-color: #fff5f5; }

        .pagination { display: flex; justify-content: flex-end; align-items: center; gap: 5px; margin-bottom: 40px; }
        .page-btn {
            width: 35px; height: 35px; border-radius: 8px; border: 2px solid transparent;
            background: white; font-weight: 700; color: var(--text-grey); cursor: pointer;
            display: flex; align-items: center; justify-content: center; transition: all 0.2s;
        }
        .page-btn:hover { border-color: var(--border-color); color: var(--button-blue); }
        .page-btn.active { background-color: var(--button-blue); color: white; box-shadow: 2px 2px 0px var(--button-shadow-blue); }

        .modal-overlay {
            display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0, 0, 0, 0.5); z-index: 1000; justify-content: center; align-items: center; padding: 20px;
        }
        .modal-overlay.active { display: flex; }
        .modal-container {
            background: var(--white); width: 100%; max-width: 600px; border-radius: 24px;
            padding: 30px; position: relative; max-height: 90vh; overflow-y: auto;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }
        
        .close-modal-btn { position: absolute; top: 25px; right: 25px; background: none; border: none; font-size: 1.5rem; color: var(--text-grey); cursor: pointer; }
        .modal-title { font-size: 1.5rem; font-weight: 900; margin-bottom: 25px; }
        .form-label { display: block; font-size: 0.9rem; font-weight: 700; margin-bottom: 8px; }
        .form-input, .form-select, .form-textarea {
            width: 100%; padding: 12px 15px; border-radius: 12px; border: 1px solid var(--border-color); background: var(--input-bg);
            font-family: 'Nunito', sans-serif; font-weight: 600; outline: none; margin-bottom: 20px;
        }
        .form-textarea { resize: vertical; height: 100px; }
        .modal-actions { display: flex; justify-content: flex-end; gap: 15px; margin-top: 10px; }
        
        .btn-primary {
            background: var(--button-blue); border: none; padding: 12px 25px; border-radius: 30px;
            font-weight: 800; color: white; cursor: pointer; box-shadow: 4px 4px 0px var(--button-shadow-blue);
            transition: transform 0.1s; display: flex; align-items: center; gap: 8px;
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
        
        .badge { padding: 5px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 800; display: inline-block; }
        .sev-high { background: var(--bg-high); color: var(--text-high); }
        
        .auto-flag-banner {
            background: var(--bg-high); color: var(--text-high); padding: 15px; border-radius: 12px; 
            display: flex; align-items: center; gap: 15px; margin-bottom: 25px; font-weight: 700; font-size: 0.9rem;
        }

        @media (max-width: 768px) {
            .admin-container { flex-direction: column; }
            .sidebar { width: 100%; height: auto; border-right: none; border-bottom: 2px solid #eee; }
            .top-user-area { display: none; } 
            .table-container { overflow-x: auto; overflow-y: visible; }
            .header-left { padding-left: 0; }
            .mascot-head { display: none; }
            .report-details-grid { grid-template-columns: 1fr 1fr; }
        }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>

      <div className="admin-container">
        <aside className="sidebar">
          <div style={{width: '160px', height: '40px', background: '#e0e0e0', borderRadius: '8px', marginBottom: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '800'}}>LOGO</div>
          
          <ul className="nav-menu">
            <li className="nav-item"><a href="#" className="nav-link"><i className="fa-solid fa-gauge-high"></i>Dashboard</a></li>
            <li className="nav-item"><a href="#" className="nav-link"><i className="fa-solid fa-file-lines"></i>All Reports</a></li>
            <li className="nav-item"><a href="#" className="nav-link active"><i className="fa-solid fa-users"></i>Employees</a></li>
            <li className="nav-item"><a href="#" className="nav-link"><i className="fa-solid fa-clock-rotate-left"></i>Activity Logs</a></li>
            <li className="nav-item"><a href="#" className="nav-link"><i className="fa-solid fa-gear"></i>Settings</a></li>
          </ul>
          
          <div className="user-profile-mini">
            <div className="user-avatar-circle"><i className="fa-solid fa-user-shield"></i></div>
            <div className="user-info"><h4>Admin</h4><p>Engineering</p></div>
          </div>
          <a href="#" className="logout-link"><i className="fa-solid fa-arrow-right-from-bracket"></i> Log out</a>
        </aside>

        <main className="main-content">
          <div className="top-user-area">
            <div className="top-user-text"><h4>Admin</h4><span>Engineering</span></div>
            <div className="top-avatar"><i className="fa-solid fa-user"></i><div className="status-dot-top"></div></div>
          </div>

          <header className="header-section">
            <div className="header-left">
              <div style={{position: 'absolute', left: 0, top: '-15px', width: '90px', height: '90px', background: '#ffd700', borderRadius: '50%', transform: 'rotate(-5deg)'}}></div>
              <h1>Employees</h1>
              <p>Manage your team members and permissions</p>
            </div>
            
            <div className="header-actions">
              <button className="btn-primary" onClick={() => setIsAddEmployeeModalOpen(true)}>
                <i className="fa-solid fa-plus"></i> Add Employee
              </button>
            </div>
          </header>

          <div className="filters-container">
            <button className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`} onClick={() => setActiveFilter('all')}>All Employees</button>
            <button className={`filter-btn ${activeFilter === 'engineering' ? 'active' : ''}`} onClick={() => setActiveFilter('engineering')}>Engineering <span className="count-badge">12</span></button>
            <button className={`filter-btn ${activeFilter === 'marketing' ? 'active' : ''}`} onClick={() => setActiveFilter('marketing')}>Marketing <span className="count-badge">8</span></button>
            <button className={`filter-btn ${activeFilter === 'sales' ? 'active' : ''}`} onClick={() => setActiveFilter('sales')}>Sales <span className="count-badge">15</span></button>
            <button className={`filter-btn ${activeFilter === 'hr' ? 'active' : ''}`} onClick={() => setActiveFilter('hr')}>HR <span className="count-badge">6</span></button>
            <button className={`filter-btn ${activeFilter === 'operation' ? 'active' : ''}`} onClick={() => setActiveFilter('operation')}>Operation <span className="count-badge">10</span></button>
          </div>

          <div className="search-container">
            <i className="fa-solid fa-magnifying-glass search-icon"></i>
            <input 
              type="text" 
              className="search-input" 
              placeholder="Search by name, ID, or role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className={`bulk-actions-bar ${selectedEmployees.length > 0 ? 'active' : ''}`}>
            <span className="bulk-text">{selectedEmployees.length} Selected</span>
            <select className="bulk-select">
              <option>Actions</option>
              <option>Delete</option>
              <option>Change Department</option>
              <option>Deactivate</option>
            </select>
            <button className="bulk-apply-btn" onClick={() => { alert('Action applied!'); clearSelection(); }}>Apply</button>
            <span className="bulk-cancel" onClick={clearSelection}>Cancel</span>
          </div>

          <section className="table-container">
            <table>
              <thead>
                <tr>
                  <th style={{width: '50px'}}></th>
                  <th>Employee</th>
                  <th>Department</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Last Active</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.map(emp => (
                  <tr key={emp.id} className={selectedEmployees.includes(emp.id) ? 'selected' : ''}>
                    <td onClick={(e) => { e.stopPropagation(); toggleEmployeeSelection(emp.id); }}>
                      <div className={`select-circle ${selectedEmployees.includes(emp.id) ? 'selected' : ''}`}></div>
                    </td>
                    <td>
                      <div className="employee-cell">
                        <div className="profile-pic" style={{backgroundColor: emp.color}}>{emp.initials}</div>
                        <div className="emp-details">
                          <span className="emp-name">{emp.name}</span>
                          <span className="emp-email">{emp.email}</span>
                        </div>
                      </div>
                    </td>
                    <td>{emp.department}</td>
                    <td>{emp.role}</td>
                    <td><span className={`status-badge ${getStatusClass(emp.status)}`}>{emp.status}</span></td>
                    <td>{emp.lastActive}</td>
                    <td>
                      <div className="action-wrapper">
                        <i className="fa-regular fa-eye action-icon" onClick={() => setIsReportDetailsModalOpen(true)}></i>
                        <div className="action-container">
                          <button className="action-btn" onClick={(e) => { e.stopPropagation(); toggleDropdown(emp.id); }}>
                            <i className="fa-solid fa-ellipsis-vertical"></i>
                          </button>
                          <div className={`action-dropdown ${activeDropdown === emp.id ? 'active' : ''}`}>
                            <div className="dropdown-item"><i className="fa-regular fa-user"></i> View Profile</div>
                            <div className="dropdown-item"><i className="fa-solid fa-pen"></i> Edit Details</div>
                            <div className="dropdown-item"><i className="fa-solid fa-lock"></i> Reset Password</div>
                            <div className="dropdown-item danger"><i className="fa-solid fa-ban"></i> Deactivate</div>
                          </div>
                        </div>
                      </div>
                    </td>
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
      </div>

      {/* Add Employee Modal */}
      <div className={`modal-overlay ${isAddEmployeeModalOpen ? 'active' : ''}`} onClick={(e) => e.target.classList.contains('modal-overlay') && setIsAddEmployeeModalOpen(false)}>
        <div className="modal-container">
          <button className="close-modal-btn" onClick={() => setIsAddEmployeeModalOpen(false)}>
            <i className="fa-solid fa-times"></i>
          </button>
          <h2 className="modal-title">Create New Employee Account</h2>
          
          <div>
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
              <button className="btn-cancel" onClick={() => setIsAddEmployeeModalOpen(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleSaveEmployee}>Save Changes</button>
            </div>
          </div>
        </div>
      </div>

      {/* Report Details Modal */}
      <div className={`modal-overlay ${isReportDetailsModalOpen ? 'active' : ''}`} onClick={(e) => e.target.classList.contains('modal-overlay') && setIsReportDetailsModalOpen(false)}>
        <div className="modal-container" style={{maxWidth: '700px'}}>
          <button className="close-modal-btn" onClick={() => setIsReportDetailsModalOpen(false)}>
            <i className="fa-solid fa-times"></i>
          </button>
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
            <div>Auto-flagged: Multiple similar reports detected from this department in the past 7 days.</div>
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
            <button className="btn-cancel" onClick={() => setIsReportDetailsModalOpen(false)}>Cancel</button>
            <button className="btn-primary" onClick={handleSaveReport}>Save Changes</button>
          </div>
        </div>
      </div>
    </>
  );
}