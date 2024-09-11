import { CITIES } from '../const/points-const';
import { getRandomInt } from '../utils/utils';

const destinations = [];
let destinationId = 0;

const setDestinations = () => {
  CITIES.forEach((destination) => {

    destinationId++;

    destinations.push({
      id: destinationId,
      description: `${destination}, is a beautiful city, a true asian pearl, with crowded streets.`,
      name: destination,
      pictures: [
        {
          src: `../img/photos/${getRandomInt(1,5)}.jpg`,
          destination: `${destination} parliament building`
        },
        {
          src: `../img/photos/${getRandomInt(1,5)}.jpg`,
          destination: `${destination} parliament building`
        },
        {
          src: `../img/photos/${getRandomInt(1,5)}.jpg`,
          destination: `${destination} parliament building`
        },
        {
          src: `../img/photos/${getRandomInt(1,5)}.jpg`,
          destination: `${destination} parliament building`
        },
        {
          src: `../img/photos/${getRandomInt(1,5)}.jpg`,
          destination: `${destination} parliament building`
        },
      ]
    });
  });
};

setDestinations();

const getDestinations = () => destinations;

export {getDestinations};
