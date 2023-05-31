const express = require('express')
const routes = require('./routes')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()
const app = express()

const apiPrefix = '/api/v1'

app.use(express.json());
app.listen(4000, () => console.log("Server is running on port 4000"));

app.use(apiPrefix + '/authentication', routes.auth)

async function main() {
  // ... you will write your Prisma Client queries here
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })