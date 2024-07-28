import './page.scss';
import Image from 'next/image';
import Link from 'next/link';
import { categoriesObject } from '../../database/categories';

export default function Categories() {
  const categories = categoriesObject;
  return (
    <div className="wrapper">
      <h1>Browse all categories</h1>
      <div className="categories">
        {categories.map((category) => {
          return (
            <Link key={`id-${category.id}`} href={`/categories/${category.id}`}>
              <div className="category">
                <Image src={category.url} alt={category.name} fill />
                <div className="name-holder">
                  <div className="category-name">{category.name}</div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
