import AbstractView from '../framework/view/abstract-view';
import { formatPointDate, getDurationEvent, getOffersByType } from '../utils/points-utils';
import { capitalizeFirstLetter, findById } from '../utils/utils';

const getSelectedOffersTemplate = (offersId, offers) => offersId.map((offerId) => {
  const offer = findById(offers, offerId);

  return (`
    <li class="event__offer">
      <span class="event__offer-title">${offer.title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${offer.price}</span>
    </li>
  `);
}).join('');


const createPointTemplate = (point, offers, destinations) => {

  const {type, destination: destinationId, isFavorite, offers: offersId, dateFrom, dateTo} = point;
  const currentDestination = findById(destinations, destinationId);
  const currentOffers = getOffersByType(offers, type);

  return (
    `<li class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime="2019-03-18">MAR 18</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${capitalizeFirstLetter(type)} ${currentDestination.name}</h3>
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
          ${getSelectedOffersTemplate(offersId, currentOffers)}
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

export default class PointView extends AbstractView{

  #point = null;
  #offers = [];
  #destinations = [];
  #onOpenEditButtonClick = null;


  constructor({point, offers, destinations, onOpenEditButtonClick}) {
    super();
    this.#point = point;
    this.#offers = offers;
    this.#destinations = destinations;
    this.#onOpenEditButtonClick = onOpenEditButtonClick;
    this.#setEventListeners();
  }


  get template() {
    return createPointTemplate(this.#point, this.#offers, this.#destinations);
  }

  #setEventListeners() {
    this.element
      .querySelector('.event__rollup-btn')
      .addEventListener('click', this.#openEditButtonClickHandler);
  }

  #openEditButtonClickHandler = (evt) => {
    evt.preventDefault(evt);
    this.#onOpenEditButtonClick();
  };
}
