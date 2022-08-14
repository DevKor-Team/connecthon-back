import mongoose from 'mongoose';

export async function connect() {
  const uri = process.env.MONGO_URL;
  if (uri) {
    await mongoose.connect(uri);
  } else {
    throw new Error('memory mongodb uri not known');
  }
}
export async function close() {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
}
