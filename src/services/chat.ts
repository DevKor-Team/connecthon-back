import { ObjectID } from 'bson';
import ChatRoomModel from '@/models/chatroom';
import { Chat, ChatRoomModel as ChatRoomModelType } from '@/interfaces/chat';
import { ServiceResult } from '@/interfaces/common';
import { userType } from '@/interfaces/auth';

export interface roomWithLastMsg extends Omit<ChatRoomModelType, 'msgs'> {
  lastMsg: string;
  lastSend: Date;
}

export async function getList(id: ObjectID | string, sender: userType)
  : Promise<ServiceResult<roomWithLastMsg[]>> {
  let roomObjs;
  if (sender === 'user') {
    roomObjs = await ChatRoomModel.find({ user: id });
  } else if (sender === 'company') {
    roomObjs = await ChatRoomModel.find({ company: id });
  } else throw Error('uncorrect sender');

  const roomList = roomObjs.map((roomObj) => {
    const lastChat = roomObj.msgs.sort(((a, b) => {
      const dateA = Date.parse(a.when.toString());
      const dateB = Date.parse(b.when.toString());
      return dateB - dateA;
    }))[0];
    return {
      id: roomObj._id,
      company: roomObj.company,
      user: roomObj.user,
      lastMsg: lastChat.msg,
      lastSend: lastChat.when,
    };
  });
  return {
    data: roomList.sort((a, b) => {
      const dateA = Date.parse(a.lastSend.toString());
      const dateB = Date.parse(b.lastSend.toString());
      return dateB - dateA;
    }),
  };
}

export async function get(id: ObjectID | string)
  : Promise<ServiceResult<ChatRoomModelType>> {
  const roomObj = await ChatRoomModel.findById(id);
  if (!roomObj) throw Error('uncorrect id');
  if (roomObj.msgs === [] || roomObj.msgs === undefined) {
    return {
      data: {
        id: roomObj._id,
        company: roomObj.company,
        user: roomObj.user,
        msgs: [],
      },
    };
  }
  return {
    data: {
      id: roomObj._id,
      company: roomObj.company,
      user: roomObj.user,
      msgs: roomObj.msgs.sort(((a, b) => {
        const dateA = Date.parse(a.when.toString());
        const dateB = Date.parse(b.when.toString());
        return dateB - dateA;
      })),
    },
  };
}

export async function create(user: ObjectID | string, company: ObjectID | string):
  Promise<ServiceResult<ChatRoomModelType>> {
  const existringRoom = await ChatRoomModel.findOne({
    $and: [{ user }, { company }],
  });
  if (existringRoom) {
    throw Error('Same room exists');
  }
  const roomObj = await ChatRoomModel.create({ user, company, msgs: [] });
  return {
    data: {
      id: roomObj._id,
      user: roomObj.user,
      company: roomObj.company,
      msgs: roomObj.msgs,
    },
  };
}

export async function update(chat: Chat, id: ObjectID | string)
  : Promise<ServiceResult<ChatRoomModelType>> {
  const roomObj = await ChatRoomModel.findById(id);
  if (!roomObj) {
    throw Error('No Room');
  }
  roomObj.msgs.unshift(chat);
  const updatedObj = await roomObj.save();
  return {
    data: {
      id: updatedObj._id,
      user: updatedObj.user,
      company: updatedObj.company,
      msgs: updatedObj.msgs,
    },
  };
}
