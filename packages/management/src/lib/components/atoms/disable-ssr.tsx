import dynamic from 'next/dynamic';
import { FunctionComponent } from 'react';

export const disableSSR = <P extends object>(Component: FunctionComponent<P>) =>
  dynamic(() => Promise.resolve(Component), { ssr: false });
