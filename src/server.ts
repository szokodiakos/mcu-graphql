import express from 'express'
import { graphqlHTTP } from 'express-graphql'
import { schema } from './schema'

const app = express()
app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    graphiql: true,
  })
)

export async function startServer(port: number) {
  return new Promise((resolve) => {
    app.listen(port, () => resolve(app))
  })
}
