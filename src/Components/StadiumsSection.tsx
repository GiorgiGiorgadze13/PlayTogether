import React, { useState, useEffect } from 'react';
import type { Language, TranslationContent } from '../types/translations';
import type { Stadium } from '../types/api';
import { api } from '../services/api';
import { StadiumBookingModal } from './StadiumBookingModal';
import { getSportRequirements } from '../constants/sports';

// Local stadium images
import imgLisiAbano from '../assets/stadiums/lisiabano.jpg';
import imgInterAcademy3 from '../assets/stadiums/interacademy3.webp';
import imgInterAcademy4 from '../assets/stadiums/interacademy4.webp';
import imgTiflisi1 from '../assets/stadiums/tiflisin1.webp';
import imgSchool35 from '../assets/stadiums/35thschool.webp';
import imgNiuton from '../assets/stadiums/niuton.jpg';
import imgGldanis from '../assets/stadiums/gldanis.webp';
import imgBaxwood from '../assets/stadiums/baxwood.webp';
import imgMaracana from '../assets/stadiums/maracana.webp';
import imgZazaFachulia from '../assets/stadiums/zazafachulia.webp';
import imgBroklyn from '../assets/stadiums/broklyn.webp';
import imgTennisCourts from '../assets/stadiums/tenniscourts nutsubidze.jpg';
import imgPadeli from '../assets/stadiums/პადელი.jpg';

interface StadiumsSectionProps {
  c: TranslationContent;
  lang: Language;
}

interface BilingualStadium extends Stadium {
  name_en: string;
  name_ka: string;
  description_en: string;
  description_ka: string;
  location_en: string;
  location_ka: string;
  address_en: string;
  address_ka: string;
}

