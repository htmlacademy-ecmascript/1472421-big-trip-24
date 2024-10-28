import PointView from '../views/point-view.js';
import EditPointView from '../views/edit-point-view.js';
import { remove, render,replace } from '../framework/render';
import { PointMode, UpdateType, UserAction } from '../const/points-const.js';
import { isDatesEqual } from '../utils/points-utils.js';

export default class PointPresenter {
  #point = null;
  #offers = [];
  #destinations = [];

  #pointComponent = null;
  #editPointComponent = null;
  #pointsListComponent = null;

  #viewActionHandler = null;
  #modeChangeHandler = null;

  #mode = PointMode.DEFAULT;

  constructor({pointsListComponent, onPointChange, onModeChange}){
    this.#pointsListComponent = pointsListComponent;
    this.#viewActionHandler = onPointChange;
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
      onSubmitButtonClick: this.#onSubmitButtonClick,
      onDeleteButtonClick: this.#onDeleteButtonClick
    });

    if(preventPointComponent === null || prevEditPointComponent === null){
      render(this.#pointComponent, this.#pointsListComponent);
      return;
    }

    if(this.#mode === PointMode.DEFAULT){
      replace(this.#pointComponent, preventPointComponent);
    }
    if(this.#mode === PointMode.EDITING){
      replace(this.#pointComponent, prevEditPointComponent);
      this.#mode = PointMode.DEFAULT;
    }

    remove(preventPointComponent);
    remove(prevEditPointComponent);

  }

  resetView() {
    if(this.#mode !== PointMode.DEFAULT){
      this.#editPointComponent.reset(this.#point);
      this.#replaceEditPointToPoint();
    }
  }

  setSaving(){
    if(this.#mode === PointMode.EDITING){

      this.#editPointComponent.updateElement({
        isDisabled: true,
        isSaving: true
      });
    }
  }

  setDeleting(){
    if(this.#mode === PointMode.EDITING){
      this.#editPointComponent.updateElement({
        isDisabled: true,
        isDeleting: true
      });
    }
  }

  setAborting(){
    if(this.#mode === PointMode.DEFAULT){
      this.#pointComponent.shake();
      return;
    }

    const resetFormState = () => {
      this.#editPointComponent.updateElement({
        isDeleting: false,
        isSaving: false,
        isDisabled: false
      });
    };

    this.#editPointComponent.shake(resetFormState);
  }

  #onOpenEditButtonClick = () => {
    this.#replacePointToEditPoint();
  };

  #onCloseEditButtonClick = () => {
    this.#editPointComponent.reset(this.#point);
    this.#replaceEditPointToPoint();
  };

  #onSubmitButtonClick = (state) => {

    const isMinorUpdate = !isDatesEqual(this.#point, state);

    this.#viewActionHandler(
      UserAction.UPDATE_POINT,
      isMinorUpdate ? UpdateType.MINOR : UpdateType.PATCH,
      state
    );

  };

  #escKeyDownHandler = (evt) => {
    if(evt.key === 'Escape'){
      evt.preventDefault();
      this.#editPointComponent.reset(this.#point);
      this.#replaceEditPointToPoint();
    }
  };

  #onFavoriteClick = () => {
    this.#viewActionHandler(
      UserAction.UPDATE_POINT,
      UpdateType.PATCH,
      {...this.#point, isFavorite: !this.#point.isFavorite}
    );
  };

  #onDeleteButtonClick = (state) => {
    this.#viewActionHandler(
      UserAction.DELETE_POINT,
      UpdateType.MINOR,
      state
    );
  };

  #replacePointToEditPoint() {
    replace(this.#editPointComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#modeChangeHandler();
    this.#mode = PointMode.EDITING;
  }

  #replaceEditPointToPoint() {
    replace(this.#pointComponent, this.#editPointComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = PointMode.DEFAULT;
  }

  destroy() {
    remove(this.#pointComponent);
    remove(this.#editPointComponent);
  }
}
