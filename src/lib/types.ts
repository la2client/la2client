export interface Server {
  id: string;
  name: string;
  url: string;
  rate: string;
  chronicle: string;
  openingDate: string;
  isVip: boolean;
  createdAt: string;
}

export interface WallpaperData {
  url: string;
  linkUrl?: string;
  validUntil?: string;
  uploadedAt: string;
}

export interface BannerData {
  url: string;
  linkUrl?: string;
  validUntil?: string;
  uploadedAt: string;
}

export const RATES = [
    'x1',
    'x3',
    'x5',
    'x7',
    'x10',
    'x50',
    'x100',
    'x1000',
    'x1200',
    'x10000',
    'x50000',
    'x100000'
];

export const CHRONICLES = [
    'Interlude',
    'High Five',
    'Essence',
    'Interlude+',
    'Classic',
    'C4',
    'C6',
    'Final',
    'Epilogue',
    'GoD',
    'Salvation',
    'C5',
    'Freya',
    'Ertheia',
    'Helios',
    'Orfen',
    'Fafurion',
    'Homunculus',
    'C3',
    'G.Crusade',
    'Lindvior',
    'Odyssey'
];