import SortView from '../views/board-views/sort-view.js';
import PointsListView from '../views/board-views/points-list-view.js';
import PointView from '../views/board-views/point-view.js';
import EditPointView from '../views/board-views/edit-point-view.js';
import {render} from '../render.js';

export default class BoardPresenter {

  pointsListComponent = new PointsListView();

  constructor({boardContainer}) {
    this.boardContainer = boardContainer;
  }

  init() {
    render(new SortView(), this.boardContainer);
    render(this.pointsListComponent, this.boardContainer);
    render(new EditPointView(), this.pointsListComponent.getElement());

    for (let i = 0; i < 3; i++) {
      render(new PointView(), this.pointsListComponent.getElement());
    }
  }
}
