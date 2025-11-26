import { BibleStudy, CalendarEvent, Transaction, LiveStreamItem, SmallGroup } from './types';

export const MOCK_STUDIES: BibleStudy[] = [
  {
    id: '1',
    title: 'Livro de João',
    coverImage: 'https://picsum.photos/400/600?random=1',
    description: 'Explore a vida de Jesus através dos olhos do discípulo amado.',
    content: 'Nesta sessão, exploramos o prólogo de João, entendendo o logos e a luz que brilha nas trevas. Discutiremos o significado das declarações "EU SOU" e sua conexão com o Antigo Testamento.',
    days: [
        { day: 1, title: 'O Verbo se fez carne', content: 'No princípio era o Verbo...', scriptureReference: 'João 1:1-14' },
        { day: 2, title: 'Cordeiro de Deus', content: 'Eis o Cordeiro de Deus que tira o pecado do mundo.', scriptureReference: 'João 1:29' }
    ],
    author: 'Pr. Miguel',
    duration: '6 Semanas',
    category: 'Novo Testamento'
  },
  {
    id: '2',
    title: 'Os Salmos',
    coverImage: 'https://picsum.photos/400/600?random=2',
    description: 'Encontrando conforto e força nas canções de Davi.',
    content: 'Os Salmos fornecem uma voz para nossas emoções mais profundas. Do lamento ao louvor, aprendemos como trazer todo o nosso ser diante de Deus.',
    days: [],
    author: 'Sarah Jenkins',
    duration: '4 Semanas',
    category: 'Velho Testamento'
  },
  {
    id: '3',
    title: 'Caminho de Romanos',
    coverImage: 'https://picsum.photos/400/600?random=3',
    description: 'Entendendo a salvação através da carta de Paulo aos Romanos.',
    content: 'Um mergulho teológico na justificação pela fé. Vamos percorrer o "Caminho de Romanos" para entender a mecânica da graça.',
    days: [],
    author: 'Dr. Evans',
    duration: '8 Semanas',
    category: 'Novo Testamento'
  },
  {
    id: '4',
    title: 'Fé & Trabalho',
    coverImage: 'https://picsum.photos/400/600?random=4',
    description: 'Como levar sua fé para o ambiente de trabalho.',
    content: 'Trabalho é adoração. Este estudo desafia a divisão secular/sagrado e equipa você para ser luz em sua vida profissional.',
    days: [],
    author: 'Pr. Miguel',
    duration: '3 Semanas',
    category: 'Temáticos'
  },
  {
    id: '5',
    title: 'Família Moderna',
    coverImage: 'https://picsum.photos/400/600?random=5',
    description: 'Construindo um lar centrado em Cristo no mundo moderno.',
    content: 'Sabedoria prática para paternidade, casamento e manutenção da disciplina espiritual dentro da unidade familiar.',
    days: [],
    author: 'Família Thompson',
    duration: '5 Semanas',
    category: 'Família'
  },
  {
    id: '6',
    title: 'Profetas Menores',
    coverImage: 'https://picsum.photos/400/600?random=6',
    description: 'Grandes mensagens dos profetas menores.',
    content: 'Muitas vezes esquecidos, esses livros contêm mensagens poderosas de justiça, misericórdia e fidelidade que são relevantes hoje.',
    days: [],
    author: 'Dr. Evans',
    duration: '12 Semanas',
    category: 'Velho Testamento'
  },
];

export const MOCK_EVENTS: CalendarEvent[] = [
  {
    id: '1',
    title: 'Culto de Domingo',
    date: new Date(new Date().setDate(new Date().getDate() + 2)), // 2 days from now
    location: 'Santuário Principal',
    type: 'Culto',
    coverImage: 'https://picsum.photos/800/600?random=20',
    description: 'Junte-se a nós para um tempo poderoso de adoração e palavra. Neste domingo, continuamos nossa série "Caminhando em Sabedoria". Berçário e Igreja Kids disponíveis para idades de 0-10 anos.'
  },
  {
    id: '2',
    title: 'Noite dos Jovens',
    date: new Date(new Date().setDate(new Date().getDate() + 4)),
    location: 'Salão Comunitário',
    type: 'Social',
    coverImage: 'https://picsum.photos/800/600?random=21',
    description: 'Uma noite de alta energia para adolescentes! Jogos, comida, música ao vivo e uma mensagem relevante. Traga um amigo!'
  },
  {
    id: '3',
    title: 'Preparação de Cestas Básicas',
    date: new Date(new Date().setDate(new Date().getDate() + 5)),
    location: 'Anexo B',
    type: 'Ação Social',
    coverImage: 'https://picsum.photos/800/600?random=22',
    description: 'Ajude-nos a embalar cestas de alimentos para nossa distribuição mensal comunitária. Precisamos de 20 voluntários.'
  },
  {
    id: '4',
    title: 'Ensaio de Louvor',
    date: new Date(new Date().setDate(new Date().getDate() + 6)),
    location: 'Palco Principal',
    type: 'Culto',
    coverImage: 'https://picsum.photos/800/600?random=23',
    description: 'Ensaio semanal para a equipe de louvor. Por favor, chegue no horário para a passagem de som.'
  }
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 't1', date: '24 Out, 2023', amount: 150.00, type: 'Dízimo', status: 'Concluído' },
  { id: 't2', date: '17 Out, 2023', amount: 50.00, type: 'Oferta', status: 'Concluído' },
  { id: 't3', date: '10 Out, 2023', amount: 200.00, type: 'Dízimo', status: 'Concluído' },
  { id: 't4', date: '28 Set, 2023', amount: 100.00, type: 'Construção', status: 'Concluído' },
  { id: 't5', date: '21 Set, 2023', amount: 150.00, type: 'Dízimo', status: 'Concluído' },
  { id: 't6', date: '15 Set, 2023', amount: 25.00, type: 'Missões', status: 'Concluído' },
  { id: 't7', date: '01 Set, 2023', amount: 150.00, type: 'Dízimo', status: 'Concluído' },
  { id: 't8', date: '24 Ago, 2023', amount: 500.00, type: 'Construção', status: 'Concluído' },
];

