import { getDestinations } from '../mocks/destination-mock';
import { getOffersByType } from '../mocks/offers-mock';
import { createElement } from '../render';
import { capitalizeFirstLetter, findById, formatPointDate, getDurationEvent } from '../utils';

const getSelectedOffersTemplate = (offersId, offers) => {


  let selectedOffersTemplate = '';

  offersId.forEach((offerId) => {

    const offer = findById(offers, offerId);

    selectedOffersTemplate += (`
      <li class="event__offer">
        <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </li>
    `);
  });
  return selectedOffersTemplate;
};

const createPointTemplate = (pointData) => {

  const {type, destination: destinationId, isFavorite, offers: offersId, dateFrom, dateTo} = pointData;
  const destination = findById(getDestinations(), destinationId);
  const offers = getOffersByType(type);

  return (
    `<li class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime="2019-03-18">MAR 18</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${capitalizeFirstLetter(type)} ${destination.name}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="2019-03-18T14:30">${formatPointDate(dateFrom)}</time>
            &mdash;
            <time class="event__end-time" datetime="2019-03-18T16:05">${formatPointDate(dateTo)}</time>
          </p>
          <p class="event__duration">${getDurationEvent(dateFrom, dateTo).hours()}H ${getDurationEvent(dateFrom, dateTo).minutes()}M</p>
        </div>
        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">160</span>
        </p>
        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
          ${getSelectedOffersTemplate(offersId, offers)}
        </ul>
        <button class="event__favorite-btn ${isFavorite ? 'event__favorite-btn--active' : ''} " type="button">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
        </button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`
  );
};

export default class PointView {

  constructor({pointData}) {
    this.pointData = pointData;
  }


  getTemplate() {
    return createPointTemplate(this.pointData);
  }

  getElement() {
    if(!this.element){
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
