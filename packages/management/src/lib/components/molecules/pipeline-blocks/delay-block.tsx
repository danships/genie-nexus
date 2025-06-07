import { NumberInput } from '@mantine/core';

export function DelayBlock({
  action,
  onChange,
}: {
  action: { type: 'delay'; ms: number };
  onChange: (a: { type: 'delay'; ms: number }) => void;
}) {
  return (
    <NumberInput
      label="Delay (ms)"
      value={action.ms}
      min={0}
      onChange={(v) => onChange({ ...action, ms: Number(v) })}
    />
  );
}
