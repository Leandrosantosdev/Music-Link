/**
 * Configuração central de links e dados do Perfil
 * Fácil de manter, atualizar e adicionar novos links de afiliados ou redes sociais.
 * Substitua os dados abaixo pelos seus próprios dados ou configure o Supabase para sincronizar na nuvem.
 */

export const profileData = {
  name: "Alex Silva", // Substitua pelo seu nome ou nome artístico
  handle: "@alexdrummer", // Substitua pelo seu @ ou arroba principal
  role: "Drummer • Covers & Equipamentos",
  bio: "Baterista, músico e criador de conteúdo. Confira abaixo meus canais oficiais, projetos musicais e os equipamentos que utilizo!",
  location: "Brasil",
  verified: true,
  avatarUrl: "/profile.jpg",
  websiteUrl: "/",
  socialLinks: {
    youtube: "https://www.youtube.com/@seucanal",
    instagram: "https://www.instagram.com/seuperfil",
    tiktok: "https://www.tiktok.com/@seuperfil",
  }
};

export const categories = [
  { id: "all", label: "Todos os Links", icon: "LayoutGrid" },
  { id: "shopee", label: "Equipamentos & Lojas", icon: "ShoppingBag" },
  { id: "social", label: "Redes Oficiais", icon: "Share2" },
];

export const linksList = [
  // === REDES SOCIAIS OFICIAIS ===
  {
    id: "youtube",
    title: "Canal no YouTube",
    subtitle: "Drum covers completos em 4K/60fps, tutoriais e análises de timbres",
    url: "https://www.youtube.com/@seucanal", // Substitua pelo seu link do YouTube
    category: "social",
    icon: "Youtube",
    platform: "youtube",
    badge: "Canal Oficial",
    featured: true,
    highlightColor: "#FF0000",
  },
  {
    id: "instagram",
    title: "Instagram Oficial",
    subtitle: "Bastidores, rotina de estudos, stories e novidades diárias",
    url: "https://www.instagram.com/seuperfil", // Substitua pelo seu link do Instagram
    category: "social",
    icon: "Instagram",
    platform: "instagram",
    badge: "Perfil Oficial",
    featured: true,
    highlightColor: "#E1306C",
  },
  {
    id: "tiktok",
    title: "TikTok Oficial",
    subtitle: "Vídeos curtos, grooves rápidos, virais e recortes dinâmicos",
    url: "https://www.tiktok.com/@seuperfil", // Substitua pelo seu link do TikTok
    category: "social",
    icon: "Video",
    platform: "tiktok",
    badge: "Em Alta",
    highlightColor: "#00F2FE",
  },

  // === EQUIPAMENTOS E AFILIADOS (SHOPEE / AMAZON / MERCADO LIVRE) ===
  {
    id: "shopee-fone",
    title: "Fone de Retorno Intra-auricular",
    subtitle: "Excelente isolamento acústico e definição para tocar ao vivo e ensaiar",
    url: "https://shopee.com.br", // Substitua pelo seu link de afiliado
    category: "shopee",
    icon: "Headphones",
    platform: "shopee",
    badge: "Mais Vendido",
    tag: "Shopee",
    highlightColor: "#EE4D2D",
  },
  {
    id: "shopee-baquetas",
    title: "Baquetas Profissionais 5A",
    subtitle: "Pegada equilibrada, durabilidade extrema e rimshot encorpado",
    url: "https://shopee.com.br", // Substitua pelo seu link de afiliado
    category: "shopee",
    icon: "Wand2",
    platform: "shopee",
    badge: "Setup Recomendado",
    tag: "Shopee",
    highlightColor: "#EE4D2D",
  },
  {
    id: "shopee-pad",
    title: "Pad de Estudo Silencioso",
    subtitle: "Pratique rudimentos e velocidade em casa sem incomodar vizinhos",
    url: "https://shopee.com.br", // Substitua pelo seu link de afiliado
    category: "shopee",
    icon: "Disc",
    platform: "shopee",
    badge: "Essencial",
    tag: "Shopee",
    highlightColor: "#EE4D2D",
  },
  {
    id: "shopee-moongel",
    title: "Géis Abafadores de Pele (Moongel)",
    subtitle: "Controle sobretons indesejados e ganhe foco no timbre da caixa e tons",
    url: "https://shopee.com.br", // Substitua pelo seu link de afiliado
    category: "shopee",
    icon: "Sliders",
    platform: "shopee",
    badge: "Top Timbre",
    tag: "Shopee",
    highlightColor: "#EE4D2D",
  },
  {
    id: "shopee-clamp",
    title: "Garra & Suporte para Gravar no Celular",
    subtitle: "Prenda no aro da bateria ou no prato para os melhores ângulos de vídeo",
    url: "https://shopee.com.br", // Substitua pelo seu link de afiliado
    category: "shopee",
    icon: "Camera",
    platform: "shopee",
    badge: "Gravação",
    tag: "Shopee",
    highlightColor: "#EE4D2D",
  },
];
