import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { TranslationContent } from '../types/translations';
import type { Stadium } from '../types/api';
import { api } from '../services/api';
import { StadiumBookingModal } from './StadiumBookingModal';

interface SportsSectionProps {
  c: TranslationContent;
}

const FALLBACK_STADIUMS: Stadium[] = [
  {
    id: 'gamo-155',
    name: 'ლისი აბანოს სტადიონი (Lisi Baths Stadium)',
    description: 'საუკეთესო საფეხბურთო მოედანი ლისის ტბის მიმდებარედ, განათებითა და გასახდელებით.',
    location: 'თბილისი, საბურთალო',
    address: 'Lisi Lake, Saburtalo, Tbilisi',
    latitude: 41.740867,
    longitude: 44.739850,
    sport: 'Football',
    imageUrl: 'https://gamo.ge/img/watermarked/YXNzZXRzL2ltYWdlcy9wcm9kdWN0cy8xNTUud2VicA?p=card',
    selectedPhotoUrl: 'https://gamo.ge/img/watermarked/YXNzZXRzL2ltYWdlcy9wcm9kdWN0cy8xNTUud2VicA?p=card',
    rating: 4.8,
    price: 110,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'gamo-180',
    name: 'ინტერ აკადემიის მოედანი №3 (Inter Academy Stadium N3)',
    description: 'პროფესიონალური სტანდარტის საფეხბურთო მოედანი დიღომში.',
    location: 'თბილისი, დიღომი',
    address: 'Digomi, Tbilisi',
    latitude: 41.781429,
    longitude: 44.775924,
    sport: 'Football',
    imageUrl: 'https://gamo.ge/img/watermarked/YXNzZXRzL2ltYWdlcy9wcm9kdWN0cy8xODAud2VicA?p=card',
    selectedPhotoUrl: 'https://gamo.ge/img/watermarked/YXNzZXRzL2ltYWdlcy9wcm9kdWN0cy8xODAud2VicA?p=card',
    rating: 4.9,
    price: 180,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'gamo-181',
    name: 'ინტერ აკადემიის მოედანი N4 (Inter Academy Stadium N4)',
    description: 'დიდი ზომის საფეხბურთო მოედანი უმაღლესი ხარისხის საფარით.',
    location: 'თბილისი, დიღომი',
    address: 'Digomi, Tbilisi',
    latitude: 41.781429,
    longitude: 44.775924,
    sport: 'Football',
    imageUrl: 'https://gamo.ge/img/watermarked/YXNzZXRzL2ltYWdlcy9wcm9kdWN0cy8xODEud2VicA?p=card',
    selectedPhotoUrl: 'https://gamo.ge/img/watermarked/YXNzZXRzL2ltYWdlcy9wcm9kdWN0cy8xODEud2VicA?p=card',
    rating: 4.9,
    price: 200,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'gamo-154',
    name: '“ტფილისი” №1 ("Tfilisi" Stadium N1)',
    description: 'თანამედროვე ხელოვნურსაფარიანი საფეხბურთო მოედანი ვარკეთილში.',
    location: 'თბილისი, ვარკეთილი',
    address: 'Varketili, Tbilisi',
    latitude: 41.703151,
    longitude: 44.852343,
    sport: 'Football',
    imageUrl: 'https://gamo.ge/img/watermarked/YXNzZXRzL2ltYWdlcy9wcm9kdWN0cy8xNTQud2VicA?p=card',
    selectedPhotoUrl: 'https://gamo.ge/img/watermarked/YXNzZXRzL2ltYWdlcy9wcm9kdWN0cy8xNTQud2VicA?p=card',
    rating: 4.7,
    price: 150,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'gamo-158',
    name: '35-ე სკოლის მოედანი (35th School Main Stadium)',
    description: 'სტანდარტული ზომის საფეხბურთო მოედანი საბურთალოზე.',
    location: 'თბილისი, საბურთალო',
    address: 'Saburtalo, Tbilisi',
    latitude: 41.721384,
    longitude: 44.723008,
    sport: 'Football',
    imageUrl: 'https://gamo.ge/img/watermarked/YXNzZXRzL2ltYWdlcy9wcm9kdWN0cy8xNTgud2VicA?p=card',
    selectedPhotoUrl: 'https://gamo.ge/img/watermarked/YXNzZXRzL2ltYWdlcy9wcm9kdWN0cy8xNTgud2VicA?p=card',
    rating: 4.8,
    price: 280,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'gamo-160',
    name: 'ნიუტონის თავისუფალი სკოლის მოედანი (Newton School Stadium)',
    description: 'უმაღლესი ხარისხის ღია საფეხბურთო მოედანი.',
    location: 'თბილისი, საბურთალო',
    address: 'Saburtalo, Tbilisi',
    latitude: 41.720029,
    longitude: 44.707622,
    sport: 'Football',
    imageUrl: 'https://gamo.ge/img/watermarked/YXNzZXRzL2ltYWdlcy9wcm9kdWN0cy8xNjAud2VicA?p=card',
    selectedPhotoUrl: 'https://gamo.ge/img/watermarked/YXNzZXRzL2ltYWdlcy9wcm9kdWN0cy8xNjAud2VicA?p=card',
    rating: 4.8,
    price: 200,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'gamo-171',
    name: 'გლდანის სპორტული დარბაზი N1 (Gldani Hall N1)',
    description: 'დახურული დიდი სპორტული დარბაზი გლდანში.',
    location: 'თბილისი, გლდანი',
    address: 'Gldani, Tbilisi',
    latitude: 41.792786,
    longitude: 44.811098,
    sport: 'Football',
    imageUrl: 'https://gamo.ge/img/watermarked/YXNzZXRzL2ltYWdlcy9wcm9kdWN0cy8xNzEud2VicA?p=card',
    selectedPhotoUrl: 'https://gamo.ge/img/watermarked/YXNzZXRzL2ltYWdlcy9wcm9kdWN0cy8xNzEud2VicA?p=card',
    rating: 4.7,
    price: 140,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'gamo-176',
    name: 'ბაქსვუდის მოედანი - წყნეთი (Buckswood Stadium Tskneti)',
    description: 'სუფთა ჰაერზე მდებარე საფეხბურთო მოედანი წყნეთში.',
    location: 'თბილისი, ვაკე',
    address: 'Tskneti, Vake, Tbilisi',
    latitude: 41.679837,
    longitude: 44.689903,
    sport: 'Football',
    imageUrl: 'https://gamo.ge/img/watermarked/YXNzZXRzL2ltYWdlcy9wcm9kdWN0cy8xNzYud2VicA?p=card',
    selectedPhotoUrl: 'https://gamo.ge/img/watermarked/YXNzZXRzL2ltYWdlcy9wcm9kdWN0cy8xNzYud2VicA?p=card',
    rating: 4.9,
    price: 150,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'gamo-185',
    name: 'მარაკანას მოედანი (Marakana Stadium)',
    description: 'პრემიუმ კლასის საფეხბურთო კომპლექსი.',
    location: 'თბილისი, საბურთალო',
    address: 'Saburtalo, Tbilisi',
    latitude: 41.721370,
    longitude: 44.720280,
    sport: 'Football',
    imageUrl: 'https://gamo.ge/img/watermarked/YXNzZXRzL2ltYWdlcy9wcm9kdWN0cy8xODUud2VicA?p=card',
    selectedPhotoUrl: 'https://gamo.ge/img/watermarked/YXNzZXRzL2ltYWdlcy9wcm9kdWN0cy8xODUud2VicA?p=card',
    rating: 5.0,
    price: 550,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'gamo-214',
    name: 'ზაზა ფაჩულიას დარბაზი A (Zaza Pachulia Academy Court A)',
    description: 'ზაზა ფაჩულიას აკადემიის მთავარი საკალათბურთო მოედანი.',
    location: 'თბილისი, დიდუბე',
    address: 'Didube, Tbilisi',
    latitude: 41.742347,
    longitude: 44.780332,
    sport: 'Basketball',
    imageUrl: 'https://gamo.ge/img/watermarked/YXNzZXRzL2ltYWdlcy9wcm9kdWN0cy8yMTQud2VicA?p=card',
    selectedPhotoUrl: 'https://gamo.ge/img/watermarked/YXNzZXRzL2ltYWdlcy9wcm9kdWN0cy8yMTQud2VicA?p=card',
    rating: 5.0,
    price: 220,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'gamo-197',
    name: 'ბრუკლინის კალათბურთის აკადემიის დარბაზი (Brooklyn Basketball)',
    description: 'პროფესიონალური საკალათბურთო პარკეტის დარბაზი.',
    location: 'თბილისი, ვაკე',
    address: 'Vake, Tbilisi',
    latitude: 41.7100,
    longitude: 44.7500,
    sport: 'Basketball',
    imageUrl: 'https://gamo.ge/img/watermarked/YXNzZXRzL2ltYWdlcy9wcm9kdWN0cy8xOTcud2VicA?p=card',
    selectedPhotoUrl: 'https://gamo.ge/img/watermarked/YXNzZXRzL2ltYWdlcy9wcm9kdWN0cy8xOTcud2VicA?p=card',
    rating: 4.8,
    price: 125,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'gamo-166',
    name: 'კორტები ნუცუბიძეზე (Courts at Nutsubidze)',
    description: 'ღია ჩოგბურთის კორტები ნუცუბიძის პლატოზე.',
    location: 'თბილისი, საბურთალო',
    address: 'Nutsubidze, Saburtalo, Tbilisi',
    latitude: 41.729971,
    longitude: 44.731098,
    sport: 'Tennis',
    imageUrl: 'https://gamo.ge/img/watermarked/YXNzZXRzL2ltYWdlcy9wcm9kdWN0cy8xNjYud2VicA?p=card',
    selectedPhotoUrl: 'https://gamo.ge/img/watermarked/YXNzZXRzL2ltYWdlcy9wcm9kdWN0cy8xNjYud2VicA?p=card',
    rating: 4.7,
    price: 70,
    createdAt: new Date().toISOString(),
  },
];

