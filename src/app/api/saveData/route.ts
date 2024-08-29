import { MongoClient } from 'mongodb';

export async function POST(req: Request) {
  if (req.method === 'POST') {
    const { data } = await req.json();

    const client = new MongoClient(process.env.MONGODB_URI as string);

    try {
      await client.connect();

      const database = client.db('collaborative-editing-notes');

      const collection = database.collection('contents');

      await collection.insertOne({ data });

      return Response.json(
        { message: 'Data saved successfully!' },
        { status: 201 }
      );
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
