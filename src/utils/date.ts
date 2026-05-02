import moment from 'moment';

export const now = () => {
  return moment();
};

export const formatTime = (
  time: any,
  format: string,
  {
    fb = '',
    locale = 'id',
  }: {
    fb?: string;
    locale?: string;
  } = {}
) => {
  if (!time) return fb;
  return moment(time).locale(locale).format(format);
};

export const fromNow = (
  time: any,
  {
    fb = '',
    locale = 'id',
  }: {
    fb?: string;
    locale?: string;
  } = {}
) => {
  if (!time) return fb;
  return moment(time).locale(locale).fromNow();
};

export const toDate = (
  time?: any,
  {
    fb,
    locale = 'id',
  }: {
    fb?: Date;
    locale?: string;
  } = {}
) => {
  if (!time) return fb;
  return moment(time).locale(locale).toDate();
};

export const setTimeInDate = (date: any, time: string): moment.Moment => {
  const [h, m] = time.split(':').map(Number);
  if (Number.isNaN(h) || Number.isNaN(m) || h < 0 || h > 23 || m < 0 || m > 59)
    return moment(date);
  return moment(date).hour(h).minute(m).second(0).millisecond(0);
};
