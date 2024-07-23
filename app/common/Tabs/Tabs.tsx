import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const Tabs = ({ children }) => {
  const [active, setActive] = useState(0);
  const router = useRouter();
  const { tab } = router.query;

  useEffect(() => {
    if (!tab) return;

    const index = children.map((child) => child.key).indexOf(tab);

    if (index < 0) return;

    setActive(index);
  }, [router.query]);

  const handleClick = (e, index, cb = () => {}) => {
    e.preventDefault();

    router.push({ query: { ...router.query, tab: index } });
    setActive(index);
    cb && cb();
  };

  return (
    <div className="tabs">
      <div className="tabs__navigation">
        {children.map((child, index) => (
          <a
            href="#"
            className={`tabs__navigation__item ${index === active ? 'active' : ''}`}
            key={`tab-${index}`}
            onClick={(e) => handleClick(e, child.key, child.props.onClick)}
          >
            {child.props.title}
          </a>
        ))}
      </div>
      <div className="tabs__body">{children[active]}</div>
    </div>
  );
};

export default Tabs;
