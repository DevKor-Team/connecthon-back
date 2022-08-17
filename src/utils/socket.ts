import socketIO from 'socket.io';
import { Server } from 'http';
import { Chat, Message } from '@/interfaces/chat';
import * as ChatService from '@/services/chat';
import * as SocketService from '@/services/socketSession';
import { initSocket } from '@/interfaces/socketSession';
import winston from 'winston';

const useSocket = (server: Server) => {
  const io = new socketIO.Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket: socketIO.Socket) => {
    socket.on('make session', async (data: initSocket) => {
      await SocketService.create({
        socketid: socket.id,
        uid: data.uid,
        userType: data.userType,
      });
    });
    socket.on('send', async (data: Message) => {
      const room = await ChatService.get(data.room);
      if (!room) {
        socket.to(socket.id).emit('error');
      } else {
        // store message to db
        const chat: Chat = {
          sender: data.sender,
          when: data.when,
          msg: data.msg,
        };
        const result = await ChatService.update(chat, data.room);
        if (result.data === undefined) {
          socket.to(socket.id).emit('error');
        }
        // if opponent has session, send socket req (trigger 'receive' event of opponent)
        const opponentId = data.sender === 'company' ? result.data?.user : result.data?.company;
        const session = await SocketService.get(opponentId!);
        if (session.data) {
          socket.to(session.data).emit('receive', data);
        }
      }
    });
    socket.on('disconnect', async () => {
      await SocketService.destroy(socket.id);
    });
  });
  winston.info('socket connected');
};

export default useSocket;
