import { isActualPoint, isExpiredPoint, isFuturePoint } from '../utils/points-utils';


const FiltersPoint = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past',
  NO_LOADED: 'no loaded'
};

const filter = {
  [FiltersPoint.EVERYTHING]: (points) => points,
  [FiltersPoint.FUTURE]: (points) => points.filter((point) => isFuturePoint(point)),
  [FiltersPoint.PRESENT]: (points) => points.filter((point) => isActualPoint(point)),
  [FiltersPoint.PAST]: (points) => points.filter((point) => isExpiredPoint(point))
};

const NoPointTextByFilter = {
  [FiltersPoint.EVERYTHING]: 'Click New Event to create your first point',
  [FiltersPoint.FUTURE]: 'There are no future events now',
  [FiltersPoint.PAST]: 'There are no past events now',
  [FiltersPoint.PRESENT]: 'There are no present events now',
  [FiltersPoint.NO_LOADED]: 'Failed to load latest route information'
};

export {
  FiltersPoint,
  filter,
  NoPointTextByFilter
};
