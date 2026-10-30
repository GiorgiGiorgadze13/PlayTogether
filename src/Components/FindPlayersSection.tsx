import React, { useState, useEffect, useRef } from 'react';
import type { TranslationContent } from '../types/translations';
import { useAuth } from '../context/AuthContext';

interface FindPlayersSectionProps {
  c: TranslationContent;
}

type SkillLevel = 'Beginner' | 'Intermediate' | 'Pro' | 'Any';
type Sport = 'Football' | 'Basketball' | 'Tennis' | 'Volleyball' | 'Running' | 'Padel' | 'Swimming' | 'Other';
type Day = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';

interface Comment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  text: string;
  createdAt: string;
}

interface PlayerPost {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  sport: Sport;
  skill: SkillLevel;
  location: string;
  days: Day[];
  phone?: string;
  whatsapp?: string;
  discord?: string;
  bio: string;
  createdAt: string;
}

const SPORTS: Sport[] = ['Football', 'Basketball', 'Tennis', 'Volleyball', 'Running', 'Padel', 'Swimming', 'Other'];
const SKILLS: SkillLevel[] = ['Beginner', 'Intermediate', 'Pro', 'Any'];
const DAYS: Day[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const SPORT_EMOJIS: Record<Sport, string> = {
  Football: '⚽', Basketball: '🏀', Tennis: '🎾', Volleyball: '🏐',
  Running: '🏃', Padel: '🏓', Swimming: '🏊', Other: '🎯',
};

const SKILL_COLORS: Record<SkillLevel, { bg: string; text: string; border: string }> = {
  Beginner: { bg: 'rgba(96, 211, 148, 0.15)', text: '#60d394', border: 'rgba(96, 211, 148, 0.35)' },
  Intermediate: { bg: 'rgba(255, 183, 77, 0.15)', text: '#ffb74d', border: 'rgba(255, 183, 77, 0.35)' },
  Pro: { bg: 'rgba(239, 83, 80, 0.15)', text: '#ef5350', border: 'rgba(239, 83, 80, 0.35)' },
  Any: { bg: 'rgba(201, 255, 53, 0.12)', text: '#c9ff35', border: 'rgba(201, 255, 53, 0.3)' },
};

const STORAGE_KEY = 'playTogether_player_posts';
const COMMENTS_KEY = 'playTogether_player_comments';

const DEMO_POSTS: PlayerPost[] = [
  {
    id: 'demo-1', authorId: 'demo-user-1', authorName: 'Giorgi K.',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=giorgi',
    sport: 'Football', skill: 'Intermediate', location: 'Tbilisi, Vake',
    days: ['Sat', 'Sun'], phone: '+995 555 123456', whatsapp: '+995555123456',
    discord: 'giorgi_k#1234',
    bio: 'Looking for 2-3 more players for weekend 5v5 matches. We play at Vake park every Saturday morning.',
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
  },
  {
    id: 'demo-2', authorId: 'demo-user-2', authorName: 'Nino M.',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=nino',
    sport: 'Tennis', skill: 'Beginner', location: 'Tbilisi, Saburtalo',
    days: ['Tue', 'Thu'], phone: '+995 599 234567',
    bio: 'Just started playing tennis. Looking for a patient partner to practice with. Have my own racket!',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    id: 'demo-3', authorId: 'demo-user-3', authorName: 'Luka J.',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=luka',
    sport: 'Basketball', skill: 'Pro', location: 'Tbilisi, Isani',
    days: ['Mon', 'Wed', 'Fri'], discord: 'luka_baller#9876',
    bio: 'Organizing a competitive 3v3 league. Need skilled players who take the game seriously. Weekday evenings.',
    createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
  },
  {
    id: 'demo-4', authorId: 'demo-user-4', authorName: 'Mariam T.',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mariam',
    sport: 'Running', skill: 'Intermediate', location: 'Tbilisi, Mtatsminda',
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], phone: '+995 577 345678',
    whatsapp: '+995577345678',
    bio: 'Morning runner looking for a training partner. Usually 6km route around Mtatsminda park. 7am start.',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'demo-5', authorId: 'demo-user-5', authorName: 'Davit A.',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=davit',
    sport: 'Volleyball', skill: 'Any', location: 'Batumi, Center',
    days: ['Sat', 'Sun'], phone: '+995 591 456789',
    bio: 'Beach volleyball crew looking for new members! All skill levels welcome. Fun and friendly vibes only 🏐',
    createdAt: new Date(Date.now() - 3600000 * 72).toISOString(),
  },
  {
    id: 'demo-6', authorId: 'demo-user-6', authorName: 'Ana R.',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ana',
    sport: 'Padel', skill: 'Intermediate', location: 'Tbilisi, Dighomi',
    days: ['Wed', 'Sat'], discord: 'ana_padel#5555',
    bio: 'Looking for a doubles partner for padel. We have a court booked every Wednesday at 7pm and Saturday at noon.',
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
];

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export const FindPlayersSection: React.FC<FindPlayersSectionProps> = ({ c: _c }) => {
  const { user, isAuthenticated, openAuthModal } = useAuth();

  const [posts, setPosts] = useState<PlayerPost[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [filterSport, setFilterSport] = useState<Sport | 'All'>('All');
  const [filterSkill, setFilterSkill] = useState<SkillLevel | 'All'>('All');
  const [filterLocation, setFilterLocation] = useState('');

  const [showPostModal, setShowPostModal] = useState(false);
  const [activeCommentsPostId, setActiveCommentsPostId] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');

  const [form, setForm] = useState({
    sport: 'Football' as Sport,
    skill: 'Intermediate' as SkillLevel,
    location: '',
    days: [] as Day[],
    phone: '',
    whatsapp: '',
    discord: '',
    bio: '',
  });
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const commentInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const storedComments = localStorage.getItem(COMMENTS_KEY);
    const userPosts: PlayerPost[] = stored ? JSON.parse(stored) : [];
    const allPosts = [...DEMO_POSTS, ...userPosts].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    setPosts(allPosts);
    setComments(storedComments ? JSON.parse(storedComments) : []);
  }, []);

  const savePosts = (newUserPosts: PlayerPost[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUserPosts));
    const allPosts = [...DEMO_POSTS, ...newUserPosts].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    setPosts(allPosts);
  };

  const saveComments = (c: Comment[]) => {
    localStorage.setItem(COMMENTS_KEY, JSON.stringify(c));
    setComments(c);
  };

  const filteredPosts = posts.filter((p) => {
    if (filterSport !== 'All' && p.sport !== filterSport) return false;
    if (filterSkill !== 'All' && p.skill !== filterSkill) return false;
    if (filterLocation && !p.location.toLowerCase().includes(filterLocation.toLowerCase())) return false;
    return true;
  });

  const handlePostSubmit = () => {
    if (!form.location.trim()) { setFormError('Location is required'); return; }
    if (!form.bio.trim()) { setFormError('Please write a short description'); return; }
    if (form.days.length === 0) { setFormError('Select at least one available day'); return; }
    if (!form.phone && !form.whatsapp && !form.discord) {
      setFormError('Provide at least one contact method (phone, WhatsApp, or Discord)');
      return;
    }

    setSubmitting(true);
    const newPost: PlayerPost = {
      id: 'post-' + Date.now(),
      authorId: user!.id,
      authorName: user!.name,
      authorAvatar: user!.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user!.name)}`,
      sport: form.sport,
      skill: form.skill,
      location: form.location.trim(),
      days: form.days,
      phone: form.phone.trim() || undefined,
      whatsapp: form.whatsapp.trim() || undefined,
      discord: form.discord.trim() || undefined,
      bio: form.bio.trim(),
      createdAt: new Date().toISOString(),
    };

    const stored = localStorage.getItem(STORAGE_KEY);
    const existing: PlayerPost[] = stored ? JSON.parse(stored) : [];
    savePosts([newPost, ...existing]);

    setForm({ sport: 'Football', skill: 'Intermediate', location: '', days: [], phone: '', whatsapp: '', discord: '', bio: '' });
    setFormError('');
    setSubmitting(false);
    setShowPostModal(false);
  };

  const handleAddComment = (postId: string) => {
    if (!newComment.trim()) return;
    const c: Comment = {
      id: 'c-' + Date.now(),
      postId,
      authorId: user!.id,
      authorName: user!.name,
      authorAvatar: user!.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user!.name)}`,
      text: newComment.trim(),
      createdAt: new Date().toISOString(),
    };
    saveComments([...comments, c]);
    setNewComment('');
  };

  const toggleDay = (day: Day) => {
    setForm((f) => ({
      ...f,
      days: f.days.includes(day) ? f.days.filter((d) => d !== day) : [...f.days, day],
    }));
  };

  const postComments = (postId: string) => comments.filter((c) => c.postId === postId);
  const activePost = posts.find((p) => p.id === activeCommentsPostId);

  return (
    <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '48px 24px 80px' }}>

      <div style={{ marginBottom: '40px' }}>
        <span style={{ fontSize: '11px', fontWeight: 800, color: '#c9ff35', letterSpacing: '2px', textTransform: 'uppercase' }}>
          ⚡ COMMUNITY HUB
        </span>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginTop: '10px' }}>
          <div>
            <h1 style={{ fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 800, color: '#fff', lineHeight: 1, letterSpacing: '-2px', margin: 0 }}>
              Find Players <span style={{ color: 'rgba(255,255,255,0.3)' }}>& Form Teams</span>
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', marginTop: '10px', lineHeight: 1.7 }}>
              Post a listing, browse players near you, and connect directly via phone, WhatsApp, or Discord.
            </p>
          </div>
          <button
            id="post-listing-btn"
            onClick={() => isAuthenticated ? setShowPostModal(true) : openAuthModal('register')}
            style={{
              background: '#c9ff35', color: '#070809', border: 'none', borderRadius: '12px',
              padding: '14px 28px', fontWeight: 800, fontSize: '14px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              boxShadow: '0 0 30px rgba(201,255,53,0.25)',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 8px 40px rgba(201,255,53,0.4)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'none'; (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 30px rgba(201,255,53,0.25)'; }}
          >
            <span style={{ fontSize: '18px' }}>+</span>
            Post a Listing
          </button>
        </div>
      </div>

      <div style={{ marginBottom: '36px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.4)', marginRight: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>Sport:</span>
          {(['All', ...SPORTS] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilterSport(s as typeof filterSport)}
              style={{
                padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: 700, cursor: 'pointer',
                border: `1px solid ${filterSport === s ? 'rgba(201,255,53,0.5)' : 'rgba(255,255,255,0.1)'}`,
                background: filterSport === s ? 'rgba(201,255,53,0.15)' : 'rgba(255,255,255,0.04)',
                color: filterSport === s ? '#c9ff35' : 'rgba(255,255,255,0.6)',
                transition: 'all 0.15s ease',
              }}
            >
              {s !== 'All' ? `${SPORT_EMOJIS[s as Sport]} ` : ''}{s}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px' }}>Skill:</span>
            {(['All', ...SKILLS] as const).map((s) => (
              <button
                key={s}
                onClick={() => setFilterSkill(s as typeof filterSkill)}
                style={{
                  padding: '5px 13px', borderRadius: '20px', fontSize: '12px', fontWeight: 700, cursor: 'pointer',
                  border: `1px solid ${filterSkill === s ? 'rgba(201,255,53,0.5)' : 'rgba(255,255,255,0.1)'}`,
                  background: filterSkill === s ? 'rgba(201,255,53,0.15)' : 'rgba(255,255,255,0.04)',
                  color: filterSkill === s ? '#c9ff35' : 'rgba(255,255,255,0.6)',
                  transition: 'all 0.15s ease',
                }}
              >
                {s}
              </button>
            ))}
          </div>

          <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
            <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '14px', opacity: 0.5 }}>📍</span>
            <input
              placeholder="Filter by city or area..."
              value={filterLocation}
              onChange={e => setFilterLocation(e.target.value)}
              style={{
                width: '100%', padding: '8px 14px 8px 34px', borderRadius: '10px',
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                color: '#fff', fontSize: '13px', outline: 'none',
                transition: 'border-color 0.2s ease',
              }}
              onFocus={e => (e.currentTarget.style.borderColor = 'rgba(201,255,53,0.4)')}
              onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
            />
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '20px', color: 'rgba(255,255,255,0.4)', fontSize: '13px', fontWeight: 600 }}>
        {filteredPosts.length} {filteredPosts.length === 1 ? 'listing' : 'listings'} found
      </div>

      {filteredPosts.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '80px 24px',
          background: 'rgba(255,255,255,0.03)', borderRadius: '20px',
          border: '1px dashed rgba(255,255,255,0.1)',
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '16px', fontWeight: 600 }}>No listings match your filters.</p>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '13px', marginTop: '8px' }}>Try adjusting your filters or be the first to post!</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: '20px',
        }}>
          {filteredPosts.map((post) => {
            const skillColor = SKILL_COLORS[post.skill];
            const commentsForPost = postComments(post.id);
            return (
              <div
                key={post.id}
                id={`player-card-${post.id}`}
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '20px',
                  padding: '24px',
                  transition: 'border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease',
                  cursor: 'default',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(201,255,53,0.2)';
                  (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
                  (e.currentTarget as HTMLDivElement).style.boxShadow = '0 12px 40px rgba(0,0,0,0.3)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.08)';
                  (e.currentTarget as HTMLDivElement).style.transform = 'none';
                  (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
                }}
              >
                <div style={{
                  position: 'absolute', top: 0, right: 0, width: '120px', height: '120px',
                  background: `radial-gradient(circle at top right, rgba(201,255,53,0.06) 0%, transparent 70%)`,
                  borderRadius: '0 20px 0 100%', pointerEvents: 'none',
                }} />

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '16px' }}>
                  <img
                    src={post.authorAvatar}
                    alt={post.authorName}
                    style={{ width: '48px', height: '48px', borderRadius: '50%', border: '2px solid rgba(201,255,53,0.3)', background: '#1e2022', flexShrink: 0 }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: 800, fontSize: '15px', color: '#fff' }}>{post.authorName}</span>
                      <span style={{ fontSize: '18px' }}>{SPORT_EMOJIS[post.sport]}</span>
                      <span style={{
                        padding: '2px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 700,
                        background: skillColor.bg, color: skillColor.text, border: `1px solid ${skillColor.border}`,
                      }}>
                        {post.skill}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px', color: 'rgba(255,255,255,0.45)', fontSize: '12px' }}>
                      <span>📍</span>
                      <span>{post.location}</span>
                      <span style={{ opacity: 0.4 }}>·</span>
                      <span>{timeAgo(post.createdAt)}</span>
                    </div>
                  </div>
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <span style={{
                    padding: '4px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 700,
                    background: 'rgba(201,255,53,0.08)', color: '#c9ff35', border: '1px solid rgba(201,255,53,0.2)',
                  }}>
                    {SPORT_EMOJIS[post.sport]} {post.sport}
                  </span>
                </div>

                <p style={{
                  color: 'rgba(255,255,255,0.7)', fontSize: '13px', lineHeight: 1.7,
                  marginBottom: '16px', display: '-webkit-box', WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical', overflow: 'hidden',
                }}>
                  {post.bio}
                </p>

                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '16px' }}>
                  {DAYS.map(day => (
                    <span key={day} style={{
                      padding: '3px 9px', borderRadius: '6px', fontSize: '11px', fontWeight: 700,
                      background: post.days.includes(day) ? 'rgba(201,255,53,0.12)' : 'rgba(255,255,255,0.04)',
                      color: post.days.includes(day) ? '#c9ff35' : 'rgba(255,255,255,0.2)',
                      border: `1px solid ${post.days.includes(day) ? 'rgba(201,255,53,0.3)' : 'rgba(255,255,255,0.06)'}`,
                    }}>
                      {day}
                    </span>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
                  {post.phone && (
                    <a
                      href={`tel:${post.phone.replace(/\s/g, '')}`}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '8px',
                        background: 'rgba(96,211,148,0.1)', border: '1px solid rgba(96,211,148,0.25)',
                        color: '#60d394', fontSize: '12px', fontWeight: 700, textDecoration: 'none',
                        transition: 'background 0.15s ease',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(96,211,148,0.2)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'rgba(96,211,148,0.1)')}
                    >
                      📞 {post.phone}
                    </a>
                  )}
                  {post.whatsapp && (
                    <a
                      href={`https://wa.me/${post.whatsapp.replace(/[^0-9]/g, '')}`}
                      target="_blank" rel="noopener noreferrer"
                      style={{
                        display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '8px',
                        background: 'rgba(37,211,102,0.1)', border: '1px solid rgba(37,211,102,0.25)',
                        color: '#25d366', fontSize: '12px', fontWeight: 700, textDecoration: 'none',
                        transition: 'background 0.15s ease',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(37,211,102,0.2)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'rgba(37,211,102,0.1)')}
                    >
                      💬 WhatsApp
                    </a>
                  )}
                  {post.discord && (
                    <span
                      style={{
                        display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '8px',
                        background: 'rgba(88,101,242,0.1)', border: '1px solid rgba(88,101,242,0.25)',
                        color: '#7289da', fontSize: '12px', fontWeight: 700, userSelect: 'all',
                      }}
                      title="Copy Discord tag"
                    >
                      🎮 {post.discord}
                    </span>
                  )}
                </div>

                <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <button
                    id={`comment-btn-${post.id}`}
                    onClick={() => {
                      if (!isAuthenticated) { openAuthModal('login'); return; }
                      setActiveCommentsPostId(post.id);
                      setNewComment('');
                      setTimeout(() => commentInputRef.current?.focus(), 100);
                    }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '8px',
                      background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px', padding: '7px 14px', color: 'rgba(255,255,255,0.65)',
                      fontSize: '13px', fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLButtonElement).style.background = 'rgba(201,255,53,0.08)';
                      (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(201,255,53,0.3)';
                      (e.currentTarget as HTMLButtonElement).style.color = '#c9ff35';
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.05)';
                      (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.1)';
                      (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.65)';
                    }}
                  >
                    💬 <span>{commentsForPost.length > 0 ? commentsForPost.length : ''} Comment{commentsForPost.length !== 1 ? 's' : ''}</span>
                  </button>

                  {commentsForPost.length > 0 && (
                    <div style={{ display: 'flex', gap: '-4px' }}>
                      {commentsForPost.slice(0, 3).map((cm) => (
                        <img key={cm.id} src={cm.authorAvatar} alt={cm.authorName}
                          style={{ width: '22px', height: '22px', borderRadius: '50%', border: '2px solid rgba(21,23,25,0.8)', marginLeft: '-4px', background: '#222' }}
                        />
                      ))}
                      {commentsForPost.length > 3 && (
                        <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', marginLeft: '6px', alignSelf: 'center' }}>+{commentsForPost.length - 3}</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeCommentsPostId && activePost && (
        <div
          onClick={e => { if (e.target === e.currentTarget) setActiveCommentsPostId(null); }}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)',
            zIndex: 9000, display: 'flex', justifyContent: 'flex-end', alignItems: 'stretch',
          }}
        >
          <div style={{
            width: 'min(480px, 100%)', background: '#0f1113',
            border: '1px solid rgba(255,255,255,0.08)', borderRight: 'none',
            display: 'flex', flexDirection: 'column',
            animation: 'slideInRight 0.25s ease',
          }}>
            <div style={{
              padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.07)',
              display: 'flex', alignItems: 'center', gap: '12px',
            }}>
              <img src={activePost.authorAvatar} alt={activePost.authorName}
                style={{ width: '40px', height: '40px', borderRadius: '50%', border: '2px solid rgba(201,255,53,0.3)', background: '#1e2022' }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800, fontSize: '15px', color: '#fff' }}>{activePost.authorName}</div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)' }}>
                  {SPORT_EMOJIS[activePost.sport]} {activePost.sport} · {activePost.location}
                </div>
              </div>
              <button
                id="close-comments-btn"
                onClick={() => setActiveCommentsPostId(null)}
                style={{ background: 'rgba(255,255,255,0.07)', border: 'none', color: 'rgba(255,255,255,0.7)', fontSize: '18px', width: '36px', height: '36px', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                ✕
              </button>
            </div>

            <div style={{ padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.65)', lineHeight: 1.7, margin: 0 }}>{activePost.bio}</p>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {postComments(activePost.id).length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0', color: 'rgba(255,255,255,0.3)', fontSize: '14px' }}>
                  <div style={{ fontSize: '32px', marginBottom: '10px' }}>💬</div>
                  Be the first to comment!
                </div>
              ) : (
                postComments(activePost.id).map((cm) => (
                  <div key={cm.id} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                    <img src={cm.authorAvatar} alt={cm.authorName}
                      style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.1)', flexShrink: 0, background: '#1e2022' }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span style={{ fontWeight: 700, fontSize: '13px', color: '#fff' }}>{cm.authorName}</span>
                        <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)' }}>{timeAgo(cm.createdAt)}</span>
                      </div>
                      <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, margin: 0, background: 'rgba(255,255,255,0.04)', padding: '10px 14px', borderRadius: '0 12px 12px 12px', border: '1px solid rgba(255,255,255,0.06)' }}>
                        {cm.text}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div style={{ padding: '16px 24px', borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', gap: '10px', alignItems: 'center' }}>
              <img
                src={user?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user?.name || 'user')}`}
                alt="you"
                style={{ width: '32px', height: '32px', borderRadius: '50%', border: '2px solid rgba(201,255,53,0.3)', background: '#1e2022', flexShrink: 0 }}
              />
              <input
                ref={commentInputRef}
                id="comment-input"
                placeholder="Write a comment..."
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleAddComment(activePost.id); }}
                style={{
                  flex: 1, padding: '10px 14px', borderRadius: '10px',
                  background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                  color: '#fff', fontSize: '13px', outline: 'none',
                }}
                onFocus={e => (e.currentTarget.style.borderColor = 'rgba(201,255,53,0.4)')}
                onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
              />
              <button
                id="submit-comment-btn"
                onClick={() => handleAddComment(activePost.id)}
                disabled={!newComment.trim()}
                style={{
                  background: newComment.trim() ? '#c9ff35' : 'rgba(255,255,255,0.08)',
                  color: newComment.trim() ? '#070809' : 'rgba(255,255,255,0.3)',
                  border: 'none', borderRadius: '10px', padding: '10px 16px',
                  fontWeight: 800, fontSize: '13px', cursor: newComment.trim() ? 'pointer' : 'default',
                  transition: 'all 0.15s ease', whiteSpace: 'nowrap',
                }}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      {showPostModal && (
        <div
          onClick={e => { if (e.target === e.currentTarget) setShowPostModal(false); }}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)',
            zIndex: 9000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
          }}
        >
          <div style={{
            width: '100%', maxWidth: '560px', background: '#0d0f11',
            border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px',
            padding: '32px', maxHeight: '90vh', overflowY: 'auto',
            animation: 'fadeInUp 0.25s ease',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
              <div>
                <h2 style={{ fontWeight: 800, fontSize: '22px', color: '#fff', margin: 0 }}>Post a Listing</h2>
                <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '13px', marginTop: '4px' }}>Let players find you</p>
              </div>
              <button id="close-post-modal-btn" onClick={() => setShowPostModal(false)}
                style={{ background: 'rgba(255,255,255,0.07)', border: 'none', color: 'rgba(255,255,255,0.7)', fontSize: '18px', width: '36px', height: '36px', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                ✕
              </button>
            </div>

            <label style={labelStyle}>Sport</label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
              {SPORTS.map(s => (
                <button key={s} onClick={() => setForm(f => ({ ...f, sport: s }))}
                  style={{
                    padding: '7px 14px', borderRadius: '10px', fontSize: '12px', fontWeight: 700, cursor: 'pointer',
                    border: `1px solid ${form.sport === s ? 'rgba(201,255,53,0.5)' : 'rgba(255,255,255,0.1)'}`,
                    background: form.sport === s ? 'rgba(201,255,53,0.15)' : 'rgba(255,255,255,0.04)',
                    color: form.sport === s ? '#c9ff35' : 'rgba(255,255,255,0.6)',
                  }}>
                  {SPORT_EMOJIS[s]} {s}
                </button>
              ))}
            </div>

            <label style={labelStyle}>Skill Level</label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
              {SKILLS.map(s => {
                const sc = SKILL_COLORS[s];
                return (
                  <button key={s} onClick={() => setForm(f => ({ ...f, skill: s }))}
                    style={{
                      padding: '7px 14px', borderRadius: '10px', fontSize: '12px', fontWeight: 700, cursor: 'pointer',
                      border: `1px solid ${form.skill === s ? sc.border : 'rgba(255,255,255,0.1)'}`,
                      background: form.skill === s ? sc.bg : 'rgba(255,255,255,0.04)',
                      color: form.skill === s ? sc.text : 'rgba(255,255,255,0.6)',
                    }}>
                    {s}
                  </button>
                );
              })}
            </div>

            <label style={labelStyle}>Location *</label>
            <input
              id="post-location-input"
              placeholder="e.g. Tbilisi, Vake"
              value={form.location}
              onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
              style={inputStyle}
              onFocus={e => (e.currentTarget.style.borderColor = 'rgba(201,255,53,0.4)')}
              onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)')}
            />

            <label style={labelStyle}>Available Days *</label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
              {DAYS.map((d) => (
                <button key={d} onClick={() => toggleDay(d)}
                  style={{
                    padding: '7px 14px', borderRadius: '10px', fontSize: '12px', fontWeight: 700, cursor: 'pointer',
                    border: `1px solid ${form.days.includes(d) ? 'rgba(201,255,53,0.5)' : 'rgba(255,255,255,0.1)'}`,
                    background: form.days.includes(d) ? 'rgba(201,255,53,0.15)' : 'rgba(255,255,255,0.04)',
                    color: form.days.includes(d) ? '#c9ff35' : 'rgba(255,255,255,0.5)',
                  }}>
                  {d}
                </button>
              ))}
            </div>

            <label style={labelStyle}>About You / What You're Looking For *</label>
            <textarea
              id="post-bio-input"
              placeholder="Describe what you're looking for, when you play, experience level, etc."
              value={form.bio}
              onChange={e => { if (e.target.value.length <= 250) setForm(f => ({ ...f, bio: e.target.value })); }}
              rows={3}
              style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.6 }}
              onFocus={e => (e.currentTarget.style.borderColor = 'rgba(201,255,53,0.4)')}
              onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)')}
            />
            <div style={{ textAlign: 'right', fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginTop: '-14px', marginBottom: '20px' }}>
              {form.bio.length}/250
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '18px', marginBottom: '20px' }}>
              <p style={{ fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.5)', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Contact Info <span style={{ color: 'rgba(255,255,255,0.3)', fontWeight: 400, textTransform: 'none' }}>(at least one required)</span>
              </p>
              <label style={labelStyle}>📞 Phone Number</label>
              <input id="post-phone-input" placeholder="+995 5XX XXX XXX" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} style={{ ...inputStyle, marginBottom: '12px' }}
                onFocus={e => (e.currentTarget.style.borderColor = 'rgba(201,255,53,0.4)')} onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)')} />
              <label style={labelStyle}>💬 WhatsApp Number</label>
              <input id="post-whatsapp-input" placeholder="+995 5XX XXX XXX" value={form.whatsapp} onChange={e => setForm(f => ({ ...f, whatsapp: e.target.value }))} style={{ ...inputStyle, marginBottom: '12px' }}
                onFocus={e => (e.currentTarget.style.borderColor = 'rgba(201,255,53,0.4)')} onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)')} />
              <label style={labelStyle}>🎮 Discord Handle</label>
              <input id="post-discord-input" placeholder="username#0000" value={form.discord} onChange={e => setForm(f => ({ ...f, discord: e.target.value }))} style={inputStyle}
                onFocus={e => (e.currentTarget.style.borderColor = 'rgba(201,255,53,0.4)')} onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)')} />
            </div>

            {formError && (
              <div style={{ background: 'rgba(239,83,80,0.1)', border: '1px solid rgba(239,83,80,0.3)', borderRadius: '10px', padding: '12px 16px', marginBottom: '16px', color: '#ef5350', fontSize: '13px', fontWeight: 600 }}>
                ⚠️ {formError}
              </div>
            )}

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                id="cancel-post-btn"
                onClick={() => setShowPostModal(false)}
                style={{ flex: 1, padding: '14px', borderRadius: '12px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', fontWeight: 700, fontSize: '14px', cursor: 'pointer' }}>
                Cancel
              </button>
              <button
                id="submit-post-btn"
                onClick={handlePostSubmit}
                disabled={submitting}
                style={{
                  flex: 2, padding: '14px', borderRadius: '12px',
                  background: '#c9ff35', color: '#070809', border: 'none',
                  fontWeight: 800, fontSize: '14px', cursor: 'pointer',
                  boxShadow: '0 0 20px rgba(201,255,53,0.25)',
                  opacity: submitting ? 0.7 : 1,
                }}>
                {submitting ? 'Posting...' : '🚀 Post Listing'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes fadeInUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </section>
  );
};

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: '12px', fontWeight: 700,
  color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.8px',
  marginBottom: '10px',
};

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '11px 14px', borderRadius: '10px',
  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)',
  color: '#fff', fontSize: '13px', outline: 'none', marginBottom: '20px',
  transition: 'border-color 0.2s ease', boxSizing: 'border-box',
};

export default FindPlayersSection;
