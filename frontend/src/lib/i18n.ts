'use client';

import { create } from 'zustand';

export type Language = 'en' | 'fr' | 'ak';

export interface LanguageOption {
  code: Language;
  name: string;
  nativeName: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'ak', name: 'Twi', nativeName: 'Akan / Twi', flag: '🇬🇭' },
];

export const translations: Record<Language, Record<string, string>> = {
  en: {
    dashboard: 'Dashboard',
    students: 'Students',
    teachers: 'Teachers',
    parents: 'Parents',
    academics: 'Academics',
    attendance: 'Attendance',
    results: 'Results & Exams',
    reportCards: 'Report Cards',
    fees: 'Finance & Fees',
    timetable: 'Timetable',
    calendar: 'Calendar',
    assignments: 'Assignments',
    announcements: 'Announcements',
    operations: 'Operations',
    discipline: 'Discipline',
    health: 'Clinic & Health',
    library: 'Library',
    inventory: 'Inventory',
    transport: 'Transport',
    hr: 'HR & Leaves',
    analytics: 'Analytics',
    documents: 'Document Vault',
    billing: 'Billing & Plans',
    settings: 'Settings',
    logout: 'Log Out',
    search: 'Search...',
    active: 'Active',
    suspended: 'Suspended',
    save: 'Save Changes',
    cancel: 'Cancel',
    exportCsv: 'Export CSV',
    overview: 'Overview',
    totalStudents: 'Total Students',
    feeCollection: 'Fee Collection',
    upgrade: 'Upgrade Plan',
    currentPlan: 'Current Plan',
  },
  fr: {
    dashboard: 'Tableau de bord',
    students: 'Élèves',
    teachers: 'Enseignants',
    parents: 'Parents',
    academics: 'Pédagogie',
    attendance: 'Présences',
    results: 'Examens & Notes',
    reportCards: 'Bulletins',
    fees: 'Finances & Frais',
    timetable: 'Emploi du temps',
    calendar: 'Calendrier',
    assignments: 'Devoirs',
    announcements: 'Annonces',
    operations: 'Opérations',
    discipline: 'Discipline',
    health: 'Infirmerie & Santé',
    library: 'Bibliothèque',
    inventory: 'Inventaire',
    transport: 'Transport',
    hr: 'RH & Congés',
    analytics: 'Analytique',
    documents: 'Coffre-fort Documents',
    billing: 'Facturation & Plans',
    settings: 'Paramètres',
    logout: 'Déconnexion',
    search: 'Rechercher...',
    active: 'Actif',
    suspended: 'Suspendu',
    save: 'Enregistrer',
    cancel: 'Annuler',
    exportCsv: 'Exporter CSV',
    overview: 'Aperçu',
    totalStudents: 'Total Élèves',
    feeCollection: 'Recouvrement',
    upgrade: 'Changer de forfait',
    currentPlan: 'Forfait actuel',
  },
  ak: {
    dashboard: 'Ahyɛase Beae',
    students: 'Asukuufoɔ',
    teachers: 'Akyerɛkyerɛfoɔ',
    parents: 'Awofoɔ',
    academics: 'Nwomasua',
    attendance: 'Kɔ-kɔ',
    results: 'Sɔhwɛ Nsunsuansoɔ',
    reportCards: 'Krataa Kɛseɛ',
    fees: 'Sika & Sukuu Ka',
    timetable: 'Nnwuma Nhyehyɛe',
    calendar: 'Dapɔn',
    assignments: 'Nnwuma a Wɔde Ma',
    announcements: 'Nkaebɔ',
    operations: 'Dwumadie Nyinaa',
    discipline: 'Atenka & Asobɔ',
    health: 'Ayaresabea & Apɔmuden',
    library: 'Nwomakorabea',
    inventory: 'Agyapadeɛ',
    transport: 'Kwantuo',
    hr: 'Adwumayɛfoɔ & Agyinatuo',
    analytics: 'Nkontabuo Nhwehwɛmu',
    documents: 'Nkrataa Siebea',
    billing: 'Tua Sika & Nhyehyɛe',
    settings: 'Nsiesiee',
    logout: 'Pue Firi Mu',
    search: 'Hwehwɛ...',
    active: 'Ɛreyɛ Adwuma',
    suspended: 'Wɔagyae Kakra',
    save: 'Sie Nsakraeɛ',
    cancel: 'Gyae Mu',
    exportCsv: 'Fa Kɔ CSV',
    overview: 'Nsunsuansoɔ Nyinaa',
    totalStudents: 'Asukuufoɔ Dodoɔ',
    feeCollection: 'Sukuu Ka a Yɛagye',
    upgrade: 'Kɔ Nhyehyɛe Foforɔ So',
    currentPlan: 'Wo Mprɛmprɛn Nhyehyɛe',
  },
};

interface I18nState {
  currentLanguage: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

export const useI18n = create<I18nState>((set, get) => ({
  currentLanguage: 'en',
  setLanguage: (lang: Language) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('sms_language', lang);
    }
    set({ currentLanguage: lang });
  },
  t: (key: string) => {
    const lang = get().currentLanguage;
    return translations[lang]?.[key] || translations['en']?.[key] || key;
  },
}));

// Safe client initializer
export const initLanguagePreference = () => {
  if (typeof window === 'undefined') return;
  const saved = localStorage.getItem('sms_language') as Language;
  if (saved && (saved === 'en' || saved === 'fr' || saved === 'ak')) {
    useI18n.getState().setLanguage(saved);
  }
};
