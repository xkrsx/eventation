import Image from 'next/image';
import logoPic from '../../../public/images/logo-150x60.webp';
import Nav from '../Nav/Nav';

export default function Header() {
  return (
    <div className="wrapper">
      <div className="header">
        <Image src={logoPic} alt="Eventation logo" />
        <Nav />
      </div>
    </div>
  );
}
