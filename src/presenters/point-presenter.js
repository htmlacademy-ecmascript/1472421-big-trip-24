import PointView from '../views/point-view.js';
import EditPointView from '../views/edit-point-view.js';
import { remove, render,replace } from '../framework/render';
import { PointMode } from '../const/points-const.js';

export default class PointPresenter {
  #point = null;
  #offers = [];
  #destinations = [];

  #pointComponent = null;
  #editPointComponent = null;
  #pointsListComponent = null;

  #pointChangeHandler = null;
  #modeChangeHandler = null;

  #mode = PointMode.DEFAULT;

  constructor({pointsListComponent, onPointChange, onModeChange}){
    this.#pointsListComponent = pointsListComponent;
    this.#pointChangeHandler = onPointChange;
    this.#modeChangeHandler = onModeChange;
  }

  init(point, offers, destinations){
    this.#point = point;
    this.#offers = offers;
    this.#destinations = destinations;

    /* Записываем предыдущие компоненты точки маршрута
    и формы редактирования в переменные.
    При первом init() в данных переменных будет хранится null
    Если будет необходимость перерисовать точку(в связи с изменением
    данных, например) и будет вызван метод init() повторно,
    то в свойства this.#pointComponent и this.#editPointComponent
    будут записаны вновь созданные компоненты,
    а в preventPoint и prevEditPoint будут записаны
    компоненты созданные при предыдущем init().
    Это для того, что бы не перерисовывать компонент,
    если он не изменился. И заменить старый компонент на новый
    через replace, если компонент изменился*/
    const preventPointComponent = this.#pointComponent;
    const prevEditPointComponent = this.#editPointComponent;

    this.#pointComponent = new PointView({
      point: this.#point,
      offers: this.#offers,
      destinations: this.#destinations,
      onOpenEditButtonClick: this.#onOpenEditButtonClick,
      onFavoriteClick: this.#onFavoriteClick
    });

    this.#editPointComponent = new EditPointView({
      point: this.#point,
      offers: this.#offers,
      destinations: this.#destinations,
      onCloseEditButtonClick: this.#onCloseEditButtonClick,
      onSubmitButtonClick: this.#onSubmitButtonClick
    });

    if(preventPointComponent === null || prevEditPointComponent === null){
      render(this.#pointComponent, this.#pointsListComponent);
      return;
    }

    if(this.#mode === PointMode.DEFAULT){
      replace(this.#pointComponent, preventPointComponent);
    }
    if(this.#mode === PointMode.EDITING){
      replace(this.#editPointComponent, prevEditPointComponent);
    }

    remove(preventPointComponent);
    remove(prevEditPointComponent);

  }

  resetView() {
    if(this.#mode !== PointMode.DEFAULT){
      this.#replaceEditPointToPoint();
    }
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

  #onFavoriteClick = () => {
    this.#pointChangeHandler({...this.#point, isFavorite: !this.#point.isFavorite});
  };

  #replacePointToEditPoint = () => {
    replace(this.#editPointComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#modeChangeHandler();
    this.#mode = PointMode.EDITING;
  };

  #replaceEditPointToPoint = () => {
    replace(this.#pointComponent, this.#editPointComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = PointMode.DEFAULT;
  };

  destroy() {
    remove(this.#pointComponent);
    remove(this.#editPointComponent);
  }
}
