import './Footer.scss';
import Link from 'next/link';

export default function Footer() {
  return (
    <div className="footer">
      <div>
        <p>2024 Jakub Markiewicz</p>
        <Link href="https://github.com/xkrsx">github.com/xkrsx</Link>
      </div>
    </div>
  );
}
