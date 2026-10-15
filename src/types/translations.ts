export type Language = 'en' | 'ka';

export interface TranslationContent {
  // ── Navigation ──
  home: string;
  sports: string;
  stadiums: string;
  games: string;
  tournaments: string;
  learn: string;
  findPlayers: string;
  about: string;
  login: string;
  signup: string;
  logout: string;
  adminPanel: string;

  // ── Hero ──
  findGameBtn: string;
  createGameBtn: string;
  eyebrow: string;
  heroTitle1: string;
  heroTitle2: string;
  heroDesc: string;
  gamesThisWeek: string;
  activePlayers: string;
  sportsVenues: string;

  // ── Search ──
  searchEyebrow: string;
  searchTitle: string;
  searchSubtitle: string;
  searchBtn: string;

  // ── Sports ──
  exploreSports: string;
  chooseGame: string;
  viewAllSports: string;
  bookNow: string;
  viewDetails: string;

  // ── Games section ──
  playSoon: string;
  upcomingGames: string;
  seeAllGames: string;
  spotsLeft: (n: number) => string;
  dateTime: string;
  location: string;
  perPlayer: string;
  joinGame: string;
  leaveGame: string;
  loadingGames: string;
  noGamesFound: string;
  allSports: string;
  joinedSuccess: string;
  leftSuccess: string;

  // ── Tournaments ──
  comingTogether: string;
  playTournament: string;
  tournamentDesc: string;
  exploreTournaments: string;
  viewTournament: string;
  // Tournament card UI
  datesLabel: string;
  entryFeeLabel: string;
  entryFeePerPlayer: string;
  registeredTeamsLabel: string;
  teamsLabel: string;
  teamSpotsRemaining: (n: number) => string;
  registrationClosed: string;
  registerTeam: string;
  teamRegistered: string;
  registrationFull: string;
  allSportsFilter: string;

  // ── How It Works ──
  howItWorks: string;
  howTitle1: string;
  howTitle2: string;
  howDesc: string;
  step1Title: string;
  step1Desc: string;
  step2Title: string;
  step2Desc: string;
  step3Title: string;
  step3Desc: string;

  // ── Footer ──
  footerDesc: string;
  explore: string;
  company: string;
  account: string;
  contact: string;
  rights: string;

  // ── Instructors / Learn ──
  learnEyebrow: string;
  learnTitle: string;
  learnSubtitle: string;
  findInstructor: string;
  startLearning: string;
  certifiedCoaches: string;
  viewAllCoaches: string;
  lessonPricing: string;
  perHour: string;
  filterAll: string;
  filterRacket: string;
  filterTeam: string;
  filterCombat: string;
  bookLesson: string;
  instructorQualifications: string;
  experience: string;
  rating: string;
  individualLesson: string;
  groupLesson: string;
  selectSlot: string;
  // Card inline strings
  fromPrice: string;
  perHourShort: string;
  coachesLabel: string;
  lessonFormatLabel: string;
  officialInstructors: string;
  coachingAcademy: string;
  backToInstructors: string;
  lessonBookingConfirmed: string;
  lessonBookingConfirmedDesc: string;
  selectLessonType: string;
  personalizedFocus: string;
  trainAlongside: string;
  availableTimeSlots: string;
  confirmBookingWith: string;
  oneOnOneLesson: string;
  groupPriceLabel: string;
  yearsExperience: string;
  reviewsLabel: string;

  // ── Auth Modal ──
  loginSubtitle: string;
  registerSubtitle: string;
  fullName: string;
  emailAddress: string;
  password: string;
  confirmPassword: string;
  minChars: string;
  passwordStrength: string;
  pwWeak: string;
  pwWeakMin: string;
  pwMedium: string;
  pwStrong: string;
  processing: string;
  done: string;
  dontHaveAccount: string;
  alreadyHaveAccount: string;
  // Validation
  validationErrors: string;
  nameRequired: string;
  nameMinLength: string;
  emailRequired: string;
  emailInvalid: string;
  passwordRequired: string;
  passwordMinLength: string;
  confirmPasswordRequired: string;
  passwordsMismatch: string;
  unexpectedError: string;
  loginSuccess: string;
  registerSuccess: string;
  // Placeholders
  fullNamePlaceholder: string;
  emailPlaceholder: string;
  showPassword: string;
  hidePassword: string;
  completeSetup: string;

  // ── Profile Page ──
  accessRequired: string;
  accessRequiredDesc: string;
  activeAthlete: string;
  totalMatches: string;
  bookedCreated: string;
  joinedMatches: string;
  allBookings: (n: number) => string;
  createdByMe: (n: number) => string;
  joinedMatchesTab: (n: number) => string;
  loadingBookings: string;
  noBookingsFound: string;
  noBookingsCreated: string;
  noBookingsJoined: string;
  noBookingsAll: string;
  browseStadiums: string;
  matchDate: string;
  timeSlot: string;
  registeredPlayers: string;
  leaveMatch: string;
  viewAllGames: string;
  you: string;
  noPlayersYet: string;
  successLeft: string;

