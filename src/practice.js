require('dotenv').config();
const knex = require('knex');

const knexInstance = knex({
    client: 'pg',
    connection: process.env.DB_URL,
});

// const q1 = knexInstance('amazong_products').select('*').toQuery();
// const q2 = knexInstance.from('amazong_products').select('*').toQuery();

// console.log('q1:', q1);

// console.log('q2:', q2);

// knexInstance('amazong_products').select('*')
//     .then(result => console.log(result));


// SELECT product_id, name, price, category
//   FROM amazong_products
// WHERE name = 'Point of view gun' limit 1;
// Equivalent to VVV
// const qry = knexInstance
//     .select('product_id', 'name', 'price', 'category')
//     .from('amazong_products')
//     .where({ name: 'Point of view gun' })
//     .first() // pulls the first item out of the array, so there is only one object, not an array with one object in it
//     .toQuery();
//     // .then(result => console.log(result));
// console.log(qry);

// select product_id, name, price, category
// 	from amazong_products
// 	where name ilike '%holo%';
// Equivalent to VVV
// const searchByProduceName = (searchTerm) => {
//     knexInstance
//     .select('product_id', 'name', 'price', 'category')
//     .from('amazong_products')
//     .where('name', 'ILIKE', `%${searchTerm}%`)
//     .then(result => console.log(result));
// }

// searchByProduceName('holo');


// SELECT product_id, name, price, category
//   FROM amazong_products
// LIMIT 10
//   OFFSET 2;
// Equivalent to VVV
// const paginateProducts = (page) => {
//     const productsPerPage = 10;
//     const offset = productsPerPage * (page - 1);
//     knexInstance
//     .select('product_id', 'name', 'price', 'category')
//     .from('amazong_products')
//     .limit(productsPerPage)
//     .offset(offset)
//     .then(result => console.log(result));
// }

// paginateProducts(2);

// SELECT product_id, name, price, category, image
//   FROM amazong_products
//   WHERE image IS NOT NULL;
// Equivalent to VVV
// const getProductsWithImages = () => {
//     knexInstance
//     .select('product_id', 'name', 'price', 'category', 'image')
//     .from('amazong_products')
//     .whereNotNull('image')
//     .then(result => console.log(result));
// }

// getProductsWithImages();

// SELECT video_name, region, count(date_viewed) AS views
// FROM whopipe_video_views
//   WHERE date_viewed > (now() - '30 days'::INTERVAL)
// GROUP BY video_name, region
// ORDER BY region ASC, views DESC;
// Equivalent to VVV
const mostPopularVideosForDays = (days) => {
    knexInstance
        .select('video_name', 'region')
        .count('date_viewed AS views')
        .where(
            'date_viewed',
            '>',
            knexInstance.raw(`now() - '?? days'::INTERVAL`, days)
            /* Knex doesn't have methods for the now() - '30 days'::INTERVAL. 
            Instead, knex provides a fallback method called .raw(). We can use the raw method to pass in "raw" SQL as a string.
            An extra security measure is to tell the raw method that the raw SQL contains user input. 
            We used ?? to tell knex that this is the position in the raw SQL that will contain user input. 
            We then specify the value for the user input as the second argument to .raw(). This is called a prepared statement */
        )
        .from('whopipe_video_views')
        .groupBy('video_name', 'region')
        .orderBy([
            { column: 'region', order: 'ASC' },
            { column: 'views', order: 'DESC' },
        ])
        .then(result => console.log(result));
}

mostPopularVideosForDays(30);