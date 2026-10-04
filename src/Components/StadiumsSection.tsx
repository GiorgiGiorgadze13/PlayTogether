import React, { useState, useEffect } from 'react';
import type { TranslationContent } from '../types/translations';
import type { Stadium } from '../types/api';
import { api } from '../services/api';
import { StadiumBookingModal } from './StadiumBookingModal';
import { getSportRequirements } from '../constants/sports';

interface StadiumsSectionProps {
  c: TranslationContent;
}

export const FALLBACK_STADIUMS: Stadium[] = [
  {
    id: 'stadium-155',
    name: 'ლისი აბანოს სტადიონი',
    description: 'საუკეთესო საფეხბურთო მოედანი ლისის ტბის მიმდებარედ, განათებითა და გასახდელებით.',
    location: 'თბილისი, საბურთალო',
    address: 'ლისის ტბის მიმდებარედ, საბურთალო, თბილისი',
    latitude: 41.740867,
    longitude: 44.739850,
    sport: 'Football',
    imageUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80',
    selectedPhotoUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80',
    rating: 4.8,
    price: 110,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'stadium-180',
    name: 'ინტერ აკადემიის მოედანი №3',
    description: 'პროფესიონალური სტანდარტის საფეხბურთო მოედანი დიღომში.',
    location: 'თბილისი, დიღომი',
    address: 'დიღმის მასივი, თბილისი',
    latitude: 41.781429,
    longitude: 44.775924,
    sport: 'Football',
    imageUrl: 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&w=1200&q=80',
    selectedPhotoUrl: 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&w=1200&q=80',
    rating: 4.9,
    price: 180,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'stadium-181',
    name: 'ინტერ აკადემიის მოედანი N4',
    description: 'დიდი ზომის საფეხბურთო მოედანი უმაღლესი ხარისხის საფარით.',
    location: 'თბილისი, დიღომი',
    address: 'დიღმის მასივი, თბილისი',
    latitude: 41.781429,
    longitude: 44.775924,
    sport: 'Football',
    imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80',
    selectedPhotoUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80',
    rating: 4.9,
    price: 200,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'stadium-154',
    name: 'ტფილისი №1',
    description: 'თანამედროვე ხელოვნურსაფარიანი საფეხბურთო მოედანი ვარკეთილში.',
    location: 'თბილისი, ვარკეთილი',
    address: 'ვარკეთილი, თბილისი',
    latitude: 41.703151,
    longitude: 44.852343,
    sport: 'Football',
    imageUrl: 'https://images.unsplash.com/photo-1577223625816-7546f13df25d?auto=format&fit=crop&w=1200&q=80',
    selectedPhotoUrl: 'https://images.unsplash.com/photo-1577223625816-7546f13df25d?auto=format&fit=crop&w=1200&q=80',
    rating: 4.7,
    price: 150,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'stadium-158',
    name: '35-ე სკოლის მოედანი',
    description: 'სტანდარტული ზომის საფეხბურთო მოედანი საბურთალოზე.',
    location: 'თბილისი, საბურთალო',
    address: 'საბურთალო, თბილისი',
    latitude: 41.721384,
    longitude: 44.723008,
    sport: 'Football',
    imageUrl: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=1200&q=80',
    selectedPhotoUrl: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=1200&q=80',
    rating: 4.8,
    price: 280,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'stadium-160',
    name: 'ნიუტონის თავისუფალი სკოლის მოედანი',
    description: 'უმაღლესი ხარისხის ღია საფეხბურთო მოედანი.',
    location: 'თბილისი, საბურთალო',
    address: 'საბურთალო, თბილისი',
    latitude: 41.720029,
    longitude: 44.707622,
    sport: 'Football',
    imageUrl: 'https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?auto=format&fit=crop&w=1200&q=80',
    selectedPhotoUrl: 'https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?auto=format&fit=crop&w=1200&q=80',
    rating: 4.8,
    price: 200,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'stadium-171',
    name: 'გლდანის სპორტული დარბაზი N1',
    description: 'დახურული დიდი სპორტული დარბაზი გლდანში.',
    location: 'თბილისი, გლდანი',
    address: 'გლდანი, თბილისი',
    latitude: 41.792786,
    longitude: 44.811098,
    sport: 'Football',
    imageUrl: 'https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&w=1200&q=80',
    selectedPhotoUrl: 'https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&w=1200&q=80',
    rating: 4.7,
    price: 140,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'stadium-176',
    name: 'ბაქსვუდის მოედანი - წყნეთი',
    description: 'სუფთა ჰაერზე მდებარე საფეხბურთო მოედანი წყნეთში.',
    location: 'თბილისი, ვაკე',
    address: 'წყნეთი, ვაკე, თბილისი',
    latitude: 41.679837,
    longitude: 44.689903,
    sport: 'Football',
    imageUrl: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&w=1200&q=80',
    selectedPhotoUrl: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&w=1200&q=80',
    rating: 4.9,
    price: 150,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'stadium-185',
    name: 'მარაკანას მოედანი',
    description: 'პრემიუმ კლასის საფეხბურთო კომპლექსი.',
    location: 'თბილისი, საბურთალო',
    address: 'საბურთალო, თბილისი',
    latitude: 41.721370,
    longitude: 44.720280,
    sport: 'Football',
    imageUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80',
    selectedPhotoUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80',
    rating: 5.0,
    price: 550,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'stadium-214',
    name: 'ზაზა ფაჩულიას დარბაზი A',
    description: 'ზაზა ფაჩულიას აკადემიის მთავარი საკალათბურთო მოედანი.',
    location: 'თბილისი, დიდუბე',
    address: 'დიდუბე, თბილისი',
    latitude: 41.742347,
    longitude: 44.780332,
    sport: 'Basketball',
    imageUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1200&q=80',
    selectedPhotoUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1200&q=80',
    rating: 5.0,
    price: 220,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'stadium-197',
    name: 'ბრუკლინის კალათბურთის აკადემიის დარბაზი',
    description: 'პროფესიონალური საკალათბურთო პარკეტის დარბაზი.',
    location: 'თბილისი, ვაკე',
    address: 'ვაკე, თბილისი',
    latitude: 41.7100,
    longitude: 44.7500,
    sport: 'Basketball',
    imageUrl: 'https://images.unsplash.com/photo-1519861531473-9200262188bf?auto=format&fit=crop&w=1200&q=80',
    selectedPhotoUrl: 'https://images.unsplash.com/photo-1519861531473-9200262188bf?auto=format&fit=crop&w=1200&q=80',
    rating: 4.8,
    price: 125,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'stadium-166',
    name: 'კორტები ნუცუბიძეზე',
    description: 'ღია ჩოგბურთის კორტები ნუცუბიძის პლატოზე.',
    location: 'თბილისი, საბურთალო',
    address: 'ნუცუბიძე, საბურთალო, თბილისი',
    latitude: 41.729971,
    longitude: 44.731098,
    sport: 'Tennis',
    imageUrl: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&w=1200&q=80',
    selectedPhotoUrl: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&w=1200&q=80',
    rating: 4.7,
    price: 70,
    createdAt: new Date().toISOString(),
  },
];

