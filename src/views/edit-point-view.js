import { CITYS, EVENT_TYPES } from '../const';
import { getDestinations } from '../mocks/destination-mock';
import { getOffersByType } from '../mocks/offers-mock';
import { createElement } from '../render';
import { capitalizeFirstLetter, findById, formatEditPointDate } from '../utils';

const getEventTypelistTemplate = () => EVENT_TYPES.map((type) => (`
  <div class="event__type-item">
    <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}">
    <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${capitalizeFirstLetter(type)}</label>
  </div>`
)).join('');

const getDestinationListTemplate = () => CITYS.map((city) => `<option value="${city}"></option>`).join('');

const getOffersTemplate = (offersId, offers) => {

  let offersTemplate = '';

  offersId.forEach((offerId) => {

    const offer = findById(offers, offerId);

    offersTemplate += (`
      <div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-luggage-${offer.id}" type="checkbox" name="event-offer-luggage" checked>
        <label class="event__offer-label" for="event-offer-luggage-${offer.id}">
          <span class="event__offer-title">${offer.title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${offer.price}</span>
        </label>
      </div>
    `);
  });
  return offersTemplate;
};

const getPhotosTemplate = (pictures) => {


  let photosTemplate = '';

  pictures.forEach((picture) => {
    photosTemplate += `<img class="event__photo" src="${picture.src}" alt="Event photo"></img>`;
  });

  return photosTemplate;
};

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

const createEditPointTemplate = (pointDate) => {

  const {type, destination: destinationId, dateTo, dateFrom, basePrice, offers: offersId } = pointDate;
  const destination = findById(getDestinations(), destinationId);
  const offers = getOffersByType(type);


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
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination.name}" list="destination-list-1">
            <datalist id="destination-list-1">
              ${getDestinationListTemplate()}
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
              ${getOffersTemplate(offersId, offers)}
            </div>
          </section>

          <section class="event__section  event__section--destination">
            <h3 class="event__section-title  event__section-title--destination">Destination</h3>
            ${getDestinationTemplate(destination)}
          </section>

          <section class="event__section  event__section--destination">
            <h3 class="event__section-title  event__section-title--destination">Destination</h3>
            <p class="event__destination-description">${destination.description} </p>
          </section>
        </section>
      </form>
    </li>`
  );
};

export default class EditPointView {

  constructor({pointData}) {
    this.pointData = pointData;
  }

  getTemplate() {
    return createEditPointTemplate(this.pointData);
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
