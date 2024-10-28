import BoardPresenter from './presenters/board-presenter.js';
import { render } from './framework/render.js';
import PointsModel from './model/points-model.js';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenters/filter-presenter.js';
import NewPointButtonView from './views/new-point-button-view.js';
import PointApiService from './point-api-service.js';
import InfoPresenter from './presenters/info-presenter.js';


const END_POINT = 'https://24.objects.htmlacademy.pro/big-trip';
const AUTHORIZATION = 'Basic 24FefwFf64g4dde23Fvsz';

const pointsModel = new PointsModel({
  pointApiService: new PointApiService(END_POINT, AUTHORIZATION)
});

const filterModel = new FilterModel();


const boardContainer = document.querySelector('.trip-events');
const headerContainer = document.querySelector('.trip-main');
const filterContainer = headerContainer.querySelector('.trip-controls');


const infoPresenter = new InfoPresenter({
  headerContainer,
  pointsModel
});

const filterPresenter = new FilterPresenter({
  filterContainer,
  filterModel,
  pointsModel
});

const boardPresenter = new BoardPresenter({
  boardContainer,
  pointsModel,
  filterModel,
  onNewPointClose: handleNewPointClose
});

const newPointButtonComponent = new NewPointButtonView({
  onNewPointButtonClick: newPointButtonClickHandler,
});

function newPointButtonClickHandler() {
  boardPresenter.createPoint();
  newPointButtonComponent.element.disabled = true;
}

function handleNewPointClose(){
  newPointButtonComponent.element.disabled = false;
}


filterPresenter.init();
boardPresenter.init();
pointsModel.init()
  .finally(() => {
    render(newPointButtonComponent, headerContainer);
    infoPresenter.init();
  });
