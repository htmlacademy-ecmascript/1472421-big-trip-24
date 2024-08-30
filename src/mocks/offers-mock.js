import { EVENT_TYPES } from '../const';
import { getRandomInt } from '../utils';

const offers = {};

const setOffers = () => {
  EVENT_TYPES.forEach((type) => {
    offers[`${type}`] = [
      {
        id: 1,
        title: `Upgrade ${type}`,
        price: getRandomInt(1, 100)
      },
      {
        id: 2,
        title: `Upgrade ${type}`,
        price: getRandomInt(1, 100)
      },
      {
        id: 3,
        title: `Upgrade ${type}`,
        price: getRandomInt(1, 100)
      }
    ];
  });
};


const getOffers = () => {
  setOffers();

  return offers;
};

export {getOffers};
