import { MongoClient } from 'mongodb';

export async function GET(req: Request) {
  if (req.method === 'GET') {
    const client = new MongoClient(process.env.MONGODB_URI as string);

    try {
      await client.connect();

      const database = client.db('collaborative-editing-notes');

      const collection = database.collection('contents');
      const allData = await collection.find({}).toArray();

      return Response.json(allData, { status: 200 });
    } catch (error) {
      return Response.json(
        { message: 'Something went wrong!' },
        { status: 500 }
      );
    } finally {
      await client.close();
    }
  } else {
    return Response.json({ message: 'Method not allowed!' }, { status: 405 });
  }
}
