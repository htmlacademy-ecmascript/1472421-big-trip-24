import BoardPresenter from './presenters/board-presenter.js';
import InfoView from './views/info-view.js';
import FilterView from './views/filter-view.js';
import NewPointButtonView from './views/new-point-button-view.js';
import { render } from './framework/render.js';
import PointsModel from './model/point-model.js';

const pointsModel = new PointsModel();

const boardContainer = document.querySelector('.trip-events');
const headerContainer = document.querySelector('.trip-main');

render(new InfoView(), headerContainer);
render(new FilterView(), headerContainer);
render(new NewPointButtonView(), headerContainer);
const boardPresenter = new BoardPresenter({boardContainer, pointsModel});


boardPresenter.init();
