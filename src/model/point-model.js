import { generationPoints } from '../mocks/point-mock';


export default class PointsModel {

  points = generationPoints();

  getPoints() {
    return this.points;
  }

}
