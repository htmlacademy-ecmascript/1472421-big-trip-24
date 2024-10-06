import AbstractView from '../framework/view/abstract-view';

function createNewPointButtonTemplate() {
  return '<button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button">New event</button>';
}

export default class NewPointButtonView extends AbstractView{

  #onNewPointButtonClick = null;

  constructor({onNewPointButtonClick}) {
    super();
    this.#onNewPointButtonClick = onNewPointButtonClick;

    this.element
      .addEventListener('click', this.#newPointButtonClickHandler);
  }

  get template() {
    return createNewPointButtonTemplate();
  }

  #newPointButtonClickHandler = (evt) => {
    evt.preventDefault();
    this.#onNewPointButtonClick();
  };
}
