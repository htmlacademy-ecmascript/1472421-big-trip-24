import { createElement } from '../../render';

function createEmptyListPointsViewTemplate() {
  return '<p class="trip-events__msg">Click New Event to create your first point</p>';
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
