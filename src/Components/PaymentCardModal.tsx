/* oxlint-disable */
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

interface PaymentCardModalProps {
  onClose: () => void;
  onSuccess: () => void;
  amount?: number;        // e.g. 15 (GEL per player)
  actionLabel?: string;  // e.g. "Confirm Booking" / "Join Game"
}

interface CardData {
  number: string;
  name: string;
  expiry: string;
  cvv: string;
}

function detectCardType(number: string): 'visa' | 'mastercard' | 'amex' | 'generic' {
  const clean = number.replace(/\s/g, '');
  if (/^4/.test(clean)) return 'visa';
  if (/^5[1-5]/.test(clean) || /^2[2-7]/.test(clean)) return 'mastercard';
  if (/^3[47]/.test(clean)) return 'amex';
  return 'generic';
}

function formatCardNumber(raw: string): string {
  const clean = raw.replace(/\D/g, '').slice(0, 16);
  return clean.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
}

function formatExpiry(raw: string): string {
  const clean = raw.replace(/\D/g, '').slice(0, 4);
  if (clean.length >= 3) return clean.slice(0, 2) + '/' + clean.slice(2);
  return clean;
}

const CARD_GRADIENTS: Record<string, string> = {
  visa: 'linear-gradient(135deg, #1a1f6e 0%, #283593 40%, #1565c0 100%)',
  mastercard: 'linear-gradient(135deg, #b71c1c 0%, #c62828 40%, #e53935 100%)',
  amex: 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 50%, #388e3c 100%)',
  generic: 'linear-gradient(135deg, #0a0b0d 0%, #1a1c20 40%, #131516 100%)',
};

