import { BLANK_POINT, EVENT_TYPES } from '../const/points-const';
import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import { formatEditPointDate, getIdByName, getOffersByType, togleOffers } from '../utils/points-utils';
import { capitalizeFirstLetter, findById } from '../utils/utils';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

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


const getOffersTemplate = (offersId, offers, isDisabled) => offers.length > 0 ? `

  <section class="event__section  event__section--offers">
    <h3 class="event__section-title  event__section-title--offers">Offers</h3>

    <div class="event__available-offers">
      ${ offers.map((offer) => (`

      <div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden"
        id="event-offer-luggage-${offer.id}"
        type="checkbox"
        name="event-offer-luggage"
        ${offersId.includes(offer.id) ? 'checked' : ''}
        ${isDisabled ? 'disabled' : ''}
        >
        <label class="event__offer-label "
        for="event-offer-luggage-${offer.id}"
        data-offer-id = ${offer.id}>
          <span class="event__offer-title">${offer.title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${offer.price}</span>
        </label>
      </div>
      `)).join('')}
    </div>
  </section>

` : '';

const getPhotosTemplate = (pictures) => (`<div class="event__photos-container">
      <div class="event__photos-tape">
        ${pictures.map((picture) => `
          <img class="event__photo" src="${picture.src}" alt="Event photo"></img>
        `).join('')}
      </div>
    </div>`
);

const getDestinationTemplate = (destination) => {

  const {pictures, description} = destination;

  return description === '' ? description : (`
    <section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${description}</p>

      ${pictures.length !== 0 ? getPhotosTemplate(pictures) : ''}

    </section>
  `);
};

const getButtonDeleteMessage = (isNewPoint, isDeleting) => {
  if(isNewPoint){
    return 'Close';
  }

  if(isDeleting){
    return 'Deleting...';
  }

  return 'Delete';
};

const getButtonsTemplate = (isNewPoint, isDeleting, isSaving, isDisabled) => (`
  <button
    class="event__save-btn  btn  btn--blue"
    type="submit"
    ${isDisabled ? 'disabled' : ''}>
      ${isSaving ? 'Saving...' : 'Save'}
    </button>
  <button class="event__reset-btn"
    type="reset"
    ${isDisabled ? 'disabled' : ''}>
      ${getButtonDeleteMessage(isNewPoint, isDeleting)}
    </button>
  ${isNewPoint ? '' : `<button class="event__rollup-btn" type="button" ${isDisabled ? 'disabled' : ''}>
    <span class="visually-hidden">Open event</span>
</button>`}
`);

const createEditPointTemplate = (point, offers, destinations) => {

  const {type, destination: destinationId, dateTo, dateFrom, basePrice, offers: offersId, isNewPoint, isDisabled, isDeleting, isSaving } = point;
  const currentDestination = findById(destinations, destinationId) ?? '';
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
              <fieldset class="event__type-group" ${isDisabled ? 'disabled' : ''}>
                <legend class="visually-hidden">Event type</legend>

                ${getEventTypelistTemplate()}
              </fieldset>
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${capitalizeFirstLetter(type)}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${currentDestination.name ?? '' }" list="destination-list-1" ${isDisabled ? 'disabled' : ''}>
            <datalist id="destination-list-1">
              ${destinations === '' ? destinations : getDestinationListTemplate(destinations)}
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${ dateFrom ? formatEditPointDate(dateFrom) : ''}" ${isDisabled ? 'disabled' : ''}>
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${dateTo ? formatEditPointDate(dateTo) : ''}" ${isDisabled ? 'disabled' : ''}>
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}" ${isDisabled ? 'disabled' : ''}>
          </div>

          ${getButtonsTemplate(isNewPoint, isDeleting, isSaving, isDisabled)}
        </header>
        <section class="event__details">
          ${currentOffers !== '' ? getOffersTemplate(offersId, currentOffers, isDisabled) : ''}
          ${currentDestination === '' ? '' : getDestinationTemplate(currentDestination)}
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
  #onDeleteButtonClick = null;
  #datepickerTo = null;
  #datepickerFrom = null;


  constructor({point = BLANK_POINT, offers, destinations, onCloseEditButtonClick, onSubmitButtonClick, onDeleteButtonClick}) {
    super();
    this._setState(EditPointView.parsePointToState(point));
    this.#offers = offers;
    this.#destinations = destinations;
    this.#onCloseEditButtonClick = onCloseEditButtonClick;
    this.#onSubmitButtonClick = onSubmitButtonClick;
    this.#onDeleteButtonClick = onDeleteButtonClick;

    this.#setEventListeners();
  }

  get template() {

    return createEditPointTemplate(this._state, this.#offers, this.#destinations);
  }

  #removeElement() {
    super.removeElement();

    if(this.#datepickerFrom || this.#datepickerTo) {
      this.#datepickerFrom.destroy();
      this.#datepickerTo.destroy();

      this.#datepickerFrom = null;
      this.#datepickerTo = null;
    }
  }

  #setEventListeners() {
    if(!this._state.isNewPoint){
      this.element
        .querySelector('.event__rollup-btn')
        .addEventListener('click', this.#closeEditButtonClickHandler);
    }

    this.element
      .querySelector('.event__save-btn')
      .addEventListener('click', this.#submitButtonClickHandler);

    this.element
      .querySelector('.event__type-group')
      .addEventListener('click', this.#eventTypeClickHandler);

    if(this.element.querySelector('.event__available-offers')){
      this.element
        .querySelector('.event__available-offers')
        .addEventListener('click', this.#offersClickHandler);
    }

    this.element
      .querySelector('.event__input--destination')
      .addEventListener('input', this.#inputDestinationHandler);

    this.element
      .querySelector('.event__reset-btn')
      .addEventListener('click', this.#deleteButtonClickHandler);

    this.element
      .querySelector('.event__input--price')
      .addEventListener('input', this.#inputBasePriceHandler);


    this.#setDatePicker();
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
    if(this.#isInputFull()){
      this.#onSubmitButtonClick(EditPointView.parseStateToPoint(this._state));
      return;
    }

    this.shake();
  };

  #isInputFull = () => (this._state.dateFrom && this._state.dateTo && this._state.destination);

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

      /* Записывает массив выбранных оферов
      c добавленным или удаченнным id офера, на котором
      сработал обработчик в зависимости от того, был
      выбран оффер или нет(т.е. был ли id офера в массиве выбранных
      оферов или нет) */
      this.updateElement({
        offers: togleOffers(offers, evt.target.dataset.offerId)
      });
    }
  };

  #inputDestinationHandler = (evt) => {
    /* Получаем список имен всех возможных пунктов назначения */
    const destinationNames = this.#destinations.map((destination) => destination.name);

    /* Если введенные символы в поле ввода соответствуют имени одного из пунктов назначания */
    if(destinationNames.includes(evt.target.value)){
      /* Перерисовываем компонент */
      this.updateElement({
        destination: getIdByName(this.#destinations, evt.target.value)
      });
    }
  };

  #dateFromChangeHandler = ([userDate]) => {
    this.updateElement({
      dateFrom: userDate
    });

    this.#datepickerTo.set('minDate', this._state.dateFrom);
  };

  #inputBasePriceHandler = (evt) => {
    evt.preventDefault();

    this.updateElement({
      basePrice: Number(evt.target.value.replace(/[^\d]/g, ''))
    });
  };

  #dateToChangeHandler = ([userDate]) => {
    this.updateElement({
      dateTo: userDate
    });

    this.#datepickerFrom.set('maxDate', this._state.dateTo);
  };

  #deleteButtonClickHandler = (evt) => {
    evt.preventDefault();
    this.#onDeleteButtonClick(EditPointView.parseStateToPoint(this._state));
  };

  #setDatePicker = () => {
    this.#datepickerFrom = flatpickr(
      this.element.querySelector('#event-start-time-1'),
      {
        dateFormat: 'd/m/y H:i',
        defaultDate: this._state.dateFrom,
        onChange: this.#dateFromChangeHandler,
        enableTime: true,
        maxDate: this._state.dateTo,
        locale: {
          firstDayOfWeek: 1
        },
        'time_24hr': true
      }
    );

    this.#datepickerTo = flatpickr(
      this.element.querySelector('#event-end-time-1'),
      {
        dateFormat: 'd/m/y H:i',
        defaultDate: this._state.dateTo,
        onChange: this.#dateToChangeHandler,
        enableTime: true,
        minDate: this._state.dateFrom,
        locale: {
          firstDayOfWeek: 1
        },
        'time_24hr': true
      }
    );
  };

  reset(point) {
    this.updateElement(EditPointView.parsePointToState(point));
  }

  static parsePointToState(point){
    return {
      ...point,
      isDeleting: false,
      isSaving: false,
      isDisabled: false
    };
  }

  static parseStateToPoint(state){
    const point = {...state};

    delete point.isDeleting;
    delete point.isDisabled;
    delete point.isSaving;
    delete point?.isNewPoint;

    return point;
  }

}


