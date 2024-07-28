export type Category = {
  id: number;
  name: string;
};

export const categoriesObject = [
  {
    id: 1,
    name: 'Activism / Politics',
    url: '/images/categories/1.webp',
    author: 'pexels/vincent-ma-janssen',
  },
  {
    id: 2,
    name: 'Art / Performance',
    url: '/images/categories/2.webp',
    author: 'pexels/joseph-phillips',
  },
  {
    id: 3,
    name: 'Business',
    url: '/images/categories/3.webp',
    author: 'pexels/julian-v',
  },
  {
    id: 4,
    name: 'Charity',
    url: '/images/categories/4.webp',
    author: 'pexels/rdne',
  },
  {
    id: 5,
    name: 'Community',
    url: '/images/categories/5.webp',
    author: 'pexels/diohasbi',
  },
  {
    id: 6,
    name: 'Dating',
    url: '/images/categories/6.webp',
    author: 'pexels/cottonbro',
  },
  {
    id: 7,
    name: 'Fashion / Trends',
    url: '/images/categories/7.webp',
    author: 'pexels/karolina-grabowska',
  },
  {
    id: 8,
    name: 'Film / Books / Media',
    url: '/images/categories/8.webp',
    author: 'pexels/donghuangmingde',
  },
  {
    id: 9,
    name: 'Food / Drink / Diet',
    url: '/images/categories/9.webp',
    author: 'pexels/james-frid',
  },
  {
    id: 10,
    name: 'Health / Science / Education',
    url: '/images/categories/10.webp',
    author: 'pexels/icsa',
  },
  {
    id: 11,
    name: 'Hobby / Collections',
    url: '/images/categories/11.webp',
    author: 'pexels/steve',
  },
  {
    id: 12,
    name: 'Kids / Family',
    url: '/images/categories/12.webp',
    author: 'pexels/goumbik',
  },
  {
    id: 13,
    name: 'Music / Concerts / Festivals',
    url: '/images/categories/13.webp',
    author: 'pexels/vishnurnair',
  },
  {
    id: 14,
    name: 'Party / Night Life',
    url: '/images/categories/14.webp',
    author: 'pexels/maumascaro',
  },
  {
    id: 15,
    name: 'Religion / Spirituality',
    url: '/images/categories/15.webp',
    author: 'pexels/rodolfoclix',
  },
  {
    id: 16,
    name: 'Sport / Activity',
    url: '/images/categories/16.webp',
    author: 'pexels/runffwpu',
  },
  {
    id: 17,
    name: 'Travel / Holidays',
    url: '/images/categories/17.webp',
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
