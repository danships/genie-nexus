import { formatRelative } from 'date-fns';
import { disableSSR } from './disable-ssr';

type Properties = {
  date: Date | string;
  relativeTo?: Date;
};

function parseDate(date: Date | string) {
  if (typeof date === 'string') {
    return new Date(date);
  }
  return date;
}

function RelativeTimeComponent({ date, relativeTo = new Date() }: Properties) {
  if (!date) {
    return;
  }

  const dateToCompareTo = parseDate(relativeTo);
  const dateAsDate = parseDate(date);
  const formattedDate = formatRelative(dateAsDate, dateToCompareTo);

  return <span title={dateAsDate.toLocaleString()}>{formattedDate}</span>;
}

export const RelativeTime = disableSSR(RelativeTimeComponent);
