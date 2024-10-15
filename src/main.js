import BoardPresenter from './presenters/board-presenter.js';
import InfoView from './views/info-view.js';
import { render } from './framework/render.js';
import PointsModel from './model/points-model.js';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenters/filter-presenter.js';
import NewPointButtonView from './views/new-point-button-view.js';
import PointApiService from './point-api-service.js';


const END_POINT = 'https://24.objects.htmlacademy.pro/big-trip';
const AUTHORIZATION = 'Basic 24FefwFf423Fvsz';

const pointsModel = new PointsModel({
  pointApiService: new PointApiService(END_POINT, AUTHORIZATION)
});

const filterModel = new FilterModel();


const boardContainer = document.querySelector('.trip-events');
const headerContainer = document.querySelector('.trip-main');


render(new InfoView(), headerContainer);


const filterPresenter = new FilterPresenter({
  headerContainer,
  filterModel,
  pointsModel
});

const boardPresenter = new BoardPresenter({
  boardContainer,
  pointsModel,
  filterModel
});

const newPointButtonClickHandler = () => {
  boardPresenter.createPoint();
};

const newPointButtonComponent = new NewPointButtonView({
  onNewPointButtonClick: newPointButtonClickHandler
});



filterPresenter.init();
render(newPointButtonComponent, headerContainer);

boardPresenter.init()
pointsModel.init();



