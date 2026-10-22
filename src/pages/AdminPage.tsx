/* oxlint-disable */
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import type { InstructorBooking, AdminStats, AdminUser } from '../services/api';

// ── Storage keys (must match FindPlayersSection) ──
const POSTS_KEY = 'playTogether_player_posts';
const COMMENTS_KEY = 'playTogether_player_comments';
const BANNED_KEY = 'playTogether_banned_users';
const REPORTS_KEY = 'playTogether_reports';

// ── Types ──
interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  sport: string;
  skill: string;
  location: string;
  bio: string;
  createdAt: string;
  phone?: string;
  whatsapp?: string;
  discord?: string;
}

interface Comment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  text: string;
  createdAt: string;
}

interface BannedUser {
  id: string;
  name: string;
  email?: string;
  reason: string;
  bannedAt: string;
}

interface Report {
  id: string;
  targetType: 'post' | 'comment';
  targetId: string;
  targetPreview: string;
  authorName: string;
  reason: string;
  createdAt: string;
}

// ── Demo posts that always exist (from FindPlayersSection) ──
const DEMO_AUTHOR_IDS = ['demo-user-1', 'demo-user-2', 'demo-user-3', 'demo-user-4', 'demo-user-5', 'demo-user-6'];

const SPORT_EMOJIS: Record<string, string> = {
  Football: '⚽', Basketball: '🏀', Tennis: '🎾', Volleyball: '🏐',
  Running: '🏃', Padel: '🏓', Swimming: '🏊', Other: '🎯',
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

type Tab = 'dashboard' | 'bookings' | 'posts' | 'comments' | 'users' | 'reports' | 'dbusers';

export const AdminPage: React.FC = () => {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<Tab>('dashboard');

  // Local-storage content (posts, comments, bans, reports)
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [bannedUsers, setBannedUsers] = useState<BannedUser[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [banReason, setBanReason] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<{ type: string; id: string } | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  // API-sourced data
  const [adminStats, setAdminStats] = useState<AdminStats | null>(null);
  const [bookings, setBookings] = useState<InstructorBooking[]>([]);
  const [dbUsers, setDbUsers] = useState<AdminUser[]>([]);
  const [apiLoading, setApiLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // ── Auth guard ──
  useEffect(() => {
    if (!isAdmin) {
      navigate('/', { replace: true });
    }
  }, [isAdmin, navigate]);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Load localStorage content
  const loadLocalData = useCallback(() => {
    const storedPosts: Post[] = JSON.parse(localStorage.getItem(POSTS_KEY) || '[]');
    const storedComments: Comment[] = JSON.parse(localStorage.getItem(COMMENTS_KEY) || '[]');
    const storedBanned: BannedUser[] = JSON.parse(localStorage.getItem(BANNED_KEY) || '[]');
    const storedReports: Report[] = JSON.parse(localStorage.getItem(REPORTS_KEY) || '[]');
    setPosts(storedPosts);
    setComments(storedComments);
    setBannedUsers(storedBanned);
    setReports(storedReports);
  }, []);

  // Load real API data
  const loadApiData = useCallback(async () => {
    if (!isAdmin) return;
    setApiLoading(true);
    setApiError(null);
    try {
      const [statsRes, bookingsRes, usersRes] = await Promise.all([
        api.admin.getStats(),
        api.admin.getBookings(),
        api.admin.getUsers(),
      ]);
      setAdminStats(statsRes.stats);
      setBookings(bookingsRes.bookings);
      setDbUsers(usersRes.users);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to load admin data from server.';
      setApiError(msg);
    } finally {
      setApiLoading(false);
    }
  }, [isAdmin]);

  useEffect(() => { loadLocalData(); }, [loadLocalData]);
  useEffect(() => { loadApiData(); }, [loadApiData]);

  // ── Actions ──
  const deletePost = (postId: string) => {
    const updated = posts.filter((p) => p.id !== postId);
    localStorage.setItem(POSTS_KEY, JSON.stringify(updated));
    const updatedComments = comments.filter((c) => c.postId !== postId);
    localStorage.setItem(COMMENTS_KEY, JSON.stringify(updatedComments));
    setPosts(updated);
    setComments(updatedComments);
    setConfirmDelete(null);
    showToast('Post deleted successfully');
  };

  const deleteComment = (commentId: string) => {
    const updated = comments.filter((c) => c.id !== commentId);
    localStorage.setItem(COMMENTS_KEY, JSON.stringify(updated));
    setComments(updated);
    setConfirmDelete(null);
    showToast('Comment removed successfully');
  };

  const banUser = (authorId: string, authorName: string) => {
    const reason = banReason[authorId] || 'Violation of community guidelines';
    const already = bannedUsers.find((b) => b.id === authorId);
    if (already) { showToast(`${authorName} is already banned`, 'error'); return; }
    const newBan: BannedUser = {
      id: authorId, name: authorName, reason,
      bannedAt: new Date().toISOString(),
    };
    const updated = [...bannedUsers, newBan];
    localStorage.setItem(BANNED_KEY, JSON.stringify(updated));
    setBannedUsers(updated);
    showToast(`${authorName} has been banned`);
  };

  const unbanUser = (userId: string) => {
    const updated = bannedUsers.filter((b) => b.id !== userId);
    localStorage.setItem(BANNED_KEY, JSON.stringify(updated));
    setBannedUsers(updated);
    showToast('User unbanned');
  };

  const resolveReport = (reportId: string) => {
    const updated = reports.filter((r) => r.id !== reportId);
    localStorage.setItem(REPORTS_KEY, JSON.stringify(updated));
    setReports(updated);
    showToast('Report resolved');
  };

  const isBanned = (userId: string) => bannedUsers.some((b) => b.id === userId);

  // ── Stats ──
  const totalPosts = posts.length;
  const totalComments = comments.length;
  const totalBanned = bannedUsers.length;
  const pendingReports = reports.length;

  const filteredPosts = posts.filter((p) =>
    p.authorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.location.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredComments = comments.filter((c) =>
    c.authorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isAdmin) return null;

  const statusColor = (s: string) => {
    if (s === 'CONFIRMED') return '#60d394';
    if (s === 'CANCELLED') return '#ef5350';
    return '#ffb74d';
  };

  const tabs: { id: Tab; label: string; icon: string; count?: number }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'bookings', label: 'Bookings', icon: '📚', count: bookings.length },
    { id: 'dbusers', label: 'DB Users', icon: '👥', count: dbUsers.length },
    { id: 'posts', label: 'Player Posts', icon: '📋', count: totalPosts },
    { id: 'comments', label: 'Comments', icon: '💬', count: totalComments },
    { id: 'users', label: 'Banned Users', icon: '🚫', count: totalBanned },
    { id: 'reports', label: 'Reports', icon: '🚩', count: pendingReports },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#0a0b0d', display: 'flex', flexDirection: 'column' }}>

      {/* ── TOAST ── */}
      {toast && (
        <div style={{
          position: 'fixed', top: '24px', right: '24px', zIndex: 99999,
          background: toast.type === 'success' ? 'rgba(96,211,148,0.95)' : 'rgba(239,83,80,0.95)',
          color: '#fff', padding: '12px 20px', borderRadius: '12px',
          fontWeight: 700, fontSize: '14px', boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          animation: 'fadeInUp 0.2s ease',
        }}>
          {toast.type === 'success' ? '✅' : '❌'} {toast.msg}
        </div>
      )}

      {/* ── CONFIRM DIALOG ── */}
      {confirmDelete && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)',
          zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            background: '#13151a', border: '1px solid rgba(239,83,80,0.3)', borderRadius: '20px',
            padding: '32px', maxWidth: '420px', width: '100%', textAlign: 'center',
          }}>
            <div style={{ fontSize: '40px', marginBottom: '16px' }}>⚠️</div>
            <h3 style={{ fontWeight: 800, fontSize: '18px', color: '#fff', marginBottom: '8px' }}>
              Confirm Deletion
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '14px', marginBottom: '24px' }}>
              This action cannot be undone. The {confirmDelete.type} will be permanently removed.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button onClick={() => setConfirmDelete(null)}
                style={{ padding: '12px 24px', borderRadius: '10px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: '14px' }}>
                Cancel
              </button>
              <button onClick={() => {
                if (confirmDelete.type === 'post') deletePost(confirmDelete.id);
                else deleteComment(confirmDelete.id);
              }}
                style={{ padding: '12px 24px', borderRadius: '10px', background: '#ef5350', border: 'none', color: '#fff', fontWeight: 800, cursor: 'pointer', fontSize: '14px' }}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── ADMIN TOPBAR ── */}
      <div style={{
        background: 'rgba(7,8,9,0.95)', borderBottom: '1px solid rgba(201,255,53,0.15)',
        padding: '0 32px', height: '60px', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100,
        backdropFilter: 'blur(12px)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '8px',
            background: 'linear-gradient(135deg, #c9ff35, #8bc34a)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px',
          }}>🛡️</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '15px', color: '#fff' }}>Admin Panel</div>
            <div style={{ fontSize: '11px', color: '#c9ff35', fontWeight: 600 }}>PlayTogether</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <img src={user?.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${user?.email}`} alt="admin"
            style={{ width: '32px', height: '32px', borderRadius: '50%', border: '2px solid #c9ff35' }}
          />
          <span style={{ fontSize: '13px', fontWeight: 700, color: '#c9ff35' }}>
            {user?.name} <span style={{ background: '#c9ff35', color: '#070809', padding: '2px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: 800, marginLeft: '6px' }}>ADMIN</span>
          </span>
          <button
            id="admin-goto-site-btn"
            onClick={() => navigate('/')}
            style={{ padding: '7px 14px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>
            ← Site
          </button>
          <button
            id="admin-logout-btn"
            onClick={() => { logout(); navigate('/'); }}
            style={{ padding: '7px 14px', borderRadius: '8px', background: 'rgba(239,83,80,0.1)', border: '1px solid rgba(239,83,80,0.3)', color: '#ef5350', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>
            Logout
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flex: 1 }}>

        {/* ── SIDEBAR ── */}
        <div style={{
          width: '220px', flexShrink: 0, background: 'rgba(13,15,17,0.98)',
          borderRight: '1px solid rgba(255,255,255,0.06)', padding: '24px 12px',
          display: 'flex', flexDirection: 'column', gap: '4px',
          position: 'sticky', top: '60px', height: 'calc(100vh - 60px)', overflowY: 'auto',
        }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              id={`admin-tab-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px',
                borderRadius: '10px', border: 'none', cursor: 'pointer', textAlign: 'left',
                background: activeTab === tab.id ? 'rgba(201,255,53,0.1)' : 'transparent',
                color: activeTab === tab.id ? '#c9ff35' : 'rgba(255,255,255,0.55)',
                fontWeight: activeTab === tab.id ? 700 : 500, fontSize: '13px',
                transition: 'all 0.15s ease', position: 'relative',
              }}
              onMouseEnter={e => { if (activeTab !== tab.id) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.04)'; }}
              onMouseLeave={e => { if (activeTab !== tab.id) (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
            >
              <span style={{ fontSize: '16px' }}>{tab.icon}</span>
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <span style={{
                  marginLeft: 'auto', background: activeTab === tab.id ? '#c9ff35' : 'rgba(255,255,255,0.12)',
                  color: activeTab === tab.id ? '#070809' : 'rgba(255,255,255,0.7)',
                  padding: '1px 7px', borderRadius: '20px', fontSize: '11px', fontWeight: 800,
                }}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── MAIN CONTENT ── */}
        <div style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>

          {/* API Error Banner */}
          {apiError && (
            <div style={{
              background: 'rgba(239,83,80,0.1)', border: '1px solid rgba(239,83,80,0.3)',
              borderRadius: '12px', padding: '14px 18px', marginBottom: '24px',
              display: 'flex', alignItems: 'center', gap: '10px',
            }}>
              <span style={{ fontSize: '18px' }}>⚠️</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: '14px', color: '#ef5350', marginBottom: '2px' }}>Backend API Error</div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.55)' }}>{apiError}</div>
              </div>
              <button onClick={loadApiData} style={{ marginLeft: 'auto', padding: '6px 14px', borderRadius: '8px', background: 'rgba(239,83,80,0.15)', border: '1px solid rgba(239,83,80,0.3)', color: '#ef5350', fontWeight: 700, fontSize: '12px', cursor: 'pointer' }}>
                Retry
              </button>
            </div>
          )}

          {/* ══════════ DASHBOARD ══════════ */}
          {activeTab === 'dashboard' && (
            <div>
              <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>
                Welcome back, {user?.name} 👋
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '14px', marginBottom: '32px' }}>
                Here's an overview of the PlayTogether community.
              </p>

              {/* Stat Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '40px' }}>
                {[
                  { label: 'DB Users', value: adminStats?.totalUsers ?? '—', icon: '👥', color: '#60d394', sub: 'registered accounts' },
                  { label: 'Instructor Bookings', value: adminStats?.totalInstructorBookings ?? '—', icon: '📚', color: '#c9ff35', sub: 'saved in database' },
                  { label: 'Games Created', value: adminStats?.totalGames ?? '—', icon: '⚽', color: '#64b5f6', sub: 'all time' },
                  { label: 'Active Subscriptions', value: adminStats?.activeSubscriptions ?? '—', icon: '⭐', color: '#ffb74d', sub: 'PlayPass members' },
                  { label: 'Player Listings', value: totalPosts, icon: '📋', color: '#c9ff35', sub: 'user-created posts' },
                  { label: 'Open Reports', value: pendingReports, icon: '🚩', color: '#ef5350', sub: 'awaiting review' },
                ].map((stat) => (
                  <div key={stat.label} style={{
                    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '16px', padding: '24px', position: 'relative', overflow: 'hidden',
                  }}>
                    <div style={{ position: 'absolute', top: '-10px', right: '-10px', fontSize: '60px', opacity: 0.06 }}>{stat.icon}</div>
                    <div style={{ fontSize: '32px', marginBottom: '8px' }}>{stat.icon}</div>
                    <div style={{ fontSize: '36px', fontWeight: 800, color: stat.color }}>{apiLoading && typeof stat.value === 'string' ? '…' : stat.value}</div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#fff', marginTop: '4px' }}>{stat.label}</div>
                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginTop: '2px' }}>{stat.sub}</div>
                  </div>
                ))}
              </div>

              {/* Quick Actions */}
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#fff', marginBottom: '16px' }}>Quick Actions</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
                {[
                  { label: 'View Bookings', desc: 'See all instructor bookings from DB', tab: 'bookings' as Tab, icon: '📚', color: '#c9ff35' },
                  { label: 'DB Users', desc: 'View all registered users', tab: 'dbusers' as Tab, icon: '👥', color: '#60d394' },
                  { label: 'Moderate Posts', desc: 'Review and remove player listings', tab: 'posts' as Tab, icon: '📋', color: '#64b5f6' },
                  { label: 'Handle Reports', desc: 'Resolve flagged content', tab: 'reports' as Tab, icon: '🚩', color: '#ffb74d' },
                ].map((a) => (
                  <button key={a.tab} onClick={() => setActiveTab(a.tab)}
                    style={{
                      background: 'rgba(255,255,255,0.04)', border: `1px solid rgba(255,255,255,0.08)`,
                      borderRadius: '14px', padding: '20px', textAlign: 'left', cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = a.color; (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.07)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.08)'; (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.04)'; }}
                  >
                    <div style={{ fontSize: '24px', marginBottom: '10px' }}>{a.icon}</div>
                    <div style={{ fontWeight: 800, fontSize: '14px', color: '#fff' }}>{a.label}</div>
                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)', marginTop: '4px' }}>{a.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ══════════ BOOKINGS TAB ══════════ */}
          {activeTab === 'bookings' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#fff', margin: 0 }}>Instructor Bookings</h2>
                  <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '13px', marginTop: '4px' }}>{bookings.length} bookings saved in the database</p>
                </div>
                <button onClick={loadApiData} style={{ padding: '9px 16px', borderRadius: '10px', background: 'rgba(201,255,53,0.1)', border: '1px solid rgba(201,255,53,0.3)', color: '#c9ff35', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}>
                  🔄 Refresh
                </button>
              </div>

              {apiLoading ? (
                <div style={{ textAlign: 'center', padding: '60px', color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>Loading…</div>
              ) : bookings.length === 0 ? (
                <EmptyState icon="📚" text="No instructor bookings yet. They will appear here once users start booking." />
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {bookings.map((booking) => (
                    <div key={booking.id} style={{
                      background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '14px', padding: '20px',
                    }}>
                      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
                        <div style={{ flex: 1, minWidth: '200px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', flexWrap: 'wrap' }}>
                            <span style={{ fontWeight: 800, fontSize: '15px', color: '#fff' }}>{booking.user?.name || 'Unknown User'}</span>
                            <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>{booking.user?.email}</span>
                            <span style={{
                              background: `rgba(${booking.status === 'CONFIRMED' ? '96,211,148' : booking.status === 'CANCELLED' ? '239,83,80' : '255,183,77'},0.15)`,
                              color: statusColor(booking.status),
                              border: `1px solid rgba(${booking.status === 'CONFIRMED' ? '96,211,148' : booking.status === 'CANCELLED' ? '239,83,80' : '255,183,77'},0.3)`,
                              padding: '2px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 700,
                            }}>{booking.status}</span>
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px,1fr))', gap: '8px', fontSize: '13px' }}>
                            <div><span style={{ color: 'rgba(255,255,255,0.4)' }}>Instructor: </span><strong style={{ color: '#fff' }}>{booking.instructorName}</strong></div>
                            <div><span style={{ color: 'rgba(255,255,255,0.4)' }}>Sport: </span><strong style={{ color: '#fff' }}>{booking.sport}</strong></div>
                            <div><span style={{ color: 'rgba(255,255,255,0.4)' }}>Type: </span><strong style={{ color: '#c9ff35' }}>{booking.lessonType}</strong></div>
                            <div><span style={{ color: 'rgba(255,255,255,0.4)' }}>Slot: </span><strong style={{ color: '#fff' }}>🕒 {booking.slot}</strong></div>
                            <div><span style={{ color: 'rgba(255,255,255,0.4)' }}>Amount: </span><strong style={{ color: '#c9ff35' }}>₾{booking.amount}</strong></div>
                            <div><span style={{ color: 'rgba(255,255,255,0.4)' }}>Booked: </span><span style={{ color: 'rgba(255,255,255,0.6)' }}>{timeAgo(booking.createdAt)}</span></div>
                          </div>
                          {booking.notes && (
                            <div style={{ marginTop: '8px', fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
                              📝 {booking.notes}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ══════════ DB USERS TAB ══════════ */}
          {activeTab === 'dbusers' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#fff', margin: 0 }}>Database Users</h2>
                  <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '13px', marginTop: '4px' }}>{dbUsers.length} registered accounts</p>
                </div>
                <button onClick={loadApiData} style={{ padding: '9px 16px', borderRadius: '10px', background: 'rgba(201,255,53,0.1)', border: '1px solid rgba(201,255,53,0.3)', color: '#c9ff35', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}>
                  🔄 Refresh
                </button>
              </div>

              {apiLoading ? (
                <div style={{ textAlign: 'center', padding: '60px', color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>Loading…</div>
              ) : dbUsers.length === 0 ? (
                <EmptyState icon="👥" text="No users found in the database." />
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {dbUsers.map((u) => (
                    <div key={u.id} style={{
                      background: 'rgba(255,255,255,0.04)', border: `1px solid ${u.role === 'ADMIN' ? 'rgba(201,255,53,0.2)' : 'rgba(255,255,255,0.08)'}`,
                      borderRadius: '14px', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap',
                    }}>
                      <img
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(u.email)}`}
                        alt={u.name}
                        style={{ width: '40px', height: '40px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.15)', flexShrink: 0 }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                          <span style={{ fontWeight: 800, fontSize: '14px', color: '#fff' }}>{u.name}</span>
                          {u.role === 'ADMIN' && (
                            <span style={{ background: '#c9ff35', color: '#070809', padding: '1px 7px', borderRadius: '5px', fontSize: '10px', fontWeight: 800 }}>ADMIN</span>
                          )}
                        </div>
                        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)' }}>{u.email}</div>
                      </div>
                      <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
                        <span>📚 {u._count.instructorBookings} bookings</span>
                        <span>⚽ {u._count.createdGames} games</span>
                        <span>Joined {timeAgo(u.createdAt)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ══════════ POSTS TAB ══════════ */}
          {activeTab === 'posts' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#fff', margin: 0 }}>Player Listings</h2>
                  <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '13px', marginTop: '4px' }}>{totalPosts} user-created posts total</p>
                </div>
                <input
                  placeholder="Search posts..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  style={{ padding: '9px 14px', borderRadius: '10px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '13px', outline: 'none', width: '240px' }}
                />
              </div>

              {filteredPosts.length === 0 ? (
                <EmptyState icon="📋" text="No user-created posts match your search." />
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {filteredPosts.map((post) => (
                    <div key={post.id} style={{
                      background: 'rgba(255,255,255,0.04)', border: `1px solid ${isBanned(post.authorId) ? 'rgba(239,83,80,0.2)' : 'rgba(255,255,255,0.08)'}`,
                      borderRadius: '14px', padding: '20px',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                        <img src={post.authorAvatar} alt={post.authorName}
                          style={{ width: '44px', height: '44px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.15)', flexShrink: 0, background: '#1e2022' }}
                        />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                            <span style={{ fontWeight: 800, fontSize: '15px', color: '#fff' }}>{post.authorName}</span>
                            {isBanned(post.authorId) && <span style={{ background: 'rgba(239,83,80,0.15)', color: '#ef5350', border: '1px solid rgba(239,83,80,0.3)', padding: '2px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 700 }}>BANNED</span>}
                            <span style={{ background: 'rgba(201,255,53,0.08)', color: '#c9ff35', border: '1px solid rgba(201,255,53,0.2)', padding: '2px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 700 }}>
                              {SPORT_EMOJIS[post.sport]} {post.sport}
                            </span>
                            <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)' }}>📍 {post.location}</span>
                            <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', marginLeft: 'auto' }}>{timeAgo(post.createdAt)}</span>
                          </div>
                          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', lineHeight: 1.6, marginTop: '8px', marginBottom: '12px' }}>{post.bio}</p>
                          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                            <button
                              id={`admin-delete-post-${post.id}`}
                              onClick={() => setConfirmDelete({ type: 'post', id: post.id })}
                              style={dangerBtn}>
                              🗑️ Delete Post
                            </button>
                            {!isBanned(post.authorId) && !DEMO_AUTHOR_IDS.includes(post.authorId) && (
                              <>
                                <input
                                  placeholder="Ban reason..."
                                  value={banReason[post.authorId] || ''}
                                  onChange={e => setBanReason(r => ({ ...r, [post.authorId]: e.target.value }))}
                                  style={{ padding: '7px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '12px', outline: 'none', width: '200px' }}
                                />
                                <button
                                  id={`admin-ban-user-${post.authorId}`}
                                  onClick={() => banUser(post.authorId, post.authorName)}
                                  style={warnBtn}>
                                  🚫 Ban User
                                </button>
                              </>
                            )}
                            {isBanned(post.authorId) && (
                              <button onClick={() => unbanUser(post.authorId)} style={successBtn}>✅ Unban</button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ══════════ COMMENTS TAB ══════════ */}
          {activeTab === 'comments' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#fff', margin: 0 }}>All Comments</h2>
                  <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '13px', marginTop: '4px' }}>{totalComments} comments across all listings</p>
                </div>
                <input
                  placeholder="Search comments..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  style={{ padding: '9px 14px', borderRadius: '10px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '13px', outline: 'none', width: '240px' }}
                />
              </div>

              {filteredComments.length === 0 ? (
                <EmptyState icon="💬" text="No comments yet or none match your search." />
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {filteredComments.map((comment) => {
                    const parentPost = posts.find((p) => p.id === comment.postId);
                    return (
                      <div key={comment.id} style={{
                        background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '14px', padding: '18px',
                      }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                          <img src={comment.authorAvatar} alt={comment.authorName}
                            style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.12)', flexShrink: 0, background: '#1e2022' }}
                          />
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', flexWrap: 'wrap' }}>
                              <span style={{ fontWeight: 700, fontSize: '14px', color: '#fff' }}>{comment.authorName}</span>
                              <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>{timeAgo(comment.createdAt)}</span>
                              {parentPost && (
                                <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '6px' }}>
                                  on {parentPost.authorName}'s post
                                </span>
                              )}
                            </div>
                            <p style={{
                              color: 'rgba(255,255,255,0.7)', fontSize: '13px', lineHeight: 1.6,
                              background: 'rgba(255,255,255,0.04)', padding: '10px 14px',
                              borderRadius: '8px', marginBottom: '12px', border: '1px solid rgba(255,255,255,0.06)',
                            }}>
                              {comment.text}
                            </p>
                            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                              <button
                                id={`admin-delete-comment-${comment.id}`}
                                onClick={() => setConfirmDelete({ type: 'comment', id: comment.id })}
                                style={dangerBtn}>
                                🗑️ Remove Comment
                              </button>
                              {!isBanned(comment.authorId) && !DEMO_AUTHOR_IDS.includes(comment.authorId) && (
                                <>
                                  <input
                                    placeholder="Ban reason..."
                                    value={banReason[comment.authorId] || ''}
                                    onChange={e => setBanReason(r => ({ ...r, [comment.authorId]: e.target.value }))}
                                    style={{ padding: '6px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '12px', outline: 'none', width: '180px' }}
                                  />
                                  <button onClick={() => banUser(comment.authorId, comment.authorName)} style={warnBtn}>
                                    🚫 Ban User
                                  </button>
                                </>
                              )}
                              {isBanned(comment.authorId) && (
                                <button onClick={() => unbanUser(comment.authorId)} style={successBtn}>✅ Unban</button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ══════════ BANNED USERS TAB ══════════ */}
          {activeTab === 'users' && (
            <div>
              <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>Banned Users</h2>
              <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '13px', marginBottom: '24px' }}>{totalBanned} users currently banned</p>

              {bannedUsers.length === 0 ? (
                <EmptyState icon="🎉" text="No users are currently banned." />
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {bannedUsers.map((banned) => (
                    <div key={banned.id} style={{
                      background: 'rgba(239,83,80,0.05)', border: '1px solid rgba(239,83,80,0.2)',
                      borderRadius: '14px', padding: '20px', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap',
                    }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(239,83,80,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>🚫</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 800, fontSize: '15px', color: '#fff' }}>{banned.name}</div>
                        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)', marginTop: '2px' }}>
                          Reason: <span style={{ color: '#ef5350' }}>{banned.reason}</span>
                        </div>
                        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginTop: '2px' }}>Banned {timeAgo(banned.bannedAt)}</div>
                      </div>
                      <button
                        id={`admin-unban-${banned.id}`}
                        onClick={() => unbanUser(banned.id)}
                        style={successBtn}>
                        ✅ Unban User
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ══════════ REPORTS TAB ══════════ */}
          {activeTab === 'reports' && (
            <div>
              <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>Content Reports</h2>
              <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '13px', marginBottom: '24px' }}>
                {pendingReports} reports waiting for review
              </p>

              {reports.length === 0 ? (
                <EmptyState icon="🚩" text="No reports pending. All content looks clean!" />
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {reports.map((report) => (
                    <div key={report.id} style={{
                      background: 'rgba(255,183,77,0.05)', border: '1px solid rgba(255,183,77,0.2)',
                      borderRadius: '14px', padding: '20px',
                    }}>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                        <div style={{ fontSize: '28px' }}>🚩</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '6px', flexWrap: 'wrap' }}>
                            <span style={{ background: 'rgba(255,183,77,0.15)', color: '#ffb74d', border: '1px solid rgba(255,183,77,0.3)', padding: '2px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }}>
                              {report.targetType}
                            </span>
                            <span style={{ fontWeight: 700, fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>
                              Reported by {report.authorName}
                            </span>
                            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>{timeAgo(report.createdAt)}</span>
                          </div>
                          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', background: 'rgba(255,255,255,0.04)', padding: '10px 14px', borderRadius: '8px', marginBottom: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
                            "{report.targetPreview}"
                          </p>
                          <div style={{ fontSize: '12px', color: '#ffb74d', marginBottom: '12px' }}>
                            Reason: {report.reason}
                          </div>
                          <button onClick={() => resolveReport(report.id)} style={successBtn}>
                            ✅ Mark as Resolved
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { transform: translateY(12px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

// ── Shared button styles ──
const dangerBtn: React.CSSProperties = {
  padding: '7px 14px', borderRadius: '8px', border: '1px solid rgba(239,83,80,0.3)',
  background: 'rgba(239,83,80,0.1)', color: '#ef5350', fontSize: '12px', fontWeight: 700, cursor: 'pointer',
  transition: 'all 0.15s ease',
};

const warnBtn: React.CSSProperties = {
  padding: '7px 14px', borderRadius: '8px', border: '1px solid rgba(255,183,77,0.3)',
  background: 'rgba(255,183,77,0.1)', color: '#ffb74d', fontSize: '12px', fontWeight: 700, cursor: 'pointer',
  transition: 'all 0.15s ease',
};

const successBtn: React.CSSProperties = {
  padding: '7px 14px', borderRadius: '8px', border: '1px solid rgba(96,211,148,0.3)',
  background: 'rgba(96,211,148,0.1)', color: '#60d394', fontSize: '12px', fontWeight: 700, cursor: 'pointer',
  transition: 'all 0.15s ease',
};

// ── Empty State ──
const EmptyState: React.FC<{ icon: string; text: string }> = ({ icon, text }) => (
  <div style={{
    textAlign: 'center', padding: '60px 24px',
    background: 'rgba(255,255,255,0.03)', borderRadius: '16px',
    border: '1px dashed rgba(255,255,255,0.08)',
  }}>
    <div style={{ fontSize: '40px', marginBottom: '12px' }}>{icon}</div>
    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>{text}</p>
  </div>
);

export default AdminPage;
