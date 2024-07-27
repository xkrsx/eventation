import './page.scss';
import Image from 'next/image';

export default function HomePage() {
  return (
    <div className="home-wrapper">
      <h1>We are here for everyone</h1>
      <div className="home-banner">
        <Image
          className="category-banner"
          src="/images/categories/music.webp"
          alt="Music category"
          fill={true}
        />
      </div>
    </div>
  );
}
