import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import type { TranslationContent } from '../types/translations';
import { ApiError } from '../services/api';
import { PaymentCardModal } from './PaymentCardModal';

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
  const [showCardModal, setShowCardModal] = useState(false);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const validateField = (field: string, value: string) => {
    let err = '';
    if (field === 'name' && authModalMode === 'register') {
      if (!value.trim()) err = c.nameRequired;
      else if (value.trim().length < 2) err = c.nameMinLength;
    } else if (field === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value.trim()) err = c.emailRequired;
      else if (!emailRegex.test(value.trim())) err = c.emailInvalid;
    } else if (field === 'password') {
      if (!value) err = c.passwordRequired;
      else if (authModalMode === 'register' && value.length < 6) err = c.passwordMinLength;
    } else if (field === 'confirmPassword' && authModalMode === 'register') {
      if (!value) err = c.confirmPasswordRequired;
      else if (value !== password) err = c.passwordsMismatch;
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
    if (pwd.length < 6) return { label: c.pwWeakMin, color: '#ff4d4d', width: '33%' };
    const hasLetters = /[a-zA-Z]/.test(pwd);
    const hasNumbers = /[0-9]/.test(pwd);
    const hasSpecial = /[^a-zA-Z0-9]/.test(pwd);
    if (pwd.length >= 8 && hasLetters && hasNumbers && hasSpecial)
      return { label: c.pwStrong, color: '#c9ff35', width: '100%' };
    if (pwd.length >= 6 && hasLetters && hasNumbers)
      return { label: c.pwMedium, color: '#ffb703', width: '66%' };
    return { label: c.pwWeak, color: '#ff4d4d', width: '33%' };
  };

  const passwordStrength = calculatePasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

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
      setErrorMsg(c.validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      if (authModalMode === 'login') {
        await login(email, password);
        setSuccessMsg(c.loginSuccess);
        setTimeout(() => { closeAuthModal(); }, 1400);
      } else {
        await register(name, email, password);
        setSuccessMsg(c.registerSuccess);
        setTimeout(() => { setShowCardModal(true); }, 1000);
      }
    } catch (err) {
      if (err instanceof ApiError) setErrorMsg(err.message);
      else if (err instanceof Error) setErrorMsg(err.message);
      else setErrorMsg(c.unexpectedError);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showCardModal) {
    return (
      <PaymentCardModal
        onClose={() => { setShowCardModal(false); closeAuthModal(); }}
        onSuccess={() => { setShowCardModal(false); closeAuthModal(); }}
        actionLabel={c.completeSetup}
      />
    );
  }

  return (
    <div
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)', backdropFilter: 'blur(8px)',
        zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 'clamp(8px, 3vw, 20px)',
      }}
      onClick={closeAuthModal}
    >
      <div
        style={{
          width: '100%', maxWidth: '440px', background: '#151719',
          border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '20px',
          padding: 'clamp(20px, 5vw, 32px)',
          boxShadow: '0 25px 70px rgba(0, 0, 0, 0.7)',
          position: 'relative', color: '#ffffff', maxHeight: '92vh',
          overflowY: 'auto', overflowX: 'hidden', boxSizing: 'border-box',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={closeAuthModal}
          style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: '20px', cursor: 'pointer' }}
        >✕</button>

        <h2 style={{ fontSize: '26px', fontWeight: 800, marginBottom: '6px', color: '#fff' }}>
          {authModalMode === 'login' ? c.login : c.signup}
        </h2>
        <p style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.55)', marginBottom: '24px' }}>
          {authModalMode === 'login' ? c.loginSubtitle : c.registerSubtitle}
        </p>

        {errorMsg && (
          <div style={{ padding: '14px 16px', backgroundColor: 'rgba(255, 77, 77, 0.15)', border: '1px solid rgba(255, 77, 77, 0.4)', borderRadius: '12px', color: '#ff6b6b', fontSize: '13px', fontWeight: 600, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>⚠️</span><span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div style={{ padding: '14px 16px', backgroundColor: 'rgba(201, 255, 53, 0.15)', border: '1px solid rgba(201, 255, 53, 0.4)', borderRadius: '12px', color: '#c9ff35', fontSize: '14px', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }} noValidate>
          {authModalMode === 'register' && (
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.8)', marginBottom: '6px' }}>
                {c.fullName} <span style={{ color: '#ff6b6b' }}>*</span>
              </label>
              <input
                type="text" value={name}
                onChange={(e) => { setName(e.target.value); if (touched.name) setFieldErrors((prev) => ({ ...prev, name: validateField('name', e.target.value) })); }}
                onBlur={(e) => handleBlur('name', e.target.value)}
                placeholder={c.fullNamePlaceholder}
                style={{ width: '100%', height: '46px', padding: '0 14px', background: '#0d0f11', border: fieldErrors.name && touched.name ? '1px solid #ff4d4d' : '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '10px', color: '#fff', fontSize: '14px', outline: 'none', transition: 'border-color 0.2s ease' }}
              />
              {fieldErrors.name && touched.name && (
                <span style={{ color: '#ff6b6b', fontSize: '12px', fontWeight: 600, marginTop: '4px', display: 'block' }}>⚠️ {fieldErrors.name}</span>
              )}
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.8)', marginBottom: '6px' }}>
              {c.emailAddress} <span style={{ color: '#ff6b6b' }}>*</span>
            </label>
            <input
              type="email" value={email}
              onChange={(e) => { setEmail(e.target.value); if (touched.email) setFieldErrors((prev) => ({ ...prev, email: validateField('email', e.target.value) })); }}
              onBlur={(e) => handleBlur('email', e.target.value)}
              placeholder={c.emailPlaceholder}
              style={{ width: '100%', height: '46px', padding: '0 14px', background: '#0d0f11', border: fieldErrors.email && touched.email ? '1px solid #ff4d4d' : '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '10px', color: '#fff', fontSize: '14px', outline: 'none', transition: 'border-color 0.2s ease' }}
            />
            {fieldErrors.email && touched.email && (
              <span style={{ color: '#ff6b6b', fontSize: '12px', fontWeight: 600, marginTop: '4px', display: 'block' }}>⚠️ {fieldErrors.email}</span>
            )}
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.8)' }}>
                {c.password} <span style={{ color: '#ff6b6b' }}>*</span>
              </label>
              {authModalMode === 'register' && (
                <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)', fontWeight: 600 }}>{c.minChars}</span>
              )}
            </div>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'} value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (touched.password) setFieldErrors((prev) => ({ ...prev, password: validateField('password', e.target.value) }));
                  if (authModalMode === 'register' && touched.confirmPassword) {
                    setFieldErrors((prev) => ({ ...prev, confirmPassword: e.target.value !== confirmPassword ? c.passwordsMismatch : '' }));
                  }
                }}
                onBlur={(e) => handleBlur('password', e.target.value)}
                placeholder="••••••••"
                style={{ width: '100%', height: '46px', padding: '0 40px 0 14px', background: '#0d0f11', border: fieldErrors.password && touched.password ? '1px solid #ff4d4d' : '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '10px', color: '#fff', fontSize: '14px', outline: 'none', transition: 'border-color 0.2s ease' }}
              />
              <button
                type="button" onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'rgba(255, 255, 255, 0.6)', cursor: 'pointer', fontSize: '16px', padding: '4px' }}
                title={showPassword ? c.hidePassword : c.showPassword}
              >
                {showPassword ? '👁️' : '🙈'}
              </button>
            </div>
            {fieldErrors.password && touched.password && (
              <span style={{ color: '#ff6b6b', fontSize: '12px', fontWeight: 600, marginTop: '4px', display: 'block' }}>⚠️ {fieldErrors.password}</span>
            )}
            {authModalMode === 'register' && password.length > 0 && (
              <div style={{ marginTop: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 700, marginBottom: '4px' }}>
                  <span style={{ color: 'rgba(255,255,255,0.5)' }}>{c.passwordStrength}</span>
                  <span style={{ color: passwordStrength.color }}>{passwordStrength.label}</span>
                </div>
                <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: passwordStrength.width, background: passwordStrength.color, transition: 'all 0.3s ease' }} />
                </div>
              </div>
            )}
          </div>

          {authModalMode === 'register' && (
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.8)', marginBottom: '6px' }}>
                {c.confirmPassword} <span style={{ color: '#ff6b6b' }}>*</span>
              </label>
              <input
                type={showPassword ? 'text' : 'password'} value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (touched.confirmPassword) setFieldErrors((prev) => ({ ...prev, confirmPassword: e.target.value !== password ? c.passwordsMismatch : '' }));
                }}
                onBlur={(e) => handleBlur('confirmPassword', e.target.value)}
                placeholder="••••••••"
                style={{ width: '100%', height: '46px', padding: '0 14px', background: '#0d0f11', border: fieldErrors.confirmPassword && touched.confirmPassword ? '1px solid #ff4d4d' : '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '10px', color: '#fff', fontSize: '14px', outline: 'none', transition: 'border-color 0.2s ease' }}
              />
              {fieldErrors.confirmPassword && touched.confirmPassword && (
                <span style={{ color: '#ff6b6b', fontSize: '12px', fontWeight: 600, marginTop: '4px', display: 'block' }}>⚠️ {fieldErrors.confirmPassword}</span>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting || !!successMsg}
            style={{ height: '48px', marginTop: '6px', background: '#c9ff35', color: '#070809', fontWeight: 800, fontSize: '14px', borderRadius: '10px', border: 'none', cursor: isSubmitting || successMsg ? 'not-allowed' : 'pointer', opacity: isSubmitting ? 0.7 : 1, transition: 'all 0.2s ease' }}
          >
            {isSubmitting ? c.processing : successMsg ? c.done : authModalMode === 'login' ? c.login : c.signup}
          </button>
        </form>

        <div style={{ marginTop: '22px', textAlign: 'center', fontSize: '13px', color: 'rgba(255,255,255,0.55)' }}>
          {authModalMode === 'login' ? (
            <>
              {c.dontHaveAccount}{' '}
              <button onClick={() => openAuthModal('register')} style={{ background: 'none', border: 'none', color: '#c9ff35', fontWeight: 800, cursor: 'pointer', textDecoration: 'underline' }}>
                {c.signup}
              </button>
            </>
          ) : (
            <>
              {c.alreadyHaveAccount}{' '}
              <button onClick={() => openAuthModal('login')} style={{ background: 'none', border: 'none', color: '#c9ff35', fontWeight: 800, cursor: 'pointer', textDecoration: 'underline' }}>
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
