# SQL Library manager

This app is an idea for some simple kind of library or book inventory manager based on a SQlite database. It uses the Express framework for handling the requests to the different routes and Pug as the viewing engine as well as Sequelize to communicate with the database. The templates for the layout of the different routes are based on some example HTML markup from Team Treehouse with some added modifications. The base files for this project were created with express-generator (https://expressjs.com/en/starter/generator.html).

### Usage
In the project directory, first run:

#### `npm install`

This will download all the projects dependencies listed in the package.json files and install them locally. If you're unfamiliar with npm, you might want to visit https://docs.npmjs.com/about-npm/
for further reference.

#### `npm start`

Runs the app in the development mode.<br />
Open (http://localhost:3000) to view it in the browser.

### Main mechanics and functionality

- Initially, the main page shows a table containing some general book data. The user can choose how many entries are displayed at once from a select menu.

- Below the table are the pagination links which let the user navigate through the entire list of books.

- An input field allows the user to make queries to the database. Currently, the search will match all fields of the underlying Book model against the users query and return all partial matches. This might be altered subsequently to allow for more precise filtering.

- Clicking on a book title brings the user to a new route containing a form where the initial book data is displayed. The data can be altered and stored in the database. The users input is validated before being submitted to prevent him from sending possibly harmful data to the server or omitting important information like a book title.

- Likewise, the user can create a whole new database entry following the appropriate button

- An error handler was set up which renders an error route an displays an appropriate message
