import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './index.css'
import { AuthProvider } from './context/AuthContext'
import { LanguageProvider, useLanguage } from './context/LanguageContext'
import { AuthModal } from './Components/AuthModal'
import { Header } from './Components/Header'
import { Footer } from './Components/Footer'
import { ScrollToTop } from './Components/ScrollToTop'

import { HomePage } from './pages/HomePage'
import { SportsPage } from './pages/SportsPage'
import { StadiumsPage } from './pages/StadiumsPage'
import { GamesPage } from './pages/GamesPage'
import { TournamentsPage } from './pages/TournamentsPage'
import { LearnPage } from './pages/LearnPage'
import { FindPlayersPage } from './pages/FindPlayersPage'
import { AboutPage } from './pages/AboutPage'
import { ProfilePage } from './pages/ProfilePage'
import { AdminPage } from './pages/AdminPage'
import { PlayPassPage } from './pages/PlayPassPage'
import { SubscriptionProvider } from './context/SubscriptionContext'

function AppInner() {
  const { lang, c, toggleLanguage } = useLanguage()

  return (
    <Router>
      <SubscriptionProvider>
        <ScrollToTop />
        <div className="app">
          <Header lang={lang} onToggleLanguage={toggleLanguage} c={c} />
          <main>
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