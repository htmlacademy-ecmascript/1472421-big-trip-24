import { createElement } from '../../render';

const createFailedLoadDataViewTemplate = () => {
  return (
    `<p class="trip-events__msg">Failed to load latest route information</p>`
  );
}

export default class FailedLoadDataView {
  getTemplate() {
    return createFailedLoadDataViewTemplate();
  }

  getElement() {
    if(!this.element){
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
