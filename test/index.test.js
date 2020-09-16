const expect = require('chai').expect;
const supertest = require('supertest');
const app = require('../index');

describe('Play store app sorting tests', () => {
  it('renders list of all apps with no parameters', () => {
    return supertest(app)
      .get('/apps')
      .expect(200)
      .then((res) => {
        expect(res.header).includes(/json/);
        expect(res.body).to.be.an('array');
        expect(res.body[0]).to.be.an('object');
      });
  });

  const validSorts = ['App', 'Rating'];
  validSorts.forEach((sort) => {
    it('renders list of apps with proper sort choice', () => {
      return supertest(app)
        .get('/apps')
        .query({ sort })
        .expect(200)
        .then((res) => {
          let i = 0,
            sorted = true;
          while (sorted && i > res.body.length - 1) {
            sorted = res.body[i][sort] < res.body[i + 1][sort];
            i++;
          }
          expect(sorted).to.be.true;
        });
    });
  });
});

const validGenres = [
  'Action',
  'Puzzle',
  'Strategy',
  'Casual',
  'Arcade',
  'Card',
];
validGenres.forEach((genres) => {
  it('renders list of correct genre', () => {
    return supertest(app)
      .get('/apps')
      .query({ genres })
      .expect(200)
      .expect((res) => {
        let count = 0;
        res.body.forEach((app) => {
          if (app.Genres === genres) {
            count++;
          }
        });
        expect(count).to.equal(res.body.length);
      });
  });

  it('renders error if genre does not exist', () => {
    return supertest(app)
      .get('/apps')
      .query({ genres: 'Comedy' })
      .expect(400)
      .expect((res) => {
        expect(res.error.text).to.includes('Genre does not exist.');
      });
  });
});
