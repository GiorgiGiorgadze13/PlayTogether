import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import type { TranslationContent } from '../types/translations';
import { ApiError } from '../services/api';

interface AuthModalProps {
  c: TranslationContent;
}

export const AuthModal: React.FC<AuthModalProps> = ({ c }) => {
  const { isAuthModalOpen, authModalMode, closeAuthModal, login, register, openAuthModal } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Error states
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when modal opens or mode changes
  useEffect(() => {
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setErrorMsg(null);
    setFieldErrors({});
    setTouched({});
    setSuccessMsg(null);
    setShowPassword(false);
  }, [authModalMode, isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  // Validation function
  const validateField = (field: string, value: string) => {
    let err = '';
    if (field === 'name' && authModalMode === 'register') {
      if (!value.trim()) {
        err = 'Full name is required.';
      } else if (value.trim().length < 2) {
        err = 'Name must be at least 2 characters long.';
      }
    } else if (field === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value.trim()) {
        err = 'Email address is required.';
      } else if (!emailRegex.test(value.trim())) {
        err = 'Please enter a valid email address (e.g. name@domain.com).';
      }
    } else if (field === 'password') {
      if (!value) {
        err = 'Password is required.';
      } else if (authModalMode === 'register' && value.length < 6) {
        err = 'Password must be at least 6 characters.';
      }
    } else if (field === 'confirmPassword' && authModalMode === 'register') {
      if (!value) {
        err = 'Please confirm your password.';
      } else if (value !== password) {
        err = 'Passwords do not match.';
      }
    }
    return err;
  };

  const handleBlur = (field: string, value: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const err = validateField(field, value);
    setFieldErrors((prev) => ({ ...prev, [field]: err }));
  };

  const calculatePasswordStrength = (pwd: string) => {
    if (!pwd) return { label: '', color: 'transparent', width: '0%' };
    if (pwd.length < 6) return { label: 'Weak (min 6 chars)', color: '#ff4d4d', width: '33%' };
    const hasLetters = /[a-zA-Z]/.test(pwd);
    const hasNumbers = /[0-9]/.test(pwd);
    const hasSpecial = /[^a-zA-Z0-9]/.test(pwd);

    if (pwd.length >= 8 && hasLetters && hasNumbers && hasSpecial) {
      return { label: 'Strong', color: '#c9ff35', width: '100%' };
    }
    if (pwd.length >= 6 && hasLetters && hasNumbers) {
      return { label: 'Medium', color: '#ffb703', width: '66%' };
    }
    return { label: 'Weak', color: '#ff4d4d', width: '33%' };
  };

  const passwordStrength = calculatePasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    // Validate all fields
    const errors: { [key: string]: string } = {};
    if (authModalMode === 'register') {
      const nameErr = validateField('name', name);
      if (nameErr) errors.name = nameErr;

      const confirmErr = validateField('confirmPassword', confirmPassword);
      if (confirmErr) errors.confirmPassword = confirmErr;
    }

    const emailErr = validateField('email', email);
    if (emailErr) errors.email = emailErr;

    const passwordErr = validateField('password', password);
    if (passwordErr) errors.password = passwordErr;

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setTouched({ name: true, email: true, password: true, confirmPassword: true });
      setErrorMsg('Please fix the validation errors below before submitting.');
      return;
    }

    setIsSubmitting(true);

    try {
      if (authModalMode === 'login') {
        await login(email, password);
        setSuccessMsg(`🎉 Welcome back! Login successful.`);
      } else {
        await register(name, email, password);
        setSuccessMsg(`🎉 Account created successfully! Welcome to PlayTogether, ${name}!`);
      }

      // Automatically close modal after brief success feedback
      setTimeout(() => {
        closeAuthModal();
      }, 1400);
    } catch (err) {
      if (err instanceof ApiError) {
        setErrorMsg(err.message);
      } else if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(8px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
      onClick={closeAuthModal}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          background: '#151719',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: '20px',
          padding: '32px',
          boxShadow: '0 25px 70px rgba(0, 0, 0, 0.7)',
          position: 'relative',
          color: '#ffffff',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={closeAuthModal}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'none',
            border: 'none',
            color: 'rgba(255,255,255,0.5)',
            fontSize: '20px',
            cursor: 'pointer',
          }}
        >
          ✕
        </button>

        <h2 style={{ fontSize: '26px', fontWeight: 800, marginBottom: '6px', color: '#fff' }}>
          {authModalMode === 'login' ? c.login : c.signup}
        </h2>
        <p style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.55)', marginBottom: '24px' }}>
          {authModalMode === 'login'
            ? 'Sign in to book stadiums and join matches.'
            : 'Create an account to join the PlayTogether community.'}
        </p>

        {/* Global Error Banner */}
        {errorMsg && (
          <div
            style={{
              padding: '14px 16px',
              backgroundColor: 'rgba(255, 77, 77, 0.15)',
              border: '1px solid rgba(255, 77, 77, 0.4)',
              borderRadius: '12px',
              color: '#ff6b6b',
              fontSize: '13px',
              fontWeight: 600,
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span>⚠️</span>
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Global Success Banner */}
        {successMsg && (
          <div
            style={{
              padding: '14px 16px',
              backgroundColor: 'rgba(201, 255, 53, 0.15)',
              border: '1px solid rgba(201, 255, 53, 0.4)',
              borderRadius: '12px',
              color: '#c9ff35',
              fontSize: '14px',
              fontWeight: 700,
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }} noValidate>
          {authModalMode === 'register' && (
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.8)', marginBottom: '6px' }}>
                Full Name <span style={{ color: '#ff6b6b' }}>*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (touched.name) setFieldErrors((prev) => ({ ...prev, name: validateField('name', e.target.value) }));
                }}
                onBlur={(e) => handleBlur('name', e.target.value)}
                placeholder="e.g. Giorgi Giorgadze"
                style={{
                  width: '100%',
                  height: '46px',
                  padding: '0 14px',
                  background: '#0d0f11',
                  border: fieldErrors.name && touched.name ? '1px solid #ff4d4d' : '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '10px',
                  color: '#fff',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border-color 0.2s ease',
                }}
              />
              {fieldErrors.name && touched.name && (
                <span style={{ color: '#ff6b6b', fontSize: '12px', fontWeight: 600, marginTop: '4px', display: 'block' }}>
                  ⚠️ {fieldErrors.name}
                </span>
              )}
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.8)', marginBottom: '6px' }}>
              Email Address <span style={{ color: '#ff6b6b' }}>*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (touched.email) setFieldErrors((prev) => ({ ...prev, email: validateField('email', e.target.value) }));
              }}
              onBlur={(e) => handleBlur('email', e.target.value)}
              placeholder="name@example.com"
              style={{
                width: '100%',
                height: '46px',
                padding: '0 14px',
                background: '#0d0f11',
                border: fieldErrors.email && touched.email ? '1px solid #ff4d4d' : '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '10px',
                color: '#fff',
                fontSize: '14px',
                outline: 'none',
                transition: 'border-color 0.2s ease',
              }}
            />
            {fieldErrors.email && touched.email && (
              <span style={{ color: '#ff6b6b', fontSize: '12px', fontWeight: 600, marginTop: '4px', display: 'block' }}>
                ⚠️ {fieldErrors.email}
              </span>
            )}
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.8)' }}>
                Password <span style={{ color: '#ff6b6b' }}>*</span>
              </label>
              {authModalMode === 'register' && (
                <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)', fontWeight: 600 }}>
                  Min 6 characters
                </span>
              )}
            </div>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (touched.password) setFieldErrors((prev) => ({ ...prev, password: validateField('password', e.target.value) }));
                  if (authModalMode === 'register' && touched.confirmPassword) {
                    setFieldErrors((prev) => ({ ...prev, confirmPassword: e.target.value !== confirmPassword ? 'Passwords do not match.' : '' }));
                  }
                }}
                onBlur={(e) => handleBlur('password', e.target.value)}
                placeholder="••••••••"
                style={{
                  width: '100%',
                  height: '46px',
                  padding: '0 40px 0 14px',
                  background: '#0d0f11',
                  border: fieldErrors.password && touched.password ? '1px solid #ff4d4d' : '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '10px',
                  color: '#fff',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border-color 0.2s ease',
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'rgba(255, 255, 255, 0.6)',
                  cursor: 'pointer',
                  fontSize: '16px',
                  padding: '4px',
                }}
                title={showPassword ? 'Hide Password' : 'Show Password'}
              >
                {showPassword ? '👁️' : '🙈'}
              </button>
            </div>
            {fieldErrors.password && touched.password && (
              <span style={{ color: '#ff6b6b', fontSize: '12px', fontWeight: 600, marginTop: '4px', display: 'block' }}>
                ⚠️ {fieldErrors.password}
              </span>
            )}

            {/* Password Strength Meter */}
            {authModalMode === 'register' && password.length > 0 && (
              <div style={{ marginTop: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 700, marginBottom: '4px' }}>
                  <span style={{ color: 'rgba(255,255,255,0.5)' }}>Password Strength:</span>
                  <span style={{ color: passwordStrength.color }}>{passwordStrength.label}</span>
                </div>
                <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: passwordStrength.width,
                      background: passwordStrength.color,
                      transition: 'all 0.3s ease',
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password field for Registration */}
          {authModalMode === 'register' && (
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.8)', marginBottom: '6px' }}>
                Confirm Password <span style={{ color: '#ff6b6b' }}>*</span>
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (touched.confirmPassword) {
                    setFieldErrors((prev) => ({
                      ...prev,
                      confirmPassword: e.target.value !== password ? 'Passwords do not match.' : '',
                    }));
                  }
                }}
                onBlur={(e) => handleBlur('confirmPassword', e.target.value)}
                placeholder="Re-enter your password"
                style={{
                  width: '100%',
                  height: '46px',
                  padding: '0 14px',
                  background: '#0d0f11',
                  border: fieldErrors.confirmPassword && touched.confirmPassword ? '1px solid #ff4d4d' : '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '10px',
                  color: '#fff',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border-color 0.2s ease',
                }}
              />
              {fieldErrors.confirmPassword && touched.confirmPassword && (
                <span style={{ color: '#ff6b6b', fontSize: '12px', fontWeight: 600, marginTop: '4px', display: 'block' }}>
                  ⚠️ {fieldErrors.confirmPassword}
                </span>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting || !!successMsg}
            style={{
              height: '48px',
              marginTop: '6px',
              background: '#c9ff35',
              color: '#070809',
              fontWeight: 800,
              fontSize: '14px',
              borderRadius: '10px',
              border: 'none',
              cursor: isSubmitting || successMsg ? 'not-allowed' : 'pointer',
              opacity: isSubmitting ? 0.7 : 1,
              transition: 'all 0.2s ease',
            }}
          >
            {isSubmitting
              ? 'Processing...'
              : successMsg
              ? '✓ Done'
              : authModalMode === 'login'
              ? c.login
              : c.signup}
          </button>
        </form>

        <div style={{ marginTop: '22px', textAlign: 'center', fontSize: '13px', color: 'rgba(255,255,255,0.55)' }}>
          {authModalMode === 'login' ? (
            <>
              Don't have an account?{' '}
              <button
                onClick={() => openAuthModal('register')}
                style={{ background: 'none', border: 'none', color: '#c9ff35', fontWeight: 800, cursor: 'pointer', textDecoration: 'underline' }}
              >
                {c.signup}
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button
                onClick={() => openAuthModal('login')}
                style={{ background: 'none', border: 'none', color: '#c9ff35', fontWeight: 800, cursor: 'pointer', textDecoration: 'underline' }}
              >
                {c.login}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
