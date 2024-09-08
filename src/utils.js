import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { EDIT_POINT_DATE_FORMAT, POINT_DATE_FORMAT } from './const';
dayjs.extend(duration);

const getRandomInt = (min, max) => {
  const lower = Math.ceil(Math.min(min, max));
  const upper = Math.floor(Math.max(min, max));
  const result = Math.random() * (upper - lower + 1) + lower;
  return Math.floor(result);
};

const findById = (arr, id) => arr.find((element) => element.id === id);

const getRandomArrayElement = (items) => items[Math.floor(Math.random() * items.length)];

const totalOffersPrice = (offers) => offers.reduce((accumulator, currentValue) => accumulator + currentValue.price, 0);

const formatEditPointDate = (editPointDate) => editPointDate.format(EDIT_POINT_DATE_FORMAT);

const formatPointDate = (pointDate) => pointDate.format(POINT_DATE_FORMAT);

const getDurationEvent = (dateFrom, dateTo) => dayjs.duration(dateTo.diff(dateFrom));

const capitalizeFirstLetter = (str) => str.charAt(0).toUpperCase() + str.slice(1);

const getOffersByType = (offers, type) => {
  const offer = offers.filter((offerItem) => offerItem.type === type);

  return offer[0].offers;
};

const getRandomDate = () => {
  const switcher = getRandomInt(1,2);
  const dateNow = dayjs(new Date());

  switch (switcher){
    case 1:
      return dateNow.add(getRandomInt(1,4), 'hour');
    case 2:
      return dateNow.subtract(getRandomInt(1,4), 'hour');
  }
};

const isFuturePoint = (point) => dayjs().isBefore(point.dateFrom, 'minute');

const isExpiredPoint = (point) => dayjs(point.dateTo) && dayjs().isAfter(dayjs(point.dateTo), 'milliseconds');

const isActualPoint = (point) => point.dateTo && (dayjs().isSame(dayjs(point.dateFrom), 'minute') || dayjs().isAfter(dayjs(point.dateFrom), 'minute')) && (dayjs().isSame(dayjs(point.dateTo), 'minute') || dayjs().isBefore(dayjs(point.dateTo), 'minute'));


export {
  getRandomInt,
  findById,
  getRandomArrayElement,
  totalOffersPrice,
  formatEditPointDate,
  formatPointDate,
  getDurationEvent,
  capitalizeFirstLetter,
  getOffersByType,
  getRandomDate,
  isFuturePoint,
  isActualPoint,
  isExpiredPoint
};
