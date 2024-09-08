import { getDestinations } from '../mocks/destination-mock';


export default class DestinationsModel {

  #destinations = getDestinations();

  get destinations() {
    return this.#destinations;
  }

}
