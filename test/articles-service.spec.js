const ArticlesService = require('../src/articles-service');
const knex = require('knex');
const { expect } = require('chai');

describe.skip('Articles service object', () => {
    let db;
    const testArticles = [
        {
            id: 1,
            date_published: new Date('2029-01-22T16:28:32.615Z'),
            title: 'First test post!',
            content: 'Pariatur tempor incididunt ullamco proident incididunt dolor labore minim.'
        },
        {
            id: 2,
            date_published: new Date('2100-05-22T16:28:32.615Z'),
            title: 'Second test post!',
            content: 'Consequat consectetur commodo consectetur sint deserunt veniam ad est.'
        },
        {
            id: 3,
            date_published: new Date('1919-12-22T16:28:32.615Z'),
            title: 'Third test post!',
            content: 'Labore laboris pariatur commodo fugiat pariatur consectetur nulla nulla.'
        },
    ];

    before(() => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL,
        });
    });

    before(() => db('blogful_articles').truncate());

    afterEach(() => db('blogful_articles').truncate());

    after(() => db.destroy());  // closes the db connection; destroy returns a promise, but using an implicit return returns us out of the promise

    context(`Given 'blogful_articles' has data`, () => { // Context does the same thing as describe, it just uses different semantics
        // Only insert data here so that we can test for an empty dataset beforehand
        beforeEach(() => {
            return db
                .into('blogful_articles')
                .insert(testArticles);
        });

        it(`getAllArticles() resolves all articles from 'blogful_articles' table`, () => {
            return ArticlesService.getAllArticles(db)
                .then(actual => {
                    expect(actual).to.eql(testArticles);
                });
        });

        it(`getbyID() resolves an article by id from 'blogful_articles' tables`, () => {
            const thirdID = 3;
            const thirdTestArticle = testArticles[thirdID - 1];
            return ArticlesService.getById(db, thirdID)
                .then(actual => {
                    const { title, content, date_published } = thirdTestArticle;
                    expect(actual).to.eql({
                        id: thirdID,
                        title,
                        content,
                        date_published,
                    });
                });
        });

        it(`deleteArticle() removes an article by id from 'blogful_articles' table`, () => {
            const articleId = 3;
            return ArticlesService.deleteArticle(db, articleId)
                .then(() => ArticlesService.getAllArticles(db))
                .then(allArticles => {
                    const expected = testArticles.filter(article => article.id !== articleId);
                    expect(allArticles).to.eql(expected);
                });
        });

        it(`updateArticle() updates an article from the 'blogful_articles' table`, () => {
            const idOfArticleToUpdate = 3;
            const newArticleData = {
                title: 'update title', 
                content: 'updated content',
                date_published: new Date(),
            }
            return ArticlesService.updateArticle(db, idOfArticleToUpdate, newArticleData)
                .then(() => ArticlesService.getById(db, idOfArticleToUpdate))
                .then(article => {
                    expect(article).to.eql({
                        id: idOfArticleToUpdate,
                        ...newArticleData,
                    });
                });
        });
    });

    context(`Given 'blogful_articles' has no data`, () => {
        it(`getAllArticles() resolves an empty array`, () => {
            return ArticlesService.getAllArticles(db)
                .then(actual => {
                    expect(actual).to.eql([]);
                });
        });
    });

    it(`insertArticle() inserts a new article and resolves the new article with an 'id'`, () => {
        const newArticle = {
            title: 'Test new title', 
            content: 'Test new content', 
            date_published: new Date('2020-01-01T00:00:00.000Z'),
        }
        return ArticlesService.insertArticle(db, newArticle)
            .then(actual => {
                const {title, content, date_published } = newArticle;
                expect(actual).to.eql({
                    id: 1,
                    title,
                    content,
                    date_published,
                });
            });
    });
});

