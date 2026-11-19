import {Confession} from '../types';
import {generateUniqueAvatar} from '../utils/avatarGenerator';

export const HOTLINKED_LOGO_URL =
  'https://lh3.googleusercontent.com/aida/ALJJyrAWkSvEOJTeU96AjyU4JHEKRkKdfD1ghBUsYxlbXJonBM8xGxFXLLvLmC2GxO2nWrM61Zry7tWycn44QSDY6tKgwI4MFQdvK8pl4GYbllG2A4yp2v39Rxvv-vXI0rEkrDycWNiaMdCeGdHnQ7fg2LD49Db2BGdw3dQhayuTrnJ9XhoiA4dZAn_Fm0vW5pP5CWCvo0ykGLunBnp0UTUGXPdHsl2uP9m1Ksh1Mzmq8_hT';

export const STORY_CATEGORIES = [
  'Clientes',
  'Pagos y precios',
  'Equipo y socios',
  'Ventas',
  'Día a día',
] as const;

export const BUSINESS_TYPES = [
  'Tienda / Comercio',
  'Freelance / Servicios',
  'Agencia / Marketing',
  'Software / Tecnología',
  'Restaurante / Cafetería',
  'Clínica / Estética',
  'Otro negocio',
];

export const INITIAL_CONFESSIONS: Confession[] = [
  {
    id: 'story-1',
    category: 'Clientes',
    businessType: 'Agencia / Marketing',
    timeAgo: 'Hace 15 min',
    createdAt: Date.now() - 15 * 60 * 1000,
    body: 'Llevo 3 meses gestionándole las redes a una clínica dental que me paga 150€ al mes. Me llamó el domingo a las 2 de la madrugada enfadado porque el vídeo de baile de su sobrino de 14 años en TikTok tuvo más visitas que la campaña de implantes dentales.',
    reactions: [
      {emoji: '💀', count: 412},
      {emoji: '🤡', count: 198},
      {emoji: '🫂', count: 145},
      {emoji: '🔥', count: 84},
    ],
    comments: [
      {
        id: 'c-101',
        avatar: generateUniqueAvatar('seed-c-101'),
        timeAgo: 'Hace 8 min',
        text: 'Los clientes que pagan 150€ siempre exigen trato de cuenta de 15.000€. Es ley universal.',
      },
      {
        id: 'c-102',
        avatar: generateUniqueAvatar('seed-c-102'),
        timeAgo: 'Hace 3 min',
        text: 'Dile que contrate al sobrino y duerme tranquilo los domingos.',
      },
    ],
  },
  {
    id: 'story-2',
    category: 'Día a día',
    businessType: 'Software / Tecnología',
    timeAgo: 'Hace 42 min',
    createdAt: Date.now() - 42 * 60 * 1000,
    body: 'Durante la demostración en directo delante de 8 directivos se nos cayó el sistema por completo. Fingí que mi perro acababa de desconectar el cable de internet, me tiré al suelo haciendo ruidos como si lo persiguiera y pedí mover la reunión al lunes. Nos firmaron el contrato diciendo que les encantó lo "cercano y familiar" que soy.',
    reactions: [
      {emoji: '🔥', count: 620},
      {emoji: '🤡', count: 310},
      {emoji: '💀', count: 275},
      {emoji: '🫂', count: 52},
    ],
    comments: [
      {
        id: 'c-103',
        avatar: generateUniqueAvatar('seed-c-103'),
        timeAgo: 'Hace 20 min',
        text: 'Premio al mejor actor del año. Me lo apunto para cuando falle la web.',
      },
    ],
  },
  {
    id: 'story-3',
    category: 'Pagos y precios',
    businessType: 'Tienda / Comercio',
    timeAgo: 'Hace 2 h',
    createdAt: Date.now() - 2 * 60 * 60 * 1000,
    body: 'Un cliente nos encargó 60 cajas personalizadas para un evento corporativo, nos hizo cambiar el color 4 veces a última hora y cuando fuimos a entregarlas dijo que "no le gustaba la vibra" y que solo nos pagaba la mitad si no queríamos que dejara una reseña de 1 estrella en Google.',
    reactions: [
      {emoji: '💀', count: 540},
      {emoji: '💸', count: 388},
      {emoji: '🫂', count: 290},
      {emoji: '🔥', count: 92},
    ],
    comments: [
      {
        id: 'c-104',
        avatar: generateUniqueAvatar('seed-c-104'),
        timeAgo: 'Hace 1 h',
        text: 'Por eso ahora cobro el 70% por adelantado antes de encender la máquina. Qué rabia da esa gente.',
      },
    ],
  },
  {
    id: 'story-4',
    category: 'Día a día',
    businessType: 'Freelance / Servicios',
    timeAgo: 'Hace 3 h',
    createdAt: Date.now() - 3 * 60 * 60 * 1000,
    body: 'Envié por error a un cliente el correo interno donde me quejaba de que sus correcciones no tenían sentido. Me quedé helado 10 minutos mirando la pantalla. Al final me respondió: "Tienes razón, me estoy liando solo, hazlo como tú veas". Todavía no me lo creo.',
    reactions: [
      {emoji: '🔥', count: 780},
      {emoji: '🫂', count: 210},
      {emoji: '💀', count: 164},
      {emoji: '🤡', count: 45},
    ],
    comments: [],
  },
  {
    id: 'story-5',
    category: 'Clientes',
    businessType: 'Restaurante / Cafetería',
    timeAgo: 'Hace 5 h',
    createdAt: Date.now() - 5 * 60 * 60 * 1000,
    body: 'Una mesa de 10 personas se comió absolutamente todo hasta dejar los platos limpios, se sacaron fotos brindando y cuando trajimos la cuenta dijeron que la comida estaba "incomible" y que o les invitábamos o llamaban a inspección. Menos mal que teníamos cámaras y vieron que no dejaron ni una miga.',
    reactions: [
      {emoji: '💀', count: 890},
      {emoji: '🔥', count: 412},
      {emoji: '🫂', count: 320},
      {emoji: '💸', count: 140},
    ],
    comments: [
      {
        id: 'c-105',
        avatar: generateUniqueAvatar('seed-c-105'),
        timeAgo: 'Hace 4 h',
        text: 'La hostelería debería convalidar años de terapia gratis.',
      },
    ],
  },
  {
    id: 'story-6',
    category: 'Equipo y socios',
    businessType: 'Tienda / Comercio',
    timeAgo: 'Hace 6 h',
    createdAt: Date.now() - 6 * 60 * 60 * 1000,
    body: 'Mi socio dice en entrevistas y en Instagram que trabaja 16 horas al día "cerrando alianzas estratégicas". Ayer entré a la oficina de atrás sin avisar y estaba jugando videojuegos con auriculares mientras yo llevaba 4 horas empaquetando 300 pedidos solo.',
    reactions: [
      {emoji: '🫂', count: 520},
      {emoji: '💀', count: 430},
      {emoji: '💸', count: 210},
      {emoji: '🤡', count: 185},
    ],
    comments: [],
  },
];

