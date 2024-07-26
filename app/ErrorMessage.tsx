import './ErrorMessage.scss';
import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export default function ErrorMessage(props: Props) {
  return <div className="errorMessage">{props.children}</div>;
}
