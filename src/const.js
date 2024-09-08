import { isActualPoint, isExpiredPoint, isFuturePoint } from './utils';

const MessageBoard = {
  EMPTY_LIST: 'Click New Event to create your first point',
  LOADING: 'Loading...',
  FAILED_LOAD: 'Failed to load latest route information'
};

const EDIT_POINT_DATE_FORMAT = 'DD/MM/YY HH:mm';

const POINT_DATE_FORMAT = 'HH:mm';

const SHOW_POINT_COUNT = 10;

const EVENT_TYPES = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

const CITIES = ['Amsterdam', 'Geneva', 'Chamonix'];

const POINT_COUNT = 10;

const FiltersPoint = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past'
};

const filter = {
  [FiltersPoint.EVERYTHING]: (points) => points,
  [FiltersPoint.FUTURE]: (points) => points.filter((point) => isFuturePoint(point)),
  [FiltersPoint.PRESENT]: (points) => points.filter((point) => isActualPoint(point)),
  [FiltersPoint.PAST]: (points) => points.filter((point) => isExpiredPoint(point))
};


export {
  MessageBoard,
  SHOW_POINT_COUNT,
  EVENT_TYPES,
  CITIES,
  POINT_COUNT,
  EDIT_POINT_DATE_FORMAT,
  POINT_DATE_FORMAT,
  FiltersPoint,
  filter
};
