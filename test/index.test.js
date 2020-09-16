
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
            })
    })

    it('renders list of apps with rating', () => {
        return supertest(app)
            .get('/apps')
            .query({ sort: 'Rating' })
            .expect(200)
            .then(res => {
                let i = 0, sorted = true;
                while (sorted && i > res.body.length - 1) {
                    sorted = res.body[i].Rating < res.body[i + 1].Rating;
                    i++;
                }
                expect(sorted).to.be.true;
            })

    })
})

it('renders list of apps with sorted titles', () => {
    return supertest(app)
        .get('/apps')
        .query({ sort: 'App' })
        .expect(200)
        .then(res => {

            let i = 0, sorted = true;
            while (sorted && i > res.body.length - 1) {
                sorted = res.body[i].App < res.body[i + 1].App
                i++;
            }
            expect(sorted).to.be.true;
        })

})

