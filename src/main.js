import BoardPresenter from './presenters/board-presenter.js';
import InfoView from './views/header-views/info-view.js';
import FilterView from './views/header-views/filter-view.js';
import NewPointButtonView from './views/header-views/new-point-button-view.js';
import { render } from './render';

const boardContainer = document.querySelector('.trip-events');
const headerContainer = document.querySelector('.trip-main');

render(new InfoView(), headerContainer);
render(new FilterView(), headerContainer);
render(new NewPointButtonView(), headerContainer);
const boardPresenter = new BoardPresenter({boardContainer});

boardPresenter.init();
