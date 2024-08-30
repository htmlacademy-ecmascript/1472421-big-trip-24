import { LoadMessage } from '../const';
import { createElement } from '../render';

function createEmptyListPointsViewTemplate() {
  return `<p class="trip-events__msg">${LoadMessage.EMPTY_LIST}</p>`;
}

export default class EmptyListPointsView {
  getTemplate() {
    return createEmptyListPointsViewTemplate();
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
