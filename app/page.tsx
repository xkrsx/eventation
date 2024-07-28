import './page.scss';
import Image from 'next/image';
import Link from 'next/link';

// import imageUrl from '../public/images/categories/music.webp';

export default function HomePage() {
  return (
    <div className="home-wrapper">
      <h1>We are here for everyone</h1>
      <Link className="system-link" href="/categories">
        <div className="home-banner">
          <Image
            className="category-banner"
            src="/images/categories/music.webp"
            alt="Music category"
            fill={true}
          />
        </div>
        <p>Browse all categories</p>
      </Link>
    </div>
  );
}
