import { FiltersPoint, filter } from '../const/filter-const';
import { UpdateType } from '../const/points-const';
import { remove, render, replace } from '../framework/render';
import FilterView from '../views/filter-view';

export default class FilterPresenter {

  #filterContainer = null;
  #filterModel = null;
  #pointsModel = null;
  #filterComponent = null;

  constructor({filterContainer, filterModel, pointsModel}) {
    this.#filterContainer = filterContainer;
    this.#filterModel = filterModel;
    this.#pointsModel = pointsModel;

    this.#pointsModel.addObserver(this.#modelChangeHandler);
    this.#filterModel.addObserver(this.#modelChangeHandler);
  }

  get filters() {
    const points = this.#pointsModel.points;

    return [
      {
        type: FiltersPoint.EVERYTHING,
        name: 'everything',
        count: filter[FiltersPoint.EVERYTHING](points).length
      },
      {
        type: FiltersPoint.FUTURE,
        name: 'future',
        count: filter[FiltersPoint.FUTURE](points).length
      },
      {
        type: FiltersPoint.PRESENT,
        name: 'present',
        count: filter[FiltersPoint.PRESENT](points).length
      },
      {
        type: FiltersPoint.PAST,
        name: 'past',
        count: filter[FiltersPoint.PAST](points).length
      },
    ];
  }

  init() {
    const filters = this.filters;
    const prevFilterComponent = this.#filterComponent;

    this.#filterComponent = new FilterView({
      filters,
      currentFilterType: this.#filterModel.filter,
      onFilterTypeChange: this.#filterTypeChangeHandler
    });

    if(prevFilterComponent === null){
      render(this.#filterComponent, this.#filterContainer);
      return;
    }

    replace(this.#filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  #modelChangeHandler = () => {
    this.init();
  };

  #filterTypeChangeHandler = (filterType) => {
    if(this.#filterModel.filter === filterType){
      return;
    }

    this.#filterModel.setFilter(UpdateType.MAJOR, filterType);
  };
}
