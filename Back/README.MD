# How to run

- Dev, with nodemon for auto-reload and eslint : `npm run dev`
- Regular, without nodemon and eslint : `npm start`

# Database

## How to add model

`node_modules/.bin/sequelize model:generate --name User --attributes firstName:string,lastName:string,email:string`

## How to sync database

The database will be automatically synced when runnning the project.

# Authors

- Corentin Garcia
- Henri Baudesson