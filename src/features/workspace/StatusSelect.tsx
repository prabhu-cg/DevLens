import { Select } from '../../components/ui';
import type { DocStatus } from '../../domain/documentation';

const options = [
  { label: 'Not started', value: 'not_started' },
  { label: 'In progress', value: 'in_progress' },
  { label: 'Documented', value: 'documented' },
];

export interface StatusSelectProps {
  status: DocStatus;
  onChange: (status: DocStatus) => void;
}

export function StatusSelect({ status, onChange }: StatusSelectProps) {
  return (
    <Select
      label="Status"
      options={options}
      value={status}
      onValueChange={(value) => onChange(value as DocStatus)}
    />
  );
}
