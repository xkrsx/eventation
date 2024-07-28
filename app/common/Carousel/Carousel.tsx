'use client';

import { EmblaOptionsType } from 'embla-carousel';
import Autoplay from 'embla-carousel-autoplay';
import Fade from 'embla-carousel-fade';
import useEmblaCarousel from 'embla-carousel-react';
import Link from 'next/link';
import React from 'react';
import { categoriesObject } from '../../../database/categories';
import {
  NextButton,
  PrevButton,
  usePrevNextButtons,
} from './CarouselArrowButtons';

type Props = {
  options?: EmblaOptionsType;
};

export default function Carousel(props: Props) {
  const { options } = props;
  const [emblaRef, emblaApi] = useEmblaCarousel(options, [Fade(), Autoplay()]);

  const categories = categoriesObject;

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaApi);

  return (
    <div className="embla">
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">
          {categories.map((category) => (
            <div className="embla__slide" key={`id-${category.id}`}>
              <Link href={`/categories/${category.id}`}>
                <img
                  className="embla__slide__img"
                  src={category.url}
                  alt={category.name}
                />
                <div className="name-holder">{category.name}</div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      <div className="embla__controls">
        <div className="embla__buttons">
          <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
          <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
        </div>
      </div>
    </div>
  );
}
