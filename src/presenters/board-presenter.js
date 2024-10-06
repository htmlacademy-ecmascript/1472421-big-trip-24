import SortView from '../views/sort-view.js';
import PointsListView from '../views/points-list-view.js';
import { remove, render } from '../framework/render.js';
import { SortType, UpdateType, UserAction } from '../const/points-const.js';
import ListMessageView from '../views/list-message-view.js';
import PointPresenter from './point-presenter.js';
import { sortByDay, sortByPrice, sortByTime } from '../utils/points-utils.js';
import { FiltersPoint, filter } from '../const/filter-const.js';
import NewPointPresenter from './new-point-presenter.js';


export default class BoardPresenter {

  #boardContainer = null;
  #pointsModel = null;
  #offersModel = null;
  #destinationsModel = null;
  #filterModel = null;

  #pointsListComponent = new PointsListView();
  #sortComponent = null;
  #listMessageComponent = null;
  #filterType = null;

  #offers = [];
  #destinations = [];
  #currentSortType = SortType.DAY;

  #pointPresenters = new Map();
  #newPointPresenter = null;


  constructor({boardContainer, pointsModel, offersModel, destinationsModel, filterModel}) {
    this.#boardContainer = boardContainer;
    this.#pointsModel = pointsModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
    this.#filterModel = filterModel;

    this.#newPointPresenter = new NewPointPresenter({
      pointListContainer: this.#pointsListComponent,
      onPointChange: this.#viewActionHandler
    });

    /* Подписываемся на изменение данных модели и прокидываем функцию,
    которая вызовется при изменении модели */
    this.#pointsModel.addObserver(this.#modelChangeHandler);
    this.#filterModel.addObserver(this.#modelChangeHandler);
  }

  get points() {

    this.#filterType = this.#filterModel.filter;
    const points = this.#pointsModel.points;
    const filteredPoints = filter[this.#filterType](points);

    switch(this.#currentSortType) {
      case SortType.DAY:
        return filteredPoints.sort(sortByDay);
      case SortType.PRICE:
        return filteredPoints.sort(sortByPrice);
      case SortType.TIME:
        return filteredPoints.sort(sortByTime);
    }

    return filteredPoints;
  }


  init() {
    this.#offers = [...this.#offersModel.offers];
    this.#destinations = [...this.#destinationsModel.destinations];

    this.#renderBoard();
  }


  #renderPoint(point, offers, destinations){

    const pointPresenter = new PointPresenter({
      pointsListComponent: this.#pointsListComponent.element,
      onPointChange: this.#viewActionHandler,
      onModeChange: this.#modeChangeHandler
    });

    pointPresenter.init(point, offers, destinations);
    this.#pointPresenters.set(point.id, pointPresenter);
  }


  #renderPointsList = () => {
    render(this.#pointsListComponent, this.#boardContainer);

    if(this.points.length === 0){
      this.#listMessageComponent = new ListMessageView({filterType: this.#filterType});
      render(this.#listMessageComponent, this.#pointsListComponent.element);
      return;
    }

    this.points.forEach((point) => this.#renderPoint(point, this.#offers, this.#destinations));
  };

  #renderSort() {
    this.#sortComponent = new SortView({
      onSortButtonClick: this.#onSortButtonClick,
      currentSortType: this.#currentSortType
    });
    render(this.#sortComponent, this.#boardContainer);
  }

  #renderBoard() {
    this.#renderSort();
    this.#renderPointsList();
  }

  /* Метод описывается стрелочной функцией, для того, что бы при вызове
  в экземплярах других классов, знал о существовании всех
  презентеров точек. (такая информация хранится в свойстве
  презентера маршрута)
  Далее метод передается в каждый создаваемый презентер, что
  бы в нем,метод вызывался при изменении каких-либо данных точки
  маршрута при взаимодействии пользователся с view и изменения
  внесенные пользователем попали в презентер и у презентера нужной точки
  был вновь вызван метод init() с обновленными данными,
  который в свою очередь прокинет обновленные данные во view и перерерисует
  view*/

  /* Обработчик события изменения View(от действий пользователя) */
  #viewActionHandler = (actionType, updateType, update) => {

    /* В зависимгости от действия пользователя,
    будут вызван тот или иной метод модели, соответствующий
    действию пользователя */
    switch(actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this.#pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this.#pointsModel.deletePoint(updateType, update);
        break;
    }
  };

  /* Обработчик события изменения данных модели */
  #modelChangeHandler = (updateType, data) => {
    switch(updateType) {
      case UpdateType.PATCH:
        this.#pointPresenters.get(data.id).init(data, this.#offers, this.#destinations);
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({resetSortType: true});
        this.#renderBoard();
        break;
    }
  };

  #modeChangeHandler = () => {
    this.#newPointPresenter.destroy();
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #onSortButtonClick = (sortType) => {
    if(this.#currentSortType === sortType){
      return;
    }

    this.#clearBoard({resetSortType: true});
    this.#currentSortType = sortType;
    this.#renderBoard();
  };

  #clearPointslist = () => {
    this.#pointPresenters.forEach((point) => point.destroy());
    this.#pointPresenters.clear();
  };

  /* Данный синтаксис говорит, что на вход функция ожидает
  объект(по умолчанию он пустой, если на вход ничего не передано) со свойством
  resetSortType (по умолчанию равный false)*/
  #clearBoard = ({resetSortType = false} = {}) => {

    remove(this.#sortComponent);
    remove(this.#listMessageComponent);
    this.#newPointPresenter.destroy();
    this.#clearPointslist();

    if(resetSortType){
      this.#currentSortType = SortType.DAY;
    }
  };

  createPoint() {
    this.#filterModel.setFilter(UpdateType.MAJOR, FiltersPoint.EVERYTHING);
    this.#newPointPresenter.init(this.#offers, this.#destinations);
  }

}

