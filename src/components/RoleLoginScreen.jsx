import React, { useState } from 'react';
import { 
  ChefHat, User, ShieldCheck, GraduationCap, ArrowRight, Lock, 
  Sparkles, Clock, CreditCard, CheckCircle2, Layers, Activity, 
  LogIn, KeyRound, AlertCircle, Utensils
} from 'lucide-react';

export const USER_ROLES = {
  student: {
    id: 'CS-402',
    name: 'Ashal Kumar',
    department: 'Computer Science & Engineering',
    year: '3rd Year • Section B',
    role: 'student',
    roleLabel: 'Student Portal',
    roleBadge: '🎓 Student',
    roleColor: 'var(--accent-teal)',
    roleBg: 'rgba(2, 132, 199, 0.1)',
    avatar: '👨‍🎓',
    tagline: 'Skip peak dinner counter rush & schedule tray pickups',
    permissions: [
      'Live fresh menu with real-time kitchen inventory',
      '15-minute slot pre-ordering with rush throttling',
      'Sub-second Campus Pass Wallet payment (offline-ready)',
      'Real-time order progress stepper & scannable QR pass'
    ]
  },
  staff: {
    id: 'KIT-08',
    name: 'Chef Ramesh',
    department: 'Canteen Kitchen Operations',
    year: 'Tawa & Counter 1 Lead',
    role: 'staff',
    roleLabel: 'Kitchen Staff Hub',
    roleBadge: '👨‍🍳 Kitchen Staff',
    roleColor: 'var(--accent-peach)',
    roleBg: 'rgba(255, 100, 61, 0.12)',
    avatar: '👨‍🍳',
    tagline: 'Live station load balancing & digital token broadcasts',
    permissions: [
      'Live incoming order tickets categorized by status',
      'Station throughput diagnostics (Tawa / Snacks / Drinks)',
      '1-click out-of-stock toggles & batch portion capping',
      'Wall-mounted cafeteria screen token announcement caller'
    ]
  },
  admin: {
    id: 'ADM-01',
    name: 'Rajesh Sharma',
    department: 'Campus Hospitality & Finance',
    year: 'Canteen General Manager',
    role: 'admin',
    roleLabel: 'Admin Management Hub',
    roleBadge: '🛡️ Canteen Admin',
    roleColor: 'var(--accent-purple)',
    roleBg: 'rgba(139, 92, 246, 0.12)',
    avatar: '🛡️',
    tagline: 'Menu pricing, slot capping, wallet credits & revenue',
    permissions: [
      'Full Menu & Pricing Studio (Add, edit price, tags & photos)',
      'Slot Capacity & Bottlenecks Controller (modify 15-min limits)',
      'Student Wallet Ledger (credit offline cash to digital balance)',
      'Financial Revenue Analytics (Wallet vs UPI vs Cash split)',
      'Broadcast real-time marquee alerts to all student devices'
    ]
  }
};

