import { SHOW_COUNT_DESTINATIONS } from '../const/points-const';
import AbstractView from '../framework/view/abstract-view';
import { dateAdapter, getOffersByType } from '../utils/points-utils';
import { findById } from '../utils/utils';

const getChosenOffersForPoint = (point, offers) => point.offers.map((offer) => findById(getOffersByType(offers, point.type), offer));

const getSumPriceForPoint = (point, offers) => getChosenOffersForPoint(point, offers).reduce((currentSum, offer) => currentSum + offer.price, point.basePrice);

const getSumPrice = (points, offers) => points.reduce((currentSum, point) => currentSum + getSumPriceForPoint(point, offers), 0);

const getDestinationsListTemplate = (destinationsList) => {

  if(destinationsList.length > SHOW_COUNT_DESTINATIONS){
    return `${destinationsList[0]} &mdash; ... &mdash; ${destinationsList[destinationsList.length - 1]}`;
  }

  return destinationsList.map((destination) => `${destination} `).join(', ').replaceAll(/,/g, '&mdash;');
};

const getDurationTrip = (points) => {
  if(dateAdapter(points[0].dateFrom).month() === dateAdapter(points[points.length - 1].dateTo).month()){
    return `${dateAdapter(points[0].dateFrom).format('DD')} &mdash; ${dateAdapter(points[points.length - 1].dateTo).format('DD MMM')}`;
  }

  return `${dateAdapter(points[0].dateFrom).format('DD MMM')} &mdash; ${dateAdapter(points[points.length - 1].dateTo).format('DD MMM')}`;
};

const getDestinationsList = (points, destinations) => points.map((point) => findById(destinations, point.destination).name);

const createInfoTemplate = ({points, offers, destinations}) => {

  const destinationsList = getDestinationsList(points, destinations);

  return (`<section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">${getDestinationsListTemplate(destinationsList)}</h1>

        <p class="trip-info__dates">${getDurationTrip(points)}</p>
      </div>

      <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${getSumPrice(points, offers)}</span>
      </p>
    </section>`);
};

export default class InfoView extends AbstractView {

  #points = [];
  #offers = [];
  #destinations = [];

  constructor({points, offers, destinations}){
    super();
    this.#points = points;
    this.#offers = offers;
    this.#destinations = destinations;

  }


  get template() {

    return createInfoTemplate({points: this.#points, offers: this.#offers, destinations: this.#destinations});
  }
}
