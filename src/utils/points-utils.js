import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { EDIT_POINT_DATE_FORMAT, POINT_DATE_FORMAT } from '../const/points-const';
import { getRandomInt } from './utils';
dayjs.extend(duration);

/* При клонировании через structuredClone объекта, значением
одно из свойств которого является объект dayjs,
значение свойства склонированного объекта объектом dayjs не является
но является похожим по структуре.

Адаптер переводит похожий по структуре на dayjs объект в dayjs объект*/
const dateAdapter = (date) => date['$d'] ? dayjs(date['$d']) : dayjs(date);

const totalOffersPrice = (offers) => offers.reduce((accumulator, currentValue) => accumulator + currentValue.price, 0);

const formatEditPointDate = (editPointDate) => dateAdapter(editPointDate).format(EDIT_POINT_DATE_FORMAT);

const formatPointDate = (pointDate) => dateAdapter(pointDate).format(POINT_DATE_FORMAT);

const getDurationEvent = (dateFrom, dateTo) => dayjs.duration(dateAdapter(dateTo).diff(dateAdapter(dateFrom)));


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

const isDatesEqual = (point, updatePoint) => (dateAdapter(point.dateFrom).isSame(dateAdapter(updatePoint.dateFrom)) && dateAdapter(point.dateTo).isSame(dateAdapter(updatePoint.dateTo)));

/* Определение результата ф-ции compare при значение null одного из сравниваемых элементов */
const getWeightForNullValue = (valueA, valueB) => {
  if(valueA === null && valueB === null) {
    return 0;
  }

  if(valueA === null) {
    return 1;
  }

  if(valueB === null){
    return -1;
  }

  return null;
};

const sortByPrice = (pointA, pointB) => getWeightForNullValue(pointA, pointB) ?? pointB.basePrice - pointA.basePrice;

const sortByTime = (pointA, pointB) => getWeightForNullValue(pointA, pointB) ?? getDurationEvent(pointB.dateFrom, pointB.dateTo).asMilliseconds() - getDurationEvent(pointA.dateFrom, pointA.dateTo).asMilliseconds();

const sortByDay = (pointA, pointB) => getWeightForNullValue(pointA, pointB) ?? dateAdapter(pointA.dateFrom).isBefore(dateAdapter(pointB.dateFrom));
/* Функция удаляет id оффера из массива id-шников выбранных офферов
точки маршрута если id оффера, пришедший на вход функции
уже есть в массиве(выбранных офферов
точки маршрута) и добавляет id оффера
в массив id-шников выбранных офферов, если такого
id-шника там нет. Возвращает изменненный массив*/
const togleOffers = (offers, offerId) => {
  if(!offers.includes(offerId)){
    return [...offers, offerId];
  }

  return offers.filter((offersItem) => offersItem !== offerId);

};


/* Возвращает id пункта назначения по имени */
const getIdByName = (destinations, name) => destinations.find((destination) => destination.name === name).id;

export {
  totalOffersPrice,
  formatEditPointDate,
  formatPointDate,
  getDurationEvent,
  getOffersByType,
  getRandomDate,
  isFuturePoint,
  isActualPoint,
  isExpiredPoint,
  sortByPrice,
  sortByTime,
  togleOffers,
  getIdByName,
  dateAdapter,
  sortByDay,
  isDatesEqual
};
