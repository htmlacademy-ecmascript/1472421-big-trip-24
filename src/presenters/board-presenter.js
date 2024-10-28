import SortView from '../views/sort-view.js';
import PointsListView from '../views/points-list-view.js';
import { remove, render } from '../framework/render.js';
import { SortType, UpdateType, UserAction } from '../const/points-const.js';
import ListMessageView from '../views/list-message-view.js';
import PointPresenter from './point-presenter.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import { sortByDay, sortByPrice, sortByTime } from '../utils/points-utils.js';
import { FiltersPoint, filter } from '../const/filter-const.js';
import NewPointPresenter from './new-point-presenter.js';
import LoadingView from '../views/loading-view.js';

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

export default class BoardPresenter {

  #boardContainer = null;
  #pointsModel = null;
  #filterModel = null;

  #pointsListComponent = new PointsListView();
  #loadingComponent = new LoadingView();
  #sortComponent = null;
  #listMessageComponent = null;
  #filterType = null;

  #currentSortType = SortType.DAY;
  #isLoading = true;

  #pointPresenters = new Map();
  #newPointPresenter = null;

  #uiBlocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT
  });


  constructor({boardContainer, pointsModel, filterModel, onNewPointClose}) {
    this.#boardContainer = boardContainer;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;


    this.#newPointPresenter = new NewPointPresenter({
      pointListContainer: this.#pointsListComponent,
      onPointChange: this.#viewActionHandler,
      onNewPointClose: onNewPointClose
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

  get offers() {
    return this.#pointsModel.offers;
  }

  get destinations() {
    return this.#pointsModel.destinations;
  }

  init() {
    this.#renderBoard();
  }

  #renderLoading() {
    render(this.#loadingComponent, this.#boardContainer);
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

    if(!this.#pointsModel.isLoaded){
      this.#filterType = FiltersPoint.NO_LOADED;
      this.#renderNoPoint();

      return;
    }

    if(this.points.length === 0){
      this.#renderNoPoint();
      return;
    }

    this.points.forEach((point) => this.#renderPoint(point, this.offers, this.destinations));
  };

  #renderSort() {
    this.#sortComponent = new SortView({
      onSortButtonClick: this.#onSortButtonClick,
      currentSortType: this.#currentSortType
    });
    render(this.#sortComponent, this.#boardContainer);
  }

  #renderBoard() {
    if(this.#isLoading){
      this.#renderLoading();
      return;
    }

    this.#renderSort();
    this.#renderPointsList();
  }

  #renderNoPoint() {
    this.#listMessageComponent = new ListMessageView({filterType: this.#filterType});
    render(this.#listMessageComponent, this.#pointsListComponent.element);
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
  #viewActionHandler = async (actionType, updateType, update) => {

    this.#uiBlocker.block();
    /* В зависимгости от действия пользователя,
    будут вызван тот или иной метод модели, соответствующий
    действию пользователя */
    switch(actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointPresenters.get(update.id).setSaving();
        try{
          await this.#pointsModel.updatePoint(updateType, update);
        }catch(err){
          this.#pointPresenters.get(update.id).setAborting();
        }
        break;
      case UserAction.ADD_POINT:
        this.#newPointPresenter.setSaving();
        try{
          await this.#pointsModel.addPoint(updateType, update);
        }catch(err){
          this.#newPointPresenter.setAborting();
        }
        break;
      case UserAction.DELETE_POINT:
        this.#pointPresenters.get(update.id).setDeleting();
        try{
          await this.#pointsModel.deletePoint(updateType, update);
        }catch(err){
          this.#pointPresenters.get(update.id).setAborting();
        }
        break;
    }

    this.#uiBlocker.unblock();
  };

  /* Обработчик события изменения данных модели */
  #modelChangeHandler = (updateType, data) => {
    switch(updateType) {
      case UpdateType.PATCH:
        this.#pointPresenters.get(data.id).init(data, this.offers, this.destinations);
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({resetSortType: true});
        this.#renderBoard();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderBoard();
        break;
    }
  };

  #modeChangeHandler = () => {
    this.#newPointPresenter?.destroy();
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
    remove(this.#loadingComponent);

    this.#newPointPresenter?.destroy();
    this.#clearPointslist();

    if(resetSortType){
      this.#currentSortType = SortType.DAY;
    }
  };

  createPoint() {
    if(this.#pointsModel.isLoaded){
      this.#filterModel.setFilter(UpdateType.MAJOR, FiltersPoint.EVERYTHING);
      remove(this.#listMessageComponent);
      this.#newPointPresenter.init(this.offers, this.destinations);
    }
  }

}

