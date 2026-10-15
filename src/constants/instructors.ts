export interface InstructorProfile {
  id: string;
  name: string;
  title: string;
  avatarUrl: string;
  rating: number;
  reviewCount: number;
  experienceYears: number;
  qualifications: string[];
  hourlyRate1on1: number;
  hourlyRateGroup: number;
  location: string;
  bio: string;
  lessonTypes: ('1-on-1' | 'Group Coaching' | 'Sparring Partner' | 'Academy Clinic')[];
  availableSlots: string[];
}

export interface LearnSport {
  id: string;
  name: string;
  icon: string;
  tagline: string;
  description: string;
  imageUrl: string;
  category: 'racket' | 'team' | 'combat';
  availableInstructorsCount: number;
  minPrice: number;
  popularTopics: string[];
  instructors: InstructorProfile[];
}

export const LEARN_SPORTS: LearnSport[] = [
  {
    id: 'boxing',
    name: 'Boxing',
    icon: '🥊',
    tagline: 'Ring Strategy, Sparring & Technical Defense',
    description: 'Master stance, footwork, jab combos, defensive slips, and high-intensity boxing conditioning with pro fighter coaches.',
    imageUrl: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&w=1200&q=80',
    category: 'combat',
    availableInstructorsCount: 8,
    minPrice: 50,
    popularTopics: ['Heavy Bag Drills', 'Sparring Technique', 'Footwork & Speed', 'Counter Punching'],
    instructors: [
      {
        id: 'box-1',
        name: 'Gia Beridze',
        title: 'National Boxing Champion & Senior Sparring Coach',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        rating: 4.9,
        reviewCount: 42,
        experienceYears: 12,
        qualifications: ['AIBA Certified Coach', 'Georgian National Champ', 'Pro Sparring Instructor'],
        hourlyRate1on1: 65,
        hourlyRateGroup: 35,
        location: 'Champions Boxing Gym, Vera',
        bio: 'Ex-national team boxer specializing in sharp footwork, defensive head movement, and customized heavy bag workouts.',
        lessonTypes: ['1-on-1', 'Group Coaching', 'Sparring Partner'],
        availableSlots: ['Mon 10:00 AM', 'Mon 04:00 PM', 'Wed 11:00 AM', 'Fri 06:00 PM', 'Sat 02:00 PM'],
      },
      {
        id: 'box-2',
        name: 'Nino Javakhishvili',
        title: 'Functional Boxing & Conditioning Trainer',
        avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
        rating: 4.8,
        reviewCount: 29,
        experienceYears: 7,
        qualifications: ['Master of Sports', 'HIIT Boxing Specialist', 'Cardio Sparring License'],
        hourlyRate1on1: 50,
        hourlyRateGroup: 30,
        location: 'Saburtalo Boxing Center',
        bio: 'Passionate coach focusing on core strength, combination speed, mitt work, and accessible entry for beginners.',
        lessonTypes: ['1-on-1', 'Group Coaching', 'Academy Clinic'],
        availableSlots: ['Tue 09:00 AM', 'Thu 05:00 PM', 'Fri 07:00 PM', 'Sun 11:00 AM'],
      },
    ],
  },
  {
    id: 'tennis',
    name: 'Tennis',
    icon: '🎾',
    tagline: 'Precision Strokes, Serve & Court Movement',
    description: 'Elevate your forehand, backhand topspin, service power, and tactical match strategy on clay and hard courts.',
    imageUrl: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&w=1200&q=80',
    category: 'racket',
    availableInstructorsCount: 14,
    minPrice: 60,
    popularTopics: ['Kick & Slice Serve', 'Forehand Topspin', 'Baseline Rallying', 'Net Volley Drills'],
    instructors: [
      {
        id: 'ten-1',
        name: 'Luka Kapanadze',
        title: 'Former ATP Player & PTR Master Professional',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
        rating: 5.0,
        reviewCount: 64,
        experienceYears: 15,
        qualifications: ['PTR Master Professional', 'Ex-ATP Top 400', 'ITF Level 3 Head Coach'],
        hourlyRate1on1: 85,
        hourlyRateGroup: 45,
        location: 'Leila Meskhi Tennis Academy, Marjanishvili',
        bio: 'Dedicated to refining technical biomechanics, court geometry awareness, and competitive match mental toughness.',
        lessonTypes: ['1-on-1', 'Group Coaching', 'Sparring Partner'],
        availableSlots: ['Mon 08:00 AM', 'Tue 06:00 PM', 'Thu 07:00 AM', 'Fri 05:00 PM', 'Sat 10:00 AM'],
      },
      {
        id: 'ten-2',
        name: 'Ana Gelashvili',
        title: 'High-Performance Junior & Adult Coach',
        avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
        rating: 4.9,
        reviewCount: 38,
        experienceYears: 9,
        qualifications: ['PTR Certified Professional', 'B.S. Sports Science', 'Georgian Junior National Coach'],
        hourlyRate1on1: 65,
        hourlyRateGroup: 35,
        location: 'Mziuri Park Tennis Courts, Vake',
        bio: 'Specialist in rapid stroke progression, footwork drills, and friendly hitting lessons for intermediate players.',
        lessonTypes: ['1-on-1', 'Group Coaching', 'Academy Clinic'],
        availableSlots: ['Wed 10:00 AM', 'Thu 04:00 PM', 'Sat 03:00 PM', 'Sun 09:00 AM'],
      },
    ],
  },
  {
    id: 'padel',
    name: 'Padel',
    icon: '🏓',
    tagline: 'Wall Rebounds, Bandeja Shots & Doubles Tactics',
    description: 'Master glass wall defense, position play, lob timing, and aggressive net vibora strikes in fast-paced Padel matches.',
    imageUrl: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=1200&q=80',
    category: 'racket',
    availableInstructorsCount: 9,
    minPrice: 55,
    popularTopics: ['Bandeja & Chiquita Shots', 'Glass Wall Defence', 'Doubles Position Switching', 'Net Control'],
    instructors: [
      {
        id: 'pad-1',
        name: 'Mateo Rossi',
        title: 'FIP Certified Padel Head Coach',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
        rating: 4.9,
        reviewCount: 51,
        experienceYears: 10,
        qualifications: ['FIP International Coach', 'Spanish Padel Federation Certified', 'Tbilisi Padel Open Champ'],
        hourlyRate1on1: 75,
        hourlyRateGroup: 40,
        location: 'Vake Padel Arena & Lisi Courts',
        bio: 'Brings authentic Spanish padel methodology to Georgia. Learn how to use the walls as your ultimate weapon.',
        lessonTypes: ['1-on-1', 'Group Coaching', 'Sparring Partner', 'Academy Clinic'],
        availableSlots: ['Mon 05:00 PM', 'Wed 07:00 PM', 'Fri 08:00 AM', 'Sat 11:00 AM', 'Sun 04:00 PM'],
      },
      {
        id: 'pad-2',
        name: 'David Chikovani',
        title: 'Padel Tactics & Group Master Instructor',
        avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
        rating: 4.8,
        reviewCount: 33,
        experienceYears: 6,
        qualifications: ['Certified Padel Trainer', 'National Tour Finalist'],
        hourlyRate1on1: 55,
        hourlyRateGroup: 30,
        location: 'Olympic Padel Center, Saburtalo',
        bio: 'Focuses on team communication, wall positioning, smooth transitions from defense to attack, and fun group clinics.',
        lessonTypes: ['1-on-1', 'Group Coaching', 'Academy Clinic'],
        availableSlots: ['Tue 11:00 AM', 'Thu 06:00 PM', 'Sat 01:00 PM', 'Sun 02:00 PM'],
      },
    ],
  },
  {
    id: 'football',
    name: 'Football',
    icon: '⚽',
    tagline: 'Technical Control, Tactical Passing & Agility',
    description: 'Sharpen ball mastery, first touch, tactical movement, long-range shooting, and match positioning on turf pitches.',
    imageUrl: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=1200&q=80',
    category: 'team',
    availableInstructorsCount: 18,
    minPrice: 45,
    popularTopics: ['First Touch Control', '1v1 Dribbling Mastery', 'Striking Technique', 'Tactical Positioning'],
    instructors: [
      {
        id: 'fut-1',
        name: 'Tornike Shengelia',
        title: 'UEFA A Licensed Football Coach',
        avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80',
        rating: 4.9,
        reviewCount: 78,
        experienceYears: 14,
        qualifications: ['UEFA A License', 'Ex-Dinamo Tbilisi Academy Coach', 'Sports Performance Specialist'],
        hourlyRate1on1: 70,
        hourlyRateGroup: 35,
        location: 'Inter Academy Fields, Digomi',
        bio: 'Focused on modern tactical awareness, high-speed decision making, body orientation, and technical execution under pressure.',
        lessonTypes: ['1-on-1', 'Group Coaching', 'Academy Clinic'],
        availableSlots: ['Mon 04:00 PM', 'Wed 05:00 PM', 'Thu 08:00 AM', 'Sat 09:00 AM', 'Sun 05:00 PM'],
      },
      {
        id: 'fut-2',
        name: 'Beka Tsereteli',
        title: 'Youth & Amateur Skill Development Coach',
        avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
        rating: 4.8,
        reviewCount: 45,
        experienceYears: 8,
        qualifications: ['UEFA B License', 'Youth Academy Trainer', 'Coerver Coaching Certified'],
        hourlyRate1on1: 50,
        hourlyRateGroup: 25,
        location: 'Marakana Arena, Saburtalo',
        bio: 'Specializes in Coerver ball mastery, quick footwork ladders, shooting accuracy drills, and 5v5 game positioning.',
        lessonTypes: ['1-on-1', 'Group Coaching'],
        availableSlots: ['Tue 05:00 PM', 'Thu 04:00 PM', 'Fri 06:00 PM', 'Sat 02:00 PM'],
      },
    ],
  },
  {
    id: 'rugby',
    name: 'Rugby',
    icon: '🏉',
    tagline: 'Tackling Mechanics, Passing & Lineout Execution',
    description: 'Learn dynamic rugby passing, safe contact & tackling technique, scrum positioning, and endurance conditioning.',
    imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80',
    category: 'team',
    availableInstructorsCount: 6,
    minPrice: 50,
    popularTopics: ['Safe Contact & Tackling', 'Spin & Pop Passing', 'Scrum & Ruck Fundamentals', 'Match Conditioning'],
    instructors: [
      {
        id: 'rug-1',
        name: 'Vano Lomidze',
        title: 'Georgian National Rugby Squad Alumni & Coach',
        avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
        rating: 5.0,
        reviewCount: 31,
        experienceYears: 16,
        qualifications: ['World Rugby Level 2 Coach', 'Ex-Lelo Saracens Player', 'Strength & Conditioning Specialist'],
        hourlyRate1on1: 75,
        hourlyRateGroup: 40,
        location: 'Shevardeni Rugby Stadium, Bagebi',
        bio: 'Teaches world-class rugby fundamentals with strict attention to safe contact technique, breakdown power, and strategic teamwork.',
        lessonTypes: ['1-on-1', 'Group Coaching', 'Academy Clinic'],
        availableSlots: ['Tue 04:00 PM', 'Thu 06:00 PM', 'Sat 10:00 AM', 'Sun 03:00 PM'],
      },
    ],
  },
  {
    id: 'basketball',
    name: 'Basketball',
    icon: '🏀',
    tagline: 'Shooting Form, Handles & Defensive Footwork',
    description: 'Build an unguardable jumper, sharp crossovers, court vision, post moves, and lockdown perimeter defense.',
    imageUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1200&q=80',
    category: 'team',
    availableInstructorsCount: 11,
    minPrice: 50,
    popularTopics: ['Jump Shot Mechanics', 'Crossover & Handle Drills', 'Pick & Roll IQ', 'Explosive Vertical Jump'],
    instructors: [
      {
        id: 'bas-1',
        name: 'Irakli Gogidze',
        title: 'Pro Basketball Skill Trainer & Shooting Coach',
        avatarUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=400&q=80',
        rating: 4.9,
        reviewCount: 56,
        experienceYears: 11,
        qualifications: ['FIBA Certified Coach', 'Ex-Superleague Guard', "I'm Possible Training Certified"],
        hourlyRate1on1: 65,
        hourlyRateGroup: 35,
        location: 'Zaza Pachulia Academy & Brooklyn Hall',
        bio: 'Transform your shooting mechanics and ball-handling fluidness through detailed video breakdown and high-rep skill drills.',
        lessonTypes: ['1-on-1', 'Group Coaching', 'Academy Clinic'],
        availableSlots: ['Mon 09:00 AM', 'Wed 06:00 PM', 'Fri 05:00 PM', 'Sat 12:00 PM', 'Sun 10:00 AM'],
      },
    ],
  },
  {
    id: 'volleyball',
    name: 'Volleyball',
    icon: '🏐',
    tagline: 'Overhead Setting, Spiking Power & Serve Precision',
    description: 'Perfect your approach jump, spiking wrist snap, setting touch, jump float serve, and beach court agility.',
    imageUrl: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&w=1200&q=80',
    category: 'team',
    availableInstructorsCount: 7,
    minPrice: 45,
    popularTopics: ['Spike Timing & Snap', 'Overhead Setting Accuracy', 'Jump Float Serve', 'Beach Dig & Movement'],
    instructors: [
      {
        id: 'vol-1',
        name: 'Elena Dolidze',
        title: 'National Volleyball Master Coach',
        avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
        rating: 4.9,
        reviewCount: 39,
        experienceYears: 10,
        qualifications: ['FIVB Level 2 Coach', 'National Beach Tour Champion', 'Biomechanics Instructor'],
        hourlyRate1on1: 60,
        hourlyRateGroup: 30,
        location: 'Digomi Olympic Arena & Vake Courts',
        bio: 'Specializing in spike approach footwork, clean setting technique, and dynamic court communication for indoor & beach volleyball.',
        lessonTypes: ['1-on-1', 'Group Coaching', 'Academy Clinic'],
        availableSlots: ['Mon 11:00 AM', 'Wed 04:00 PM', 'Fri 06:00 PM', 'Sat 04:00 PM'],
      },
    ],
  },
  {
    id: 'badminton',
    name: 'Badminton',
    icon: '🏸',
    tagline: 'High Clears, Drop Shots & Rapid Footwork',
    description: 'Develop lightning-fast reflex speed, precise wrist snaps, steep smash angles, and deceptive drop shots.',
    imageUrl: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=1200&q=80',
    category: 'racket',
    availableInstructorsCount: 5,
    minPrice: 45,
    popularTopics: ['Jump Smash Power', 'Net Deception & Drops', 'Footwork Split-step', 'Doubles Rotations'],
    instructors: [
      {
        id: 'bad-1',
        name: 'Giga Meladze',
        title: 'BWF Certified Badminton Instructor',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
        rating: 4.8,
        reviewCount: 22,
        experienceYears: 8,
        qualifications: ['BWF Level 1 Coach', 'National Tournament Winner'],
        hourlyRate1on1: 55,
        hourlyRateGroup: 30,
        location: 'Central Badminton Complex, Isani',
        bio: 'Focuses on split-step footwork timing, racquet wrist speed, and stamina drills for competitive players.',
        lessonTypes: ['1-on-1', 'Group Coaching'],
        availableSlots: ['Tue 10:00 AM', 'Thu 03:00 PM', 'Sat 02:00 PM'],
      },
    ],
  },
  {
    id: 'tabletennis',
    name: 'Table Tennis',
    icon: '🏓',
    tagline: 'Spin Control, Loop Drives & Reaction Drills',
    description: 'Master topspin loops, backspin chop defense, serve spin variation, and high-speed table placement.',
    imageUrl: 'https://images.unsplash.com/photo-1534158914592-062992fbe900?auto=format&fit=crop&w=1200&q=80',
    category: 'racket',
    availableInstructorsCount: 6,
    minPrice: 40,
    popularTopics: ['Topspin Loop Drive', 'Heavy Backspin Push', 'Deceptive Pendulum Serve', 'Reaction Speed'],
    instructors: [
      {
        id: 'tt-1',
        name: 'Soso Pantsulaia',
        title: 'ITTF Level 2 Master Coach',
        avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
        rating: 4.9,
        reviewCount: 47,
        experienceYears: 13,
        qualifications: ['ITTF Certified Coach', 'Multiple National Gold Medalist'],
        hourlyRate1on1: 50,
        hourlyRateGroup: 25,
        location: 'Tbilisi Table Tennis Club, Vera Park',
        bio: 'Learn how to read opponents spin instantly, develop explosive forehand loops, and serve unreturnable balls.',
        lessonTypes: ['1-on-1', 'Group Coaching', 'Sparring Partner'],
        availableSlots: ['Mon 02:00 PM', 'Wed 05:00 PM', 'Fri 04:00 PM', 'Sun 12:00 PM'],
      },
    ],
  },
];

