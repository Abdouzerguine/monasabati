import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      // Navigation
      home: 'Home',
      search: 'Search',
      bookings: 'Bookings',
      profile: 'Profile',
      dashboard: 'Dashboard',
      venues: 'My Venues',
      addVenue: 'Add Venue',
      
      // Auth
      login: 'Login',
      register: 'Register',
      logout: 'Logout',
      email: 'Email',
      password: 'Password',
      name: 'Full Name',
      phone: 'Phone',
      userType: 'I am a',
      eventOrganizer: 'Event Organizer',
      venueOwner: 'Venue Owner',
      
      // Common
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      view: 'View',
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      
      // Venues
      venueName: 'Venue Name',
      description: 'Description',
      location: 'Location',
      price: 'Price',
      capacity: 'Capacity',
      amenities: 'Amenities',
      category: 'Category',
      images: 'Images',
      
      // Booking
      bookNow: 'Book Now',
      selectDate: 'Select Date',
      selectTime: 'Select Time',
      guests: 'Guests',
      totalPrice: 'Total Price',
      confirmBooking: 'Confirm Booking',
      
      // Reviews
      reviews: 'Reviews',
      addReview: 'Add Review',
      rating: 'Rating',
      writeReview: 'Write a review...',
      
      // Chat
      sendMessage: 'Send Message',
      typeMessage: 'Type a message...',
      chatWith: 'Chat with {{name}}',
      
      // Analytics
      totalRevenue: 'Total Revenue',
      totalBookings: 'Total Bookings',
      averageRating: 'Average Rating',
      occupancyRate: 'Occupancy Rate',
      monthlyRevenue: 'Monthly Revenue',
      
      // Social
      favorites: 'Favorites',
      share: 'Share',
      addToFavorites: 'Add to Favorites',
      removeFromFavorites: 'Remove from Favorites',
    }
  },
  ar: {
    translation: {
      // Navigation
      home: 'الرئيسية',
      search: 'البحث',
      bookings: 'الحجوزات',
      profile: 'الملف الشخصي',
      dashboard: 'لوحة التحكم',
      venues: 'أماكني',
      addVenue: 'إضافة مكان',
      
      // Auth
      login: 'تسجيل الدخول',
      register: 'تسجيل',
      logout: 'تسجيل الخروج',
      email: 'البريد الإلكتروني',
      password: 'كلمة المرور',
      name: 'الاسم الكامل',
      phone: 'الهاتف',
      userType: 'أنا',
      eventOrganizer: 'منظم فعاليات',
      venueOwner: 'مالك مكان',
      
      // Common
      save: 'حفظ',
      cancel: 'إلغاء',
      delete: 'حذف',
      edit: 'تعديل',
      view: 'عرض',
      loading: 'جاري التحميل...',
      error: 'خطأ',
      success: 'نجح',
      
      // Venues
      venueName: 'اسم المكان',
      description: 'الوصف',
      location: 'الموقع',
      price: 'السعر',
      capacity: 'السعة',
      amenities: 'المرافق',
      category: 'الفئة',
      images: 'الصور',
      
      // Booking
      bookNow: 'احجز الآن',
      selectDate: 'اختر التاريخ',
      selectTime: 'اختر الوقت',
      guests: 'الضيوف',
      totalPrice: 'السعر الإجمالي',
      confirmBooking: 'تأكيد الحجز',
      
      // Reviews
      reviews: 'المراجعات',
      addReview: 'إضافة مراجعة',
      rating: 'التقييم',
      writeReview: 'اكتب مراجعة...',
      
      // Chat
      sendMessage: 'إرسال رسالة',
      typeMessage: 'اكتب رسالة...',
      chatWith: 'محادثة مع {{name}}',
      
      // Analytics
      totalRevenue: 'إجمالي الإيرادات',
      totalBookings: 'إجمالي الحجوزات',
      averageRating: 'متوسط التقييم',
      occupancyRate: 'معدل الإشغال',
      monthlyRevenue: 'الإيرادات الشهرية',
      
      // Social
      favorites: 'المفضلة',
      share: 'مشاركة',
      addToFavorites: 'إضافة للمفضلة',
      removeFromFavorites: 'إزالة من المفضلة',
    }
  },
  fr: {
    translation: {
      // Navigation
      home: 'Accueil',
      search: 'Recherche',
      bookings: 'Réservations',
      profile: 'Profil',
      dashboard: 'Tableau de bord',
      venues: 'Mes lieux',
      addVenue: 'Ajouter un lieu',
      
      // Auth
      login: 'Connexion',
      register: 'S\'inscrire',
      logout: 'Déconnexion',
      email: 'Email',
      password: 'Mot de passe',
      name: 'Nom complet',
      phone: 'Téléphone',
      userType: 'Je suis',
      eventOrganizer: 'Organisateur d\'événements',
      venueOwner: 'Propriétaire de lieu',
      
      // Common
      save: 'Enregistrer',
      cancel: 'Annuler',
      delete: 'Supprimer',
      edit: 'Modifier',
      view: 'Voir',
      loading: 'Chargement...',
      error: 'Erreur',
      success: 'Succès',
      
      // Venues
      venueName: 'Nom du lieu',
      description: 'Description',
      location: 'Emplacement',
      price: 'Prix',
      capacity: 'Capacité',
      amenities: 'Équipements',
      category: 'Catégorie',
      images: 'Images',
      
      // Booking
      bookNow: 'Réserver maintenant',
      selectDate: 'Sélectionner la date',
      selectTime: 'Sélectionner l\'heure',
      guests: 'Invités',
      totalPrice: 'Prix total',
      confirmBooking: 'Confirmer la réservation',
      
      // Reviews
      reviews: 'Avis',
      addReview: 'Ajouter un avis',
      rating: 'Note',
      writeReview: 'Écrire un avis...',
      
      // Chat
      sendMessage: 'Envoyer un message',
      typeMessage: 'Tapez un message...',
      chatWith: 'Chat avec {{name}}',
      
      // Analytics
      totalRevenue: 'Revenus totaux',
      totalBookings: 'Réservations totales',
      averageRating: 'Note moyenne',
      occupancyRate: 'Taux d\'occupation',
      monthlyRevenue: 'Revenus mensuels',
      
      // Social
      favorites: 'Favoris',
      share: 'Partager',
      addToFavorites: 'Ajouter aux favoris',
      removeFromFavorites: 'Retirer des favoris',
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;