import { faker } from '@faker-js/faker';
import { sample } from 'lodash';

// ----------------------------------------------------------------------

const PRODUCT_NAME = [
  'Sell ​​gardening products',
  'Sell ​​gardening products',
  'Sell ​​gardening products',
  'Sell ​​gardening products',
  'Sell ​​gardening products',
  'Sell ​​gardening products',
  'Sell ​​gardening products',
  'Sell ​​gardening products',
  'Sell ​​gardening products',
  'Sell ​​gardening products',
  'Sell ​​gardening products',
  'Sell ​​gardening products',
  'Sell ​​gardening products',
  'Sell ​​gardening products',
  'Sell ​​gardening products',
  'Sell ​​gardening products',
  'Sell ​​gardening products',
  'Sell ​​gardening products',
  'Sell ​​gardening products',
  'Sell ​​gardening products',
  'Sell ​​gardening products',
  'Sell ​​gardening products',
  'Sell ​​gardening products',
  'Sell ​​gardening products',
];
const PRODUCT_COLOR = ['#00AB55', '#000000', '#FFFFFF', '#FFC0CB', '#FF4842', '#1890FF', '#94D82D', '#FFC107'];

// ----------------------------------------------------------------------

const products = [...Array(24)].map((_, index) => {
  const setIndex = index + 1;

  return {
    id: faker.string.uuid(),
    cover: `/static/mock-images/products/product_${setIndex}.jpg`,
    name: PRODUCT_NAME[index],
    price: faker.number.float({ min: 4, max: 99, fractionDigits: 2 }),
    priceSale: setIndex % 3 ? null : faker.number.float({ min: 19, max: 29, fractionDigits: 2 }),
    colors:
      (setIndex === 1 && PRODUCT_COLOR.slice(0, 2)) ||
      (setIndex === 2 && PRODUCT_COLOR.slice(1, 3)) ||
      (setIndex === 3 && PRODUCT_COLOR.slice(2, 4)) ||
      (setIndex === 4 && PRODUCT_COLOR.slice(3, 6)) ||
      (setIndex === 23 && PRODUCT_COLOR.slice(4, 6)) ||
      (setIndex === 24 && PRODUCT_COLOR.slice(5, 6)) ||
      PRODUCT_COLOR,
    status: sample(['sale', 'new', '', '']),
  };
});

export default products;
