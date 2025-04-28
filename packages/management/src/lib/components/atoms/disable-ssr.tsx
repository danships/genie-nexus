import dynamic from 'next/dynamic';
import { FunctionComponent } from 'react';

export const disableSSR = (Component: FunctionComponent) =>
  dynamic(() => Promise.resolve(Component), { ssr: false });
