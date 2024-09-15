
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


export {
  MessageBoard,
  EVENT_TYPES,
  CITIES,
  POINT_COUNT,
  EDIT_POINT_DATE_FORMAT,
  POINT_DATE_FORMAT,
  PointMode
};
