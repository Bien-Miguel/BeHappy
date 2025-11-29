import React, { useState } from 'react';

export default function SafeShiftDashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Select type',
    severity: 'Low',
    date: '',
    location: '',
    description: '',
    anonymous: false
  });

  const openModal = () => {
    setIsModalOpen(true);
    setCurrentStep(0);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Date not set";
    return new Date(dateString).toLocaleDateString();
  };

  const getModalTitle = () => {
    const titles = [
      { title: "Submit a Report", sub: "Please fill out the details below" },
      { title: "Add Attachments", sub: "Optional: Add supporting files" },
      { title: "Review & Submit", sub: "Please review your information" },
      { title: "Success", sub: "" }
    ];
    return titles[currentStep];
  };

  const getNextButtonText = () => {
    if (currentStep === 0) return "Next";
    if (currentStep === 1) return "Review";
    if (currentStep === 2) return "Submit Report";
    return "Next";
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

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            font-family: 'Nunito', sans-serif;
            background-color: #fcfcfc; 
            color: var(--text-dark);
        }

        .dashboard-container {
            display: flex;
            min-height: 100vh;
        }

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
        }
        .user-info p {
            font-size: 0.8rem;
            color: var(--text-grey);
            font-weight: 600;
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
        }

        .main-content {
            flex-grow: 1;
            padding: 40px 60px;
            overflow-y: auto;
        }

        .header-section {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            margin-bottom: 50px;
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
        }

        .header-text p {
            color: var(--text-grey);
            font-weight: 700;
            font-size: 1.1rem;
            margin-top: 8px;
        }

        .submit-report-btn {
            background-color: var(--button-blue);
            color: white;
            border: none;
            padding: 15px 30px;
            border-radius: 50px;
            font-family: 'Nunito', sans-serif;
            font-weight: 800;
            font-size: 1rem;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 12px;
            box-shadow: 5px 6px 0px 0px var(--button-shadow-blue);
            transition: all 0.1s ease;
        }

        .submit-report-btn:hover {
            transform: translate(-2px, -2px);
            box-shadow: 7px 8px 0px 0px var(--button-shadow-blue);
        }

        .submit-report-btn:active {
            transform: translate(2px, 2px);
            box-shadow: 2px 3px 0px 0px var(--button-shadow-blue);
        }

        .stats-row {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 25px;
            margin-bottom: 35px;
        }

        .stat-card {
            background: white;
            border: 2px solid var(--border-color);
            border-radius: 20px;
            padding: 25px;
            display: flex;
            align-items: center;
            gap: 20px;
            box-shadow: 5px 6px 0px 0px var(--shadow-grey);
            transition: transform 0.2s ease;
        }

        .stat-card:hover {
            transform: translateY(-3px);
        }

        .stat-icon {
            width: 55px;
            height: 55px;
            border-radius: 50%;
            border: 2px solid var(--text-dark);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.3rem;
            color: var(--text-dark);
            flex-shrink: 0;
        }

        .stat-info h3 {
            font-size: 2rem;
            font-weight: 900;
            line-height: 1;
            margin-bottom: 5px;
        }

        .stat-info p {
            font-size: 0.95rem;
            color: var(--text-grey);
            font-weight: 700;
        }

        .dashboard-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 30px;
        }

        .dashboard-card {
            background: white;
            border: 2px solid var(--border-color);
            border-radius: 24px;
            padding: 30px;
            box-shadow: 5px 6px 0px 0px var(--shadow-grey);
        }

        .card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 25px;
        }

        .card-header h3 {
            font-weight: 800;
            font-size: 1.2rem;
        }

        .wellness-content {
            display: flex;
            align-items: center;
            gap: 25px;
            margin-bottom: 25px;
        }

        .donut-chart {
            width: 100px;
            height: 100px;
            border-radius: 50%;
            background: conic-gradient(
                var(--accent-green) 0% 75%, 
                #f0f0f0 75% 100%
            );
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .donut-chart::after {
            content: "";
            width: 75px;
            height: 75px;
            background: white;
            border-radius: 50%;
            position: absolute;
        }

        .donut-chart-small {
            width: 70px;
            height: 70px;
            background: conic-gradient(var(--accent-green) 0% 40%, #eee 40% 100%);
        }

        .donut-chart-small::after {
            width: 50px;
            height: 50px;
        }

        .wellness-details h4 {
            color: var(--accent-green);
            font-weight: 900;
            font-size: 1.5rem;
            margin-bottom: 2px;
        }
        .wellness-details p {
            font-size: 0.9rem;
            color: var(--text-grey);
            font-weight: 600;
        }

        .metric-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 12px;
            font-weight: 700;
            font-size: 0.85rem;
        }
        .metric-row i {
            width: 20px;
            text-align: center;
            margin-right: 8px;
            color: var(--button-blue);
        }
        .metric-bar-bg {
            width: 120px;
            height: 8px;
            background-color: #eee;
            border-radius: 10px;
            margin-top: 5px;
        }
        .metric-bar-fill {
            height: 100%;
            border-radius: 10px;
            background-color: var(--button-blue);
        }

        .status-badge {
            background-color: #e6fffa;
            color: #00cd78;
            padding: 10px;
            border-radius: 10px;
            font-size: 0.9rem;
            font-weight: 800;
            text-align: center;
            margin-bottom: 25px;
            border: 1px dashed #00cd78;
        }

        .progress-label {
            display: flex;
            justify-content: space-between;
            font-size: 0.9rem;
            font-weight: 800;
            margin-bottom: 8px;
        }
        .progress-bar {
            width: 100%;
            height: 10px;
            background-color: #eee;
            border-radius: 10px;
            margin-bottom: 8px;
        }
        .progress-fill {
            height: 100%;
            background-color: var(--button-blue);
            border-radius: 10px;
            width: 81%; 
        }

        .trend-up {
            color: var(--accent-green);
            font-weight: 800;
            font-size: 0.95rem;
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .report-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px 0;
            border-bottom: 2px solid #f9f9f9;
        }
        .report-item:last-child {
            border-bottom: none;
        }
        .report-info h5 {
            font-size: 1rem;
            font-weight: 800;
            margin-bottom: 4px;
        }
        .report-info span {
            font-size: 0.8rem;
            color: var(--text-grey);
            font-weight: 600;
        }
        .tag {
            padding: 6px 14px;
            border-radius: 20px;
            font-size: 0.75rem;
            font-weight: 800;
        }
        .tag.review { background-color: #fff4e5; color: #ff9f43; }
        .tag.resolved { background-color: #e6fffa; color: #00cd78; }

        .modal-overlay {
            position: fixed;
            top: 0; left: 0;
            width: 100%; height: 100%;
            background-color: rgba(0, 0, 0, 0.4);
            display: flex;
            justify-content: center;
            align-items: center;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.3s ease, visibility 0.3s ease;
            z-index: 2000;
        }
        .modal-overlay.active {
            opacity: 1;
            visibility: visible;
        }
        .modal-container {
            background-color: var(--white);
            border-radius: 24px;
            border: 2px solid var(--border-color);
            box-shadow: 5px 6px 0px 0px var(--shadow-grey);
            width: 600px; 
            max-width: 90%;
            max-height: 90vh;
            display: flex;
            flex-direction: column;
            transform: translateY(20px);
            transition: transform 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28);
            position: relative; 
        }
        .modal-overlay.active .modal-container {
            transform: translateY(0);
        }
        
        .modal-header-figma {
            padding: 30px 30px 20px 30px;
            border-bottom: 2px solid #f9f9f9;
            position: relative;
            overflow: hidden; 
            border-top-left-radius: 22px;
            border-top-right-radius: 22px;
        }
        
        .header-content-figma {
            position: relative;
            z-index: 1;
            display: flex;
            align-items: center;
            gap: 20px; 
        }

        .modal-logo {
            width: 60px;
            display: block;
        }

        .header-text-group h3 { 
            font-size: 1.5rem; 
            font-weight: 900; 
            margin-bottom: 5px; 
            color: var(--text-dark); 
            line-height: 1.1; 
        }
        .header-text-group p { 
            font-size: 0.95rem; 
            color: var(--text-grey); 
            font-weight: 700; 
            margin: 0; 
        }
        
        .close-modal { 
            position: absolute;
            top: 15px;
            right: 15px;
            background: white; 
            border: 1px solid #eee; 
            border-radius: 50%;
            width: 30px; height: 30px;
            font-size: 1.2rem; 
            color: var(--text-grey); 
            cursor: pointer; 
            z-index: 2; 
            display: flex; 
            align-items: center; 
            justify-content: center;
            box-shadow: 0 2px 5px rgba(0,0,0,0.05);
        }
        
        .modal-body { 
            padding: 30px;
            overflow-y: auto; 
            flex-grow: 1;
        }
        .modal-body::-webkit-scrollbar { width: 8px; }
        .modal-body::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 4px; }
        .modal-body::-webkit-scrollbar-thumb { background: #dcdcdc; border-radius: 4px; }
        .modal-body::-webkit-scrollbar-thumb:hover { background: #bbb; }
        
        .form-group-modal { margin-bottom: 20px; }
        .form-group-modal label { 
            display: block; 
            font-size: 0.9rem; 
            font-weight: 800; 
            margin-bottom: 8px; 
            color: var(--text-dark); 
        }
        .form-input-modal, .form-select-modal, .form-textarea-modal {
            width: 100%;
            padding: 14px 18px;
            border-radius: 12px;
            border: 1px solid transparent;
            background-color: var(--input-bg);
            font-family: 'Nunito', sans-serif;
            font-weight: 700;
            color: var(--text-dark);
            outline: none;
            font-size: 0.95rem;
        }
        .form-input-modal:focus, .form-select-modal:focus, .form-textarea-modal:focus {
            background-color: white; 
            border-color: var(--button-blue); 
            box-shadow: 0 0 0 3px rgba(91, 161, 252, 0.15);
        }

        .form-grid-modal {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
        }

        .modal-toggle-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background-color: var(--input-bg);
            padding: 15px 20px;
            border-radius: 16px;
            margin-bottom: 10px;
        }
        .toggle-left { display: flex; align-items: center; gap: 15px; }
        
        .toggle-icon img { 
            width: 45px; 
            height: auto; 
            display: block;
        }
        
        .modal-toggle-info h4 { 
            font-size: 0.95rem; 
            font-weight: 800; 
            margin-bottom: 2px; 
        }
        .modal-toggle-info p { 
            font-size: 0.8rem; 
            color: var(--text-grey); 
            font-weight: 600; 
        }
        
        .switch { 
            position: relative; 
            display: inline-block; 
            width: 50px; 
            height: 28px; 
        }
        .switch input { 
            opacity: 0; 
            width: 0; 
            height: 0; 
        }
        .slider { 
            position: absolute; 
            cursor: pointer; 
            top: 0; left: 0; right: 0; bottom: 0; 
            background-color: #cbd5e1; 
            transition: .4s; 
            border-radius: 34px; 
        }
        .slider:before { 
            position: absolute; 
            content: ""; 
            height: 22px; 
            width: 22px; 
            left: 3px; 
            bottom: 3px; 
            background-color: white; 
            transition: .4s; 
            border-radius: 50%; 
        }
        input:checked + .slider { 
            background-color: var(--button-blue); 
        }
        input:checked + .slider:before { 
            transform: translateX(22px); 
        }

        .file-upload-box {
            border: 2px dashed #cbd5e1;
            border-radius: 16px;
            padding: 40px;
            text-align: center;
            background-color: #f8fafc;
            color: var(--text-grey);
            cursor: pointer;
            transition: all 0.2s;
        }
        .file-upload-box:hover { 
            border-color: var(--button-blue); 
            background-color: #f0f9ff; 
        }
        .file-upload-box i { 
            font-size: 2.5rem; 
            margin-bottom: 10px; 
            color: #94a3b8; 
        }

        .review-card {
            background-color: #fff; 
            border: 2px solid #eee; 
            border-radius: 16px; 
            padding: 25px; 
            margin-bottom: 20px; 
            box-shadow: 0 4px 10px rgba(0,0,0,0.02);
        }
        .review-title-large { 
            font-size: 1.4rem; 
            font-weight: 900; 
            color: var(--text-dark); 
            margin-bottom: 20px; 
            padding-bottom: 15px; 
            border-bottom: 1px solid #f0f0f0; 
        }
        .review-details-grid { 
            display: grid; 
            grid-template-columns: 1fr 1fr; 
            gap: 20px; 
            margin-bottom: 25px; 
        }
        .review-detail-item { 
            display: flex; 
            align-items: flex-start; 
            gap: 12px; 
        }
        .review-icon-box { 
            width: 40px; 
            height: 40px; 
            background-color: #f0f7ff; 
            color: var(--button-blue); 
            border-radius: 10px; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            font-size: 1.1rem; 
            flex-shrink: 0; 
        }
        .review-text label { 
            display: block; 
            font-size: 0.75rem; 
            color: var(--text-grey); 
            font-weight: 700; 
            margin-bottom: 2px; 
            text-transform: uppercase; 
        }
        .review-text p { 
            font-size: 0.95rem; 
            font-weight: 800; 
            color: var(--text-dark); 
        }
        .review-section-label { 
            font-size: 0.9rem; 
            font-weight: 800; 
            color: var(--text-dark); 
            margin-bottom: 10px; 
        }
        .review-description-box { 
            background-color: #f9f9f9; 
            padding: 15px; 
            border-radius: 12px; 
            border: 1px solid #eee; 
            color: var(--text-grey); 
            font-size: 0.9rem; 
            line-height: 1.5; 
            margin-bottom: 20px; 
        }
        .attachment-preview { 
            display: flex; 
            align-items: center; 
            gap: 10px; 
            background-color: white; 
            border: 1px solid #eee; 
            padding: 12px; 
            border-radius: 10px; 
            font-weight: 700; 
            font-size: 0.9rem; 
            color: var(--text-dark); 
        }

        .captcha-box { 
            background-color: #f9f9f9; 
            border: 1px solid #d3d3d3; 
            border-radius: 6px; 
            padding: 15px 20px; 
            width: 100%; 
            display: flex; 
            align-items: center; 
            justify-content: space-between; 
            margin-top: 10px; 
            max-width: 320px; 
            box-shadow: 0 2px 4px rgba(0,0,0,0.05); 
        }
        .captcha-container { 
            display: flex; 
            align-items: center; 
            gap: 15px; 
            font-family: Roboto, sans-serif; 
            font-size: 14px; 
            font-weight: 500; 
            color: #555; 
        }
        .captcha-container input { 
            width: 26px; 
            height: 26px; 
            accent-color: #4A90E2; 
            cursor: pointer; 
        }
        .captcha-logo { 
            height: 36px; 
            opacity: 0.7; 
        }

        .success-content { 
            text-align: center; 
            padding: 40px 20px; 
        }
        .success-icon { 
            width: 80px; 
            height: 80px; 
            background-color: #d1fae5; 
            color: var(--accent-green); 
            border-radius: 50%; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            font-size: 2.5rem; 
            margin: 0 auto 20px auto; 
        }
        .success-content h2 { 
            font-size: 1.8rem; 
            font-weight: 900; 
            margin-bottom: 10px; 
        }
        .success-content p { 
            color: var(--text-grey); 
            margin-bottom: 30px; 
        }

        .modal-footer { 
            padding: 20px 30px; 
            border-top: 2px solid #f9f9f9; 
            display: flex; 
            justify-content: flex-end; 
            gap: 15px; 
            flex-shrink: 0; 
        }
        .modal-btn-primary { 
            background-color: var(--button-blue); 
            color: white; 
            border: none; 
            padding: 12px 25px; 
            border-radius: 50px; 
            font-weight: 800; 
            cursor: pointer; 
            box-shadow: 5px 6px 0px 0px var(--button-shadow-blue); 
            transition: transform 0.1s; 
        }
        .modal-btn-primary:active { 
            transform: translate(2px, 2px); 
            box-shadow: 2px 3px 0px 0px var(--button-shadow-blue); 
        }
        .modal-btn-secondary { 
            background-color: transparent; 
            color: var(--text-grey); 
            border: 2px solid #e2e8f0; 
            padding: 12px 25px; 
            border-radius: 50px; 
            font-weight: 800; 
            cursor: pointer; 
            transition: all 0.2s; 
        }
        .modal-btn-secondary:hover { 
            border-color: var(--alert-red); 
            color: var(--alert-red); 
        }

        .form-step { 
            display: none; 
        }
        .form-step.active { 
            display: block; 
            animation: fadeIn 0.3s ease; 
        }
        @keyframes fadeIn { 
            from { opacity: 0; transform: translateY(5px); } 
            to { opacity: 1; transform: translateY(0); } 
        }

        @media (max-width: 1024px) {
            .dashboard-grid, .stats-row { 
                grid-template-columns: 1fr; 
            }
        }
        @media (max-width: 768px) {
            .dashboard-container { 
                flex-direction: column; 
            }
            .sidebar { 
                width: 100%; 
                border-right: none; 
                border-bottom: 2px solid #eee; 
            }
            .main-content { 
                padding: 30px 20px; 
            }
            .mascot-head { 
                display: none; 
            } 
        }
      `}</style>

      <div className="dashboard-container">
        <aside className="sidebar">
          <div style={{width: '160px', height: '40px', background: '#e0e0e0', borderRadius: '8px', marginBottom: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '800'}}>LOGO</div>

          <ul className="nav-menu">
            <li className="nav-item">
              <a href="#" className="nav-link active">
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
              <a href="#" className="nav-link">
                <i className="fa-regular fa-user"></i>
                Profile
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
              <i className="fa-solid fa-user"></i>
            </div>
            <div className="user-info">
              <h4>Employee</h4>
              <p>Engineering</p>
            </div>
          </div>
          
          <a href="#" className="logout-link">
            <i className="fa-solid fa-arrow-right-from-bracket"></i> Log out
          </a>
        </aside>

        <main className="main-content">
          <header className="header-section">
            <div className="header-text">
              <div style={{position: 'absolute', left: 0, top: '-15px', width: '90px', height: '90px', background: '#ffd700', borderRadius: '50%', transform: 'rotate(-5deg)'}}></div>
              <h1>Good Morning, employee!</h1>
              <p>Here's what's happening with your work today.</p>
            </div>
            
            <button className="submit-report-btn" onClick={openModal}>
              <i className="fa-solid fa-plus"></i> Submit Report
            </button>
          </header>

          <section className="stats-row">
            <div className="stat-card">
              <div className="stat-icon"><i className="fa-regular fa-calendar"></i></div>
              <div className="stat-info"><h3>12</h3><p>Days this month</p></div>
            </div>
            <div className="stat-card">
              <div className="stat-icon"><i className="fa-regular fa-file-lines"></i></div>
              <div className="stat-info"><h3>4</h3><p>Reports submitted</p></div>
            </div>
            <div className="stat-card">
              <div className="stat-icon"><i className="fa-regular fa-envelope"></i></div>
              <div className="stat-info"><h3>2</h3><p>New messages</p></div>
            </div>
          </section>

          <section className="dashboard-grid">
            <div className="dashboard-card">
              <div className="card-header">
                <h3>Wellness Score</h3>
                <i className="fa-regular fa-heart" style={{color: 'var(--accent-green)', fontSize: '1.2rem'}}></i>
              </div>
              <div className="wellness-content">
                <div className="donut-chart"></div>
                <div className="wellness-details">
                  <h4>Good</h4>
                  <p>Keep it up!</p>
                </div>
              </div>
              <div className="wellness-metrics">
                <div className="metric-row">
                  <span><i className="fa-solid fa-scale-balanced"></i> Work-Life Balance</span>
                  <div className="metric-bar-bg"><div className="metric-bar-fill" style={{width: '80%'}}></div></div>
                </div>
                <div className="metric-row">
                  <span><i className="fa-solid fa-person-running"></i> Activity Level</span>
                  <div className="metric-bar-bg"><div className="metric-bar-fill" style={{width: '60%', backgroundColor: '#ddd'}}></div></div>
                </div>
                <div className="metric-row">
                  <span><i className="fa-solid fa-bolt"></i> Stress Level</span>
                  <div className="metric-bar-bg"><div className="metric-bar-fill" style={{width: '30%', backgroundColor: '#ddd'}}></div></div>
                </div>
              </div>
            </div>

            <div className="dashboard-card">
              <div className="card-header">
                <h3>Performance Tracker</h3>
                <i className="fa-regular fa-clock" style={{color: 'var(--button-blue)', fontSize: '1.2rem'}}></i>
              </div>
              <div className="status-badge">
                <i className="fa-solid fa-bolt"></i> Current Status: Working
              </div>
              <div className="progress-container">
                <div className="progress-label">
                  <span>Today's Progress</span>
                  <span style={{color: 'var(--accent-green)'}}>6.5h / 8h</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill"></div>
                </div>
                <div className="progress-label" style={{marginTop:'5px', fontWeight:'700', color:'#aaa', fontSize: '0.8rem'}}>
                  <span>On Track</span>
                  <span>81%</span>
                </div>
              </div>
              <div style={{borderTop: '2px solid #f9f9f9', paddingTop: '15px', marginTop: '20px'}}>
                <div style={{display:'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <span style={{fontWeight:'800', fontSize:'0.9rem'}}>This Week</span>
                  <div className="trend-up">
                    <i className="fa-solid fa-arrow-trend-up"></i> On Track
                  </div>
                </div>
              </div>
            </div>

            <div className="dashboard-card">
              <div className="card-header">
                <h3>Task Completion</h3>
                <a href="#" style={{textDecoration:'none', color:'var(--text-dark)', fontWeight:'800', fontSize:'0.9rem'}}>+ Add</a>
              </div>
              <div className="wellness-content">
                <div className="donut-chart donut-chart-small"></div>
                <div className="wellness-details">
                  <h4 style={{color:'var(--text-dark)', fontSize: '1.3rem'}}>2/5</h4>
                  <p>Tasks Done</p>
                </div>
              </div>
              <div style={{marginTop: '20px'}}>
                <div style={{display:'flex', justifyContent:'space-between', marginBottom:'12px', fontSize:'0.85rem', fontWeight:'700'}}>
                  <span style={{display:'flex', alignItems:'center', gap:'8px'}}>
                    <i className="fa-regular fa-circle-check" style={{color:'var(--accent-green)', fontSize:'1rem'}}></i> Quarterly report
                  </span>
                  <i className="fa-regular fa-flag" style={{color:'var(--alert-red)'}}></i>
                </div>
                <div style={{display:'flex', justifyContent:'space-between', marginBottom:'12px', fontSize:'0.85rem', fontWeight:'700'}}>
                  <span style={{display:'flex', alignItems:'center', gap:'8px'}}>
                    <i className="fa-regular fa-circle-check" style={{color:'var(--accent-green)', fontSize:'1rem'}}></i> Team proposal
                  </span>
                  <i className="fa-regular fa-flag" style={{color:'var(--warning-yellow)'}}></i>
                </div>
              </div>
            </div>

            <div className="dashboard-card">
              <div className="card-header">
                <h3>My Recent Reports</h3>
                <a href="#" style={{textDecoration:'none', color:'var(--text-grey)', fontWeight:'700', fontSize:'0.85rem'}}>View all</a>
              </div>
              <ul className="report-list">
                <li className="report-item">
                  <div className="report-info">
                    <h5>Safety Concern</h5>
                    <span>#Safe-001 • 2 days ago</span>
                  </div>
                  <span className="tag review">Under Review</span>
                </li>
                <li className="report-item">
                  <div className="report-info">
                    <h5>Policy Violation</h5>
                    <span>#Safe-002 • 1 day ago</span>
                  </div>
                  <span className="tag resolved">Resolved</span>
                </li>
                <li className="report-item">
                  <div className="report-info">
                    <h5>Equipment Check</h5>
                    <span>#Safe-003 • 5 hrs ago</span>
                  </div>
                  <span className="tag resolved">Resolved</span>
                </li>
              </ul>
            </div>
          </section>
        </main>
      </div>

      {/* Modal */}
      <div className={`modal-overlay ${isModalOpen ? 'active' : ''}`} onClick={(e) => e.target.classList.contains('modal-overlay') && closeModal()}>
        <div className="modal-container">
          <div className="modal-header-figma">
            <div className="header-content-figma">
              <div style={{width: '60px', height: '60px', background: '#c0c0c0', borderRadius: '8px'}}></div>
              <div className="header-text-group">
                <h3>{getModalTitle().title}</h3>
                <p>{getModalTitle().sub}</p>
              </div>
            </div>
            <button className="close-modal" onClick={closeModal}>&times;</button>
          </div>
          
          <div className="modal-body">
            {/* Step 1 */}
            <div className={`form-step ${currentStep === 0 ? 'active' : ''}`}>
              <div className="form-group-modal">
                <label>Report Title</label>
                <input 
                  type="text" 
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="form-input-modal" 
                  placeholder="Enter report title"
                />
              </div>
              
              <div className="form-grid-modal">
                <div className="form-group-modal">
                  <label>Report Type</label>
                  <select 
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="form-select-modal"
                  >
                    <option>Select type</option>
                    <option>Safety Concern</option>
                    <option>Policy Violation</option>
                    <option>Equipment Issue</option>
                  </select>
                </div>
                <div className="form-group-modal">
                  <label>Severity Level</label>
                  <select 
                    name="severity"
                    value={formData.severity}
                    onChange={handleInputChange}
                    className="form-select-modal"
                  >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                    <option>Critical</option>
                  </select>
                </div>
              </div>

              <div className="form-grid-modal">
                <div className="form-group-modal">
                  <label>Date & Time</label>
                  <input 
                    type="datetime-local" 
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="form-input-modal"
                  />
                </div>
                <div className="form-group-modal">
                  <label>Location</label>
                  <input 
                    type="text" 
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="form-input-modal" 
                    placeholder="e.g. Warehouse B"
                  />
                </div>
              </div>

              <div className="form-group-modal">
                <label>Description</label>
                <textarea 
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="form-textarea-modal" 
                  rows="4" 
                  placeholder="Please provide detailed information about the incident..."
                ></textarea>
              </div>

              <div className="modal-toggle-row">
                <div className="toggle-left">
                  <div className="toggle-icon">
                    <div style={{width: '45px', height: '45px', background: '#ffd700', borderRadius: '50%'}}></div>
                  </div>
                  <div className="modal-toggle-info">
                    <h4>Anonymous Submission</h4>
                    <p>Hide my identity for this report</p>
                  </div>
                </div>
                <label className="switch">
                  <input 
                    type="checkbox" 
                    name="anonymous"
                    checked={formData.anonymous}
                    onChange={handleInputChange}
                  />
                  <span className="slider"></span>
                </label>
              </div>
            </div>

            {/* Step 2 */}
            <div className={`form-step ${currentStep === 1 ? 'active' : ''}`}>
              <div className="form-group-modal">
                <label>Attachments <span style={{fontWeight:'400', color:'var(--text-grey)', fontSize:'0.8rem'}}>(Optional)</span></label>
                <div className="file-upload-box">
                  <i className="fa-solid fa-cloud-arrow-up"></i>
                  <p style={{fontWeight:'700', color:'var(--text-dark)'}}>Drag and drop files here</p>
                  <p style={{fontSize:'0.8rem'}}>or browse files</p>
                </div>
              </div>
            </div>

            {/* Step 3 - Review */}
            <div className={`form-step ${currentStep === 2 ? 'active' : ''}`}>
              <div className="review-card">
                <div className="review-title-large">{formData.title || "Untitled Report"}</div>
                
                <div className="review-details-grid">
                  <div className="review-detail-item">
                    <div className="review-icon-box"><i className="fa-regular fa-folder"></i></div>
                    <div className="review-text">
                      <label>Category</label>
                      <p>{formData.category || "Uncategorized"}</p>
                    </div>
                  </div>
                  <div className="review-detail-item">
                    <div className="review-icon-box"><i className="fa-regular fa-calendar"></i></div>
                    <div className="review-text">
                      <label>Date</label>
                      <p>{formatDate(formData.date)}</p>
                    </div>
                  </div>
                  <div className="review-detail-item">
                    <div className="review-icon-box"><i className="fa-solid fa-location-dot"></i></div>
                    <div className="review-text">
                      <label>Location</label>
                      <p>{formData.location || "No location"}</p>
                    </div>
                  </div>
                  <div className="review-detail-item">
                    <div className="review-icon-box"><i className="fa-solid fa-circle-exclamation"></i></div>
                    <div className="review-text">
                      <label>Severity</label>
                      <p>{formData.severity}</p>
                    </div>
                  </div>
                </div>

                <div className="review-section-label">Description</div>
                <div className="review-description-box">
                  {formData.description || "No description provided."}
                </div>

                <div className="review-section-label">Attachments</div>
                <div className="attachment-preview">
                  <i className="fa-solid fa-paperclip" style={{color:'var(--text-grey)'}}></i> 
                  <span>No files attached</span>
                </div>
              </div>

              <div className="captcha-box">
                <label className="captcha-container">
                  <input type="checkbox" />
                  I'm not a robot
                </label>
                <img src="https://www.gstatic.com/recaptcha/api2/logo_48.png" className="captcha-logo" alt="reCAPTCHA" />
              </div>
            </div>

            {/* Step 4 - Success */}
            <div className={`form-step ${currentStep === 3 ? 'active' : ''}`}>
              <div className="success-content">
                <div className="success-icon">
                  <i className="fa-solid fa-check"></i>
                </div>
                <h2>Report Submitted Successfully</h2>
                <p>Your report has been received and is under review.</p>
                <button className="modal-btn-primary" onClick={closeModal}>Back to Dashboard</button>
              </div>
            </div>
          </div>

          {currentStep < 3 && (
            <div className="modal-footer" style={{justifyContent: currentStep === 0 ? 'flex-end' : 'space-between'}}>
              {currentStep > 0 && (
                <button className="modal-btn-secondary" onClick={handleBack}>Back</button>
              )}
              <button className="modal-btn-primary" onClick={handleNext}>{getNextButtonText()}</button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}