export const SportsSection: React.FC<SportsSectionProps> = ({ c }) => {
  const [stadiums, setStadiums] = useState<Stadium[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStadium, setSelectedStadium] = useState<Stadium | null>(null);

  useEffect(() => {
    const fetchStadiums = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const res = await api.getStadiums();
        setStadiums(res.stadiums && res.stadiums.length > 0 ? res.stadiums : FALLBACK_STADIUMS);
      } catch {
        // Fallback to default stadiums gracefully when offline / backend not deployed yet
        setStadiums(FALLBACK_STADIUMS);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStadiums();
  }, []);

  return (
    <section className="content-section" id="sports">
      <div className="section-heading">
        <div>
          <span>{c.exploreSports}</span>
          <h2>{c.chooseGame}</h2>
        </div>
        <Link to="/sports">{c.viewAllSports} <span>→</span></Link>
      </div>

      {isLoading && (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'rgba(255,255,255,0.6)' }}>
          <p>Loading available stadiums...</p>
        </div>
      )}

      {error && (
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#ff6b6b' }}>
          <p>⚠️ {error}</p>
        </div>
      )}

      {!isLoading && !error && stadiums.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'rgba(255,255,255,0.6)' }}>
          <p>No stadiums available at the moment.</p>
        </div>
      )}

      {!isLoading && !error && stadiums.length > 0 && (
        <div className="sports-grid">
          {stadiums.map((stadium, index) => {
            const isLarge = index === 0;
            return (
              <article
                key={stadium.id}
                className={`sport-card ${isLarge ? 'sport-card-large' : ''}`}
                style={{ cursor: 'pointer' }}
                onClick={() => setSelectedStadium(stadium)}
              >
                <div className="sport-card-top">
                  <span className="sport-number">0{index + 1}</span>
                  <span className="sport-arrow">↗</span>
                </div>
                <div className="sport-visual">
                  <img
                    src={stadium.selectedPhotoUrl || stadium.imageUrl}
                    alt={stadium.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '14px' }}
                  />
                </div>
                <div className="sport-card-info">
                  <h3>{stadium.name}</h3>
                  <p>📍 {stadium.location} · ₾{stadium.price}/player</p>
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

export default SportsSection;
