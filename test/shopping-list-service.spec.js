const ShoppingListService = require('../src/shopping-list-service');
const knex = require('knex');
const { expect } = require('chai');

describe('ShoppingList service object', () => {
    let db;
    const testItems = [
        {
            id: 1,
            name: 'Fresh Pet',
            price: '11.99',
            date_added: new Date('2029-01-22T16:28:32.615Z'),
            checked: false,
            category: 'Main',
        },
        {
            id: 2,
            name: 'Ice cream',
            price: '2.39',
            date_added: new Date('2029-01-22T16:28:32.615Z'),
            checked: true,
            category: 'Snack',
        },
        {
            id: 3,
            name: 'Jimmy Dean Sandwhiches',
            price: '8.99',
            date_added: new Date('2029-01-22T16:28:32.615Z'),
            checked: false,
            category: 'Breakfast',
        },
    ];

    before(() => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL,
        });
    });

    before(() => db('shopping_list').truncate());
    
    afterEach(() => db('shopping_list').truncate());

    after(() => db.destroy());

    context(`Given 'shopping_list' has data`, () => {
        beforeEach(() => {
            return db
                .into('shopping_list')
                .insert(testItems);
        });

        it(`getAllItems() resolves all items from 'shopping_list' table`, () => {
            return ShoppingListService.getAllItems(db)
                .then(actual => {
                    expect(actual).to.eql(testItems);
                });
        });

        it(`getById() resolves an items by id from 'shopping_list' table`, () => {
            const thirdID = 3;
            const thirdTestItem = testItems[thirdID - 1];
            return ShoppingListService.getById(db, thirdID)
                .then(actual => {
                    const { name, price, date_added, checked, category } = thirdTestItem;
                    expect(actual).to.eql({
                        id: thirdID,
                        name,
                        price, 
                        date_added,
                        checked,
                        category,
                    });
                });
        });

        it(`deleteItem() removes an item by id from 'shopping_list' table`, () => {
            const itemID = 3;
            return ShoppingListService.deleteItem(db, itemID)
                .then(() => ShoppingListService.getAllItems(db))
                .then(allItems => {
                    const expected = testItems.filter(item => item.id !== itemID);
                    expect(allItems).to.eql(expected);
                });
        });

        it(`updateItem() updates an item from the 'shopping_list' table`, () => {
            const idOfItemToUpdate = 3;
            const newItemData = {
                name: 'bagels',
                price: '3.50',
                date_added: new Date(),
                checked: true,
                category: 'Breakfast',
            }
            return ShoppingListService.updateItem(db, idOfItemToUpdate, newItemData)
                .then(() => ShoppingListService.getById(db, idOfItemToUpdate))
                .then(item => {
                    expect(item).to.eql({
                        id: idOfItemToUpdate,
                        ...newItemData,
                    });
                });
        });
    });

    context(`Given 'shopping_list' has no data`, () => {
        it(`getAllItems() resolves an empty array`, () => {
            return ShoppingListService.getAllItems(db)
                .then(actual => {
                    expect(actual).to.eql([]);
                })
        });
    });

    it(`insertItem() inserts a new item and resolves the new item with an 'id'`, () => {
        const newItem = {
            name: 'test item',
            price: '1.00',
            date_added: new Date('2020-01-01T00:00:00.000Z'),
            checked: true,
            category: 'Main',
        }
        return ShoppingListService.insertItem(db, newItem)
            .then(actual => {
                const { name, price, date_added, checked, category } = newItem;
                expect(actual).to.eql({
                    id: 1,
                    name,
                    price,
                    date_added,
                    checked,
                    category,
                });
            });
    });
});