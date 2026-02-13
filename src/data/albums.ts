export type AlbumPhoto = {
  src: string;
  alt: string;
};

export type Album = {
  id: string;
  title: string;
  cover: string;
  description: string;
  locationLabel: string;
  lat: number;
  lng: number;
  photos: AlbumPhoto[];
};

export const defaultAlbums: Album[] = [
  {
    id: 'sunset-promise',
    title: 'Sunset Promise',
    cover: '/blog-placeholder-1.jpg',
    description: 'A golden-hour walk with laughter, flowers, and warm skies.',
    locationLabel: 'Victoria Harbour, Hong Kong',
    lat: 22.2932,
    lng: 114.1722,
    photos: [
      { src: '/blog-placeholder-1.jpg', alt: 'Sunset photo 1' },
      { src: '/blog-placeholder-2.jpg', alt: 'Sunset photo 2' },
      { src: '/blog-placeholder-3.jpg', alt: 'Sunset photo 3' },
    ],
  },
  {
    id: 'city-lights',
    title: 'City Lights Date',
    cover: '/blog-placeholder-4.jpg',
    description: 'Neon reflections, hand-holding, and a cozy late-night dinner.',
    locationLabel: 'Shibuya Crossing, Tokyo',
    lat: 35.6595,
    lng: 139.7005,
    photos: [
      { src: '/blog-placeholder-4.jpg', alt: 'City lights photo 1' },
      { src: '/blog-placeholder-5.jpg', alt: 'City lights photo 2' },
      { src: '/blog-placeholder-about.jpg', alt: 'City lights photo 3' },
    ],
  },
];
