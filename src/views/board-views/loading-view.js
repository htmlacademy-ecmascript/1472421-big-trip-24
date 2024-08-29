import { createElement } from '../../render';

const createLoadingViewTemplate = () => {
  return (
    `<p class="trip-events__msg">Loading...</p>`
  );
}

export default class LoadingView {
  getTemplate() {
    return createLoadingViewTemplate();
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
