import { EVENT_TYPES } from '../const/points-const';
import AbstractView from '../framework/view/abstract-view';
import { formatEditPointDate, getOffersByType } from '../utils/points-utils';
import { capitalizeFirstLetter, findById } from '../utils/utils';

const getEventTypelistTemplate = () => EVENT_TYPES.map((type) => (`
  <div class="event__type-item">
    <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}">
    <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${capitalizeFirstLetter(type)}</label>
  </div>`
)).join('');

const getDestinationListTemplate = (destinations) => destinations.map((destination) => `<option value="${destination.name}"></option>`).join('');


const getOffersTemplate = (offersId, offers) => offersId.map((offerId) => {

  const offer = findById(offers, offerId);

  return (`
    <div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-luggage-${offer.id}" type="checkbox" name="event-offer-luggage" checked>
      <label class="event__offer-label" for="event-offer-luggage-${offer.id}">
        <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </label>
    </div>
    `);
}).join('');

const getPhotosTemplate = (pictures) => pictures.map((picture) => `<img class="event__photo" src="${picture.src}" alt="Event photo"></img>`).join('');

const getDestinationTemplate = (destination) => {

  const {pictures, description} = destination;

  return (`
    <p class="event__destination-description">${description}</p>

    <div class="event__photos-container">
      <div class="event__photos-tape">
        ${getPhotosTemplate(pictures)}
      </div>
    </div>
  `);
};

const createEditPointTemplate = (point, offers, destinations) => {


  const {type, destination: destinationId, dateTo, dateFrom, basePrice, offers: offersId } = point;
  const currentDestination = findById(destinations, destinationId);
  const currentOffers = getOffersByType(offers, type);


  return (
    `<li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Event type</legend>

                ${getEventTypelistTemplate()}
              </fieldset>
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${capitalizeFirstLetter(type)}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${currentDestination.name}" list="destination-list-1">
            <datalist id="destination-list-1">
              ${getDestinationListTemplate(destinations)}
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${ formatEditPointDate(dateFrom)}">
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${formatEditPointDate(dateTo)}">
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}">
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">Delete</button>
          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </header>
        <section class="event__details">
          <section class="event__section  event__section--offers">
            <h3 class="event__section-title  event__section-title--offers">Offers</h3>

            <div class="event__available-offers">
              ${getOffersTemplate(offersId, currentOffers)}
            </div>
          </section>

          <section class="event__section  event__section--destination">
            <h3 class="event__section-title  event__section-title--destination">Destination</h3>
            ${getDestinationTemplate(currentDestination)}
          </section>

          <section class="event__section  event__section--destination">
            <h3 class="event__section-title  event__section-title--destination">Destination</h3>
            <p class="event__destination-description">${currentDestination.description} </p>
          </section>
        </section>
      </form>
    </li>`
  );
};


export default class EditPointView extends AbstractView {

  #point = null;
  #offers = [];
  #destinations = [];
  #onCloseEditButtonClick = null;
  #onSubmitButtonClick = null;

  constructor({point, offers, destinations, onCloseEditButtonClick, onSubmitButtonClick}) {
    super();
    this.#point = point;
    this.#offers = offers;
    this.#destinations = destinations;
    this.#onCloseEditButtonClick = onCloseEditButtonClick;
    this.#onSubmitButtonClick = onSubmitButtonClick;
    this.#setEventListeners();
  }

  get template() {
    return createEditPointTemplate(this.#point, this.#offers, this.#destinations);
  }

  #setEventListeners() {
    this.element
      .querySelector('.event__rollup-btn')
      .addEventListener('click', this.#closeEditButtonClickHandler);

    this.element
      .querySelector('.event__save-btn')
      .addEventListener('submit', this.#submitButtonClickHandler);
  }

  #closeEditButtonClickHandler = (evt) => {
    evt.preventDefault();
    this.#onCloseEditButtonClick();
  };

  #submitButtonClickHandler = (evt) => {
    evt.preventDefault();
    this.#onSubmitButtonClick();
  };
}
