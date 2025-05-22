import { Code } from '@mantine/core';

type Properties = {
  code: string;
  language: string;
};

export const CodeHighlight = ({ code }: Properties) => {
  return <Code block>{code}</Code>;
};