export default function RoleLoginScreen({ onLogin, onPlaySound }) {
  const [selectedRole, setSelectedRole] = useState('student');
  const [loginMode, setLoginMode] = useState('quick'); // 'quick' | 'form'
  const [idInput, setIdInput] = useState('CS-402');
  const [passwordInput, setPasswordInput] = useState('student123');
  const [authError, setAuthError] = useState('');

  const handleRoleSelect = (roleKey) => {
    onPlaySound?.('click');
    setSelectedRole(roleKey);
    setAuthError('');
    if (roleKey === 'student') {
      setIdInput('CS-402');
      setPasswordInput('student123');
    } else if (roleKey === 'staff') {
      setIdInput('KIT-08');
      setPasswordInput('chef123');
    } else {
      setIdInput('ADM-01');
      setPasswordInput('admin123');
    }
  };

  const handleQuickLogin = (roleKey) => {
    onPlaySound?.('success');
    const user = USER_ROLES[roleKey];
    onLogin(user);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!idInput.trim()) {
      setAuthError('Please enter your Campus ID.');
      return;
    }
    onPlaySound?.('success');
    const user = USER_ROLES[selectedRole];
    onLogin({
      ...user,
      id: idInput.trim()
    });
  };

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', animation: 'fadeIn 0.5s ease-out' }}>
      
      {/* Brand Header */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.85rem', marginBottom: '0.75rem' }}>
          <div 
            style={{ 
              background: 'var(--accent-peach-gradient)', 
              color: 'white', 
              width: '52px',
              height: '52px',
              borderRadius: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--accent-peach-glow)',
              border: '1.5px solid rgba(255, 255, 255, 0.6)'
            }}
          >
            <ChefHat size={28} />
          </div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h1 style={{ fontSize: '2.2rem', fontWeight: 800, lineHeight: 1 }}>CampusBite</h1>
              <span style={{ 
                background: 'rgba(255, 100, 61, 0.12)', 
                color: 'var(--accent-peach)', 
                fontSize: '0.72rem', 
                fontWeight: 700, 
                padding: '2px 8px', 
                borderRadius: '999px',
                border: '1px solid rgba(255, 100, 61, 0.25)'
              }}>
                iOS 27 Glass
              </span>
            </div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', fontWeight: 500 }}>
              Next-Gen College Canteen Queue Intelligence & Access Gateway
            </span>
          </div>
        </div>

        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '620px', margin: '0 auto', lineHeight: 1.5 }}>
          Sign in to your designated portal. Each role provides access exclusively to the features and management tools relevant to your duties.
        </p>
      </div>

      {/* Mode Switcher: 1-Click Role Direct Access vs Custom Credential Login */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', background: 'rgba(0, 0, 0, 0.04)', borderRadius: '18px', padding: '0.3rem', border: '1px solid rgba(255, 255, 255, 0.7)' }}>
          <button
            onClick={() => {
              onPlaySound?.('click');
              setLoginMode('quick');
            }}
            className="nav-tab-btn"
            style={{
              padding: '0.45rem 1.4rem',
              fontSize: '0.86rem',
              borderRadius: '14px',
              background: loginMode === 'quick' ? 'white' : 'transparent',
              color: loginMode === 'quick' ? 'var(--text-primary)' : 'var(--text-tertiary)',
              boxShadow: loginMode === 'quick' ? '0 4px 14px rgba(0,0,0,0.06)' : 'none',
              fontWeight: 700
            }}
          >
            ⚡ 1-Click Role Selection
          </button>
          <button
            onClick={() => {
              onPlaySound?.('click');
              setLoginMode('form');
            }}
            className="nav-tab-btn"
            style={{
              padding: '0.45rem 1.4rem',
              fontSize: '0.86rem',
              borderRadius: '14px',
              background: loginMode === 'form' ? 'white' : 'transparent',
              color: loginMode === 'form' ? 'var(--text-primary)' : 'var(--text-tertiary)',
              boxShadow: loginMode === 'form' ? '0 4px 14px rgba(0,0,0,0.06)' : 'none',
              fontWeight: 700
            }}
          >
            🔑 Credentials Form
          </button>
        </div>
      </div>

      {/* VIEW 1: 3 Role Cards with Instant 1-Click Access */}
      {loginMode === 'quick' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          
          {/* Card 1: Student Portal */}
          <div 
            className="glass-panel glass-card-interactive" 
            style={{ 
              padding: '1.6rem', 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'space-between',
              borderRadius: 'var(--radius-lg)',
              border: '1.5px solid rgba(2, 132, 199, 0.25)',
              background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.85) 0%, rgba(240, 249, 255, 0.6) 100%)',
              boxShadow: '0 16px 36px -10px rgba(2, 132, 199, 0.12)'
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <div style={{ 
                  background: 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)', 
                  color: 'white', 
                  width: '48px', 
                  height: '48px', 
                  borderRadius: '16px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  boxShadow: '0 6px 16px rgba(2, 132, 199, 0.35)'
                }}>
                  <GraduationCap size={24} />
                </div>
                <span style={{ 
                  fontSize: '0.74rem', 
                  fontWeight: 800, 
                  color: 'var(--accent-teal)', 
                  background: 'rgba(2, 132, 199, 0.1)', 
                  border: '1px solid rgba(2, 132, 199, 0.25)',
                  padding: '3px 9px', 
                  borderRadius: '999px' 
                }}>
                  🎓 Student Access
                </span>
              </div>

              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '0.25rem', color: 'var(--text-primary)' }}>
                Student Portal
              </h3>
              
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.85rem' }}>
                Demo User: Ashal Kumar <span style={{ color: 'var(--accent-teal)' }}>(#CS-402)</span>
              </div>

              <p style={{ fontSize: '0.82rem', color: 'var(--text-tertiary)', lineHeight: 1.45, marginBottom: '1.25rem' }}>
                Designed for students to skip dinner queues, order hot dishes, reserve 15-min pickup slots, and pay with 1-sec Campus Pass Wallet.
              </p>

              {/* Permissions List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem', marginBottom: '1.5rem' }}>
                {USER_ROLES.student.permissions.map((perm, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    <CheckCircle2 size={15} style={{ color: 'var(--accent-teal)', flexShrink: 0, marginTop: '2px' }} />
                    <span>{perm}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => handleQuickLogin('student')}
              className="glass-btn glass-btn-teal"
              style={{ width: '100%', padding: '0.75rem', borderRadius: '14px', fontWeight: 700, fontSize: '0.9rem' }}
            >
              Sign In as Student ➔
            </button>
          </div>

          {/* Card 2: Kitchen Staff */}
          <div 
            className="glass-panel glass-card-interactive" 
            style={{ 
              padding: '1.6rem', 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'space-between',
              borderRadius: 'var(--radius-lg)',
              border: '1.5px solid rgba(255, 100, 61, 0.25)',
              background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.85) 0%, rgba(255, 247, 245, 0.6) 100%)',
              boxShadow: '0 16px 36px -10px rgba(255, 100, 61, 0.12)'
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <div style={{ 
                  background: 'var(--accent-peach-gradient)', 
                  color: 'white', 
                  width: '48px', 
                  height: '48px', 
                  borderRadius: '16px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  boxShadow: 'var(--accent-peach-glow)'
                }}>
                  <ChefHat size={24} />
                </div>
                <span style={{ 
                  fontSize: '0.74rem', 
                  fontWeight: 800, 
                  color: 'var(--accent-peach)', 
                  background: 'rgba(255, 100, 61, 0.1)', 
                  border: '1px solid rgba(255, 100, 61, 0.25)',
                  padding: '3px 9px', 
                  borderRadius: '999px' 
                }}>
                  👨‍🍳 Kitchen Staff
                </span>
              </div>

              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '0.25rem', color: 'var(--text-primary)' }}>
                Kitchen Staff Hub
              </h3>
              
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.85rem' }}>
                Demo User: Chef Ramesh <span style={{ color: 'var(--accent-peach)' }}>(#KIT-08)</span>
              </div>

              <p style={{ fontSize: '0.82rem', color: 'var(--text-tertiary)', lineHeight: 1.45, marginBottom: '1.25rem' }}>
                Designed for canteen chefs to manage incoming order queue tickets, monitor station loads, update dish stock, and call ready tokens.
              </p>

              {/* Permissions List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem', marginBottom: '1.5rem' }}>
                {USER_ROLES.staff.permissions.map((perm, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    <CheckCircle2 size={15} style={{ color: 'var(--accent-peach)', flexShrink: 0, marginTop: '2px' }} />
                    <span>{perm}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => handleQuickLogin('staff')}
              className="glass-btn glass-btn-primary"
              style={{ width: '100%', padding: '0.75rem', borderRadius: '14px', fontWeight: 700, fontSize: '0.9rem' }}
            >
              Sign In as Kitchen Staff ➔
            </button>
          </div>

          {/* Card 3: Canteen Admin */}
          <div 
            className="glass-panel glass-card-interactive" 
            style={{ 
              padding: '1.6rem', 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'space-between',
              borderRadius: 'var(--radius-lg)',
              border: '1.5px solid rgba(139, 92, 246, 0.25)',
              background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.85) 0%, rgba(250, 245, 255, 0.6) 100%)',
              boxShadow: '0 16px 36px -10px rgba(139, 92, 246, 0.12)'
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <div style={{ 
                  background: 'linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%)', 
                  color: 'white', 
                  width: '48px', 
                  height: '48px', 
                  borderRadius: '16px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  boxShadow: '0 6px 16px rgba(139, 92, 246, 0.35)'
                }}>
                  <ShieldCheck size={24} />
                </div>
                <span style={{ 
                  fontSize: '0.74rem', 
                  fontWeight: 800, 
                  color: 'var(--accent-purple)', 
                  background: 'rgba(139, 92, 246, 0.1)', 
                  border: '1px solid rgba(139, 92, 246, 0.25)',
                  padding: '3px 9px', 
                  borderRadius: '999px' 
                }}>
                  🛡️ Canteen Admin
                </span>
              </div>

              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '0.25rem', color: 'var(--text-primary)' }}>
                Admin Management Hub
              </h3>
              
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.85rem' }}>
                Demo User: Rajesh Sharma <span style={{ color: 'var(--accent-purple)' }}>(#ADM-01)</span>
              </div>

              <p style={{ fontSize: '0.82rem', color: 'var(--text-tertiary)', lineHeight: 1.45, marginBottom: '1.25rem' }}>
                Designed for canteen managers to edit dishes & pricing, throttle queue slot limits, credit student wallets, and broadcast marquee alerts.
              </p>

              {/* Permissions List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem', marginBottom: '1.5rem' }}>
                {USER_ROLES.admin.permissions.map((perm, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    <CheckCircle2 size={15} style={{ color: 'var(--accent-purple)', flexShrink: 0, marginTop: '2px' }} />
                    <span>{perm}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => handleQuickLogin('admin')}
              className="glass-btn"
              style={{ 
                width: '100%', 
                padding: '0.75rem', 
                borderRadius: '14px', 
                fontWeight: 700, 
                fontSize: '0.9rem',
                background: 'linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%)',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.4)',
                boxShadow: '0 4px 14px rgba(124, 58, 237, 0.35)'
              }}
            >
              Sign In as Admin ➔
            </button>
          </div>

        </div>
      ) : (
        /* VIEW 2: Traditional ID & Password Credentials Form */
        <div 
          className="glass-panel" 
          style={{ 
            maxWidth: '520px', 
            margin: '0 auto 2.5rem auto', 
            padding: '2.2rem 2rem', 
            borderRadius: 'var(--radius-lg)' 
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.5rem' }}>
            <div style={{ background: 'var(--accent-peach-light)', padding: '7px', borderRadius: '12px' }}>
              <KeyRound size={22} style={{ color: 'var(--accent-peach)' }} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Campus Portal Login</h3>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>
                Authenticate with your university credentials
              </span>
            </div>
          </div>

          <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
            
            {/* Role Target Dropdown */}
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '0.35rem' }}>
                Select Desired Role:
              </label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {Object.keys(USER_ROLES).map(k => {
                  const roleObj = USER_ROLES[k];
                  const isSel = selectedRole === k;
                  return (
                    <button
                      key={k}
                      type="button"
                      onClick={() => handleRoleSelect(k)}
                      className="glass-btn"
                      style={{
                        flex: 1,
                        padding: '0.5rem',
                        fontSize: '0.78rem',
                        borderRadius: '10px',
                        background: isSel ? 'var(--text-primary)' : 'rgba(255, 255, 255, 0.7)',
                        color: isSel ? 'white' : 'var(--text-secondary)',
                        border: isSel ? '1px solid var(--text-primary)' : '1px solid rgba(226, 232, 240, 0.9)',
                        fontWeight: 700
                      }}
                    >
                      {roleObj.roleBadge}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Campus ID */}
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '0.35rem' }}>
                Campus ID / Staff ID:
              </label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="text" 
                  value={idInput}
                  onChange={(e) => setIdInput(e.target.value)}
                  className="glass-input" 
                  style={{ padding: '0.65rem 1rem', width: '100%', fontSize: '0.92rem' }}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '0.35rem' }}>
                PIN / Password:
              </label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="password" 
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="glass-input" 
                  style={{ padding: '0.65rem 1rem', width: '100%', fontSize: '0.92rem' }}
                  required
                />
              </div>
            </div>

            {authError && (
              <div style={{ background: 'var(--accent-red-light)', color: 'var(--accent-red)', padding: '0.6rem 0.85rem', borderRadius: '10px', fontSize: '0.82rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <AlertCircle size={15} /> {authError}
              </div>
            )}

            <button 
              type="submit" 
              className="glass-btn glass-btn-primary" 
              style={{ width: '100%', padding: '0.75rem', borderRadius: '12px', fontSize: '0.92rem', fontWeight: 700, marginTop: '0.5rem' }}
            >
              Sign In to {USER_ROLES[selectedRole].roleLabel} ➔
            </button>
          </form>
        </div>
      )}

      {/* Feature Comparison Pill */}
      <div 
        className="glass-panel" 
        style={{ 
          padding: '1rem 1.5rem', 
          textAlign: 'center', 
          background: 'rgba(255, 255, 255, 0.65)', 
          borderRadius: 'var(--radius-md)',
          fontSize: '0.84rem',
          color: 'var(--text-secondary)'
        }}
      >
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}>
          <Sparkles size={16} style={{ color: 'var(--accent-peach)' }} />
          <span>Strict Role-Based Security: Logging in reveals only the tools authorized for that role.</span>
        </div>
      </div>

    </div>
  );
}
