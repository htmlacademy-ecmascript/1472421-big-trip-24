import { EVENT_TYPES } from '../const/points-const';
import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import { formatEditPointDate, getIdByName, getOffersByType, togleOffers } from '../utils/points-utils';
import { capitalizeFirstLetter, findById } from '../utils/utils';

const getEventTypelistTemplate = () => EVENT_TYPES.map((type) => (`
  <div class="event__type-item">
    <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}">
    <label class="event__type-label  event__type-label--${type}"
    for="event-type-${type}-1"
    data-event-type = ${type}>
      ${capitalizeFirstLetter(type)}
    </label>
  </div>`
)).join('');

const getDestinationListTemplate = (destinations) => destinations.map((destination) => `<option value="${destination.name}"></option>`).join('');


const getOffersTemplate = (offersId, offers) => offers.length > 0 ? offers.map((offer) => (`
    <div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden"
      id="event-offer-luggage-${offer.id}"
      type="checkbox"
      name="event-offer-luggage"
      ${offersId.includes(offer.id) ? 'checked' : ''}
      >
      <label class="event__offer-label"
      for="event-offer-luggage-${offer.id}"
      data-offer-id = ${offer.id}>
        <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </label>
    </div>
    `)).join('') : '';

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


export default class EditPointView extends AbstractStatefulView {

  #offers = [];
  #destinations = [];
  #onCloseEditButtonClick = null;
  #onSubmitButtonClick = null;

  constructor({point, offers, destinations, onCloseEditButtonClick, onSubmitButtonClick}) {
    super();
    this._setState(point);
    this.#offers = offers;
    this.#destinations = destinations;
    this.#onCloseEditButtonClick = onCloseEditButtonClick;
    this.#onSubmitButtonClick = onSubmitButtonClick;
    this.#setEventListeners();
  }

  get template() {
    return createEditPointTemplate(this._state, this.#offers, this.#destinations);
  }

  #setEventListeners() {
    this.element
      .querySelector('.event__rollup-btn')
      .addEventListener('click', this.#closeEditButtonClickHandler);

    this.element
      .querySelector('.event__save-btn')
      .addEventListener('submit', this.#submitButtonClickHandler);

    this.element
      .querySelector('.event__type-group')
      .addEventListener('click', this.#eventTypeClickHandler);

    this.element
      .querySelector('.event__available-offers')
      .addEventListener('click', this.#offersClickHandler);

    this.element
      .querySelector('.event__input--destination')
      .addEventListener('input', this.#inpitDestinationHandler);
  }

  _restoreHandlers() {
    this.#setEventListeners();
  }

  #closeEditButtonClickHandler = (evt) => {
    evt.preventDefault();
    this.#onCloseEditButtonClick();
  };

  #submitButtonClickHandler = (evt) => {
    evt.preventDefault();
    this.#onSubmitButtonClick();
  };

  #eventTypeClickHandler = (evt) => {
    evt.preventDefault();
    if(evt.target.classList.contains('event__type-label')){
      this.updateElement({
        type: evt.target.dataset.eventType,
        offers: []
      });
    }
  };

  #offersClickHandler = (evt) => {
    evt.preventDefault();
    if(evt.target.classList.contains('event__offer-label')){
      /* Копируем массив выбранных оферов
      что бы не мутировать свойство offers у _state*/
      const offers = [...this._state.offers];

      /* Записываем массив выбранных оферов
      c добавленным или удаченнным id офера, на котором
      сработал обработчик в зависимости от того, был
      выбран оффер или нет(т.е. был ли id офера в массиве выбранных
      оферов или нет) */
      this.updateElement({
        offers: togleOffers(offers, evt.target.dataset.offerId)
      });
    }
  };

  #inpitDestinationHandler = (evt) => {
    /* Получаем список имен всех возможных пунктов назначения */
    const destinationNames = Object.values(this.#destinations).map((destination) => destination.name);

    /* Если введенные символы в поле ввода соответствуют имени одного из пуктов назначания */
    if(destinationNames.includes(evt.target.value)){
      /* Перерисовываем компонент */
      this.updateElement({
        destination: getIdByName(this.#destinations, evt.target.value)
      });
    }
  };

  reset(point) {
    this.updateElement(point)
  };

}