export const FALLBACK_STADIUMS: BilingualStadium[] = [
  {
    id: 'stadium-155',
    name_en: 'Lisi Abano Stadium',
    name_ka: 'ლისი აბანოს სტადიონი',
    name: 'Lisi Abano Stadium',
    description_en: 'Top football pitch near Lisi Lake with floodlights and changing rooms.',
    description_ka: 'საუკეთესო საფეხბურთო მოედანი ლისის ტბის მიმდებარედ, განათებითა და გასახდელებით.',
    description: '',
    location_en: 'Tbilisi, Saburtalo',
    location_ka: 'თბილისი, საბურთალო',
    location: 'Tbilisi, Saburtalo',
    address_en: 'Near Lisi Lake, Saburtalo, Tbilisi',
    address_ka: 'ლისის ტბის მიმდებარედ, საბურთალო, თბილისი',
    address: 'Near Lisi Lake, Saburtalo, Tbilisi',
    latitude: 41.740867,
    longitude: 44.739850,
    sport: 'Football',
    imageUrl: imgLisiAbano,
    selectedPhotoUrl: imgLisiAbano,
    rating: 4.8,
    price: 110,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'stadium-180',
    name_en: 'Inter Academy Pitch №3',
    name_ka: 'ინტერ აკადემიის მოედანი №3',
    name: 'Inter Academy Pitch №3',
    description_en: 'Professional-standard football pitch in Digomi.',
    description_ka: 'პროფესიონალური სტანდარტის საფეხბურთო მოედანი დიღომში.',
    description: '',
    location_en: 'Tbilisi, Digomi',
    location_ka: 'თბილისი, დიღომი',
    location: 'Tbilisi, Digomi',
    address_en: 'Digomi Massif, Tbilisi',
    address_ka: 'დიღმის მასივი, თბილისი',
    address: 'Digomi Massif, Tbilisi',
    latitude: 41.781429,
    longitude: 44.775924,
    sport: 'Football',
    imageUrl: imgInterAcademy3,
    selectedPhotoUrl: imgInterAcademy3,
    rating: 4.9,
    price: 180,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'stadium-181',
    name_en: 'Inter Academy Pitch N4',
    name_ka: 'ინტერ აკადემიის მოედანი N4',
    name: 'Inter Academy Pitch N4',
    description_en: 'Large football pitch with premium quality surface.',
    description_ka: 'დიდი ზომის საფეხბურთო მოედანი უმაღლესი ხარისხის საფარით.',
    description: '',
    location_en: 'Tbilisi, Digomi',
    location_ka: 'თბილისი, დიღომი',
    location: 'Tbilisi, Digomi',
    address_en: 'Digomi Massif, Tbilisi',
    address_ka: 'დიღმის მასივი, თბილისი',
    address: 'Digomi Massif, Tbilisi',
    latitude: 41.781429,
    longitude: 44.775924,
    sport: 'Football',
    imageUrl: imgInterAcademy4,
    selectedPhotoUrl: imgInterAcademy4,
    rating: 4.9,
    price: 200,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'stadium-154',
    name_en: 'Tfilisi №1',
    name_ka: 'ტფილისი №1',
    name: 'Tfilisi №1',
    description_en: 'Modern artificial-turf football pitch in Varketili.',
    description_ka: 'თანამედროვე ხელოვნურსაფარიანი საფეხბურთო მოედანი ვარკეთილში.',
    description: '',
    location_en: 'Tbilisi, Varketili',
    location_ka: 'თბილისი, ვარკეთილი',
    location: 'Tbilisi, Varketili',
    address_en: 'Varketili, Tbilisi',
    address_ka: 'ვარკეთილი, თბილისი',
    address: 'Varketili, Tbilisi',
    latitude: 41.703151,
    longitude: 44.852343,
    sport: 'Football',
    imageUrl: imgTiflisi1,
    selectedPhotoUrl: imgTiflisi1,
    rating: 4.7,
    price: 150,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'stadium-158',
    name_en: 'School 35 Pitch',
    name_ka: '35-ე სკოლის მოედანი',
    name: 'School 35 Pitch',
    description_en: 'Standard-size football pitch in Saburtalo.',
    description_ka: 'სტანდარტული ზომის საფეხბურთო მოედანი საბურთალოზე.',
    description: '',
    location_en: 'Tbilisi, Saburtalo',
    location_ka: 'თბილისი, საბურთალო',
    location: 'Tbilisi, Saburtalo',
    address_en: 'Saburtalo, Tbilisi',
    address_ka: 'საბურთალო, თბილისი',
    address: 'Saburtalo, Tbilisi',
    latitude: 41.721384,
    longitude: 44.723008,
    sport: 'Football',
    imageUrl: imgSchool35,
    selectedPhotoUrl: imgSchool35,
    rating: 4.8,
    price: 280,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'stadium-160',
    name_en: 'Newton Free School Pitch',
    name_ka: 'ნიუტონის თავისუფალი სკოლის მოედანი',
    name: 'Newton Free School Pitch',
    description_en: 'High-quality open-air football pitch.',
    description_ka: 'უმაღლესი ხარისხის ღია საფეხბურთო მოედანი.',
    description: '',
    location_en: 'Tbilisi, Saburtalo',
    location_ka: 'თბილისი, საბურთალო',
    location: 'Tbilisi, Saburtalo',
    address_en: 'Saburtalo, Tbilisi',
    address_ka: 'საბურთალო, თბილისი',
    address: 'Saburtalo, Tbilisi',
    latitude: 41.720029,
    longitude: 44.707622,
    sport: 'Football',
    imageUrl: imgNiuton,
    selectedPhotoUrl: imgNiuton,
    rating: 4.8,
    price: 200,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'stadium-171',
    name_en: 'Gldani Sports Hall N1',
    name_ka: 'გლდანის სპორტული დარბაზი N1',
    name: 'Gldani Sports Hall N1',
    description_en: 'Large indoor sports hall in Gldani.',
    description_ka: 'დახურული დიდი სპორტული დარბაზი გლდანში.',
    description: '',
    location_en: 'Tbilisi, Gldani',
    location_ka: 'თბილისი, გლდანი',
    location: 'Tbilisi, Gldani',
    address_en: 'Gldani, Tbilisi',
    address_ka: 'გლდანი, თბილისი',
    address: 'Gldani, Tbilisi',
    latitude: 41.792786,
    longitude: 44.811098,
    sport: 'Football',
    imageUrl: imgGldanis,
    selectedPhotoUrl: imgGldanis,
    rating: 4.7,
    price: 140,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'stadium-176',
    name_en: 'Baxwood Pitch — Tskneti',
    name_ka: 'ბაქსვუდის მოედანი - წყნეთი',
    name: 'Baxwood Pitch — Tskneti',
    description_en: 'Fresh-air football pitch nestled in Tskneti.',
    description_ka: 'სუფთა ჰაერზე მდებარე საფეხბურთო მოედანი წყნეთში.',
    description: '',
    location_en: 'Tbilisi, Vake',
    location_ka: 'თბილისი, ვაკე',
    location: 'Tbilisi, Vake',
    address_en: 'Tskneti, Vake, Tbilisi',
    address_ka: 'წყნეთი, ვაკე, თბილისი',
    address: 'Tskneti, Vake, Tbilisi',
    latitude: 41.679837,
    longitude: 44.689903,
    sport: 'Football',
    imageUrl: imgBaxwood,
    selectedPhotoUrl: imgBaxwood,
    rating: 4.9,
    price: 150,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'stadium-185',
    name_en: 'Maracana Pitch',
    name_ka: 'მარაკანას მოედანი',
    name: 'Maracana Pitch',
    description_en: 'Premium-class football complex.',
    description_ka: 'პრემიუმ კლასის საფეხბურთო კომპლექსი.',
    description: '',
    location_en: 'Tbilisi, Saburtalo',
    location_ka: 'თბილისი, საბურთალო',
    location: 'Tbilisi, Saburtalo',
    address_en: 'Saburtalo, Tbilisi',
    address_ka: 'საბურთალო, თბილისი',
    address: 'Saburtalo, Tbilisi',
    latitude: 41.721370,
    longitude: 44.720280,
    sport: 'Football',
    imageUrl: imgMaracana,
    selectedPhotoUrl: imgMaracana,
    rating: 5.0,
    price: 550,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'stadium-214',
    name_en: 'Zaza Pachulia Hall A',
    name_ka: 'ზაზა ფაჩულიას დარბაზი A',
    name: 'Zaza Pachulia Hall A',
    description_en: "Zaza Pachulia Academy's main basketball court.",
    description_ka: 'ზაზა ფაჩულიას აკადემიის მთავარი საკალათბურთო მოედანი.',
    description: '',
    location_en: 'Tbilisi, Didube',
    location_ka: 'თბილისი, დიდუბე',
    location: 'Tbilisi, Didube',
    address_en: 'Didube, Tbilisi',
    address_ka: 'დიდუბე, თბილისი',
    address: 'Didube, Tbilisi',
    latitude: 41.742347,
    longitude: 44.780332,
    sport: 'Basketball',
    imageUrl: imgZazaFachulia,
    selectedPhotoUrl: imgZazaFachulia,
    rating: 5.0,
    price: 220,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'stadium-197',
    name_en: 'Brooklyn Basketball Academy Hall',
    name_ka: 'ბრუკლინის კალათბურთის აკადემიის დარბაზი',
    name: 'Brooklyn Basketball Academy Hall',
    description_en: 'Professional basketball parquet hall.',
    description_ka: 'პროფესიონალური საკალათბურთო პარკეტის დარბაზი.',
    description: '',
    location_en: 'Tbilisi, Vake',
    location_ka: 'თბილისი, ვაკე',
    location: 'Tbilisi, Vake',
    address_en: 'Vake, Tbilisi',
    address_ka: 'ვაკე, თბილისი',
    address: 'Vake, Tbilisi',
    latitude: 41.7100,
    longitude: 44.7500,
    sport: 'Basketball',
    imageUrl: imgBroklyn,
    selectedPhotoUrl: imgBroklyn,
    rating: 4.8,
    price: 125,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'stadium-166',
    name_en: 'Nutsubidze Tennis Courts',
    name_ka: 'კორტები ნუცუბიძეზე',
    name: 'Nutsubidze Tennis Courts',
    description_en: 'Open tennis courts on Nutsubidze Plateu.',
    description_ka: 'ღია ჩოგბურთის კორტები ნუცუბიძის პლატოზე.',
    description: '',
    location_en: 'Tbilisi, Saburtalo',
    location_ka: 'თბილისი, საბურთალო',
    location: 'Tbilisi, Saburtalo',
    address_en: 'Nutsubidze, Saburtalo, Tbilisi',
    address_ka: 'ნუცუბიძე, საბურთალო, თბილისი',
    address: 'Nutsubidze, Saburtalo, Tbilisi',
    latitude: 41.729971,
    longitude: 44.731098,
    sport: 'Tennis',
    imageUrl: imgTennisCourts,
    selectedPhotoUrl: imgTennisCourts,
    rating: 4.7,
    price: 70,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'stadium-padel-1',
    name_en: 'Tbilisi Padel Club - Arena Nord',
    name_ka: 'Tbilisi Padel Club - Arena Nord',
    name: 'Tbilisi Padel Club - Arena Nord',
    description_en: 'Top padel courts in a modern indoor arena.',
    description_ka: 'საუკეთესო პადელის კორტები თანამედროვე დახურულ დარბაზში.',
    description: '',
    location_en: 'Tbilisi, Digomi',
    location_ka: 'თბილისი, დიღომი',
    location: 'Tbilisi, Digomi',
    address_en: 'Digomi Olympic Complex, Tbilisi',
    address_ka: 'დიღმის ოლიმპიური კომპლექსი, თბილისი',
    address: 'Digomi Olympic Complex, Tbilisi',
    latitude: 41.7654,
    longitude: 44.7699,
    sport: 'Padel',
    imageUrl: imgPadeli,
    selectedPhotoUrl: imgPadeli,
    rating: 5.0,
    price: 90,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'stadium-padel-2',
    name_en: 'Premium Padel Courts Vake',
    name_ka: 'Premium Padel Courts Vake',
    name: 'Premium Padel Courts Vake',
    description_en: 'High-end padel courts with perfect lighting.',
    description_ka: 'მაღალი კლასის პადელის კორტები სრულყოფილი განათებით.',
    description: '',
    location_en: 'Tbilisi, Vake',
    location_ka: 'თბილისი, ვაკე',
    location: 'Tbilisi, Vake',
    address_en: 'Near Vake Park, Tbilisi',
    address_ka: 'ვაკის პარკის მიმდებარედ, თბილისი',
    address: 'Near Vake Park, Tbilisi',
    latitude: 41.7092,
    longitude: 44.7558,
    sport: 'Padel',
    imageUrl: imgPadeli,
    selectedPhotoUrl: imgPadeli,
    rating: 4.9,
    price: 80,
    createdAt: new Date().toISOString(),
  },
];

