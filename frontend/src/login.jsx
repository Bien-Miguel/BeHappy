// frontend/src/login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import clouds from './ui/clouds.png';
import characters from './ui/characters.png';
import logo from './ui/logo.png';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Employee');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
  e.preventDefault();
  setError('');
  setLoading(true);

  try {
    const result = await login(email, password);
    
    if (result.success) {
      if (result.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } else {
      setError(result.error);
    }
  } catch (error) {
    console.error('Login error:', error);
    setError(error.message || 'An unexpected error occurred. Please try again.');
  } finally {
    setLoading(false);
  }
};
  

  return (
    <>
      {/* External Resources */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap" rel="stylesheet" />
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />

      <style>{`
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        :root {
            --primary-blue: #64a6ff; 
            --button-blue: #5ba1fc;
            --button-shadow-blue: #2f74c7;
            --accent-green: #00cd78;
            --text-dark: #2d3436;
            --text-grey: #636e72;
            --input-bg: #d9d9d9; 
            --white: #ffffff;
            --shadow-grey: #cacaca;
            --alert-red: #ff6b6b;
        }

        body {
            font-family: 'Nunito', sans-serif;
            height: 100vh;
            display: flex;
            background-color: var(--white);
            margin: 0;
        }

        .app-container {
            display: flex;
            width: 100%;
            height: 100vh;
        }

        .left-panel {
            flex: 1;
            background-color: var(--primary-blue);
            background-image: url('ui/clouds.png'); 
            background-size: cover;
            background-position: bottom; 
            background-repeat: no-repeat;
            padding: 40px 60px 0 60px;
            display: flex;
            flex-direction: column;
            justify-content: flex-start; 
            position: relative;
            overflow: hidden; 
        }

        .logo {
            width: 250px;
            max-width: 100%;
            height: auto;
            margin-bottom: 40px;
            z-index: 1;
        }

        .hero-text {
            z-index: 1;
            margin-bottom: 20px;
        }

        .hero-text h1 {
            font-weight: 900; 
            font-size: 2.6rem;
            line-height: 1.2;
            margin-bottom: 20px;
            color: #1a1a1a; 
        }

        .hero-text p {
            font-size: 1.15rem;
            line-height: 1.5;
            color: #333;
            max-width: 90%;
            font-weight: 600;
        }

        .illustration {
            width: 100%;
            max-width: 650px; 
            height: auto;
            margin-top: auto; 
            align-self: center;
            z-index: 1;
            display: block;
            object-fit: contain;
        }

        .right-panel {
            flex: 1;
            background-color: var(--white);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 40px;
        }

        .login-wrapper {
            width: 100%;
            max-width: 420px;
            text-align: center;
        }

        .login-header h2 {
            color: var(--accent-green);
            font-weight: 900; 
            font-size: 2.2rem;
            margin-bottom: 15px;
        }

        .login-header p {
            color: var(--text-grey);
            font-size: 1.1rem;
            margin-bottom: 40px;
            font-weight: 600;
        }

        .role-toggle {
            display: flex;
            justify-content: space-between;
            margin-bottom: 30px;
            gap: 25px;
        }

        .role-btn {
            flex: 1;
            padding: 18px 20px;
            border-radius: 110px;
            border: 1px solid #f0f0f0;
            background: white;
            font-family: 'Nunito', sans-serif;
            font-size: 1.05rem;
            font-weight: 700;
            color: #555;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 12px;
            box-shadow: 5px 6px 0px 0px var(--shadow-grey);
            transition: all 0.1s ease; 
        }

        .role-btn.active {
            border-color: var(--button-blue);
            color: var(--button-blue);
        }
        .role-btn.active i {
            color: var(--button-blue);
        }

        .role-btn i {
            font-size: 1.2rem;
            color: #444;
        }

        .role-btn:active {
            transform: translate(2px, 2px);
            box-shadow: 2px 3px 0px 0px var(--shadow-grey);
        }

        .role-btn:hover {
            border-color: #dcdcdc;
        }
        
        .form-group {
            margin-bottom: 20px;
        }

        input[type="email"],
        input[type="password"] {
            width: 100%;
            padding: 16px 20px;
            border-radius: 12px;
            border: none;
            background-color: var(--input-bg);
            font-family: 'Nunito', sans-serif;
            font-size: 1rem;
            font-weight: 700;
            color: #444;
            outline: none;
        }

        input::placeholder {
            color: #7f8c8d;
            font-weight: 700;
        }

        .form-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 15px;
            margin-bottom: 35px;
            font-size: 0.95rem;
        }

        .remember-me {
            display: flex;
            align-items: center;
            gap: 10px;
            color: var(--text-grey);
            font-weight: 600;
            cursor: pointer;
        }

        .remember-me input {
            appearance: none;
            -webkit-appearance: none;
            width: 24px;
            height: 24px;
            background-color: white;
            border: 2px solid #ddd;
            border-radius: 50%;
            cursor: pointer;
        }
        .remember-me input:checked {
            background-color: var(--button-blue);
            border-color: var(--button-blue);
        }

        .forgot-pass {
            color: var(--accent-green);
            text-decoration: none;
            font-weight: 700;
        }

        .submit-btn {
            width: 100%;
            padding: 18px;
            border-radius: 50px;
            border: none;
            background-color: var(--button-blue);
            color: white;
            font-family: 'Nunito', sans-serif;
            font-weight: 800;
            font-size: 1.2rem;
            cursor: pointer;
            box-shadow: 5px 6px 0px 0px var(--button-shadow-blue);
            transition: all 0.1s ease;
            position: relative;
        }

        .submit-btn:hover {
            background-color: #4a90e2;
        }

        .submit-btn:active {
            transform: translate(2px, 2px);
            box-shadow: 2px 3px 0px 0px var(--button-shadow-blue);
        }

        .submit-btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }

        .error-message {
            background-color: #fee;
            border: 1px solid var(--alert-red);
            color: var(--alert-red);
            padding: 12px;
            border-radius: 8px;
            margin-bottom: 20px;
            font-weight: 700;
            font-size: 0.9rem;
            text-align: left;
        }

        @media (max-width: 900px) { 
            .app-container {
                flex-direction: column;
                height: auto;
            }
            .left-panel {
                min-height: auto;
                padding: 40px 30px 0 30px; 
            }
            .illustration {
                margin-top: 30px;
                max-width: 90%; 
            }
            .right-panel {
                padding: 40px 20px;
            }
        }
      `}</style>

      <div className="app-container">
        <div className="left-panel">
          
           <img src={logo} className="logo" />

          <div className="hero-text">
            <h1>Create a safer,<br/>healthier workplace</h1>
            <p>Empower your team to voice concerns anonymously while gaining insights to build a culture of trust and transparency.</p>
          </div>

          <img src={characters} className="illustration" />
          
        </div>

        <div className="right-panel">
          <div className="login-wrapper">
            <div className="login-header">
              <h2>Welcome Back</h2>
              <p>Sign in to your account to continue</p>
            </div>

            {error && (
                <div style={{
                    backgroundColor: '#fee',
                    border: '1px solid #ff6b6b',
                    color: '#ff6b6b',
                    padding: '12px',
                    borderRadius: '8px',
                    marginBottom: '20px',
                    fontWeight: '700',
                    fontSize: '0.9rem',
                    textAlign: 'left'
                }}>
                    <i className="fa-solid fa-circle-exclamation"></i> {error}
                </div>
            )}

            <div className="role-toggle">
              <button 
                className={`role-btn ${role === 'Employee' ? 'active' : ''}`}
                onClick={() => setRole('Employee')}
                type="button"
              >
                <i className="fa-regular fa-user"></i> Employee
              </button>
              <button 
                className={`role-btn ${role === 'Admin' ? 'active' : ''}`}
                onClick={() => setRole('Admin')}
                type="button"
              >
                <i className="fa-regular fa-user"></i> Admin
              </button>
            </div>

            <form onSubmit={handleLogin}>
              <div className="form-group">
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <input 
                  type="password" 
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="form-footer">
                <label className="remember-me">
                  <input type="checkbox" />
                  Remember me
                </label>
                <a href="#" className="forgot-pass">Forgot Password</a>
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}