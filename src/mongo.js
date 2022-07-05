// @ts-check

require('dotenv').config();

const { MongoClient, ServerApiVersion } = require('mongodb');

// @ts-ignore
const username = encodeURIComponent(process.env.MONGODB_USERNAME);
// @ts-ignore
const password = encodeURIComponent(process.env.MONGODB_PASS);
const uri = `mongodb+srv://${username}:${password}@mydatabase.gudcrqd.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
  serverSelectionTimeoutMS: 3500,
});
async function main() {
  try {
    await client.connect();
    const users = client.db('taetae').collection('users');
    const cities = client.db('taetae').collection('cities');

    // 매번 비우기
    await users.deleteMany({});
    await cities.deleteMany({});

    // Init
    await cities.insertMany([
      {
        name: '서울',
        population: 1000,
      },
      {
        name: '부산',
        population: 342,
      },
    ]);

    await users.insertMany([
      {
        name: 'Kim',
        age: 24,
        // one to many 관계는 이렇게 Nesting하는 것이 좋다
        // 물론 주 데이터라면 따로 도큐먼트로 생성해도 된다
        // NoSQL의 장점을 살릴 수 있음
        // BSON 파일의 크기는 16MB가 최대
        // depth는 100 레벨을 넘을 수 없다
        hobby: [
          {
            name: 'readig books',
            type: 'non-active',
          },
          {
            name: 'working out',
            type: 'active',
          },
        ],
        // many to many
        city: '서울',
      },
      {
        name: 'Lee',
        age: 33,
        hobby: [
          {
            name: 'soccer',
            type: 'active',
          },
        ],
        city: '서울',
      },
      {
        name: 'Park',
        age: 30,
        hobby: [
          {
            name: 'tennis',
            type: 'active',
          },
        ],
        city: '부산',
      },
      {
        name: 'Amy',
        age: 27,
        hobby: [
          {
            name: 'watching movies',
            type: 'non-active',
          },
        ],
        city: '부산',
      },
      {
        name: 'Barkez',
        age: 31,
        hobby: [
          {
            name: 'driving with car',
            type: 'non-active',
          },
        ],
        city: '부산',
      },
    ]);
    // users.updateOne(
    //   {
    //     name: 'Kim',
    //   },
    //   {
    //     $set: {
    //       name: 'Kook',
    //     },
    //   }
    // );

    // await users.deleteOne({
    //   name: 'Barkez',
    // });
    // const cursor = users.find(
    //   {
    //     age: {
    //       $gte: 30, // grater than or equal
    //     },
    //   },
    //   {
    //     sort: {
    //       name: -1, // 내림차순
    //       // name: 1 // 오름차순
    //     },
    //   }
    // );

    // cursor
    // const cursor = users.find({
    //   'hobby.type': 'active',
    // });

    const cursor = users.aggregate([
      {
        $lookup: {
          from: 'cities',
          foreignField: 'name',
          localField: 'city',
          as: 'city_detail',
        },
      },
      {
        $match: {
          // $or도 사용 가능
          $and: [
            {
              'city_detail.population': {
                $gte: 500,
              },
            },
            {
              age: {
                $gte: 30,
              },
            },
          ],
        },
      },
      // {
      //   $count: 'number of users',
      // },
    ]);

    await cursor.forEach(console.log);
  } finally {
    await client.close();
  }
}

main().catch(console.log);
