import { categoriesObject } from '../database/categories';

export function getCategoryNameById(id: number): string | undefined {
  const category = categoriesObject.find(
    (categoryObject) => categoryObject.id === id,
  );
  return category?.name;
}
