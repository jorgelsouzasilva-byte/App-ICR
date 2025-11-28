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
  id: string;
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
  id: string;
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
  id: string;
  title: string;
  date: Date;
  location: string;
  type: 'Culto' | 'Social' | 'Ação Social' | 'Estudo';
  coverImage: string;
  description: string;
}

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  type: 'Dízimo' | 'Oferta' | 'Missões' | 'Construção';
  status: 'Concluído' | 'Pendente';
}

export interface LiveStreamItem {
  id: string;
  title: string;
  date: string; // Display string
  dateObj?: Date; // For sorting/grouping
  thumbnail: string;
  isLive: boolean;
  views?: number;
  category: 'Culto' | 'Estudo' | 'Louvor' | 'Evento Especial';
}

export interface SmallGroup {
  id: string;
  name: string;
  leader: string;
  address: string;
  day: string;
  time: string;
  image: string;
  neighborhood: string;
}