const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  class Book extends Sequelize.Model{}

  Book.init({
    title: {
      type: Sequelize.STRING,
      allowNull: false,
      validate:{
        notEmpty: { msg: "Please enter a book title." },
        not: {
          args: ["[<>&]", "g"],
          msg: "<, > and & characters are not allowed!"
        }
      }
    },
    author: {
      type: Sequelize.STRING,
      allowNull: false,
      validate:{
        notEmpty:  {msg: "Please enter an author" },
        not: {
          args: ["[<>&]", "g"],
          msg: "<, > and & characters are not allowed!"
        }
      }
    },
    genre: {
      type: Sequelize.STRING,
      validate:{
        not: {
          args: ["[<>&]", "g"],
          msg: "<, > and & characters are not allowed!"
        }
      }
    },
    year:{
      type: Sequelize.INTEGER,
      validate:{
        is: {
          args: [/^[\d\s]*$/g],
          msg: "If you want to enter a year, please makes sure you only use numbers"
        }
      }
    }
  }, {sequelize});

  return Book;
}