const CardFront: React.FC<{ cardData: CardData; cardType: string }> = ({ cardData, cardType }) => {
  const displayNumber = cardData.number
    ? cardData.number.padEnd(19, '·').replace(/\s/g, ' ')
    : '•••• •••• •••• ••••';
  const displayName = cardData.name || 'YOUR NAME';
  const displayExpiry = cardData.expiry || 'MM/YY';

  return (
    <div style={{
      width: '100%', height: '100%', backfaceVisibility: 'hidden',
      background: CARD_GRADIENTS[cardType] || CARD_GRADIENTS.generic,
      borderRadius: '20px', padding: '28px 28px 24px',
      display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
      position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    }}>
      {/* Top Row: chip + card type */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        {/* Chip */}
        <div style={{ width: '46px', height: '34px', borderRadius: '6px', background: 'linear-gradient(135deg, #f9d71c, #d4a017)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '11px', left: 0, right: 0, height: '2px', background: 'rgba(0,0,0,0.25)' }} />
          <div style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', width: '2px', background: 'rgba(0,0,0,0.15)' }} />
        </div>
        {/* Card Type */}
        <CardTypeBadge type={cardType} />
      </div>

      {/* Card Number */}
      <div style={{ fontFamily: 'monospace', fontSize: '20px', letterSpacing: '3px', color: 'rgba(255,255,255,0.92)', fontWeight: 700, textShadow: '0 1px 3px rgba(0,0,0,0.4)' }}>
        {displayNumber}
      </div>

      {/* Bottom Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <div style={{ fontSize: '9px', letterSpacing: '1.5px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', marginBottom: '4px' }}>Card Holder</div>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: '1px', maxWidth: '180px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {displayName}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '9px', letterSpacing: '1.5px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', marginBottom: '4px' }}>Expires</div>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff', fontFamily: 'monospace', letterSpacing: '1px' }}>{displayExpiry}</div>
        </div>
      </div>

      {/* Decorative circles */}
      <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '160px', height: '160px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
      <div style={{ position: 'absolute', top: '20px', right: '20px', width: '100px', height: '100px', borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
    </div>
  );
};

const CardBack: React.FC<{ cardData: CardData; cardType: string }> = ({ cardData, cardType }) => (
  <div style={{
    width: '100%', height: '100%', backfaceVisibility: 'hidden',
    background: CARD_GRADIENTS[cardType] || CARD_GRADIENTS.generic,
    borderRadius: '20px', transform: 'rotateY(180deg)',
    boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
  }}>
    {/* Magnetic stripe */}
    <div style={{ marginTop: '40px', height: '44px', background: '#111', width: '100%' }} />
    {/* Signature panel + CVV */}
    <div style={{ padding: '16px 28px', display: 'flex', alignItems: 'center', gap: '12px', marginTop: '16px' }}>
      <div style={{ flex: 1, height: '36px', background: 'linear-gradient(90deg, #e8e0d0, #f0ebe0)', borderRadius: '4px', display: 'flex', alignItems: 'center', padding: '0 10px' }}>
        <span style={{ color: '#aaa', fontSize: '12px', fontStyle: 'italic', letterSpacing: '1px' }}>{'////'}</span>
      </div>
      <div style={{ background: '#fff', borderRadius: '6px', padding: '8px 16px', textAlign: 'center', minWidth: '60px' }}>
        <div style={{ fontSize: '9px', color: '#555', fontWeight: 700, textTransform: 'uppercase', marginBottom: '2px' }}>CVV</div>
        <div style={{ fontFamily: 'monospace', fontSize: '16px', fontWeight: 800, color: '#222', letterSpacing: '3px' }}>
          {cardData.cvv ? '•'.repeat(cardData.cvv.length) : '•••'}
        </div>
      </div>
    </div>
    <div style={{ padding: '0 28px', fontSize: '10px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.5 }}>
      This card is issued by PlayTogether Financial Services. Use responsibly.
    </div>
  </div>
);

const CardTypeBadge: React.FC<{ type: string }> = ({ type }) => {
  if (type === 'visa') {
    return (
      <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: '6px', padding: '4px 10px', backdropFilter: 'blur(4px)' }}>
        <span style={{ fontWeight: 900, fontSize: '18px', fontStyle: 'italic', color: '#fff', letterSpacing: '-1px' }}>VISA</span>
      </div>
    );
  }
  if (type === 'mastercard') {
    return (
      <div style={{ display: 'flex', gap: '-6px' }}>
        <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#eb001b', opacity: 0.9 }} />
        <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#f79e1b', opacity: 0.9, marginLeft: '-10px' }} />
      </div>
    );
  }
  if (type === 'amex') {
    return (
      <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: '6px', padding: '4px 10px', backdropFilter: 'blur(4px)' }}>
        <span style={{ fontWeight: 900, fontSize: '11px', color: '#fff', letterSpacing: '1px' }}>AMEX</span>
      </div>
    );
  }
  return (
    <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '6px', padding: '4px 10px' }}>
      <span style={{ fontWeight: 700, fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>CARD</span>
    </div>
  );
};

export const PaymentCardModal: React.FC<PaymentCardModalProps> = ({
  onClose,
  onSuccess,
  amount,
  actionLabel,
}) => {
  const { saveCard } = useAuth();
  const { c } = useLanguage();
  const resolvedLabel = actionLabel ?? c.confirmPayment;

  const [cardData, setCardData] = useState<CardData>({ number: '', name: '', expiry: '', cvv: '' });
  const [isFlipped, setIsFlipped] = useState(false);
  const [errors, setErrors] = useState<Partial<CardData>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const [succeeded, setSucceeded] = useState(false);

  const cardType = detectCardType(cardData.number);

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const validate = (): boolean => {
    const e: Partial<CardData> = {};
    const cleanNum = cardData.number.replace(/\s/g, '');
    if (cleanNum.length < 16) e.number = c.cardNumberError;
    if (!cardData.name.trim() || cardData.name.trim().length < 3) e.name = c.holderError;
    const [mm, yy] = cardData.expiry.split('/');
    const currentYear = new Date().getFullYear() % 100;
    const currentMonth = new Date().getMonth() + 1;
    if (!mm || !yy || +mm < 1 || +mm > 12 || +yy < currentYear || (+yy === currentYear && +mm < currentMonth)) {
      e.expiry = c.expiryError;
    }
    if (cardData.cvv.length < 3) e.cvv = c.cvvError;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setIsProcessing(true);

    // Simulate processing steps
    const steps = ['Encrypting card data...', 'Verifying with bank...', 'Payment authorized!'];
    for (let i = 0; i < steps.length; i++) {
      setProcessingStep(i);
      await new Promise(r => setTimeout(r, 900));
    }

    // Save card (masked) to context/localStorage
    const clean = cardData.number.replace(/\s/g, '');
    saveCard({
      last4: clean.slice(-4),
      type: cardType,
      holderName: cardData.name.trim(),
      expiry: cardData.expiry,
    });

    setSucceeded(true);
    await new Promise(r => setTimeout(r, 700));
    setIsProcessing(false);
    onSuccess();
  };

  const inputStyle = (hasError: boolean): React.CSSProperties => ({
    width: '100%', height: '48px', padding: '0 14px',
    background: '#0d0f11',
    border: `1px solid ${hasError ? '#ef5350' : 'rgba(255,255,255,0.12)'}`,
    borderRadius: '12px', color: '#fff', fontSize: '14px',
    outline: 'none', transition: 'border-color 0.2s ease', fontFamily: 'inherit',
    boxSizing: 'border-box',
  });

  const processingStepLabels = [c.paymentProcessing, 'Verifying with bank...', `${c.paymentSuccess} ✅`];

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 99999,
        background: 'rgba(0,0,0,0.87)', backdropFilter: 'blur(16px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
      }}
      onClick={(e) => { if (e.target === e.currentTarget && !isProcessing) onClose(); }}
    >
      <div style={{
        width: '100%', maxWidth: '460px',
        background: '#121416',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '28px', padding: '36px 32px 32px',
        boxShadow: '0 40px 120px rgba(0,0,0,0.9)',
        maxHeight: '95vh', overflowY: 'auto',
        position: 'relative',
      }}>
        {/* Close */}
        {!isProcessing && (
          <button onClick={onClose} style={{
            position: 'absolute', top: '18px', right: '18px',
            background: 'rgba(255,255,255,0.07)', border: 'none', color: 'rgba(255,255,255,0.6)',
            width: '34px', height: '34px', borderRadius: '50%', fontSize: '16px',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>✕</button>
        )}

        {/* Header */}
        <div style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '10px',
              background: 'linear-gradient(135deg, #c9ff35, #8bc34a)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px',
            }}>💳</div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '18px', color: '#fff' }}>Add Payment Card</div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginTop: '1px' }}>
                Secure · Encrypted · One-time setup
              </div>
            </div>
          </div>
          {amount && (
            <div style={{
              marginTop: '14px', background: 'rgba(201,255,53,0.08)',
              border: '1px solid rgba(201,255,53,0.2)', borderRadius: '12px', padding: '12px 16px',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>Amount due</span>
              <span style={{ fontSize: '20px', fontWeight: 800, color: '#c9ff35' }}>₾{amount}</span>
            </div>
          )}
        </div>

        {/* ── ANIMATED 3D CARD ── */}
        <div style={{ perspective: '1000px', marginBottom: '28px', height: '190px', position: 'relative' }}>
          <div style={{
            width: '100%', height: '100%',
            position: 'relative', transformStyle: 'preserve-3d',
            transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          }}>
            <CardFront cardData={cardData} cardType={cardType} />
            <CardBack cardData={cardData} cardType={cardType} />
          </div>
        </div>

        {/* ── PROCESSING OVERLAY ── */}
        {isProcessing && (
          <div style={{
            position: 'absolute', inset: '140px 32px 32px',
            background: '#121416', borderRadius: '16px',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', gap: '16px', zIndex: 10,
          }}>
            {succeeded ? (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '56px', marginBottom: '12px' }}>✅</div>
                <div style={{ fontWeight: 800, fontSize: '18px', color: '#c9ff35' }}>{c.paymentSuccess}</div>
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginTop: '6px' }}>{c.paymentSuccessDesc}</div>
              </div>
            ) : (
              <>
                {/* Spinner */}
                <div style={{
                  width: '52px', height: '52px', borderRadius: '50%',
                  border: '4px solid rgba(201,255,53,0.15)',
                  borderTop: '4px solid #c9ff35',
                  animation: 'spinAnim 0.8s linear infinite',
                }} />
                <div style={{ fontWeight: 700, fontSize: '15px', color: '#fff' }}>Processing payment</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%', padding: '0 20px' }}>
                  {processingStepLabels.map((label, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: i > processingStep ? 0.3 : 1, transition: 'opacity 0.3s ease' }}>
                      <div style={{
                        width: '18px', height: '18px', borderRadius: '50%', flexShrink: 0,
                        background: i < processingStep ? '#c9ff35' : i === processingStep ? 'rgba(201,255,53,0.2)' : 'rgba(255,255,255,0.08)',
                        border: i === processingStep ? '2px solid #c9ff35' : '2px solid transparent',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px',
                      }}>
                        {i < processingStep ? '✓' : ''}
                      </div>
                      <span style={{ fontSize: '12px', color: i < processingStep ? '#c9ff35' : 'rgba(255,255,255,0.6)', fontWeight: 600 }}>{label}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* ── FORM FIELDS ── */}
        {!isProcessing && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Card Number */}
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '6px' }}>
                {c.cardNumber}
              </label>
              <input
                id="payment-card-number"
                type="text"
                inputMode="numeric"
                placeholder={c.cardNumberPlaceholder}
                maxLength={19}
                value={cardData.number}
                onChange={e => {
                  const formatted = formatCardNumber(e.target.value);
                  setCardData(p => ({ ...p, number: formatted }));
                  if (errors.number) setErrors(p => ({ ...p, number: '' }));
                }}
                onFocus={() => setIsFlipped(false)}
                style={inputStyle(!!errors.number)}
                onFocusCapture={e => (e.currentTarget.style.borderColor = 'rgba(201,255,53,0.5)')}
                onBlurCapture={e => (e.currentTarget.style.borderColor = errors.number ? '#ef5350' : 'rgba(255,255,255,0.12)')}
              />
              {errors.number && <span style={{ color: '#ef5350', fontSize: '12px', marginTop: '4px', display: 'block' }}>⚠ {errors.number}</span>}
            </div>

            {/* Cardholder Name */}
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '6px' }}>
                {c.cardHolder}
              </label>
              <input
                id="payment-card-name"
                type="text"
                placeholder={c.cardHolderPlaceholder}
                value={cardData.name}
                onChange={e => {
                  setCardData(p => ({ ...p, name: e.target.value.toUpperCase() }));
                  if (errors.name) setErrors(p => ({ ...p, name: '' }));
                }}
                onFocus={() => setIsFlipped(false)}
                style={inputStyle(!!errors.name)}
                onFocusCapture={e => (e.currentTarget.style.borderColor = 'rgba(201,255,53,0.5)')}
                onBlurCapture={e => (e.currentTarget.style.borderColor = errors.name ? '#ef5350' : 'rgba(255,255,255,0.12)')}
              />
              {errors.name && <span style={{ color: '#ef5350', fontSize: '12px', marginTop: '4px', display: 'block' }}>⚠ {errors.name}</span>}
            </div>

            {/* Expiry + CVV */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '6px' }}>
                  {c.expiryDate}
                </label>
                <input
                  id="payment-card-expiry"
                  type="text"
                  inputMode="numeric"
                  placeholder={c.expiryPlaceholder}
                  maxLength={5}
                  value={cardData.expiry}
                  onChange={e => {
                    const v = formatExpiry(e.target.value);
                    setCardData(p => ({ ...p, expiry: v }));
                    if (errors.expiry) setErrors(p => ({ ...p, expiry: '' }));
                  }}
                  onFocus={() => setIsFlipped(false)}
                  style={inputStyle(!!errors.expiry)}
                  onFocusCapture={e => (e.currentTarget.style.borderColor = 'rgba(201,255,53,0.5)')}
                  onBlurCapture={e => (e.currentTarget.style.borderColor = errors.expiry ? '#ef5350' : 'rgba(255,255,255,0.12)')}
                />
                {errors.expiry && <span style={{ color: '#ef5350', fontSize: '11px', marginTop: '4px', display: 'block' }}>⚠ {errors.expiry}</span>}
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '6px' }}>
                  {c.cvv}
                </label>
                <input
                  id="payment-card-cvv"
                  type="text"
                  inputMode="numeric"
                  placeholder={c.cvvPlaceholder}
                  maxLength={4}
                  value={cardData.cvv}
                  onChange={e => {
                    const v = e.target.value.replace(/\D/g, '').slice(0, 4);
                    setCardData(p => ({ ...p, cvv: v }));
                    if (errors.cvv) setErrors(p => ({ ...p, cvv: '' }));
                  }}
                  onFocus={() => setIsFlipped(true)}
                  onBlur={() => setIsFlipped(false)}
                  style={inputStyle(!!errors.cvv)}
                  onFocusCapture={e => (e.currentTarget.style.borderColor = 'rgba(201,255,53,0.5)')}
                  onBlurCapture={e => (e.currentTarget.style.borderColor = errors.cvv ? '#ef5350' : 'rgba(255,255,255,0.12)')}
                />
                {errors.cvv && <span style={{ color: '#ef5350', fontSize: '11px', marginTop: '4px', display: 'block' }}>⚠ {errors.cvv}</span>}
              </div>
            </div>

            {/* Security note */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '10px' }}>
              <span style={{ fontSize: '14px' }}>🔒</span>
              <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.5 }}>
                Your payment is secured with 256-bit SSL encryption. Card details are never stored in plain text.
              </span>
            </div>

            {/* Submit Button */}
            <button
              id="payment-submit-btn"
              onClick={handleSubmit}
              style={{
                width: '100%', height: '52px', marginTop: '4px',
                background: 'linear-gradient(135deg, #c9ff35 0%, #a8e024 100%)',
                color: '#0a0b0d', fontWeight: 900, fontSize: '15px',
                border: 'none', borderRadius: '14px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                boxShadow: '0 8px 32px rgba(201,255,53,0.3)',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 12px 40px rgba(201,255,53,0.45)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'none'; (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 8px 32px rgba(201,255,53,0.3)'; }}
            >
              <span>💳</span>
              {amount ? `Pay ₾${amount} & ${resolvedLabel}` : resolvedLabel}
            </button>

            <button
              onClick={onClose}
              style={{
                width: '100%', height: '40px', background: 'transparent',
                border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px',
                color: 'rgba(255,255,255,0.4)', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
              }}
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spinAnim {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default PaymentCardModal;
