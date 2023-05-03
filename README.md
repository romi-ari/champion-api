# Champion API

This project using repository pattern

## How to run
Create docker image
- `docker build -t champion-api .`

Run docker compose
- `docker compose up`

Create and migrating database
- `docker exec [CONTAINER ID/NAME] npm run db:setup`

Stop and remove docker compose
- `docker compose down`

In this repository there are several scripts that can be used in managing databases.

- `npm db:setup` used to setup database delete database (if database with the same name), create database, and perform table migration
