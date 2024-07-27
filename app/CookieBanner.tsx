'use client';

import './CookieBanner.scss';
import { useEffect, useState } from 'react';
import { parseJson } from '../util/json';
import { getLocalStorage, setLocalStorage } from '../util/localStorage';

export default function CookieBanner() {
  const [areCookiesAccepted, setAreCookiesAccepted] = useState(false);

  // // In case you are using state variables with multiple different
  // // possible types
  // const [areCookiesAccepted, setAreCookiesAccepted] = useState<
  //   boolean | string
  // >(false);

  useEffect(() => {
    const localStorageValue = getLocalStorage('cookiePolicy');

    if (localStorageValue) {
      setAreCookiesAccepted(parseJson(localStorageValue));
      // // Another way: Convert string to boolean
      // setAreCookiesAccepted(Boolean(localStorageValue));
    } else {
      setAreCookiesAccepted(false);
    }
  }, []);

  return (
    <div className={`cookieBanner ${areCookiesAccepted ? 'closed' : 'open'}`}>
      <div>
        This website uses cookies to create better performance and experience
        for users. Do you accept the use of Cookies?
      </div>
      <button
        className="button"
        onClick={() => {
          setAreCookiesAccepted(true);
          setLocalStorage('cookiePolicy', JSON.stringify(true));
        }}
      >
        Accept
      </button>
    </div>
  );
}
