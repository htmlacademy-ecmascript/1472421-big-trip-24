import { getOffers } from '../mocks/offers-mock';


export default class OffersModel {

  #offers = getOffers();

  get offers() {
    return this.#offers;
  }

}
