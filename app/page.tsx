import './page.scss';
import './common/Carousel/Carousel.scss';
import { EmblaOptionsType } from 'embla-carousel';
// import Image from 'next/image';
import Carousel from './common/Carousel/Carousel';

const OPTIONS: EmblaOptionsType = { loop: true, duration: 60 };
const SLIDE_COUNT = 17;
const SLIDES = Array.from(Array(SLIDE_COUNT).keys());

export default function HomePage() {
  return (
    <div className="home-wrapper">
      <h1>We are here for everyone</h1>

      <div className="home-banner">
        <Carousel options={OPTIONS} />
      </div>
      <div className="main-slogans">
        <p>celebrate your life</p>
        <p>enjoy the variety</p>
        <p>choose location</p>
        <p>add to calendar</p>
        <p>find what interest you</p>
        <p>connect with others</p>
        <p>invite & join</p>
      </div>
    </div>
  );
}
