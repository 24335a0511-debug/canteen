import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Utensils, 
  GraduationCap, 
  UtensilsCrossed, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  Loader2, 
  AlertCircle 
} from 'lucide-react';
import { authService } from '../services/authService';

const ROLE_TABS = [
  { key: 'student', label: 'Student', icon: GraduationCap },
  { key: 'staff', label: 'Kitchen Staff', icon: UtensilsCrossed },
  { key: 'admin', label: 'Admin', icon: ShieldCheck }
];

export default function LoginPage({ onLoginSuccess, onPlaySound }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedRole, setSelectedRole] = useState('student');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [infoNotice, setInfoNotice] = useState('');
  const [focusedField, setFocusedField] = useState(null);

  // Catch any route redirect notice
  useEffect(() => {
    if (location.state?.message) {
      setInfoNotice(location.state.message);
    }
  }, [location]);

  const handleRoleChange = (roleKey) => {
    onPlaySound?.('click');
    setSelectedRole(roleKey);
    setErrorMessage('');
    setInfoNotice('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setInfoNotice('');

    if (!identifier.trim()) {
      setErrorMessage('Please enter your Campus ID or Email.');
      onPlaySound?.('error');
      return;
    }

    if (!password) {
      setErrorMessage('Please enter your account password.');
      onPlaySound?.('error');
      return;
    }

    try {
      setLoading(true);
      const result = await authService.login({
        role: selectedRole,
        identifier: identifier.trim(),
        password,
        rememberMe
      });

      onPlaySound?.('success');
      if (onLoginSuccess) {
        onLoginSuccess(result.user);
      }

      const targetPath = location.state?.from?.pathname || authService.getDashboardPath(result.user.role);
      navigate(targetPath, { replace: true });
    } catch (err) {
      setErrorMessage(err.message || 'Authentication failed. Please verify your credentials.');
      onPlaySound?.('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999,
        backgroundColor: '#FAF9F6',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        color: '#252525'
      }}
    >
      <div
        style={{
          margin: 'auto',
          width: '100%',
          maxWidth: '410px',
          padding: '2.5rem 1.25rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          boxSizing: 'border-box'
        }}
      >
        {/* Minimal Branding */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '9px',
            marginBottom: '1.75rem',
            userSelect: 'none'
          }}
        >
          <div
            style={{
              width: '30px',
              height: '30px',
              borderRadius: '7px',
              backgroundColor: '#C66B4E',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF'
            }}
          >
            <Utensils size={16} strokeWidth={2.2} />
          </div>
          <span
            style={{
              fontSize: '1.125rem',
              fontWeight: 600,
              letterSpacing: '-0.025em',
              color: '#252525'
            }}
          >
            CampusBite
          </span>
        </div>

        {/* Login Container */}
        <div
          style={{
            width: '100%',
            backgroundColor: '#FFFFFF',
            border: '1px solid #EAE7E1',
            borderRadius: '12px',
            padding: '2.25rem 2rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02), 0 6px 18px -4px rgba(0, 0, 0, 0.03)',
            boxSizing: 'border-box'
          }}
        >
          {/* Heading */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h1
              style={{
                fontSize: '1.375rem',
                fontWeight: 600,
                color: '#252525',
                letterSpacing: '-0.025em',
                margin: '0 0 0.35rem 0'
              }}
            >
              Welcome back
            </h1>
            <p
              style={{
                fontSize: '0.875rem',
                color: '#77736E',
                margin: 0,
                lineHeight: 1.45
              }}
            >
              Sign in to continue to CampusBite.
            </p>
          </div>

          {/* Segmented Role Selection Tabs */}
          <div
            style={{
              display: 'flex',
              backgroundColor: '#F5F3EF',
              border: '1px solid #EAE7E1',
              borderRadius: '8px',
              padding: '3px',
              marginBottom: '1.5rem',
              gap: '3px'
            }}
            role="tablist"
            aria-label="Select role"
          >
            {ROLE_TABS.map((role) => {
              const isSelected = selectedRole === role.key;
              const Icon = role.icon;
              return (
                <button
                  key={role.key}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => handleRoleChange(role.key)}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    padding: '7px 6px',
                    fontSize: '0.8125rem',
                    fontWeight: isSelected ? 600 : 500,
                    color: isSelected ? '#252525' : '#77736E',
                    backgroundColor: isSelected ? '#FFFFFF' : 'transparent',
                    border: isSelected ? '1px solid rgba(0, 0, 0, 0.04)' : '1px solid transparent',
                    borderRadius: '6px',
                    boxShadow: isSelected ? '0 1px 2px rgba(0, 0, 0, 0.04)' : 'none',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    outline: 'none',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <Icon 
                    size={14} 
                    strokeWidth={isSelected ? 2 : 1.75} 
                    style={{ color: isSelected ? '#C66B4E' : '#77736E' }} 
                  />
                  <span>{role.label}</span>
                </button>
              );
            })}
          </div>

          {/* Redirect Notice Banner (if applicable) */}
          {infoNotice && (
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px',
                backgroundColor: '#FBF9F5',
                border: '1px solid #EAE7E1',
                color: '#77736E',
                padding: '0.625rem 0.75rem',
                borderRadius: '8px',
                fontSize: '0.8125rem',
                lineHeight: 1.4,
                marginBottom: '1.25rem'
              }}
            >
              <AlertCircle size={15} style={{ flexShrink: 0, marginTop: '2px', color: '#C66B4E' }} />
              <span>{infoNotice}</span>
            </div>
          )}

          {/* Error Message Box */}
          {errorMessage && (
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px',
                backgroundColor: '#FEF2F2',
                border: '1px solid #FEE2E2',
                color: '#991B1B',
                padding: '0.625rem 0.75rem',
                borderRadius: '8px',
                fontSize: '0.8125rem',
                lineHeight: 1.4,
                marginBottom: '1.25rem'
              }}
            >
              <AlertCircle size={15} style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate>
            {/* Campus ID or Email */}
            <div style={{ marginBottom: '1.125rem' }}>
              <label
                htmlFor="identifier"
                style={{
                  display: 'block',
                  fontSize: '0.8125rem',
                  fontWeight: 500,
                  color: '#252525',
                  marginBottom: '0.4rem'
                }}
              >
                Campus ID or Email
              </label>
              <input
                id="identifier"
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder={
                  selectedRole === 'student' 
                    ? 'CS-402 or student@campusbite.edu' 
                    : selectedRole === 'staff' 
                    ? 'KIT-08 or chef@campusbite.edu' 
                    : 'ADM-01 or admin@campusbite.edu'
                }
                disabled={loading}
                autoComplete="username"
                style={{
                  width: '100%',
                  height: '42px',
                  padding: '0 0.875rem',
                  fontSize: '0.875rem',
                  color: '#252525',
                  backgroundColor: '#FFFFFF',
                  border: focusedField === 'identifier' ? '1px solid #C66B4E' : '1px solid #EAE7E1',
                  boxShadow: focusedField === 'identifier' ? '0 0 0 3px rgba(198, 107, 78, 0.12)' : 'none',
                  borderRadius: '8px',
                  outline: 'none',
                  transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
                  boxSizing: 'border-box'
                }}
                onFocus={() => setFocusedField('identifier')}
                onBlur={() => setFocusedField(null)}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label
                htmlFor="password"
                style={{
                  display: 'block',
                  fontSize: '0.8125rem',
                  fontWeight: 500,
                  color: '#252525',
                  marginBottom: '0.4rem'
                }}
              >
                Password
              </label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  disabled={loading}
                  autoComplete="current-password"
                  style={{
                    width: '100%',
                    height: '42px',
                    padding: '0 2.5rem 0 0.875rem',
                    fontSize: '0.875rem',
                    color: '#252525',
                    backgroundColor: '#FFFFFF',
                    border: focusedField === 'password' ? '1px solid #C66B4E' : '1px solid #EAE7E1',
                    boxShadow: focusedField === 'password' ? '0 0 0 3px rgba(198, 107, 78, 0.12)' : 'none',
                    borderRadius: '8px',
                    outline: 'none',
                    transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
                    boxSizing: 'border-box'
                  }}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '0.625rem',
                    background: 'none',
                    border: 'none',
                    padding: '4px',
                    color: '#77736E',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    outline: 'none',
                    borderRadius: '4px'
                  }}
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Remember Me Option */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <label
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '0.8125rem',
                  color: '#77736E',
                  cursor: 'pointer',
                  userSelect: 'none'
                }}
              >
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{
                    width: '15px',
                    height: '15px',
                    borderRadius: '4px',
                    accentColor: '#C66B4E',
                    cursor: 'pointer'
                  }}
                />
                <span>Remember me</span>
              </label>
            </div>

            {/* Full-width Sign In Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                height: '42px',
                backgroundColor: loading ? '#D9947E' : '#C66B4E',
                color: '#FFFFFF',
                fontSize: '0.875rem',
                fontWeight: 600,
                border: 'none',
                borderRadius: '8px',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'background-color 0.15s ease, transform 0.1s ease',
                outline: 'none'
              }}
              onMouseEnter={(e) => {
                if (!loading) e.currentTarget.style.backgroundColor = '#B55D40';
              }}
              onMouseLeave={(e) => {
                if (!loading) e.currentTarget.style.backgroundColor = '#C66B4E';
              }}
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="spin-animate" />
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>
        </div>

        {/* Understated Campus Portal Footer */}
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <p
            style={{
              fontSize: '0.75rem',
              color: '#77736E',
              margin: 0,
              letterSpacing: '0.01em'
            }}
          >
            CampusBite Portal • Dining &amp; Order Management
          </p>
        </div>
      </div>
    </div>
  );
}
