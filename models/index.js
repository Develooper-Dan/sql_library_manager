//Setting up the database and connecting sequelize to it
const Sequelize = require('sequelize');
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'library.db',
  logging: false
})

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
  
const db = {
  sequelize,
  Sequelize,
  models: {},
};

db.models.Book = require('./book.js')(sequelize);

module.exports = db;
