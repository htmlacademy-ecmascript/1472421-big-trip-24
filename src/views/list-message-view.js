import { MessageBoard } from '../const';
import AbstractView from '../framework/view/abstract-view';

function createEmptyListPointsTemplate() {
  return `<p class="trip-events__msg">${MessageBoard.EMPTY_LIST}</p>`;
}

export default class EmptyListPointsView extends AbstractView{
  get template() {
    return createEmptyListPointsTemplate();
  }
}
