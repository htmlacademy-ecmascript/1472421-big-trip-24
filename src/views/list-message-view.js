import { NoPointTextByFilter } from '../const/filter-const';
import AbstractView from '../framework/view/abstract-view';

function createEmptyListPointsTemplate(filterType) {
  return `<p class="trip-events__msg">${NoPointTextByFilter[filterType]}</p>`;
}

export default class ListMessageView extends AbstractView{

  #filterType = null;

  constructor({filterType}){
    super();
    this.#filterType = filterType;
  }

  get template() {
    console.log(this.#filterType)
    return createEmptyListPointsTemplate(this.#filterType);
  }
}