export function getLearnSportById(id: string): LearnSport | undefined {
  return LEARN_SPORTS.find((sport) => sport.id === id.toLowerCase());
}

// ── Georgian localizations ──────────────────────────────────────────────────
// Only the text fields are translated; numeric/image/icon fields stay unchanged.
export interface SportL10n {
  name: string;
  tagline: string;
  description: string;
  popularTopics: string[];
  instructors: {
    id: string;
    title: string;
    qualifications: string[];
    bio: string;
    lessonTypes: string[];
  }[];
}

export const LEARN_SPORTS_KA: Record<string, SportL10n> = {
  boxing: {
    name: 'ბოქსი',
    tagline: 'ტექნიკა, სპარინგი & დაცვა',
    description: 'დაეუფლე სპარინგის ფეხკინძის ტექნიკას, თავდაცვითი სლიპებსა და ინტენსიურ კონდიციონირებას პროფი ბოქსიორ-მწვრთნელებთან ერთად.',
    popularTopics: ['ჩანთაზე სავარჯიშოები', 'სპარინგის ტექნიკა', 'ფეხკინძა & სიჩქარე', 'კონტრ-დარტყმები'],
    instructors: [
      {
        id: 'box-1',
        title: 'ეროვნული ბოქსის ჩემპიონი & სპარინგ-მწვრთნელი',
        qualifications: ['AIBA სერტიფიცირებული', 'საქართველოს ეროვნული ჩემპიონი', 'პროფ. სპარინგ ინსტრუქტორი'],
        bio: 'ყოფილი ეროვნული გუნდის ბოქსიორი, სპეციალობა — ფეხკინძა, დამცავი მოძრაობა და ინდივიდუალური სავარჯიშოები.',
        lessonTypes: ['1-on-1', 'ჯგუფური', 'სპარინგ-პარტნიორი'],
      },
      {
        id: 'box-2',
        title: 'ფუნქციონალური ბოქსი & კონდიციონირების მწვრთნელი',
        qualifications: ['სპორტის მაგისტრი', 'HIIT ბოქსის სპეციალისტი', 'კარდიო-სპარინგის ლიცენზია'],
        bio: 'ვნებიანი მწვრთნელი, ორიენტირება — სხეულის გამძლეობა, კომბინაციების სიჩქარე, მიტ-ვორქი და დამწყებებისათვის ხელმისაწვდომი სწავლება.',
        lessonTypes: ['1-on-1', 'ჯგუფური', 'ბოლო-ნერვების კლინიკა'],
      },
    ],
  },
  tennis: {
    name: 'ჩოგბურთი',
    tagline: 'ზუსტი დარტყმები, სერვი & მოძრაობა',
    description: 'გააუმჯობესე ფორჰენდი, ბექჰენდის ტოფსპინი, სამსახური და ტაქტიკური მოედნის სტრატეგია.',
    popularTopics: ['კიქ & სლაისი', 'ფ-ჰენდ ტოფსპინი', 'საბაზო ხაზიდან ბრძოლა', 'ქსელის ვოლეი'],
    instructors: [
      {
        id: 'ten-1',
        title: 'ყოფილი ATP მოთამაშე & PTR მასტერ-პროფესიონალი',
        qualifications: ['PTR მასტერ-პროფ.', 'ყოფ. ATP Top 400', 'ITF Level 3 მთავარი მწვრთნელი'],
        bio: 'სპეციალიზდება ბიომექანიკაზე, მოედნის გეომეტრიის გაგებაზე და შეჯიბრის ფსიქოლოგიაზე.',
        lessonTypes: ['1-on-1', 'ჯგუფური', 'სპარინგ-პარტნიორი'],
      },
      {
        id: 'ten-2',
        title: 'მაღალი ეფექტიანობის ახალგაზრდა & ზრდასრულ სპოლრტსმენთა მწვრთნელი',
        qualifications: ['PTR სერტ. პროფ.', 'სპორტ-მეცნ. ბაკ.', 'ეროვნული ახ. გუნდის მწვრთნელი'],
        bio: 'სპეციალისტი სწრაფ სტრიქ-პროგრესში, ფეხკინძის სავარჯიშოებში და მეგობრულ გაკვეთილებში.',
        lessonTypes: ['1-on-1', 'ჯგუფური', 'კლინიკა'],
      },
    ],
  },
  padel: {
    name: 'პადელი',
    tagline: 'კედლის მაჩვენებლები, ბანდეხა & ტაქტიკა',
    description: 'დაეუფლე შუშის კედელს, პოზიციის თამაშს, ლობის ტაიმინგს და სწრაფ ვიბორა-ჩარიხებს.',
    popularTopics: ['ბანდეხა & ჩიქიტა', 'კედლის დაცვა', 'ორეული გადართვა', 'ქსელის კონტროლი'],
    instructors: [
      {
        id: 'pad-1',
        title: 'FIP სერტ. პადელის მთავარი მწვრთნელი',
        qualifications: ['FIP საერთ. მწვრთნელი', 'ესპ. პადელ-ფედ. სერტ.', 'თბილ. Open ჩემპიონი'],
        bio: 'ავტენტური ესპანური პადელ-მეთოდოლოგია. ისწავლე კედლის, როგორც მთავარი იარაღის, გამოყენება.',
        lessonTypes: ['1-on-1', 'ჯგუფური', 'სპარინგ-პარტნიორი', 'კლინიკა'],
      },
      {
        id: 'pad-2',
        title: 'პადელ ტაქტიკა & ჯგუფური ინსტრუქტორი',
        qualifications: ['სერტ. პადელ-ტრენერი', 'ეროვნული ტური ფინალისტი'],
        bio: 'ფოკუსი — კომუნიკაცია, კედლის პოზიცია, გადასვლა თავდაცვიდან შეტევაზე და მხიარული ჯგუფური კლინიკები.',
        lessonTypes: ['1-on-1', 'ჯგუფური', 'კლინიკა'],
      },
    ],
  },
  football: {
    name: 'ფეხბურთი',
    tagline: 'ბურთის კონტროლი, გადაცემა & სიმარჯვე',
    description: 'გაამახვილე ბურთის ტექნიკა, პირველი შეხება, ტაქტიკური მოძრაობა და გრძელი სროლის ძალა.',
    popularTopics: ['პირველი შეხება', '1v1 ჟონგლირება', 'სროლის ტექნიკა', 'ტაქტიკური პოზიციონირება'],
    instructors: [
      {
        id: 'fut-1',
        title: 'UEFA A ლიცენზიის ფეხბურთის მწვრთნელი',
        qualifications: ['UEFA A ლიცენზია', 'ყოფ. დინამო-თბ. აკ. მწვ.', 'სპ. ეფ-ის სპეციალისტი'],
        bio: 'თანამედროვე ტაქტიკური ცნობიერება, სიჩქარითი გადაწყვეტილება და ტექნ. შესრულება ზეწოლის ქვეშ.',
        lessonTypes: ['1-on-1', 'ჯგუფური', 'კლინიკა'],
      },
      {
        id: 'fut-2',
        title: 'ახალგაზრდული & სააკადემიო განვითარების მწვრთნელი',
        qualifications: ['UEFA B ლიცენზია', 'ახ. გ. ট্রেনერი', 'Coerver სერტ.'],
        bio: 'სპეციალიზდება Coerver ბურთის ოსტ-ბა, სიჩქარის კიბეებზე, სროლის სიზუსტეში და 5v5 პოზიციაში.',
        lessonTypes: ['1-on-1', 'ჯგუფური'],
      },
    ],
  },
  rugby: {
    name: 'რაგბი',
    tagline: 'ჩარხვის მექ-ა, გადაცემა & სკრამი',
    description: 'ისწავლე გადაცემა, უსაფრთხო კონტაქტი, სკრამის პოზიციონირება და გამძლეობის კონდ-ება.',
    popularTopics: ['კონტაქტი & ჩარხვა', 'სპინ & პოპ-გდება', 'სკრამ & რაქი', 'მატჩის გამ-ბ'],
    instructors: [
      {
        id: 'rug-1',
        title: 'საქ. ეროვ. რაგბი-გუნდის ყოფ. წევრი & მწვრთნელი',
        qualifications: ['World Rugby Level 2', 'ყოფ. Lelo Saracens მოთ.', 'სიძლიერე & კონდ. სპ.'],
        bio: 'მსოფლიო კლასის ფუნდამენტები — უსაფრთხო კონტაქტი, ბრეიქდაუნი და სტრატეგიული გუნდური მუშაობა.',
        lessonTypes: ['1-on-1', 'ჯგუფური', 'კლინიკა'],
      },
    ],
  },
  basketball: {
    name: 'კალათბურთი',
    tagline: 'სროლება, ჰენდლინგი & დაცვის ფეხკინძა',
    description: 'ააგე დაუცველი jump shot, ჭარბი ჯვარ-ოვერი, მოედნის ხედვა, ახლო მოძრაობა & პერიმ. დაცვა.',
    popularTopics: ['ნახტომ-სროლის მექ-ა', 'ჯვარ-ოვ. & ჰენდ.', 'Pick & Roll IQ', 'ვერტ. მოძრაობა'],
    instructors: [
      {
        id: 'bas-1',
        title: 'პროფ. კალათ-ური სავ-ო მწვრთ. & სროლ-ის მწვ.',
        qualifications: ['FIBA სერტ. მწვ.', 'ყოფ. სუპ. ლიგის გა-დი', "I'm Possible სერტ."],
        bio: 'სროლ-ის მექანიკა და ბ-ის მართვ-ის გლუვ-ბა ვიდ-ო ანალ-ისა და მაღალი გამ-ის სავ-ების გზით.',
        lessonTypes: ['1-on-1', 'ჯგუფური', 'კლინიკა'],
      },
    ],
  },
  volleyball: {
    name: 'ვოლეიბოლი',
    tagline: 'სეტინგი, სმეში & სერვის სიზუსტე',
    description: 'გაამახვილე საკ-ო ნახტომი, სმ-ის მაჯის მოძრ-ბა, სეტ-ის შეხება და ზ-ბ-ის სიმარჯვე.',
    popularTopics: ['სმ-ის ტაიმ. & მაჯა', 'სეტ-ის სიზუსტე', 'Jump Float სერვ.', 'ბ-ბ-ი & მოძრ.'],
    instructors: [
      {
        id: 'vol-1',
        title: 'ეროვ. ვოლ-ბ-ის მასტ-ერ-მწვრ.',
        qualifications: ['FIVB Level 2', 'ეროვ. სანაპ. ჩ-ემ.', 'ბიომ-ის ინს-ტ.'],
        bio: 'სმ-ის ნახტომ-ის ფეხ-კ., სუფთა სეტ-ის ტექ-ნ. და მოედ-ის კომ-ია ინდ. & სანაპ. ვოლ-ბ-ისთვის.',
        lessonTypes: ['1-on-1', 'ჯგუფური', 'კლინიკა'],
      },
    ],
  },
  badminton: {
    name: 'ბადმინტონი',
    tagline: 'სმეში, Drop Shot & სიჩქარე',
    description: 'განავითარე სიჩქარე, მაჯის სნეპი, სმ-ის კუთხe და სიმარჯვე ბ-ინ.',
    popularTopics: ['ნახტომ-სმ.', 'ქსელ-ის ატყ.', 'Split-step', 'ორ-ის ბრ-ება'],
    instructors: [
      {
        id: 'bad-1',
        title: 'BWF სერტ. ბ-ტ. ინსტრ.',
        qualifications: ['BWF Level 1', 'ეროვ. ტ-ის გამ-ი'],
        bio: 'ფოკ-ი — Split-step ტაიმ., ჩ-ოს მაჯ-ის სი-ქ. და გ-ის სავ-ები კ-ს. მოთ-ებ-ის.',
        lessonTypes: ['1-on-1', 'ჯგუფური'],
      },
    ],
  },
  tabletennis: {
    name: 'მაგიდის ჩოგბ.',
    tagline: 'სპი-ს კ-ი, Loop & რეაქ.',
    description: 'დაეუფ. ტოფსპ. ლ-ს, ბექ-ის ჩოფ-ს, სპ-ის ვარ-ას და მაღ-ს. ფ-ის განლ-ს.',
    popularTopics: ['ტოფსპ. Loop', 'ბ-ი ბ-ქ-ი ფ-ი', 'სე-ვ. ვარ-ა', 'რეაქ-ის სი-ქ.'],
    instructors: [
      {
        id: 'tt-1',
        title: 'ITTF Level 2 მ-ა მ-ი',
        qualifications: ['ITTF სე-ბ. მ-ი', 'მრ-ელ ეროვ. ო-ს მ-ი'],
        bio: 'ისწ-ლე რ-ის სპ-ის წ-ა, ფ-ენ-ის ლ-ბ-ი და გ-უ-ელ-ი ს-ვ-ი.',
        lessonTypes: ['1-on-1', 'ჯგუფური', 'სპარინგ-პარტნიორი'],
      },
    ],
  },
};

/** Returns a sport card with text localised to `lang`. Falls back to English. */
export function getLocalizedLearnSports(lang: 'en' | 'ka'): LearnSport[] {
  if (lang === 'en') return LEARN_SPORTS;
  return LEARN_SPORTS.map((sport) => {
    const ka = LEARN_SPORTS_KA[sport.id];
    if (!ka) return sport;
    return {
      ...sport,
      name: ka.name,
      tagline: ka.tagline,
      description: ka.description,
      popularTopics: ka.popularTopics,
      instructors: sport.instructors.map((ins) => {
        const kaIns = ka.instructors.find((k) => k.id === ins.id);
        if (!kaIns) return ins;
        return {
          ...ins,
          title: kaIns.title,
          qualifications: kaIns.qualifications,
          bio: kaIns.bio,
          lessonTypes: kaIns.lessonTypes as typeof ins.lessonTypes,
        };
      }),
    };
  });
}
