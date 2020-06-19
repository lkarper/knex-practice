require('dotenv').config();
const knex = require('knex');

const knexInstance = knex({
    client: 'pg',
    connection: process.env.DB_URL
});

console.log(process.env.DB_URL)

const findByTerm = (searchText) => {
    knexInstance
        .select('name')
        .from('shopping_list')
        .where('name', 'ILIKE', `%${searchText}%`)
        .then(result => console.log(result));
}

// findByTerm('burg');
// findByTerm('fish');

const getAllItemsPaginated = (pageNumber) => {
    const offset = 6 * (pageNumber - 1);
    knexInstance
        .select('*')
        .from('shopping_list')
        .limit(6)
        .offset(offset)
        .then(result => console.log(result));
}

// getAllItemsPaginated(5);
// getAllItemsPaginated(1);

const getItemsAddedAfterDate = (daysAgo) => {
    knexInstance
        .select('*')
        .from('shopping_list')
        .where(
            'date_added',
            '>',
            knexInstance.raw(`now() - '?? days'::INTERVAL`, daysAgo)
        )
        .then(result => console.log(result));
}

// getItemsAddedAfterDate(10);
// getItemsAddedAfterDate(45);
// getItemsAddedAfterDate(100);

const getTotalCostForEachCategory = () => {
    knexInstance
        .select('category')
        .sum('price AS total_cost')
        .from('shopping_list')
        .groupBy('category')
        .then(result => console.log(result));
}

getTotalCostForEachCategory();
