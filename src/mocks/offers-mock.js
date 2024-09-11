import { EVENT_TYPES } from '../const/points-const';
import { getRandomInt } from '../utils/utils';

let offers = [];

const setOffers = () => {
  offers = EVENT_TYPES.map((type) => (
    {
      type: type,
      offers: [
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
      ]
    }
  ));
};

setOffers();

const getOffers = () => offers;

export {getOffers};
