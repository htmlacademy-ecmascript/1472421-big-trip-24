import SortView from '../views/sort-view.js';
import PointsListView from '../views/points-list-view.js';
import { render } from '../framework/render.js';
import { MessageBoard, SortType } from '../const/points-const.js';
import ListMessageView from '../views/list-message-view.js';
import PointPresenter from './point-presenter.js';
import { sortByPrice, sortByTime, updatePointData } from '../utils/points-utils.js';


export default class BoardPresenter {

  #boardContainer = null;
  #pointsModel = null;
  #offersModel = null;
  #destinationsModel = null;

  #pointsListComponent = new PointsListView();
  #sortComponent = null;

  #points = [];
  #sourcedPoints = [];
  #offers = [];
  #destinations = [];
  #currentSortType = SortType.DAY;

  #pointPresenters = new Map();


  constructor({boardContainer, pointsModel, offersModel, destinationsModel}) {
    this.#boardContainer = boardContainer;
    this.#pointsModel = pointsModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
  }


  init() {
    this.#points = [...this.#pointsModel.points];
    this.#sourcedPoints = [...this.#pointsModel.points];
    this.#offers = [...this.#offersModel.offers];
    this.#destinations = [...this.#destinationsModel.destinations];

    this.#renderBoard();
  }


  #renderPoint(point, offers, destinations){

    const pointPresenter = new PointPresenter({
      pointsListComponent: this.#pointsListComponent.element,
      onPointChange: this.#pointChangeHandler,
      onModeChange: this.#modeChangeHandler
    });

    pointPresenter.init(point, offers, destinations);
    this.#pointPresenters.set(point.id, pointPresenter);
  }


  #renderPointsList = () => {
    render(this.#pointsListComponent, this.#boardContainer);

    if(this.#points.length === 0){
      render(new ListMessageView({message: MessageBoard.EMPTY_LIST}), this.#pointsListComponent.element);
      return;
    }

    this.#points.forEach((point) => this.#renderPoint(point, this.#offers, this.#destinations));
  };

  #renderSort() {
    this.#sortComponent = new SortView({onSortButtonClick: this.#onSortButtonClick});
    render(this.#sortComponent, this.#boardContainer);
  }

  #renderBoard() {
    this.#renderSort();
    this.#renderPointsList();
  }

  /* Метод описывается стрелочной функцией, для того, что бы при вызове
  в экземплярах других классов, знал о существовании всех
  презентеров точек. (такая информация хранится в свойстве
  презентера маршрута.
  Далее метод передается в каждый создаваемый презентер, что
  бы в нем,метод вызывался при изменении каких-либо данных точки
  маршрута при взаимодействии пользователся с view и изменения
  внесенные пользователем попали в презентер и у презентера нужной точки
  был вновь вызван метод init() с обновленными данными,
  который в свою очередь прокинет обновленные данные во view и перерерисует
  view*/
  #pointChangeHandler = (updatePoint) => {
    this.#points = updatePointData(this.#points, updatePoint);
    this.#sourcedPoints = updatePointData(this.#points, updatePoint);
    this.#pointPresenters.get(updatePoint.id).init(updatePoint, this.#offers, this.#destinations);
  };

  #modeChangeHandler = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #onSortButtonClick = (sortType) => {
    if(this.#currentSortType === sortType){
      return;
    }

    this.#sortPoint(sortType);
    this.#clearPointslist();
    this.#renderPointsList();
  };

  #clearPointslist = () => {
    this.#pointPresenters.forEach((point) => point.destroy());
    this.#pointPresenters.clear();
  };

  #sortPoint = (sortType) => {
    switch(sortType) {
      case SortType.DAY:
        this.#points = [...this.#sourcedPoints];
        break;
      case SortType.PRICE:
        this.#points.sort(sortByPrice);
        break;
      case SortType.TIME:
        this.#points.sort(sortByTime);
        break;
    }


    this.#currentSortType = sortType;
  };

}

