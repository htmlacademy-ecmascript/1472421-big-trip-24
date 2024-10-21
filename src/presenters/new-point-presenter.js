import { UpdateType, UserAction } from '../const/points-const';
import EditPointView from '../views/edit-point-view';
import { RenderPosition, remove, render } from '../framework/render';

export default class NewPointPresenter {

  #offers = [];
  #destinations = [];

  #pointListContainer = null;
  #viewActionHandler = null;
  #editPointComponent = null;

  constructor ({pointListContainer, onPointChange}) {
    this.#pointListContainer = pointListContainer;
    this.#viewActionHandler = onPointChange;
  }


  init(offers, destinations) {
    if(this.#editPointComponent !== null){
      return;
    }

    this.#offers = offers;
    this.#destinations = destinations;

    this.#editPointComponent = new EditPointView({
      offers: this.#offers,
      destinations: this.#destinations,
      onSubmitButtonClick: this.#onSubmitButtonClick,
      onDeleteButtonClick: this.#onDeleteButtonClick,
    });

    render(this.#editPointComponent, this.#pointListContainer.element, RenderPosition.AFTERBEGIN);

    document.addEventListener('click', this.#escKeyDownHandler);
  }

  destroy() {
    if(this.#editPointComponent === null){
      return;
    }

    remove(this.#editPointComponent);
    this.#editPointComponent = null;

    document.removeEventListener('click', this.#escKeyDownHandler);
  }

  setSaving(){
    this.#editPointComponent.updateElement({
      isDisabled: true,
      isSaving: true
    });
  }

  setAborting(){
    const resetFormState = () => {
      this.#editPointComponent.updateElement({
        isDeleting: false,
        isSaving: false,
        isDisabled: false
      });
    };

    this.#editPointComponent.shake(resetFormState);
  }

  #onSubmitButtonClick = (state) => {
    this.#viewActionHandler(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      state
    );
  };

  #onDeleteButtonClick = () => {
    this.destroy();
  };

  #escKeyDownHandler = (evt) => {
    if(evt.key === 'Escape' || evt.key === 'Esc'){
      evt.preventDefault();
      this.destroy();
    }
  };
}
