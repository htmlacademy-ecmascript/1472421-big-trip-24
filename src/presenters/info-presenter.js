import { remove, render, RenderPosition } from '../framework/render';
import InfoView from '../views/info-view';

export default class InfoPresenter {
  #headerContainer = null;
  #infoComponent = null;
  #pointsModel = null;

  constructor({headerContainer, pointsModel}){
    this.#headerContainer = headerContainer;
    this.#pointsModel = pointsModel;

    this.#pointsModel.addObserver(this.#modelChangeHandler);
  }

  init(){
    if(this.#pointsModel.points.length === 0){
      if (this.#infoComponent !== null) {
        this.#removeInfoComponent();
      }
      return;
    }

    this.#renderInfo();
  }

  get points() {
    return this.#pointsModel.points;
  }

  get offers() {
    return this.#pointsModel.offers;
  }

  get destinations() {
    return this.#pointsModel.destinations;
  }

  #renderInfo(){

    if(this.#infoComponent !== null){
      this.#removeInfoComponent();
    }

    this.#infoComponent = new InfoView({points: this.points, offers: this.offers, destinations: this.destinations});
    render(this.#infoComponent, this.#headerContainer, RenderPosition.AFTERBEGIN);
  }

  #removeInfoComponent() {
    remove(this.#infoComponent);
    this.#infoComponent = null;
  }

  /* Тут используется стрелочная функция, потому что
  она запоминает this того месте, где была объявлена.
  Данная функция будет вызвана классом Observer, а выполнить она
  должна метод init() infoPresenter'a. Поэтому
  используется стрелочная функция */
  #modelChangeHandler = () => {
    this.init();
  };
}