export const EXTRA_CONFESSIONS: Confession[] = [
  {
    id: 'story-extra-1',
    category: 'Ventas',
    businessType: 'Freelance / Servicios',
    timeAgo: 'Hace 8 h',
    createdAt: Date.now() - 8 * 60 * 60 * 1000,
    body: 'Pasé un presupuesto infladísimo a un cliente pesado pensando que así diría que no y me libraría de él sin ser maleducado. Me respondió en 5 minutos: "Perfecto, mándame la factura". Ahora tengo que hacer el trabajo, pero al menos cobro el triple.',
    reactions: [
      {emoji: '🔥', count: 940},
      {emoji: '💸', count: 510},
      {emoji: '🤡', count: 120},
    ],
    comments: [
      {
        id: 'c-106',
        avatar: generateUniqueAvatar('seed-c-106'),
        timeAgo: 'Hace 6 h',
        text: 'El famoso "presupuesto espanta-clientes" que acaba saliendo bien.',
      },
    ],
  },
  {
    id: 'story-extra-2',
    category: 'Clientes',
    businessType: 'Clínica / Estética',
    timeAgo: 'Hace 10 h',
    createdAt: Date.now() - 10 * 60 * 60 * 1000,
    body: 'Una clienta vino sin cita un sábado a hora punta exigiendo que la atendiéramos antes que a nadie porque "ella siempre recomienda el sitio". Tenía 3 reseñas puestas en su vida y eran todas de 1 estrella en gasolineras.',
    reactions: [
      {emoji: '💀', count: 615},
      {emoji: '🤡', count: 390},
      {emoji: '🫂', count: 180},
    ],
    comments: [],
  },
];
