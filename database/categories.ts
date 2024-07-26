export type Category = {
  id: number;
  name: string;
};

export const categoriesObject = [
  { id: 1, name: 'Activism / Politics' },
  { id: 2, name: 'Art / Performance' },
  { id: 3, name: 'Business' },
  { id: 4, name: 'Charity' },
  { id: 5, name: 'Community' },
  { id: 6, name: 'Dating' },
  { id: 7, name: 'Fashion / Trends' },
  { id: 8, name: 'Film / Books / Media' },
  { id: 9, name: 'Food / Drink / Diet' },
  { id: 10, name: 'Health / Science / Education' },
  { id: 11, name: 'Hobby / Collections' },
  { id: 12, name: 'Kids / Family' },
  { id: 13, name: 'Music / Concerts / Festivals' },
  { id: 14, name: 'Party / Night Life' },
  { id: 15, name: 'Religion / Spirituality' },
  { id: 16, name: 'Sport / Activity' },
  { id: 17, name: 'Travel / Holidays' },
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
