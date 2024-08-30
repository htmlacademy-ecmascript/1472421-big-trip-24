import SortView from '../views/sort-view.js';
import PointsListView from '../views/points-list-view.js';
import PointView from '../views/point-view.js';
import EditPointView from '../views/edit-point-view.js';
import {render} from '../render.js';
import { SHOW_POINT_COUNT } from '../const.js';

export default class BoardPresenter {

  pointsListComponent = new PointsListView();

  constructor({boardContainer}) {
    this.boardContainer = boardContainer;
  }

  init() {
    render(new SortView(), this.boardContainer);
    render(this.pointsListComponent, this.boardContainer);
    render(new EditPointView(), this.pointsListComponent.getElement());

    for (let i = 0; i < SHOW_POINT_COUNT; i++) {
      render(new PointView(), this.pointsListComponent.getElement());
    }
  }
}
