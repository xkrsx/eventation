import Link from 'next/link';
import { categoriesObject } from '../../database/categories';

export default function Categories() {
  const categories = categoriesObject;
  return (
    <div className="wrapper">
      <div className="categories">
        <h1>Browse all categories</h1>
        <div className="list">
          {categories.map((category) => {
            return (
              <Link
                key={`id-${category.id}`}
                href={`/categories/${category.id}`}
              >
                <div
                  style={{
                    height: '50px',
                    width: '150px',
                    border: '1px solid black',
                    lineHeight: '50px',
                    textAlign: 'center',
                  }}
                >
                  {category.name}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
