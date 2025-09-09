'use client';

import Ably from 'ably';
import { ChatClient } from '@ably/chat';
import { ChatClientProvider, ChatRoomProvider } from '@ably/chat/react';
import ChatBox from './ChatBox';

export default function Chat() {
  const realtimeClient = new Ably.Realtime({ authUrl: '/api/ably' });
  const chatClient = new ChatClient(realtimeClient);

  return (
    <ChatClientProvider client={chatClient}>
      <ChatRoomProvider name="chat-demo">
        <ChatBox />
      </ChatRoomProvider>
    </ChatClientProvider>
  );
}
