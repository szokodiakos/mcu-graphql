import { startServer } from './server'

const port = 3000
startServer(port)
  .then(() => {
    console.log(`Server running on port ${port}.`)
  })
  .catch((err) => {
    console.log(`Server error: ${err.stack ?? err}`)
  })
