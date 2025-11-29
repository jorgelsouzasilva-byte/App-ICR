export enum NavItem {
  HOME = 'Início',
  BIBLE_STUDIES = 'Estudos',
  EVENTS = 'Eventos',
  CONTRIBUTIONS = 'Doar',
  LIVE_STREAM = 'Ao Vivo',
  PROFILE = 'Perfil',
  GROUPS = 'Grupos',
  ADMIN = 'Admin',
}

export interface User {
  id: string; // Stays as string because it's a UUID from auth.users
  name: string;
  email: string;
  phone: string;
  group: string;
  memberSince: string;
  avatar: string;
  role: 'user' | 'admin';
}

export interface StudyDay {
  day: number;
  title: string;
  content: string;
  scriptureReference?: string;
}

export interface BibleStudy {
  id?: number; // Corrected to number (from bigint) and made optional
  title: string;
  coverImage: string;
  description: string;
  content: string; // General overview
  days?: StudyDay[]; // Daily steps
  author: string;
  duration: string;
  category: 'Novo Testamento' | 'Velho Testamento' | 'Temáticos' | 'Família' | 'Jovens';
}

export interface CalendarEvent {
  id?: number; // Corrected to number (from bigint) and made optional
  title: string;
  date: Date;
  location: string;
  type: 'Culto' | 'Social' | 'Ação Social' | 'Estudo';
  coverImage: string;
  description: string;
}

export interface Transaction {
  id: number; // Corrected to number (from bigint)
  date: string;
  amount: number;
  type: 'Dízimo' | 'Oferta' | 'Missões' | 'Construção';
  status: 'Concluído' | 'Pendente';
}

export interface LiveStreamItem {
  id: number; // Corrected to number (from bigint)
  title: string;
  date: string; // Display string
  dateObj?: Date; // For sorting/grouping
  thumbnail: string;
  isLive: boolean;
  views?: number;
  category: 'Culto' | 'Estudo' | 'Louvor' | 'Evento Especial';
  duration?: string;
}

export interface SmallGroup {
  id: number; // Corrected to number (from bigint)
  name: string;
  leader: string;
  address: string;
  day: string;
  time: string;
  image: string;
  neighborhood: string;
}