### [Shirako Eats](https://eats.shirako.dev)

Full-stack app built on Nuxt.js with an Express server middleware.

### Requirements

This app is currently configured to be deployed on Heroku. You must have the following services:

- PostgreSQL
- Redis
- SendGrid

If you wish to decouple this app from Heroku such as to deploy it within AWS or Google Cloud, you need to configure their connections within the environment variables yourself.

You must also obtain an API key from Yelp and configure a tenant within Auth0.

### Development

Run the local dev server with HMR with `npm run dev`.

### Deployment

Build the client with `npm run build` and start the production server with `npm run start`.
