import { EVENT_TYPES, POINT_COUNT, CITIES } from '../const.js';
import { getRandomArrayElement, getRandomDate, getRandomInt } from '../utils.js';

const randomType = () => getRandomArrayElement(EVENT_TYPES);

const generatePoint = () => {

  const dateNow = getRandomDate();

  return ({
    id: getRandomInt(0, 100),
    basePrice: getRandomInt(0, 100),
    dateFrom: dateNow,
    dateTo: dateNow.add(getRandomInt(1,4), 'hour'),
    destination: getRandomInt(1, CITIES.length),
    isFavorite: Boolean(getRandomInt(0, 1)),
    offers: Array.from({ length: 3 }, (_, i) => i + 1),
    type: randomType()
  });
};

const generationPoints = () => Array.from({length: POINT_COUNT}, generatePoint);

export {generationPoints};
