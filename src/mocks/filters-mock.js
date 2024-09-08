import { filter } from '../const';

const generationFilters = (points) => Object.entries(filter).map(([filterType, filterPatternByType]) => ({
  type: filterType,
  count: filterPatternByType(points).length
}));

export { generationFilters};
