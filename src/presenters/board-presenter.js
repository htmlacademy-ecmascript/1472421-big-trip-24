import SortView from '../views/sort-view.js';
import PointsListView from '../views/points-list-view.js';
import PointView from '../views/point-view.js';
import EditPointView from '../views/edit-point-view.js';
import { render, replace } from '../framework/render.js';
import { SHOW_POINT_COUNT } from '../const.js';


export default class BoardPresenter {

  #boardContainer = null;
  #pointsModel = null;
  #offersModel = null;
  #destinationsModel = null;
  #pointsListComponent = new PointsListView();
  #pointsData = [];
  #offersData = [];
  #destinationsData = [];


  constructor({boardContainer, pointsModel, offersModel, destinationsModel}) {
    this.#boardContainer = boardContainer;
    this.#pointsModel = pointsModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
  }


  init() {

    this.#pointsData = [...this.#pointsModel.points];
    this.#offersData = [...this.#offersModel.offers];
    this.#destinationsData = [...this.#destinationsModel.destinations];

    render(new SortView(), this.#boardContainer);
    render(this.#pointsListComponent, this.#boardContainer);

    for (let i = 0; i < SHOW_POINT_COUNT; i++) {
      this.#renderPoint(this.#pointsData[i], this.#offersData, this.#destinationsData);
    }
  }


  /**
   *
   * @param {Object} point
   */
  #renderPoint(point, offers, destinations){
    /* В данных функциях описывается логика, выполняющаяся
    при кликах(стрелка или save). На данном этапе описана реализация
    замены точки на форму редактирования точки и наоборот.
    Поведение описывается тут, а не во view потому, что именно тут создаются
    компоненты, которые заменяют друг друга.
    Поэтому логика поведения передается через конструктор
    в компонент(view) */
    const escKeyDownHandler = (evt) => {
      if(evt.key === 'Escape'){
        evt.preventDefault();
        replaceEditPointToPoint();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    };
    const onOpenEditButtonClick = () => {
      replacePointToEditPoint();
      document.addEventListener('keydown', escKeyDownHandler);
    };
    const onCloseEditButtonClick = () => {
      replaceEditPointToPoint();
      document.removeEventListener('keydown', escKeyDownHandler);
    };
    const onSubmitButtonClick = () => {
      replaceEditPointToPoint();
      document.removeEventListener('keydown', escKeyDownHandler);
    };

    const pointComponent = new PointView({
      point,
      offers,
      destinations,
      onOpenEditButtonClick
    });

    const editPointComponent = new EditPointView({
      point,
      offers,
      destinations,
      onCloseEditButtonClick,
      onSubmitButtonClick
    });

    function replacePointToEditPoint() {
      replace(editPointComponent, pointComponent);
    }
    function replaceEditPointToPoint() {
      replace(pointComponent, editPointComponent);
    }

    render(pointComponent, this.#pointsListComponent.element);
  }

}
