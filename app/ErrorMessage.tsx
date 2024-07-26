'use server';

import './ErrorMessage.scss';
import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export default async function ErrorMessage(props: Props) {
  return await (<div className="errorMessage">{props.children}</div>);
}
