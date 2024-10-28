const MessageBoard = {
  EMPTY_LIST: 'Click New Event to create your first point',
  LOADING: 'Loading...',
  FAILED_LOAD: 'Failed to load latest route information'
};

const EDIT_POINT_DATE_FORMAT = 'DD/MM/YY HH:mm';

const POINT_DATE_FORMAT = 'HH:mm';

const EVENT_TYPES = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

const CITIES = ['Amsterdam', 'Geneva', 'Chamonix'];

const POINT_COUNT = 10;

const PointMode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING'
};

const SortType = {
  DAY: 'day',
  EVENT: 'event',
  TIME: 'time',
  PRICE: 'price',
  OFFER: 'offer'
};

const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT'
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT'
};

const BLANK_POINT = {
  basePrice: 0,
  dateFrom: null,
  dateTo: null,
  destination: null,
  isFavorite: false,
  offers: [],
  type: EVENT_TYPES[5],
  isNewPoint: true
};

const RequestMethod = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE'
};

const SHOW_COUNT_DESTINATIONS = 3;

export {
  MessageBoard,
  EVENT_TYPES,
  CITIES,
  POINT_COUNT,
  EDIT_POINT_DATE_FORMAT,
  POINT_DATE_FORMAT,
  PointMode,
  SortType,
  UserAction,
  UpdateType,
  BLANK_POINT,
  RequestMethod,
  SHOW_COUNT_DESTINATIONS
};
