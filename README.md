# rysolv_analytics

Calculating git statistics for users

## Getting Started

Install dependencies

```
npm i
```

Add env variables

```
# Local Database
DB_HOST_LOCAL=localhost
DB_NAME_LOCAL=postgres
DB_PASSWORD_LOCAL=password
DB_PORT_LOCAL=3001
DB_USER_LOCAL=postgres

GITHUB_TOKEN=123123123
```

Run CLI

```
rysolv
```

Will prompt you:

```
What would you like to do?
> analyze user (takes github username)
  analyze repo (takes github past name ex: rysolv/rysolv)
  nuke (wipes /git folder)
```
