import { formatRelative } from 'date-fns';

type Properties = {
  date: Date | string;
  relativeTo?: Date;
};

export function RelativeTime({ date, relativeTo }: Properties) {
  if (!date) {
    return;
  }

  const dateToUse = relativeTo ? new Date(relativeTo) : new Date();
  const dateAsDate = typeof date === 'string' ? new Date(date) : date;
  const formattedDate = formatRelative(dateToUse, dateAsDate);

  return <span title={dateAsDate.toLocaleString()}>{formattedDate}</span>;
}