export const StadiumsSection: React.FC<StadiumsSectionProps> = ({ c }) => {
  const [stadiums, setStadiums] = useState<Stadium[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSportFilter, setSelectedSportFilter] = useState<string>('All');
  const [selectedStadium, setSelectedStadium] = useState<Stadium | null>(null);

  useEffect(() => {
    const fetchStadiums = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const res = await api.getStadiums();
        setStadiums(res.stadiums && res.stadiums.length > 0 ? res.stadiums : FALLBACK_STADIUMS);
      } catch {
        setStadiums(FALLBACK_STADIUMS);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStadiums();
  }, []);

  const sportsFilterList = [
    'All',
    'Football',
    'Tennis',
    'Basketball',
    'Volleyball',
    'Table Tennis',
    'Rugby',
    'Boxing',
    'Badminton',
  ];

  const filteredStadiums = stadiums.filter((s) => {
    if (selectedSportFilter === 'All') return true;
    return s.sport.toLowerCase() === selectedSportFilter.toLowerCase();
  });

  return (
    <section
      className="content-section"
      id="stadiums"
      style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '40px 24px 80px 24px',
        boxSizing: 'border-box',
      }}
    >
      <div className="section-heading" style={{ marginBottom: '28px' }}>
        <div>
          <span style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '2px', color: '#c9ff35', textTransform: 'uppercase' }}>
            VERIFIED VENUES & FIELDS
          </span>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, margin: '6px 0 10px', color: '#fff' }}>
            Explore All Stadiums
          </h2>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.65)', margin: 0, maxWidth: '650px' }}>
            Browse top rated sports fields, indoor courts & arenas in Tbilisi. Filter by your favorite sport and book an available time slot.
          </p>
        </div>
      </div>

      {/* Sport Category Filter Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '10px',
          overflowX: 'auto',
          paddingBottom: '12px',
          marginBottom: '32px',
          scrollbarWidth: 'none',
        }}
      >
        {sportsFilterList.map((sport) => {
          const isSelected = selectedSportFilter.toLowerCase() === sport.toLowerCase();
          const req = getSportRequirements(sport);
          return (
            <button
              key={sport}
              onClick={() => setSelectedSportFilter(sport)}
              style={{
                padding: '10px 20px',
                borderRadius: '24px',
                background: isSelected ? '#c9ff35' : '#151719',
                color: isSelected ? '#070809' : '#ffffff',
                border: isSelected ? '2px solid #c9ff35' : '1px solid rgba(255,255,255,0.15)',
                fontWeight: 800,
                fontSize: '13px',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease',
              }}
            >
              {sport === 'All' ? '🏟️ All Stadiums' : `${req.icon} ${sport}`}
            </button>
          );
        })}
      </div>

      {isLoading && (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'rgba(255,255,255,0.6)' }}>
          <p>Loading stadiums and sports venues...</p>
        </div>
      )}

      {error && (
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#ff6b6b' }}>
          <p>⚠️ {error}</p>
        </div>
      )}

      {!isLoading && !error && filteredStadiums.length === 0 && (
        <div
          style={{
            textAlign: 'center',
            padding: '60px 20px',
            background: '#151719',
            borderRadius: '20px',
            border: '1px solid rgba(255,255,255,0.1)',
            color: 'rgba(255,255,255,0.6)',
          }}
        >
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>🏟️</div>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>
            No Stadiums Found for "{selectedSportFilter}"
          </h3>
          <p style={{ fontSize: '14px', marginBottom: '16px' }}>
            Try selecting a different sport filter or browse all venues.
          </p>
          <button
            onClick={() => setSelectedSportFilter('All')}
            style={{
              padding: '10px 20px',
              background: '#c9ff35',
              color: '#070809',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 800,
              cursor: 'pointer',
            }}
          >
            Show All Stadiums
          </button>
        </div>
      )}

      {!isLoading && !error && filteredStadiums.length > 0 && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '28px',
          }}
        >
          {filteredStadiums.map((stadium) => {
            const req = getSportRequirements(stadium.sport);
            return (
              <article
                key={stadium.id}
                style={{
                  background: '#151719',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  boxShadow: '0 16px 40px rgba(0,0,0,0.5)',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.3s ease, border-color 0.3s ease',
                  cursor: 'pointer',
                }}
                onClick={() => setSelectedStadium(stadium)}
              >
                {/* Stadium Image Banner */}
                <div style={{ position: 'relative', height: '200px', width: '100%', overflow: 'hidden' }}>
                  <img
                    src={stadium.selectedPhotoUrl || stadium.imageUrl}
                    alt={stadium.name}
                    className="clean-stadium-img"
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      background: '#c9ff35',
                      color: '#070809',
                      padding: '4px 10px',
                      borderRadius: '8px',
                      fontSize: '11px',
                      fontWeight: 900,
                      textTransform: 'uppercase',
                    }}
                  >
                    {req.icon} {stadium.sport}
                  </div>

                  <div
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      background: 'rgba(0,0,0,0.8)',
                      backdropFilter: 'blur(4px)',
                      color: '#ffb703',
                      padding: '4px 10px',
                      borderRadius: '8px',
                      fontSize: '11px',
                      fontWeight: 800,
                      border: '1px solid rgba(255,183,3,0.3)',
                    }}
                  >
                    ⭐ {stadium.rating || 4.8}
                  </div>
                </div>

                {/* Card Content */}
                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 800, margin: '0 0 6px', color: '#fff' }}>
                    {stadium.name}
                  </h3>
                  <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', margin: '0 0 16px' }}>
                    📍 {stadium.location} · {stadium.address}
                  </p>

                  <div
                    style={{
                      background: '#0d0f11',
                      padding: '12px 14px',
                      borderRadius: '12px',
                      marginBottom: '16px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      border: '1px solid rgba(255,255,255,0.06)',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>
                        CAPACITY
                      </div>
                      <div style={{ fontSize: '13px', fontWeight: 800, color: '#fff', marginTop: '2px' }}>
                        👥 Up to {req.maxPlayers} Players
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>
                        RATE / PLAYER
                      </div>
                      <div style={{ fontSize: '14px', fontWeight: 900, color: '#c9ff35', marginTop: '2px' }}>
                        ₾{stadium.price}
                      </div>
                    </div>
                  </div>

                  <button
                    style={{
                      marginTop: 'auto',
                      width: '100%',
                      height: '44px',
                      background: '#c9ff35',
                      color: '#070809',
                      border: 'none',
                      borderRadius: '12px',
                      fontWeight: 800,
                      fontSize: '13px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      transition: 'transform 0.2s ease',
                    }}
                  >
                    Book Stadium →
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {selectedStadium && (
        <StadiumBookingModal
          stadium={selectedStadium}
          onClose={() => setSelectedStadium(null)}
          c={c}
        />
      )}
    </section>
  );
};

export default StadiumsSection;
