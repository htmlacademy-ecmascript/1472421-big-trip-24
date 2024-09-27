import BoardPresenter from './presenters/board-presenter.js';
import InfoView from './views/info-view.js';
import FilterView from './views/filter-view.js';
import NewPointButtonView from './views/new-point-button-view.js';
import { render } from './framework/render.js';
import PointsModel from './model/point-model.js';
import OffersModel from './model/offers-model.js';
import DestinationsModel from './model/destinations-model.js';
import { generateFilters } from './mocks/filters-mock.js';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenters/filter-presenter.js';

const pointsModel = new PointsModel();
const offersModel = new OffersModel();
const destinationsModel = new DestinationsModel();
const filterModel = new FilterModel();


const boardContainer = document.querySelector('.trip-events');
const headerContainer = document.querySelector('.trip-main');


render(new InfoView(), headerContainer);

/* render(new NewPointButtonView(), headerContainer); */

const filterPresenter = new FilterPresenter({
  headerContainer,
  filterModel,
  pointsModel
});

const boardPresenter = new BoardPresenter({
  boardContainer,
  pointsModel,
  offersModel,
  destinationsModel
});

filterPresenter.init();
boardPresenter.init();
