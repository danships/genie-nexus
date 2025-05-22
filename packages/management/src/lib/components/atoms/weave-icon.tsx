import Image from 'next/image';

type Properties = {
  size?: number;
};

export function WeaveIcon({ size = 16 }: Properties) {
  return (
    <Image src="/icons/weave.svg" alt="Weave Icon" width={size} height={size} />
  );
}
