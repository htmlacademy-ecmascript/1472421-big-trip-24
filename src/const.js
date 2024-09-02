const MessageBoard = {
  EMPTY_LIST: 'Click New Event to create your first point',
  LOADING: 'Loading...',
  FAILED_LOAD: 'Failed to load latest route information'
};

const EDIT_POINT_DATE_FORMAT = 'DD/MM/YY HH:mm';

const POINT_DATE_FORMAT = 'HH:mm';

const SHOW_POINT_COUNT = 3;

const EVENT_TYPES = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

const CITYS = ['Amsterdam', 'Geneva', 'Chamonix'];

const POINT_COUNT = 4;


export {MessageBoard, SHOW_POINT_COUNT, EVENT_TYPES, CITYS, POINT_COUNT, EDIT_POINT_DATE_FORMAT, POINT_DATE_FORMAT};
