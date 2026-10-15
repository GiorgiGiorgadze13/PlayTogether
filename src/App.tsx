import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './index.css'
import type { Language } from './types/translations'
import { t } from './constants/translations'
import { AuthProvider } from './context/AuthContext'
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

function App() {
  const [lang, setLang] = useState<Language>(() => {
    const savedLang = localStorage.getItem('playTogetherLang')
    return savedLang === 'en' || savedLang === 'ka' ? savedLang : 'en'
  })

  useEffect(() => {
    localStorage.setItem('playTogetherLang', lang)
  }, [lang])

  const toggleLanguage = () => {
    setLang((prev) => (prev === 'en' ? 'ka' : 'en'))
  }

  const c = t[lang]

  return (
    <AuthProvider>
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
    </AuthProvider>
  )
}

export default App