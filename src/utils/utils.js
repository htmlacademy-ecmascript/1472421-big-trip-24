const getRandomInt = (min, max) => {
  const lower = Math.ceil(Math.min(min, max));
  const upper = Math.floor(Math.max(min, max));
  const result = Math.random() * (upper - lower + 1) + lower;
  return Math.floor(result);
};

const findById = (arr, id) => arr.find((element) => element.id === id);

const getRandomArrayElement = (items) => items[Math.floor(Math.random() * items.length)];

const capitalizeFirstLetter = (str) => str.charAt(0).toUpperCase() + str.slice(1);

export {
  getRandomInt,
  findById,
  getRandomArrayElement,
  capitalizeFirstLetter,
};
