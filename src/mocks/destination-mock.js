import { DESTINATIONS } from '../const';
import { getRandomInt } from '../utils';

const destinations = {};
let destinationId = 0;

const setDestinations = () => {
  DESTINATIONS.forEach((destination) => {

    destinationId++;

    destinations[`${destination}`] = {
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
        }
      ]
    };
  });
};


const getDestinations = () => {
  setDestinations();

  return destinations;
};

export {getDestinations};