export const MOCK_STREAMS: LiveStreamItem[] = [
  { 
    id: 'l1', 
    title: 'Culto de Domingo: O Poder da Esperança', 
    date: 'Ao Vivo Agora', 
    dateObj: new Date(),
    thumbnail: 'https://picsum.photos/800/450?random=10', 
    isLive: true, 
    views: 124,
    category: 'Culto'
  },
  { 
    id: 'l2', 
    title: 'Estudo Bíblico de Quarta', 
    date: '25 Out • 1:00 hr', 
    dateObj: new Date('2023-10-25'),
    thumbnail: 'https://picsum.photos/800/450?random=11', 
    isLive: false, 
    views: 450,
    category: 'Estudo'
  },
  { 
    id: 'l3', 
    title: 'Melhores Momentos do Louvor', 
    date: '20 Out • 45 min', 
    dateObj: new Date('2023-10-20'),
    thumbnail: 'https://picsum.photos/800/450?random=12', 
    isLive: false, 
    views: 890,
    category: 'Louvor'
  },
  { 
    id: 'l4', 
    title: 'Entendendo a Graça', 
    date: '28 Set • 1:15 hr', 
    dateObj: new Date('2023-09-28'),
    thumbnail: 'https://picsum.photos/800/450?random=13', 
    isLive: false, 
    views: 620,
    category: 'Culto'
  },
  { 
    id: 'l5', 
    title: 'Conferência de Jovens 2023', 
    date: '15 Set • 2:00 hr', 
    dateObj: new Date('2023-09-15'),
    thumbnail: 'https://picsum.photos/800/450?random=14', 
    isLive: false, 
    views: 1024,
    category: 'Evento Especial'
  },
   { 
    id: 'l6', 
    title: 'Livro de Tiago: Parte 1', 
    date: '30 Ago • 55 min', 
    dateObj: new Date('2023-08-30'),
    thumbnail: 'https://picsum.photos/800/450?random=15', 
    isLive: false, 
    views: 340,
    category: 'Estudo'
  },
];

export const MOCK_GROUPS: SmallGroup[] = [
  {
    id: 'g1',
    name: 'GP Jardim São Marcos',
    neighborhood: 'Jd. São Marcos',
    address: 'Rua das Flores, 123 - Jardim São Marcos',
    day: 'Terça-feira',
    time: '20:00',
    leader: 'Carlos e Ana',
    image: 'https://picsum.photos/400/300?random=100'
  },
  {
    id: 'g2',
    name: 'GP Centro',
    neighborhood: 'Centro',
    address: 'Av. Paulista, 1000 - Centro',
    day: 'Quarta-feira',
    time: '19:30',
    leader: 'Pr. João',
    image: 'https://picsum.photos/400/300?random=101'
  },
  {
    id: 'g3',
    name: 'GP Jovens Universitários',
    neighborhood: 'Vila Madalena',
    address: 'Rua Harmonia, 45 - Vila Madalena',
    day: 'Sábado',
    time: '18:00',
    leader: 'Pedro e Marina',
    image: 'https://picsum.photos/400/300?random=102'
  },
  {
    id: 'g4',
    name: 'GP Mulheres de Fé',
    neighborhood: 'Morumbi',
    address: 'Rua Itapaiúna, 1800 - Morumbi',
    day: 'Quinta-feira',
    time: '15:00',
    leader: 'Pra. Lúcia',
    image: 'https://picsum.photos/400/300?random=103'
  }
];

// Admin Stats Mock Data
export const MOCK_ADMIN_STATS = {
    totalMembers: 452,
    gender: { male: 42, female: 58 }, // percentages
    ageDistribution: [
        { label: '0-12', count: 60, pct: 13 },
        { label: '13-18', count: 45, pct: 10 },
        { label: '19-30', count: 120, pct: 27 },
        { label: '31-50', count: 150, pct: 33 },
        { label: '51+', count: 77, pct: 17 }
    ],
    familyStats: {
        married: 65,
        single: 35
    },
    studyAnalytics: {
        '1': { activeUsers: 145, completed: 32 },
        '2': { activeUsers: 89, completed: 12 },
        '3': { activeUsers: 210, completed: 85 },
        '4': { activeUsers: 56, completed: 8 },
        '5': { activeUsers: 102, completed: 44 },
        '6': { activeUsers: 34, completed: 5 },
    },
    eventAnalytics: {
        '1': { registered: 230 },
        '2': { registered: 45 },
        '3': { registered: 18 },
        '4': { registered: 12 },
    }
};