// Helper to pick the right language field from a bilingual stadium
function getField(stadium: BilingualStadium, field: 'name' | 'description' | 'location' | 'address', lang: Language): string {
  const key = `${field}_${lang}` as keyof BilingualStadium;
  return (stadium[key] as string) || (stadium[`${field}_en` as keyof BilingualStadium] as string);
}

export const StadiumsSection: React.FC<StadiumsSectionProps> = ({ c, lang }) => {
  const [stadiums, setStadiums] = useState<BilingualStadium[]>([]);
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
        if (res.stadiums && res.stadiums.length > 0) {
          // API stadiums don't have bilingual fields — wrap them
          const wrapped = res.stadiums.map((s: Stadium) => ({
            ...s,
            name_en: s.name,
            name_ka: s.name,
            description_en: s.description,
            description_ka: s.description,
            location_en: s.location,
            location_ka: s.location,
            address_en: s.address,
            address_ka: s.address,
          })) as BilingualStadium[];
          setStadiums(wrapped);
        } else {
          setStadiums(FALLBACK_STADIUMS);
        }
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
    'Padel',
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
            {c.stadiumsEyebrow}
          </span>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, margin: '6px 0 10px', color: '#fff' }}>
            {c.stadiumsTitle}
          </h2>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.65)', margin: 0, maxWidth: '650px' }}>
            {c.stadiumsSubtitle}
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
              {sport === 'All' ? c.allStadiumsFilter : `${req.icon} ${sport}`}
            </button>
          );
        })}
      </div>

      {isLoading && (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'rgba(255,255,255,0.6)' }}>
          <p>{c.loadingStadiums}</p>
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
            {c.noStadiumsForFilter(selectedSportFilter)}
          </h3>
          <p style={{ fontSize: '14px', marginBottom: '16px' }}>
            {c.noStadiumsFound}
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
            {c.showAllStadiums2}
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
            const displayName = getField(stadium, 'name', lang);
            const displayLocation = getField(stadium, 'location', lang);
            const displayAddress = getField(stadium, 'address', lang);
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
                onClick={() => setSelectedStadium({ ...stadium, name: displayName, location: displayLocation, address: displayAddress })}
              >
                {/* Stadium Image Banner */}
                <div style={{ position: 'relative', height: '200px', width: '100%', overflow: 'hidden' }}>
                  <img
                    src={stadium.selectedPhotoUrl || stadium.imageUrl}
                    alt={displayName}
                    className="clean-stadium-img"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=1200&q=80';
                    }}
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
                    {displayName}
                  </h3>
                  <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', margin: '0 0 16px' }}>
                    📍 {displayLocation} · {displayAddress}
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
                        {c.capacityLabel2}
                      </div>
                      <div style={{ fontSize: '13px', fontWeight: 800, color: '#fff', marginTop: '2px' }}>
                        👥 {c.maxPlayersLabel(req.maxPlayers)}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>
                        {c.ratePerPlayerLabel}
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
                    {c.bookStadium} →
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
