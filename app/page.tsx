import './page.scss';
import './common/Carousel/EmblaCarousel.scss';
import { EmblaOptionsType } from 'embla-carousel';
// import Image from 'next/image';
import Link from 'next/link';
import EmblaCarousel from './common/Carousel/EmblaCarousel';

// import imageUrl from '../public/images/categories/music.webp';

const OPTIONS: EmblaOptionsType = { loop: true, duration: 40 };
const SLIDE_COUNT = 17;
const SLIDES = Array.from(Array(SLIDE_COUNT).keys());

export default function HomePage() {
  return (
    <div className="home-wrapper">
      <h1>We are here for everyone</h1>

      <div className="home-banner">
        {/* <Image
            className="category-banner"
            src="/images/categories/music.webp"
            alt="Music category"
            fill={true}
          /> */}

        <EmblaCarousel slides={SLIDES} options={OPTIONS} />
      </div>
      <Link className="system-link" href="/categories">
        Browse all categories
      </Link>
    </div>
  );
}
