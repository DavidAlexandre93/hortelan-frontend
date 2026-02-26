import { faker } from '@faker-js/faker';

// ----------------------------------------------------------------------

const POST_TITLES = [
  'User post in the Hortelan AgTech Ltda community',
  'User post in the Hortelan AgTech Ltda community',
  'User post in the Hortelan AgTech Ltda community',
  'User post in the Hortelan AgTech Ltda community',
  'User post in the Hortelan AgTech Ltda community',
  'User post in the Hortelan AgTech Ltda community',
  'User post in the Hortelan AgTech Ltda community',
  'User post in the Hortelan AgTech Ltda community',
  'User post in the Hortelan AgTech Ltda community',
  'User post in the Hortelan AgTech Ltda community',
  'User post in the Hortelan AgTech Ltda community',
  'User post in the Hortelan AgTech Ltda community',
  'User post in the Hortelan AgTech Ltda community',
  'User post in the Hortelan AgTech Ltda community',
  'User post in the Hortelan AgTech Ltda community',
  'User post in the Hortelan AgTech Ltda community',
  'User post in the Hortelan AgTech Ltda community',
  'User post in the Hortelan AgTech Ltda community',
  'User post in the Hortelan AgTech Ltda community',
  'User post in the Hortelan AgTech Ltda community',
  'User post in the Hortelan AgTech Ltda community',
  'User post in the Hortelan AgTech Ltda community',
  'User post in the Hortelan AgTech Ltda community',
  'User post in the Hortelan AgTech Ltda community',
];

const posts = [...Array(23)].map((_, index) => ({
  id: faker.datatype.uuid(),
  cover: `/static/mock-images/covers/cover_${index + 1}.jpg`,
  title: POST_TITLES[index + 1],
  createdAt: faker.date.past(),
  view: faker.datatype.number(),
  comment: faker.datatype.number(),
  share: faker.datatype.number(),
  favorite: faker.datatype.number(),
  author: {
    name: faker.name.findName(),
    avatarUrl: `/static/mock-images/avatars/avatar_${index + 1}.jpg`,
  },
}));

export default posts;
