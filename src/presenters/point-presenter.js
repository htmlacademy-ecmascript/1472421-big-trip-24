import PointView from '../views/point-view.js';
import EditPointView from '../views/edit-point-view.js';
import { render,replace } from '../framework/render';

export default class PointPresenter {
  #point = null;
  #offers = [];
  #destinations = [];

  #pointComponent = null;
  #editPointComponent = null;
  #pointsListComponent = null;

  constructor({pointsListComponent}){
    this.#pointsListComponent = pointsListComponent;
  }

  init(point, offers, destinations){
    this.#point = point;
    this.#offers = offers;
    this.#destinations = destinations;


    this.#pointComponent = new PointView({
      point: this.#point,
      offers: this.#offers,
      destinations: this.#destinations,
      onOpenEditButtonClick: this.#onOpenEditButtonClick
    });

    this.#editPointComponent = new EditPointView({
      point: this.#point,
      offers: this.#offers,
      destinations: this.#destinations,
      onCloseEditButtonClick: this.#onCloseEditButtonClick,
      onSubmitButtonClick: this.#onSubmitButtonClick
    });

    render(this.#pointComponent, this.#pointsListComponent.element);
  }

  #onOpenEditButtonClick = () => {
    this.#replacePointToEditPoint();

  };

  #onCloseEditButtonClick = () => this.#replaceEditPointToPoint();

  #onSubmitButtonClick = () => this.#replaceEditPointToPoint();

  #escKeyDownHandler = (evt) => {
    if(evt.key === 'Escape'){
      evt.preventDefault();
      this.#replaceEditPointToPoint();
    }
  };

  #replacePointToEditPoint = () => {
    replace(this.#editPointComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
  };

  #replaceEditPointToPoint = () => {
    replace(this.#pointComponent, this.#editPointComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };
}