  // ── PlayPass Page ──
  introducingPlayPass: string;
  playMorePayLess: string;
  playMorePayLessHighlight: string;
  playPassDesc: string;
  chooseDuration: string;
  yourActivePlan: string;
  expiresLabel: string;
  creditsLeftWeek: string;
  unlimitedAccess: string;
  cancelPlan: string;
  confirmCancelQuestion: string;
  yesCancel: string;
  keepPlan: string;
  comparePlans: string;
  everythingIncluded: string;
  featureLabel: string;
  activityCreditsPerWeek: string;
  checkmark: string;
  profileBadge: string;
  newSportEarlyAccess: string;
  perMonth: string;
  save: string;
  activityCredits: string;
  unlimited: string;
  perWeek: string;
  choosePlan: (name: string) => string;
  yourCurrentPlan: string;
  activating: string;
  mostPopular: string;
  activeBadge: string;
  howItWorksPlayPass: string;
  simpleAsBooking: string;
  ppStep1Title: string;
  ppStep1Desc: string;
  ppStep2Title: string;
  ppStep2Desc: string;
  ppStep3Title: string;
  ppStep3Desc: string;
  ppStep4Title: string;
  ppStep4Desc: string;
  faqTitle: string;
  faqSubtitle: string;
  readyToPlay: string;
  readyToPlayDesc: string;
  viewPlans: string;
  noCommitment: string;
  // Checkout modal
  checkoutDurationLabel: string;
  checkoutPlan: string;
  checkoutDuration: string;
  checkoutWeeklyCredits: string;
  checkoutTotal: string;
  checkoutPaymentNote: string;
  checkoutPaymentNoteText: string;
  back: string;
  activate: (name: string) => string;
  playPassActivated: string;
  playPassActivatedDesc: (tier: string) => string;
  close: string;
  bookSportNow: string;
  somethingWentWrong: string;
  // Duration labels
  duration1: string;
  duration2: string;
  duration3: string;
  duration5: string;
  // FAQ items
  faq1q: string;
  faq1a: string;
  faq2q: string;
  faq2a: string;
  faq3q: string;
  faq3a: string;
  faq4q: string;
  faq4a: string;
  faq5q: string;
  faq5a: string;

  // ── Stadiums Section ──
  stadiumsEyebrow: string;
  stadiumsTitle: string;
  stadiumsSubtitle: string;
  viewAllStadiums: string;
  bookStadium: string;
  playersMax: string;
  ratingLabel: string;
  pricePerHour: string;
  loadingStadiums: string;
  noStadiumsFound: string;
  // Stadiums section UI
  allStadiumsFilter: string;
  capacityLabel2: string;
  ratePerPlayerLabel: string;
  showAllStadiums2: string;
  noStadiumsForFilter: (sport: string) => string;

  // ── Booking Modal ──
  chooseSport: string;
  chooseVenue: string;
  dateTimeSlots: string;
  reviewConfirm: string;
  paymentMethod: string;
  stepLabel: (step: number) => string;
  searchVenuePlaceholder: string;
  venuesAvailable: (n: number) => string;
  noVenuesFound: string;
  searchingVenues: string;
  selectVenueContinue: (name: string) => string;
  matchTitleOptional: string;
  matchTitlePlaceholder: (sport: string, venue: string) => string;
  selectDate: string;
  timeSlots: string;
  customTime: string;
  startTime: string;
  endTime: string;
  checkAvailability: string;
  slotAvailable: string;
  slotUnavailable: string;
  conflictWith: (title: string) => string;
  capacityLabel: string;
  maxPlayersLabel: (n: number) => string;
  ratePerPlayer: string;
  reviewTitle: string;
  reviewSport: string;
  reviewVenue: string;
  reviewAddress: string;
  reviewDate: string;
  reviewTime: string;
  reviewMaxPlayers: string;
  reviewSpotsRemaining: (n: number) => string;
  proceedToPayment: string;
  payWithCash: string;
  payWithCard: string;
  cashDesc: string;
  cardDesc: string;
  bookingSuccessMsg: string;
  bookingErrorFallback: string;
  bookingAlreadyBooked: string;
  checkingAvailability: string;
  submittingBooking: string;
  continueNext: string;

  // ── Payment Card Modal ──
  paymentTitle: string;
  paymentSecure: string;
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
  cardNumberPlaceholder: string;
  cardHolderPlaceholder: string;
  expiryPlaceholder: string;
  cvvPlaceholder: string;
  cardNumberError: string;
  expiryError: string;
  cvvError: string;
  holderError: string;
  confirmPayment: string;
  paymentProcessing: string;
  paymentSuccess: string;
  paymentSuccessDesc: string;
  paymentErrorTitle: string;
  tryAgain: string;

  // ── Find Players ──
  findPlayersEyebrow: string;
  findPlayersTitle: string;
  findPlayersSubtitle: string;
  postAd: string;
  filterBySport: string;
  searchPlayers: string;
  skillLevel: string;
  locationLabel: string;
  bio: string;
  contactInfo: string;
  postPlayer: string;
  loadingPlayers: string;
  noPlayersFound: string;
  writeComment: string;
  postComment: string;
  reportContent: string;
  bannedLabel: string;
  deletePost: string;
  editPost: string;
  yourPost: string;
  replyLabel: string;
  commentsLabel: string;
  viewComments: string;
  hideComments: string;

  // ── General ──
  loading: string;
  error: string;
  cancel: string;
  confirm: string;
  save2: string;
  delete: string;
  edit: string;
  submit: string;
  optional: string;
  required: string;
}
