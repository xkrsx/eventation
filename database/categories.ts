export type Category = {
  id: number;
  name: string;
};

export const categoriesObject = [
  {
    id: 1,
    name: 'Activism / Politics',
    url: '/images/categories/activism.webp',
    author: 'pexels/anete-lusina',
  },
  {
    id: 2,
    name: 'Art / Performance',
    url: '/images/categories/art.webp',
    author: 'pexels/craigmdennis',
  },
  {
    id: 3,
    name: 'Business',
    url: '/images/categories/business.webp',
    author: 'pexels/julian-v',
  },
  {
    id: 4,
    name: 'Charity',
    url: '/images/categories/charity.webp',
    author: 'pexels/rdne',
  },
  {
    id: 5,
    name: 'Community',
    url: '/images/categories/community.webp',
    author: 'pexels/diohasbi',
  },
  {
    id: 6,
    name: 'Dating',
    url: '/images/categories/dating.webp',
    author: 'pexels/cottonbro',
  },
  {
    id: 7,
    name: 'Fashion / Trends',
    url: '/images/categories/fashion.webp',
    author: 'pexels/shattha-pilabut',
  },
  {
    id: 8,
    name: 'Film / Books / Media',
    url: '/images/categories/film.webp',
    author: 'pexels/donghuangmingde',
  },
  {
    id: 9,
    name: 'Food / Drink / Diet',
    url: '/images/categories/food.webp',
    author: 'pexels/juan-c-palacios',
  },
  {
    id: 10,
    name: 'Health / Science / Education',
    url: '/images/categories/health.webp',
    author: 'pexels/icsa',
  },
  {
    id: 11,
    name: 'Hobby / Collections',
    url: '/images/categories/hobby.webp',
    author: 'pexels/steve',
  },
  {
    id: 12,
    name: 'Kids / Family',
    url: '/images/categories/kids.webp',
    author: 'pexels/goumbik',
  },
  {
    id: 13,
    name: 'Music / Concerts / Festivals',
    url: '/images/categories/music.webp',
    author: 'pexels/vishnurnair',
  },
  {
    id: 14,
    name: 'Party / Night Life',
    url: '/images/categories/party.webp',
    author: 'pexels/maumascaro',
  },
  {
    id: 15,
    name: 'Religion / Spirituality',
    url: '/images/categories/religion.webp',
    author: 'pexels/rodolfoclix',
  },
  {
    id: 16,
    name: 'Sport / Activity',
    url: '/images/categories/sport.webp',
    author: 'pexels/runffwpu',
  },
  {
    id: 17,
    name: 'Travel / Holidays',
    url: '/images/categories/travel.webp',
    author: 'pexels/sanmane',
  },
];

const categories = [
  'Activism / Politics',
  'Art / Performance',
  'Business',
  'Charity',
  'Community',
  'Dating',
  'Fashion / Trends',
  'Film / Books / Media',
  'Food / Drink / Diet',
  'Health / Science / Education',
  'Hobby / Collections',
  'Kids / Family',
  'Music / Concerts / Festivals',
  'Party / Night Life',
  'Religion / Spirituality',
  'Sport / Activity',
  'Travel / Holidays',
];

const suggestions = categories.map((name, index) => ({
  value: index,
  label: name,
}));

export { categories, suggestions };
