const excel = require('excel-to-mongodb');

const cred = {
    host: 'localhost',
    path: './test.xlsx',
    collection: 'test',
    db: 'nimble',
};

excel.covertToMongo(cred, {}, (r) => {
    console.log('-->', r);
});