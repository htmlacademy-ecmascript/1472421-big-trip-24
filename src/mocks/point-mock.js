import { EVENT_TYPES, POINT_COUNT } from '../const.js';
import { getRandomArrayElement, getRandomInt } from '../utils.js';

const randomType = () => getRandomArrayElement(EVENT_TYPES);

const generatePoint = () => ({
  id: getRandomInt(0, 100),
  basePrice: getRandomInt(0, 100),
  dateFrom: '2019-07-10T22:55:56.845Z',
  dateTo: '2019-07-11T11:22:13.375Z',
  destination: getRandomInt(1, 3),
  isFavorite: Boolean(getRandomInt(0, 1)),
  offers: Array.from({ length: 3 }, (_, i) => i + 1),
  type: randomType()
});

const generationPoints = () => Array.from({length: POINT_COUNT}, generatePoint);

export {generationPoints};
