import { ObjectID } from 'bson';
import { ServiceResult } from '@/interfaces/common';
import SocketSessionModel from '@/models/socketSession';
import { SocketSession } from '@/interfaces/socketSession';

export async function get(id: ObjectID | string)
  : Promise<ServiceResult<string>> {
  const session = await SocketSessionModel.findOne({ uid: id });
  if (!session) {
    return { data: undefined };
  }
  return { data: session.socketid };
}

export async function create(data: SocketSession)
  : Promise<ServiceResult<string>> {
  const existingSession = await SocketSessionModel.findOne({ uid: data.uid });
  if (existingSession) {
    throw Error('session already exists');
  }
  const result = await SocketSessionModel.create(data);
  return { data: result.socketid };
}

export async function destroy(socket: string)
  : Promise<ServiceResult<string>> {
  const session = await SocketSessionModel.findOne({ socketid: socket });
  if (!session) {
    throw Error('session not found');
  }
  await session.remove();
  return { data: session.socketid };
}
