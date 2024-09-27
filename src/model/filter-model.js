import { FiltersPoint } from "../const/filter-const";
import Observable from "../framework/observable";


export default class FilterModel extends Observable {

  #filter = FiltersPoint.EVERYTHING;

  get filter() {
    return this.#filter;
  }

  setFilter(updateType, filter) {
    this.#filter = filter;

    this._notify(updateType, filter);
  }
}
