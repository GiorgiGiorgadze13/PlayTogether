import { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './index.css'
import { AuthProvider } from './context/AuthContext'
import { LanguageProvider, useLanguage } from './context/LanguageContext'
import { AuthModal } from './Components/AuthModal'
import { Header } from './Components/Header'
import { Footer } from './Components/Footer'
import { ScrollToTop } from './Components/ScrollToTop'
import { SubscriptionProvider } from './context/SubscriptionContext'

// Route-level lazy loading: each page chunk is only downloaded when first visited
const HomePage = lazy(() => import('./pages/HomePage').then(m => ({ default: m.HomePage })));
const SportsPage = lazy(() => import('./pages/SportsPage').then(m => ({ default: m.SportsPage })));
const StadiumsPage = lazy(() => import('./pages/StadiumsPage').then(m => ({ default: m.StadiumsPage })));
const GamesPage = lazy(() => import('./pages/GamesPage').then(m => ({ default: m.GamesPage })));
const TournamentsPage = lazy(() => import('./pages/TournamentsPage').then(m => ({ default: m.TournamentsPage })));
const LearnPage = lazy(() => import('./pages/LearnPage').then(m => ({ default: m.LearnPage })));
const FindPlayersPage = lazy(() => import('./pages/FindPlayersPage').then(m => ({ default: m.FindPlayersPage })));
const AboutPage = lazy(() => import('./pages/AboutPage').then(m => ({ default: m.AboutPage })));
const ProfilePage = lazy(() => import('./pages/ProfilePage').then(m => ({ default: m.ProfilePage })));
const AdminPage = lazy(() => import('./pages/AdminPage').then(m => ({ default: m.AdminPage })));
const PlayPassPage = lazy(() => import('./pages/PlayPassPage').then(m => ({ default: m.PlayPassPage })));

/** Minimal full-screen loading state shown while a lazy chunk is downloading */
function PageLoader() {
  return (
    <div style={{
      minHeight: '60vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'rgba(255,255,255,0.4)',
      fontSize: '14px',
    }}>
      Loading…
    </div>
  );
}

function AppInner() {
  const { lang, c, toggleLanguage } = useLanguage()

  return (
    <Router>
      <SubscriptionProvider>
        <ScrollToTop />
        <div className="app">
          <Header lang={lang} onToggleLanguage={toggleLanguage} c={c} />
          <main>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<HomePage c={c} />} />
                <Route path="/sports" element={<SportsPage c={c} />} />
                <Route path="/stadiums" element={<StadiumsPage c={c} />} />
                <Route path="/games" element={<GamesPage c={c} />} />
                <Route path="/tournaments" element={<TournamentsPage c={c} />} />
                <Route path="/learn" element={<LearnPage c={c} />} />
                <Route path="/find-players" element={<FindPlayersPage c={c} />} />
                <Route path="/about" element={<AboutPage c={c} />} />
                <Route path="/profile" element={<ProfilePage c={c} />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/search" element={<GamesPage c={c} />} />
                <Route path="/playpass" element={<PlayPassPage c={c} />} />
              </Routes>
            </Suspense>
          </main>
          <Footer c={c} />
          <AuthModal c={c} />
        </div>
      </SubscriptionProvider>
    </Router>
  )
}

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <AppInner />
      </LanguageProvider>
    </AuthProvider>
  )
}

export default App