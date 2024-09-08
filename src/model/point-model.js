import { generationPoints } from '../mocks/point-mock';


export default class PointsModel {

  #points = generationPoints();

  get points() {
    return this.#points;
  }

}
