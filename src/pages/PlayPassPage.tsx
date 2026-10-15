import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { TranslationContent } from '../types/translations';
import type { SubscriptionTier, SubscriptionDuration } from '../constants/subscriptionConfig';
import {
  PLAN_META,
  PLAYPASS_PRICES,
  SUBSCRIPTION_DURATIONS,
  pricePerMonth,
  monthlySavings,
  ELIGIBLE_SPORTS,
} from '../constants/subscriptionConfig';
import { useAuth } from '../context/AuthContext';
import { useSubscription } from '../context/SubscriptionContext';

interface PlayPassPageProps {
  c: TranslationContent;
}

const DURATION_LABELS: Record<number, string> = {
  1: '1 Month',
  2: '2 Months',
  3: '3 Months',
  5: '5 Months',
};




export const PlayPassPage: React.FC<PlayPassPageProps> = () => {
  const { isAuthenticated, openAuthModal } = useAuth();
  const { subscription, weeklyUsage, hasActiveSubscription, subscribe, cancel, isLoading } = useSubscription();

  const [selectedDuration, setSelectedDuration] = useState<SubscriptionDuration>(1);
  const [checkoutTier, setCheckoutTier] = useState<SubscriptionTier | null>(null);
  const [checkoutStep, setCheckoutStep] = useState<'idle' | 'confirm' | 'success' | 'error'>('idle');
  const [checkoutError, setCheckoutError] = useState<string>('');
  const [cancelStep, setCancelStep] = useState<'idle' | 'confirm'>('idle');

  // If user comes with an active plan already, default to showing that plan's price duration
  useEffect(() => {
    if (subscription?.durationMonths) {
      const dur = subscription.durationMonths as SubscriptionDuration;
      if (SUBSCRIPTION_DURATIONS.includes(dur)) setSelectedDuration(dur);
    }
  }, [subscription]);

  const handleChoosePlan = (tier: SubscriptionTier) => {
    if (!isAuthenticated) {
      openAuthModal('login');
      return;
    }
    // If already on this plan and it's active, don't re-subscribe
    if (hasActiveSubscription && subscription?.tier === tier) return;
    setCheckoutTier(tier);
    setCheckoutStep('confirm');
    setCheckoutError('');
  };

  const handleConfirmSubscribe = async () => {
    if (!checkoutTier) return;
    setCheckoutStep('idle');
    try {
      await subscribe(checkoutTier, selectedDuration);
      setCheckoutStep('success');
    } catch (err: any) {
      setCheckoutError(err.message || 'Subscription failed. Please try again.');
      setCheckoutStep('error');
    }
  };

  const handleCancelSubscription = async () => {
    try {
      await cancel();
      setCancelStep('idle');
    } catch (err: any) {
      alert(err.message || 'Failed to cancel subscription.');
    }
  };

  const expiryDate = subscription?.endDate
    ? new Date(subscription.endDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : null;

  return (
    <div style={{ minHeight: '100vh', color: '#fff', fontFamily: 'Manrope, sans-serif' }}>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section style={{
        position: 'relative',
        padding: '80px 24px 64px',
        textAlign: 'center',
        overflow: 'hidden',
        background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(201,255,53,0.12) 0%, transparent 70%)',
      }}>
        {/* Decorative circles */}
        <div style={{ position: 'absolute', top: '10%', left: '8%', width: 180, height: 180, borderRadius: '50%', background: 'rgba(201,255,53,0.04)', filter: 'blur(40px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '5%', right: '6%', width: 240, height: 240, borderRadius: '50%', background: 'rgba(201,255,53,0.05)', filter: 'blur(60px)', pointerEvents: 'none' }} />

        {/* Badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'rgba(201,255,53,0.12)', border: '1px solid rgba(201,255,53,0.3)',
          borderRadius: 100, padding: '6px 18px', marginBottom: 28,
        }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#c9ff35', boxShadow: '0 0 10px rgba(201,255,53,0.6)' }} />
          <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: 2, color: '#c9ff35' }}>INTRODUCING PLAYPASS</span>
        </div>

        <h1 style={{
          fontSize: 'clamp(40px, 7vw, 80px)',
          fontWeight: 800,
          letterSpacing: '-3px',
          lineHeight: 1.0,
          marginBottom: 20,
          maxWidth: 800,
          margin: '0 auto 20px',
        }}>
          Play More.{' '}
          <span style={{ color: '#c9ff35' }}>Pay Less.</span>
        </h1>

        <p style={{
          fontSize: 17, color: 'rgba(255,255,255,0.58)', lineHeight: 1.75,
          maxWidth: 560, margin: '0 auto 36px',
        }}>
          One membership. All sports. Book football, basketball, tennis, padel, boxing,
          and more — on your schedule. No per-booking fees.
        </p>

        {/* Sports pill list */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 8, maxWidth: 640, margin: '0 auto' }}>
          {ELIGIBLE_SPORTS.map((sport) => (
            <span key={sport} style={{
              fontSize: 12, fontWeight: 700,
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.12)',
              padding: '5px 14px', borderRadius: 100, color: 'rgba(255,255,255,0.7)',
            }}>{sport}</span>
          ))}
        </div>
      </section>

      {/* ── ACTIVE SUBSCRIPTION BANNER ─────────────────────────────────────── */}
      {hasActiveSubscription && subscription && (
        <div style={{ maxWidth: 1000, margin: '0 auto 0', padding: '0 24px 32px' }}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(201,255,53,0.12) 0%, rgba(201,255,53,0.04) 100%)',
            border: '1px solid rgba(201,255,53,0.35)',
            borderRadius: 20,
            padding: '24px 28px',
            display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{
                width: 52, height: 52, borderRadius: '50%',
                background: '#c9ff35', color: '#070809',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 24, fontWeight: 900,
              }}>
                {subscription.tier === 'SILVER' ? '🥈' : subscription.tier === 'GOLD' ? '🥇' : '⚡'}
              </div>
              <div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', fontWeight: 700, letterSpacing: 1.5 }}>YOUR ACTIVE PLAN</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: '#c9ff35', marginTop: 2 }}>{subscription.tier} Pass</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginTop: 2 }}>Expires {expiryDate}</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'center' }}>
              {/* Credits remaining */}
              {subscription.tier !== 'UNLIMITED' && weeklyUsage && (
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 28, fontWeight: 900, color: '#c9ff35' }}>
                    {weeklyUsage.creditsRemaining ?? 0}
                  </div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', fontWeight: 700 }}>
                    credits left this week
                  </div>
                </div>
              )}
              {subscription.tier === 'UNLIMITED' && (
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 22, fontWeight: 900, color: '#c9ff35' }}>∞</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', fontWeight: 700 }}>Unlimited access</div>
                </div>
              )}

              {cancelStep === 'idle' ? (
                <button
                  onClick={() => setCancelStep('confirm')}
                  style={{
                    height: 38, padding: '0 16px',
                    background: 'rgba(255,77,77,0.1)',
                    border: '1px solid rgba(255,77,77,0.3)',
                    borderRadius: 10, color: '#ff6b6b', fontSize: 12,
                    fontWeight: 700, cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  Cancel Plan
                </button>
              ) : (
                <div style={{ display: 'flex', gap: 8 }}>
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', alignSelf: 'center' }}>Confirm cancel?</span>
                  <button
                    onClick={handleCancelSubscription}
                    disabled={isLoading}
                    style={{
                      height: 34, padding: '0 14px',
                      background: '#ff4d4d', color: '#fff',
                      border: 'none', borderRadius: 8,
                      fontSize: 12, fontWeight: 800, cursor: 'pointer',
                    }}
                  >Yes, Cancel</button>
                  <button
                    onClick={() => setCancelStep('idle')}
                    style={{
                      height: 34, padding: '0 14px',
                      background: 'rgba(255,255,255,0.08)', color: '#fff',
                      border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8,
                      fontSize: 12, fontWeight: 700, cursor: 'pointer',
                    }}
                  >Keep</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── DURATION SELECTOR ─────────────────────────────────────────────── */}
      <section style={{ maxWidth: 1000, margin: '0 auto', padding: '40px 24px 0' }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontWeight: 800, letterSpacing: 2, marginBottom: 10 }}>CHOOSE DURATION</div>
          <div style={{ display: 'inline-flex', gap: 8, background: '#0d0f11', borderRadius: 14, padding: 6, border: '1px solid rgba(255,255,255,0.08)' }}>
            {SUBSCRIPTION_DURATIONS.map((d) => {
              const savings = monthlySavings('GOLD', d);
              const isSelected = selectedDuration === d;
              return (
                <button
                  key={d}
                  id={`duration-${d}`}
                  onClick={() => setSelectedDuration(d)}
                  style={{
                    position: 'relative',
                    padding: '10px 20px',
                    borderRadius: 10,
                    border: 'none',
                    background: isSelected ? '#c9ff35' : 'transparent',
                    color: isSelected ? '#070809' : 'rgba(255,255,255,0.65)',
                    fontWeight: 800,
                    fontSize: 13,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    fontFamily: 'Manrope, sans-serif',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {DURATION_LABELS[d]}
                  {savings > 0 && (
                    <span style={{
                      position: 'absolute', top: -8, right: -4,
                      background: '#c9ff35', color: '#070809',
                      fontSize: 9, fontWeight: 900, padding: '1px 5px', borderRadius: 6,
                      display: isSelected ? 'none' : 'block',
                    }}>
                      -{savings}₾
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── PLAN CARDS ────────────────────────────────────────────────────── */}
      <section style={{ maxWidth: 1120, margin: '0 auto', padding: '12px 24px 60px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 24,
          alignItems: 'stretch',
        }}>
          {PLAN_META.map((plan) => {
            const price = PLAYPASS_PRICES[plan.tier][selectedDuration];
            const ppm = pricePerMonth(plan.tier, selectedDuration);
            const savings = monthlySavings(plan.tier, selectedDuration);
            const isCurrentPlan = hasActiveSubscription && subscription?.tier === plan.tier;
            const isRec = plan.recommended;

            return (
              <div
                key={plan.tier}
                id={`plan-card-${plan.tier.toLowerCase()}`}
                style={{
                  position: 'relative',
                  background: isRec
                    ? 'linear-gradient(160deg, #1a1800 0%, #0e0c00 100%)'
                    : '#151719',
                  border: isCurrentPlan
                    ? `2px solid ${plan.color}`
                    : isRec
                    ? `2px solid rgba(240,180,41,0.5)`
                    : '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 24,
                  padding: '32px 28px',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                  boxShadow: isRec
                    ? '0 20px 60px rgba(240,180,41,0.12)'
                    : '0 8px 30px rgba(0,0,0,0.3)',
                  cursor: 'default',
                  transform: isRec ? 'translateY(-8px)' : 'none',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLDivElement).style.transform = isRec ? 'translateY(-12px)' : 'translateY(-4px)';
                  (e.currentTarget as HTMLDivElement).style.boxShadow = `0 24px 70px ${plan.color}22`;
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.transform = isRec ? 'translateY(-8px)' : 'none';
                  (e.currentTarget as HTMLDivElement).style.boxShadow = isRec ? '0 20px 60px rgba(240,180,41,0.12)' : '0 8px 30px rgba(0,0,0,0.3)';
                }}
              >
                {/* Recommended badge */}
                {isRec && (
                  <div style={{
                    position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)',
                    background: '#f0b429', color: '#070809',
                    fontSize: 10, fontWeight: 900, letterSpacing: 1.5,
                    padding: '4px 16px', borderRadius: 100,
                    whiteSpace: 'nowrap',
                  }}>⭐ MOST POPULAR</div>
                )}

                {/* Active badge */}
                {isCurrentPlan && (
                  <div style={{
                    position: 'absolute', top: -14, right: 20,
                    background: plan.color, color: '#070809',
                    fontSize: 10, fontWeight: 900, letterSpacing: 1,
                    padding: '4px 14px', borderRadius: 100,
                  }}>✓ ACTIVE</div>
                )}

                {/* Plan header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                  <span style={{ fontSize: 36 }}>{plan.icon}</span>
                  <div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: plan.color }}>{plan.name}</div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>{plan.tagline}</div>
                  </div>
                </div>

                {/* Weekly credits */}
                <div style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: `1px solid ${plan.color}30`,
                  borderRadius: 12, padding: '14px 16px', marginBottom: 20,
                  display: 'flex', alignItems: 'center', gap: 10,
                }}>
                  <span style={{ fontSize: 22 }}>🎟️</span>
                  <div>
                    <div style={{ fontSize: 18, fontWeight: 900, color: plan.color }}>
                      {plan.weeklyCredits === null ? 'Unlimited' : `${plan.weeklyCredits}× per week`}
                    </div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 1 }}>activity credits</div>
                  </div>
                </div>

                {/* Pricing */}
                <div style={{ marginBottom: 24 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, marginBottom: 4 }}>
                    <span style={{ fontSize: 42, fontWeight: 900, lineHeight: 1, color: '#fff' }}>{price}₾</span>
                    <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 6 }}>
                      / {DURATION_LABELS[selectedDuration].toLowerCase()}
                    </span>
                  </div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>
                    {ppm}₾ / month
                    {savings > 0 && (
                      <span style={{ marginLeft: 8, color: '#c9ff35', fontWeight: 700 }}>
                        · Save {savings}₾
                      </span>
                    )}
                  </div>
                </div>

                {/* Perks */}
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px', display: 'flex', flexDirection: 'column', gap: 9 }}>
                  {plan.perks.map((perk) => (
                    <li key={perk} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'rgba(255,255,255,0.75)' }}>
                      <span style={{ width: 18, height: 18, borderRadius: '50%', background: `${plan.color}25`, border: `1px solid ${plan.color}50`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: plan.color, flexShrink: 0 }}>✓</span>
                      {perk}
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <div style={{ marginTop: 'auto' }}>
                  {isCurrentPlan ? (
                    <div style={{
                      height: 50, borderRadius: 12,
                      background: `${plan.color}20`,
                      border: `1px solid ${plan.color}50`,
                      color: plan.color, fontWeight: 800, fontSize: 14,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    }}>
                      ✓ Your Current Plan
                    </div>
                  ) : (
                    <button
                      id={`choose-${plan.tier.toLowerCase()}`}
                      onClick={() => handleChoosePlan(plan.tier)}
                      disabled={isLoading}
                      style={{
                        width: '100%', height: 50, borderRadius: 12,
                        background: plan.recommended ? '#f0b429' : plan.tier === 'UNLIMITED' ? '#c9ff35' : 'rgba(255,255,255,0.08)',
                        border: plan.recommended ? 'none' : plan.tier === 'UNLIMITED' ? 'none' : '1px solid rgba(255,255,255,0.2)',
                        color: plan.recommended || plan.tier === 'UNLIMITED' ? '#070809' : '#fff',
                        fontWeight: 800, fontSize: 14,
                        cursor: isLoading ? 'wait' : 'pointer',
                        transition: 'all 0.2s ease',
                        fontFamily: 'Manrope, sans-serif',
                        opacity: isLoading ? 0.7 : 1,
                      }}
                    >
                      {isLoading && checkoutTier === plan.tier ? 'Activating...' : `Choose ${plan.name}`}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── COMPARISON TABLE ─────────────────────────────────────────────── */}
      <section style={{ maxWidth: 1000, margin: '0 auto', padding: '0 24px 80px' }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', fontWeight: 800, letterSpacing: 2, marginBottom: 8 }}>COMPARE PLANS</div>
          <h2 style={{ fontSize: 34, fontWeight: 800, letterSpacing: -1.5, color: '#fff' }}>Everything included</h2>
        </div>

        <div style={{
          background: '#0d0f11',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 20, overflow: 'hidden',
        }}>
          {/* Header row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ padding: '18px 20px', fontSize: 12, fontWeight: 800, color: 'rgba(255,255,255,0.4)', letterSpacing: 1 }}>FEATURE</div>
            {PLAN_META.map(p => (
              <div key={p.tier} style={{ padding: '18px 20px', textAlign: 'center', fontSize: 13, fontWeight: 800, color: p.color }}>
                {p.icon} {p.name}
              </div>
            ))}
          </div>

          {[
            { label: 'Activities / week', values: ['2', '3', 'Unlimited'] },
            { label: 'All eligible sports', values: ['✓', '✓', '✓'] },
            { label: 'Stadium booking', values: ['✓', '✓', '✓'] },
            { label: 'Cancel anytime', values: ['✓', '✓', '✓'] },
            { label: 'Priority access', values: ['✓', '✓', '✓'] },
            { label: 'Profile badge', values: ['—', 'Gold badge', 'Unlimited badge'] },
            { label: 'New sport early access', values: ['—', '—', '✓'] },
          ].map((row, idx) => (
            <div
              key={row.label}
              style={{
                display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr',
                borderBottom: idx < 6 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                background: idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)',
              }}
            >
              <div style={{ padding: '14px 20px', fontSize: 13, color: 'rgba(255,255,255,0.65)', fontWeight: 600 }}>{row.label}</div>
              {row.values.map((val, vi) => (
                <div key={vi} style={{
                  padding: '14px 20px', textAlign: 'center',
                  fontSize: 13, fontWeight: 700,
                  color: val === '✓' ? PLAN_META[vi].color : val === '—' ? 'rgba(255,255,255,0.2)' : '#fff',
                }}>{val}</div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────── */}
      <section style={{ maxWidth: 1000, margin: '0 auto', padding: '0 24px 80px' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', fontWeight: 800, letterSpacing: 2, marginBottom: 8 }}>HOW IT WORKS</div>
          <h2 style={{ fontSize: 34, fontWeight: 800, letterSpacing: -1.5 }}>Simple as booking a game</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
          {[
            { step: '01', icon: '🎫', title: 'Choose your PlayPass', desc: 'Pick Silver, Gold, or Unlimited. Select your preferred duration from 1 to 5 months.' },
            { step: '02', icon: '⚡', title: 'Instant activation', desc: 'Your PassPass is activated immediately. Credits reset every Monday at midnight UTC.' },
            { step: '03', icon: '🏟️', title: 'Book any eligible sport', desc: 'Browse stadiums, choose your sport, and confirm. One booking = one activity credit.' },
            { step: '04', icon: '🔄', title: 'Credits restore on cancel', desc: 'Cancel a booking? Your credit is returned automatically to use elsewhere this week.' },
          ].map((item) => (
            <div key={item.step} style={{
              background: '#0d0f11',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 20, padding: '28px 24px',
            }}>
              <div style={{ fontSize: 10, color: '#c9ff35', fontWeight: 800, letterSpacing: 2, marginBottom: 12 }}>{item.step}</div>
              <div style={{ fontSize: 32, marginBottom: 12 }}>{item.icon}</div>
              <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 8 }}>{item.title}</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7 }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────────────────── */}
      <section style={{ maxWidth: 720, margin: '0 auto', padding: '0 24px 100px' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', fontWeight: 800, letterSpacing: 2, marginBottom: 8 }}>FAQ</div>
          <h2 style={{ fontSize: 34, fontWeight: 800, letterSpacing: -1.5 }}>You asked, we answered</h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            { q: 'What counts as one activity?', a: 'One confirmed stadium booking consumes one credit. Browsing, clicking, or checking availability does not use credits. Only a successfully confirmed booking deducts a credit.' },
            { q: 'When do my weekly credits reset?', a: 'Credits reset every Monday at midnight UTC. The week runs Monday 00:00 UTC to Sunday 23:59 UTC.' },
            { q: 'Can I cancel my subscription?', a: 'Yes, you can cancel from your PlayPass page at any time. Your access continues until the end of the billing period.' },
            { q: 'Does Unlimited really have no limits?', a: 'Unlimited gives you unlimited activity credits. Regular booking rules apply — stadium availability, time-slot conflicts, and player capacities still restrict bookings.' },
            { q: 'Is payment secure?', a: 'Payment integration is currently pending. Your subscription will be activated immediately after the confirmation step. Real card processing will be available soon.' },
          ].map((item, idx) => (
            <FaqItem key={idx} q={item.q} a={item.a} />
          ))}
        </div>
      </section>

      {/* ── CTA BOTTOM ───────────────────────────────────────────────────── */}
      <section style={{
        maxWidth: 800, margin: '0 auto', padding: '0 24px 80px', textAlign: 'center',
      }}>
        <div style={{
          background: 'linear-gradient(135deg, rgba(201,255,53,0.1) 0%, rgba(201,255,53,0.04) 100%)',
          border: '1px solid rgba(201,255,53,0.2)',
          borderRadius: 28, padding: '56px 40px',
        }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>⚡</div>
          <h2 style={{ fontSize: 36, fontWeight: 800, letterSpacing: -2, marginBottom: 12 }}>
            Ready to play on your terms?
          </h2>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.55)', marginBottom: 32, lineHeight: 1.7 }}>
            Join hundreds of athletes who use PlayPass to stay active without the per-session costs.
          </p>
          <button
            onClick={() => {
              document.getElementById('plan-card-gold')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }}
            style={{
              height: 54, padding: '0 36px',
              background: '#c9ff35', color: '#070809',
              border: 'none', borderRadius: 12,
              fontWeight: 800, fontSize: 15,
              cursor: 'pointer', fontFamily: 'Manrope, sans-serif',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'none'; }}
          >
            View Plans →
          </button>
          <div style={{ marginTop: 16, fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>
            No commitment. Cancel anytime.
          </div>
        </div>
      </section>

      {/* ── CHECKOUT MODAL ──────────────────────────────────────────────── */}
      {checkoutStep !== 'idle' && checkoutTier && (
        <div
          onClick={() => { setCheckoutStep('idle'); setCheckoutTier(null); }}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(7,8,9,0.92)', backdropFilter: 'blur(16px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 2000, padding: 20,
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: '#151719', border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 24, padding: '40px 36px',
              maxWidth: 480, width: '100%', textAlign: 'center',
              boxShadow: '0 40px 100px rgba(0,0,0,0.6)',
            }}
          >
            {checkoutStep === 'confirm' && (() => {
              const plan = PLAN_META.find(p => p.tier === checkoutTier)!;
              const price = PLAYPASS_PRICES[checkoutTier][selectedDuration];
              return (
                <>
                  <div style={{ fontSize: 52, marginBottom: 12 }}>{plan.icon}</div>
                  <h3 style={{ fontSize: 24, fontWeight: 800, marginBottom: 6 }}>{plan.name}</h3>
                  <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 28 }}>{DURATION_LABELS[selectedDuration]} subscription</div>

                  <div style={{
                    background: '#0d0f11', borderRadius: 14,
                    padding: '20px 24px', marginBottom: 28,
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                      <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>Plan</span>
                      <span style={{ fontWeight: 700 }}>{plan.name}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                      <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>Duration</span>
                      <span style={{ fontWeight: 700 }}>{DURATION_LABELS[selectedDuration]}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                      <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>Weekly credits</span>
                      <span style={{ fontWeight: 700, color: plan.color }}>
                        {plan.weeklyCredits === null ? 'Unlimited' : `${plan.weeklyCredits}× per week`}
                      </span>
                    </div>
                    <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '12px 0' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>Total</span>
                      <span style={{ fontWeight: 900, fontSize: 22, color: '#fff' }}>{price}₾</span>
                    </div>
                  </div>

                  <div style={{
                    background: 'rgba(201,255,53,0.06)', border: '1px solid rgba(201,255,53,0.2)',
                    borderRadius: 10, padding: '10px 14px', marginBottom: 24,
                    fontSize: 12, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6,
                  }}>
                    ⚠️ <strong style={{ color: '#c9ff35' }}>Payment note:</strong> Real payment integration is pending. Clicking "Activate" will simulate a successful payment and immediately activate your plan.
                  </div>

                  <div style={{ display: 'flex', gap: 10 }}>
                    <button
                      onClick={() => { setCheckoutStep('idle'); setCheckoutTier(null); }}
                      style={{
                        flex: 1, height: 48,
                        background: 'transparent', border: '1px solid rgba(255,255,255,0.15)',
                        borderRadius: 12, color: '#fff', fontWeight: 700,
                        fontSize: 13, cursor: 'pointer', fontFamily: 'Manrope, sans-serif',
                      }}
                    >Back</button>
                    <button
                      id="activate-playpass"
                      onClick={handleConfirmSubscribe}
                      disabled={isLoading}
                      style={{
                        flex: 2, height: 48,
                        background: plan.color, color: '#070809',
                        border: 'none', borderRadius: 12,
                        fontWeight: 800, fontSize: 14,
                        cursor: isLoading ? 'wait' : 'pointer',
                        fontFamily: 'Manrope, sans-serif',
                        transition: 'opacity 0.2s',
                        opacity: isLoading ? 0.7 : 1,
                      }}
                    >
                      {isLoading ? 'Activating...' : `Activate ${plan.name} →`}
                    </button>
                  </div>
                </>
              );
            })()}

            {checkoutStep === 'success' && (
              <>
                <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
                <h3 style={{ fontSize: 26, fontWeight: 800, marginBottom: 8 }}>PlayPass Activated!</h3>
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', marginBottom: 28, lineHeight: 1.7 }}>
                  Your {checkoutTier} Pass is now active. Start booking eligible sports right now.
                </p>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button
                    onClick={() => { setCheckoutStep('idle'); setCheckoutTier(null); }}
                    style={{
                      flex: 1, height: 48,
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      borderRadius: 12, color: '#fff', fontWeight: 700,
                      fontSize: 13, cursor: 'pointer', fontFamily: 'Manrope, sans-serif',
                    }}
                  >Close</button>
                  <Link
                    to="/sports"
                    style={{
                      flex: 2, height: 48,
                      background: '#c9ff35', color: '#070809',
                      border: 'none', borderRadius: 12,
                      fontWeight: 800, fontSize: 14,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      textDecoration: 'none',
                    }}
                    onClick={() => { setCheckoutStep('idle'); setCheckoutTier(null); }}
                  >
                    Book a Sport Now →
                  </Link>
                </div>
              </>
            )}

            {checkoutStep === 'error' && (
              <>
                <div style={{ fontSize: 52, marginBottom: 16 }}>⚠️</div>
                <h3 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>Something went wrong</h3>
                <p style={{ fontSize: 13, color: 'rgba(255,100,100,0.9)', marginBottom: 24 }}>{checkoutError}</p>
                <button
                  onClick={() => { setCheckoutStep('idle'); setCheckoutTier(null); }}
                  style={{
                    width: '100%', height: 48,
                    background: '#c9ff35', color: '#070809',
                    border: 'none', borderRadius: 12,
                    fontWeight: 800, fontSize: 14,
                    cursor: 'pointer', fontFamily: 'Manrope, sans-serif',
                  }}
                >Close</button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// ── FAQ accordion item ────────────────────────────────────────────────────────
const FaqItem: React.FC<{ q: string; a: string }> = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div style={{
      background: '#0d0f11',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 14, overflow: 'hidden',
    }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', padding: '18px 20px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'transparent', border: 'none', cursor: 'pointer',
          color: '#fff', fontWeight: 700, fontSize: 14, textAlign: 'left',
          fontFamily: 'Manrope, sans-serif',
        }}
      >
        {q}
        <span style={{ fontSize: 18, transition: 'transform 0.2s', transform: open ? 'rotate(45deg)' : 'none', color: '#c9ff35', flexShrink: 0, marginLeft: 12 }}>+</span>
      </button>
      {open && (
        <div style={{ padding: '0 20px 18px', fontSize: 13, color: 'rgba(255,255,255,0.55)', lineHeight: 1.75 }}>
          {a}
        </div>
      )}
    </div>
  );
};

export default PlayPassPage;
