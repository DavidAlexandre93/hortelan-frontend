import { faker } from '@faker-js/faker';

// ----------------------------------------------------------------------

const POST_TITLES = [
  'User post in the Hortelan community',
  'User post in the Hortelan community',
  'User post in the Hortelan community',
  'User post in the Hortelan community',
  'User post in the Hortelan community',
  'User post in the Hortelan community',
  'User post in the Hortelan community',
  'User post in the Hortelan community',
  'User post in the Hortelan community',
  'User post in the Hortelan community',
  'User post in the Hortelan community',
  'User post in the Hortelan community',
  'User post in the Hortelan community',
  'User post in the Hortelan community',
  'User post in the Hortelan community',
  'User post in the Hortelan community',
  'User post in the Hortelan community',
  'User post in the Hortelan community',
  'User post in the Hortelan community',
  'User post in the Hortelan community',
  'User post in the Hortelan community',
  'User post in the Hortelan community',
  'User post in the Hortelan community',
  'User post in the Hortelan community',
];

const posts = [...Array(23)].map((_, index) => ({
  id: faker.string.uuid(),
  cover: `/static/mock-images/covers/cover_${index + 1}.jpg`,
  title: POST_TITLES[index + 1],
  createdAt: faker.date.past(),
  view: faker.number.int({ min: 0, max: 9999 }),
  comment: faker.number.int({ min: 0, max: 9999 }),
  share: faker.number.int({ min: 0, max: 9999 }),
  favorite: faker.number.int({ min: 0, max: 9999 }),
  author: {
    name: faker.person.fullName(),
    avatarUrl: `/static/mock-images/avatars/avatar_${index + 1}.jpg`,
  },
}));

export default posts;
