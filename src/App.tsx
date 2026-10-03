import { useState, useEffect } from 'react'
import './index.css'

function App() {
  const [lang, setLang] = useState<'en' | 'ka'>(() => {
    const savedLang = localStorage.getItem('playTogetherLang')
    return (savedLang === 'en' || savedLang === 'ka') ? savedLang : 'en'
  })

  useEffect(() => {
    localStorage.setItem('playTogetherLang', lang)
  }, [lang])

  const toggleLanguage = () => {
    setLang((prev) => (prev === 'en' ? 'ka' : 'en'))
  }

  const t = {
    en: {
      home: 'Home',
      sports: 'Sports',
      games: 'Games',
      tournaments: 'Tournaments',
      about: 'About',
      login: 'Log in',
      signup: 'Sign up',
      findGameBtn: 'Find a Game',
      createGameBtn: 'Create a Game',
      eyebrow: 'THE SPORTS COMMUNITY',
      heroTitle1: 'Find your game',
      heroTitle2: 'Find your people',
      heroDesc: 'Find your game, meet new teammates, and play what you love.',
      gamesThisWeek: 'Games this week',
      activePlayers: 'Active players',
      sportsVenues: 'Sports venues',
      searchEyebrow: 'FIND YOUR NEXT GAME',
      searchTitle: 'What do you want to play?',
      searchSubtitle: 'Choose your sport, location and preferred time.',
      searchBtn: 'Search Games',
      exploreSports: 'EXPLORE SPORTS',
      chooseGame: 'Choose your game',
      viewAllSports: 'View all sports',
      playSoon: 'Ready to play?',
      upcomingGames: 'Upcoming games',
      seeAllGames: 'See all games',
      spotsLeft: (n: number) => `${n} spots left`,
      dateTime: 'DATE & TIME',
      location: 'LOCATION',
      perPlayer: '/ player',
      joinGame: 'Join Game',
      comingTogether: 'COMING TOGETHER',
      playTournament: 'Play in a tournament',
      tournamentDesc: 'Compete, meet new players and experience the game beyond a single match.',
      exploreTournaments: 'Explore tournaments',
      viewTournament: 'View Tournament →',
      howItWorks: 'HOW IT WORKS',
      howTitle1: 'From searching',
      howTitle2: 'to playing',
      howDesc: 'Everything you need to organize your next game in one place.',
      step1Title: 'Find a game',
      step1Desc: 'Choose your sport, location and preferred time.',
      step2Title: 'Join the team',
      step2Desc: 'Reserve your spot and connect with other players.',
      step3Title: 'Play together',
      step3Desc: 'Show up, meet your team and enjoy the game.',
      footerDesc: 'Find your game. Find your people.',
      explore: 'EXPLORE',
      company: 'COMPANY',
      account: 'ACCOUNT',
      contact: 'Contact',
      rights: 'Built for people who love to play.',
    },
    ka: {
      home: 'მთავარი',
      sports: 'სპორტი',
      games: 'თამაშები',
      tournaments: 'ტურნირები',
      about: 'ჩვენ შესახებ',
      login: 'შესვლა',
      signup: 'რეგისტრაცია',
      findGameBtn: 'იპოვე თამაში',
      createGameBtn: 'შექმენი თამაში',
      eyebrow: 'სპორტული საზოგადოება',
      heroTitle1: 'იპოვე შენი თამაში',
      heroTitle2: 'იპოვე შენი გუნდი',
      heroDesc: 'იპოვე შენი თამაში, გაიცანი ახალი თანაგუნდელები და ითამაშე ის, რაც გიყვარს.',
      gamesThisWeek: 'თამაში ამ კვირაში',
      activePlayers: 'აქტიური მოთამაშე',
      sportsVenues: 'სპორტული მოედანი',
      searchEyebrow: 'იპოვე შენი შემდეგი თამაში',
      searchTitle: 'რის თამაში გსურს?',
      searchSubtitle: 'აირჩიე სპორტი, მდებარეობა და სასურველი დრო.',
      searchBtn: 'თამაშების ძებნა',
      exploreSports: 'აღმოაჩინე სპორტი',
      chooseGame: 'აირჩიე შენი თამაში',
      viewAllSports: 'ყველა სპორტის ნახვა',
      playSoon: 'მზად ხარ თამაშისთვის?',
      upcomingGames: 'მომავალი თამაშები',
      seeAllGames: 'ყველა თამაშის ნახვა',
      spotsLeft: (n: number) => `დარჩენილია ${n} ადგილი`,
      dateTime: 'თარიღი და დრო',
      location: 'მდებარეობა',
      perPlayer: '/ მოთამაშე',
      joinGame: 'თამაშში შეერთება',
      comingTogether: 'გაერთიანება',
      playTournament: 'მიიღე მონაწილეობა ტურნირში',
      tournamentDesc: 'შეეჯიბრე, გაიცანი ახალი მოთამაშეები და მიიღე ახალი ემოციები.',
      exploreTournaments: 'ტურნირების ნახვა',
      viewTournament: 'ტურნირის ნახვა →',
      howItWorks: 'როგორ მუშაობს',
      howTitle1: 'ძებნიდან',
      howTitle2: 'თამაშამდე',
      howDesc: 'ყველაფერი, რაც შენი შემდეგი თამაშის დასაგეგმად გჭირდება.',
      step1Title: 'იპოვე თამაში',
      step1Desc: 'აირჩიე სპორტი, მდებარეობა და სასურველი დრო.',
      step2Title: 'შეუერთდი გუნდს',
      step2Desc: 'დაჯავშნე ადგილი და დაუკავშირდი სხვა მოთამაშეებს.',
      step3Title: 'ითამაშეთ ერთად',
      step3Desc: 'მიდი მოედანზე, გაიცანი გუნდი და ისიამოვნე თამაშით.',
      footerDesc: 'იპოვე შენი თამაში. იპოვე შენი გუნდი.',
      explore: 'ნავიგაცია',
      company: 'კომპანია',
      account: 'ანგარიში',
      contact: 'კონტაქტი',
      rights: 'შეიქმნა მათთვის, ვისაც თამაში უყვარს.',
    },
  }

  const c = t[lang]

  return (
    <div className="app">
      {/* NAVBAR */}
      <header className="navbar">
        <a href="#" className="logo" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          <img 
            src="/ლოგო.png" 
            alt="PlayTogether Logo" 
            style={{ width: '64px', height: '64px', objectFit: 'contain', marginLeft: '-16px' }} 
          />
          <span className="logo-text" style={{ fontSize: '1.5rem', fontWeight: 'bold', marginLeft: '-6px' }}>
            <span style={{ color: '#ffffff' }}>Play</span>
            <span style={{ color: '#888888' }}>Together</span>
          </span>
        </a>

        <nav className="nav-links">
          <a href="#home">{c.home}</a>
          <a href="#sports">{c.sports}</a>
          <a href="#games">{c.games}</a>
          <a href="#tournaments">{c.tournaments}</a>
          <a href="#about">{c.about}</a>
        </nav>

        <div className="nav-actions">
          <button className="login-button">{c.login}</button>
          <button className="signup-button">{c.signup}</button>

          <button 
            className="lang-switcher" 
            onClick={toggleLanguage} 
            style={{ 
              background: 'none', 
              border: '1px solid rgba(255,255,255,0.2)', 
              padding: '6px 12px', 
              borderRadius: '8px', 
              color: '#fff', 
              cursor: 'pointer', 
              marginLeft: '10px',
              fontWeight: 500
            }}
          >
            {lang === 'en' ? 'GEO' : 'ENG'}
          </button>
        </div>
      </header>

      <main>
        {/* HERO */}
        <section className="hero" id="home">
          <div className="hero-content">
            <div className="hero-eyebrow">
              <span className="eyebrow-dot"></span>
              {c.eyebrow}
            </div>

            <h1>
              {c.heroTitle1}
              <br />
              <span>{c.heroTitle2}</span>
            </h1>

            <p className="hero-description">{c.heroDesc}</p>

            <div className="hero-buttons">
              <a href="#search" className="primary-button" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <span>{c.findGameBtn}</span>
                <strong>↗</strong>
              </a>
              <button className="secondary-button">{c.createGameBtn}</button>
            </div>

            <div className="hero-meta">
              <div className="meta-item">
                <strong>120+</strong>
                <span>{c.gamesThisWeek}</span>
              </div>
              <div className="meta-divider"></div>
              <div className="meta-item">
                <strong>850+</strong>
                <span>{c.activePlayers}</span>
              </div>
              <div className="meta-divider"></div>
              <div className="meta-item">
                <strong>24</strong>
                <span>{c.sportsVenues}</span>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="visual-glow"></div>
            <div className="visual-circle visual-circle-one"></div>
            <div className="visual-circle visual-circle-two"></div>
            
            <div className="sport-orbit orbit-one"><div className="sport-object football-object">⚽</div></div>
            <div className="sport-orbit orbit-two"><div className="sport-object basketball-object">🏀</div></div>
            <div className="sport-orbit orbit-three"><div className="sport-object volleyball-object">🏐</div></div>
            <div className="sport-orbit orbit-four"><div className="sport-object rugby-object">🏉</div></div>
            <div className="sport-orbit orbit-five"><div className="sport-object tennis-object">🎾</div></div>
            <div className="sport-orbit orbit-six"><div className="sport-object badminton-object">🏸</div></div>

            <div className="hero-center">
              <div className="center-small">PLAY</div>
              <div className="center-title">TOGETHER</div>
              <div className="center-line"></div>
              <div className="center-caption">YOUR GAME. YOUR PEOPLE.</div>
            </div>
            <div className="visual-label label-top">MULTI-SPORT</div>
            <div className="visual-label label-bottom">6 SPORTS</div>
          </div>
        </section>

        {/* SEARCH SECTION */}
        <section className="search-section" id="search">
          <div className="search-container-card">
            <div className="search-intro">
              <div>
                <span>{c.searchEyebrow}</span>
                <h2>{c.searchTitle}</h2>
              </div>
              <p>{c.searchSubtitle}</p>
            </div>

            <div className="search-box">
              <div className="search-field">
                <small>SPORT</small>
                <div className="field-value"><span className="field-icon">●</span> Football</div>
              </div>
              <div className="search-field">
                <small>LOCATION</small>
                <div className="field-value"><span className="field-icon">⌖</span> Tbilisi</div>
              </div>
              <div className="search-field">
                <small>DATE</small>
                <div className="field-value"><span className="field-icon">□</span> Choose date</div>
              </div>
              <div className="search-field">
                <small>TIME</small>
                <div className="field-value"><span className="field-icon">◷</span> Any time</div>
              </div>
              <button className="search-button">
                {c.searchBtn} <span>↗</span>
              </button>
            </div>
          </div>
        </section>

        {/* SPORTS */}
        <section className="content-section" id="sports">
          <div className="section-heading">
            <div>
              <span>{c.exploreSports}</span>
              <h2>{c.chooseGame}</h2>
            </div>
            <a href="#">{c.viewAllSports} <span>→</span></a>
          </div>

          <div className="sports-grid">
            {/* 01. Football */}
            <article className="sport-card sport-card-large">
              <div className="sport-card-top"><span className="sport-number">01</span><span className="sport-arrow">↗</span></div>
              <div className="sport-visual football-visual">
                <img src="/ფეხბურთი.png" alt="Football" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>
              <div className="sport-card-info"><h3>Football</h3><p>24 games available</p></div>
            </article>

            {/* 02. Basketball */}
            <article className="sport-card">
              <div className="sport-card-top"><span className="sport-number">02</span><span className="sport-arrow">↗</span></div>
              <div className="sport-visual basketball-visual">
                <img src="/კალათბურთი.png" alt="Basketball" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>
              <div className="sport-card-info"><h3>Basketball</h3><p>18 games available</p></div>
            </article>

            {/* 03. Volleyball */}
            <article className="sport-card">
              <div className="sport-card-top"><span className="sport-number">03</span><span className="sport-arrow">↗</span></div>
              <div className="sport-visual volleyball-visual">
                <img src="/ფრენბურთი.png" alt="Volleyball" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>
              <div className="sport-card-info"><h3>Volleyball</h3><p>12 games available</p></div>
            </article>

            {/* 04. Rugby */}
            <article className="sport-card">
              <div className="sport-card-top"><span className="sport-number">04</span><span className="sport-arrow">↗</span></div>
              <div className="sport-visual rugby-visual">
                <img src="/რაგბი.png" alt="Rugby" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>
              <div className="sport-card-info"><h3>Rugby</h3><p>14 games available</p></div>
            </article>

            {/* 05. Tennis */}
            <article className="sport-card">
              <div className="sport-card-top"><span className="sport-number">05</span><span className="sport-arrow">↗</span></div>
              <div className="sport-visual tennis-visual">
                <img src="/ტენისი.png" alt="Tennis" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>
              <div className="sport-card-info"><h3>Tennis</h3><p>9 games available</p></div>
            </article>

            {/* 06. Badminton */}
            <article className="sport-card">
              <div className="sport-card-top"><span className="sport-number">06</span><span className="sport-arrow">↗</span></div>
              <div className="sport-visual badminton-visual">
                <img src="/ბანბიგტონი.png" alt="Badminton" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>
              <div className="sport-card-info"><h3>Badminton</h3><p>7 games available</p></div>
            </article>
          </div>
        </section>

        {/* UPCOMING GAMES */}
        <section className="games-section" id="games">
          <div className="section-heading">
            <div>
              <span>{c.playSoon}</span>
              <h2>{c.upcomingGames}</h2>
            </div>
            <a href="#">{c.seeAllGames} <span>→</span></a>
          </div>

          <div className="games-grid">
            <article className="game-card">
              <div className="game-card-header">
                <div className="game-tag">⚽ Football</div>
                <span className="spots-badge">{c.spotsLeft(4)}</span>
              </div>
              <h3>Friday Night Football</h3>
              <div className="game-info">
                <div><span>{c.dateTime}</span><strong>Friday · 20:00</strong></div>
                <div><span>{c.location}</span><strong>Tbilisi Sports Arena</strong></div>
              </div>
              <div className="game-card-footer">
                <div className="game-price"><strong>₾15</strong><span>{c.perPlayer}</span></div>
                <button>{c.joinGame} <span>↗</span></button>
              </div>
            </article>

            <article className="game-card">
              <div className="game-card-header">
                <div className="game-tag">🏉 Rugby</div>
                <span className="spots-badge">{c.spotsLeft(6)}</span>
              </div>
              <h3>Weekend Rugby Match</h3>
              <div className="game-info">
                <div><span>{c.dateTime}</span><strong>Saturday · 15:00</strong></div>
                <div><span>{c.location}</span><strong>Shevardeni Rugby Stadium</strong></div>
              </div>
              <div className="game-card-footer">
                <div className="game-price"><strong>₾15</strong><span>{c.perPlayer}</span></div>
                <button>{c.joinGame} <span>↗</span></button>
              </div>
            </article>

            <article className="game-card">
              <div className="game-card-header">
                <div className="game-tag">🏀 Basketball</div>
                <span className="spots-badge">{c.spotsLeft(3)}</span>
              </div>
              <h3>Weekend Basketball</h3>
              <div className="game-info">
                <div><span>{c.dateTime}</span><strong>Saturday · 16:00</strong></div>
                <div><span>{c.location}</span><strong>Vake Sports Hall</strong></div>
              </div>
              <div className="game-card-footer">
                <div className="game-price"><strong>₾10</strong><span>{c.perPlayer}</span></div>
                <button>{c.joinGame} <span>↗</span></button>
              </div>
            </article>
          </div>
        </section>

        {/* TOURNAMENTS */}
        <section className="tournaments-section" id="tournaments">
          <div className="tournament-heading">
            <div>
              <span>{c.comingTogether}</span>
              <h2>{c.playTournament}</h2>
              <p>{c.tournamentDesc}</p>
            </div>
            <button className="outline-button">{c.exploreTournaments} <span>↗</span></button>
          </div>

          <div className="tournament-grid">
            <article className="tournament-card tournament-featured">
              <div className="tournament-card-top"><span>FOOTBALL</span><strong>01</strong></div>
              <div className="tournament-icon">
                <img src="/ბეხბურთიი.png" alt="Football Tournament" style={{ width: '140px', height: '140px', objectFit: 'contain', maxWidth: '100%', display: 'block' }} />
              </div>
              <div className="tournament-content">
                <h3>Tbilisi Weekend Cup</h3>
                <p>Saturday · Tbilisi Sports Arena</p>
                <div className="tournament-meta"><span>16 teams</span><span>₾25 {c.perPlayer}</span></div>
              </div>
              <button>{c.viewTournament}</button>
            </article>

            <article className="tournament-card">
              <div className="tournament-card-top"><span>RUGBY</span><strong>02</strong></div>
              <div className="tournament-icon">
                <img src="/რაგბიი.png" alt="Rugby Tournament" style={{ width: '140px', height: '140px', objectFit: 'contain', maxWidth: '100%', display: 'block' }} />
              </div>
              <div className="tournament-content">
                <h3>Tbilisi Rugby Sevens</h3>
                <p>Sunday · Shevardeni Stadium</p>
                <div className="tournament-meta"><span>8 teams</span><span>₾20 {c.perPlayer}</span></div>
              </div>
              <button>{c.viewTournament}</button>
            </article>

            <article className="tournament-card">
              <div className="tournament-card-top"><span>BASKETBALL</span><strong>03</strong></div>
              <div className="tournament-icon">
                <img src="/კალათბურთიი.png" alt="Basketball Tournament" style={{ width: '140px', height: '140px', objectFit: 'contain', maxWidth: '100%', display: 'block' }} />
              </div>
              <div className="tournament-content">
                <h3>City Basketball Cup</h3>
                <p>Sunday · Vake Sports Hall</p>
                <div className="tournament-meta"><span>8 teams</span><span>₾20 {c.perPlayer}</span></div>
              </div>
              <button>{c.viewTournament}</button>
            </article>

            <article className="tournament-card">
              <div className="tournament-card-top"><span>VOLLEYBALL</span><strong>04</strong></div>
              <div className="tournament-icon">
                <img src="/ფრენბურთიი.png" alt="Volleyball Tournament" style={{ width: '140px', height: '140px', objectFit: 'contain', maxWidth: '100%', display: 'block' }} />
              </div>
              <div className="tournament-content">
                <h3>Tbilisi Volleyball Open</h3>
                <p>Saturday · New Volleyball Arena</p>
                <div className="tournament-meta"><span>6 teams</span><span>₾15 {c.perPlayer}</span></div>
              </div>
              <button>{c.viewTournament}</button>
            </article>

            <article className="tournament-card">
              <div className="tournament-card-top"><span>TENNIS</span><strong>05</strong></div>
              <div className="tournament-icon">
                <img src="/ტენისიი.png" alt="Tennis Tournament" style={{ width: '140px', height: '140px', objectFit: 'contain', maxWidth: '100%', display: 'block' }} />
              </div>
              <div className="tournament-content">
                <h3>City Tennis Championship</h3>
                <p>Sunday · Mziuri Courts</p>
                <div className="tournament-meta"><span>8 players</span><span>₾30 {c.perPlayer}</span></div>
              </div>
              <button>{c.viewTournament}</button>
            </article>

            <article className="tournament-card">
              <div className="tournament-card-top"><span>BADMINTON</span><strong>06</strong></div>
              <div className="tournament-icon">
                <img src="/ბანბიგტონიი.png" alt="Badminton Tournament" style={{ width: '140px', height: '140px', objectFit: 'contain', maxWidth: '100%', display: 'block' }} />
              </div>
              <div className="tournament-content">
                <h3>Badminton Masters</h3>
                <p>Saturday · Sports Complex</p>
                <div className="tournament-meta"><span>10 players</span><span>₾20 {c.perPlayer}</span></div>
              </div>
              <button>{c.viewTournament}</button>
            </article>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="how-section" id="about">
          <div className="how-header">
            <div>
              <span>{c.howItWorks}</span>
              <h2>{c.howTitle1}<br />{c.howTitle2}</h2>
            </div>
            <p>{c.howDesc}</p>
          </div>

          <div className="steps">
            <div className="step">
              <div className="step-top"><span>01</span><div>↗</div></div>
              <div className="step-icon">01</div>
              <h3>{c.step1Title}</h3>
              <p>{c.step1Desc}</p>
            </div>
            <div className="step">
              <div className="step-top"><span>02</span><div>↗</div></div>
              <div className="step-icon">02</div>
              <h3>{c.step2Title}</h3>
              <p>{c.step2Desc}</p>
            </div>
            <div className="step">
              <div className="step-top"><span>03</span><div>↗</div></div>
              <div className="step-icon">03</div>
              <h3>{c.step3Title}</h3>
              <p>{c.step3Desc}</p>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-main">
          <div className="footer-brand">
            <a href="#" className="footer-logo" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
              <img 
                src="/ლოგო.png" 
                alt="PlayTogether Logo" 
                style={{ width: '38px', height: '38px', objectFit: 'contain', marginLeft: '-10px' }} 
              />
              <span className="logo-text" style={{ fontSize: '1.1rem', fontWeight: 'bold', marginLeft: '-4px' }}>
                <span style={{ color: '#ffffff' }}>Play</span>
                <span style={{ color: '#888888' }}>Together</span>
              </span>
            </a>
            <p>{c.footerDesc}</p>
          </div>
          <div className="footer-column">
            <span>{c.explore}</span>
            <a href="#sports">{c.sports}</a>
            <a href="#games">{c.games}</a>
            <a href="#tournaments">{c.tournaments}</a>
          </div>
          <div className="footer-column">
            <span>{c.company}</span>
            <a href="#about">{c.about}</a>
            <a href="#">{c.contact}</a>
          </div>
          <div className="footer-column">
            <span>{c.account}</span>
            <a href="#">{c.login}</a>
            <a href="#">{c.signup}</a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 PlayTogether</span>
          <span>{c.rights}</span>
        </div>
      </footer>
    </div>
  )
}

export default App