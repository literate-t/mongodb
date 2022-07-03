// @ts-check

require('dotenv').config();

const { MongoClient, ServerApiVersion } = require('mongodb');

// @ts-ignore
const password = encodeURIComponent(process.env.MONGODB_PASS);
const uri = `mongodb+srv://tae:${password}@cluster0.jkrdxt1.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
async function main() {
  const result = await client.connect();
  console.log(result);
  await client.close();
}

main();
