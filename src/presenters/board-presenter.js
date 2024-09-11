import SortView from '../views/sort-view.js';
import PointsListView from '../views/points-list-view.js';
import { render } from '../framework/render.js';
import { MessageBoard } from '../const/points-const.js';
import ListMessageView from '../views/list-message-view.js';
import PointPresenter from './point-presenter.js';


export default class BoardPresenter {

  #boardContainer = null;
  #pointsModel = null;
  #offersModel = null;
  #destinationsModel = null;
  #pointsListComponent = new PointsListView();
  #points = [];
  #offers = [];
  #destinations = [];


  constructor({boardContainer, pointsModel, offersModel, destinationsModel}) {
    this.#boardContainer = boardContainer;
    this.#pointsModel = pointsModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
  }


  init() {
    this.#points = [...this.#pointsModel.points];
    this.#offers = [...this.#offersModel.offers];
    this.#destinations = [...this.#destinationsModel.destinations];

    this.#renderBoard();
  }


  #renderPoint(point, offers, destinations){

    const pointPresenter = new PointPresenter({
      pointsListComponent: this.#pointsListComponent
    });

    pointPresenter.init(point, offers, destinations);
  }

  #renderBoard() {
    render(new SortView(), this.#boardContainer);
    render(this.#pointsListComponent, this.#boardContainer);

    if(this.#points.length === 0){
      render(new ListMessageView({message: MessageBoard.EMPTY_LIST}), this.#pointsListComponent.element);
      return;
    }

    this.#points.forEach((point) => this.#renderPoint(point, this.#offers, this.#destinations));
  }

}
