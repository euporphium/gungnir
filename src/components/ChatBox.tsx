'use client';

import type React from 'react';
import { useRef, useState, useEffect } from 'react';
import { useMessages } from '@ably/chat/react';
import { authClient } from '@/lib/auth-client';
import { cn } from '@/lib/client/cn';
import type { Message } from '@ably/chat';

export default function ChatBox() {
  const { data: session } = authClient.useSession();
  const userId = session?.user.id;

  const inputBox = useRef<HTMLTextAreaElement>(null);
  const messageEndRef = useRef<HTMLDivElement>(null);

  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const messageTextIsEmpty = messageText.trim().length === 0;

  const { sendMessage } = useMessages({
    listener: (payload) => {
      const newMessage = payload.message;
      setMessages((prevMessages) => {
        if (
          prevMessages.some((existingMessage) =>
            existingMessage.isSameAs(newMessage),
          )
        ) {
          return prevMessages;
        }

        const index = prevMessages.findIndex((existingMessage) =>
          existingMessage.after(newMessage),
        );

        const newMessages = [...prevMessages];
        if (index === -1) {
          newMessages.push(newMessage);
        } else {
          newMessages.splice(index, 0, newMessage);
        }
        return newMessages;
      });
    },
  });

  const sendChatMessage = async (text: string) => {
    if (!sendMessage) {
      // hook isn't ready yet
      return;
    }
    try {
      // send via Ably Chat SDK
      await sendMessage({ text });
      // clear out the textarea and restore focus
      setMessageText('');
      inputBox.current?.focus();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleFormSubmission = (event: React.FormEvent) => {
    event.preventDefault();
    sendChatMessage(messageText);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    // only send on plain Enter (not Shift+Enter)
    if (event.key !== 'Enter' || event.shiftKey) {
      return;
    }
    event.preventDefault();
    sendChatMessage(messageText);
  };

  const messageElements = messages.map((message, index) => {
    const key = message.serial ?? index;
    const isSender = message.clientId === userId;
    return (
      <div
        key={key}
        className={cn('border-b border-gray-200 p-2', {
          'text-end': isSender,
        })}
      >
        {message.text}
      </div>
    );
  });

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex h-96 flex-col rounded-lg border border-gray-300">
      <div className="flex-1 overflow-y-auto p-4">
        {messageElements}
        <div ref={messageEndRef}></div>
      </div>
      <form
        onSubmit={handleFormSubmission}
        className="flex border-t border-gray-300 p-4"
      >
        <textarea
          ref={inputBox}
          value={messageText}
          placeholder="Type a message..."
          onChange={(e) => setMessageText(e.target.value)}
          onKeyDown={handleKeyDown}
          className="mr-2 flex-1 resize-none rounded border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-gray-400 focus:outline-none"
        ></textarea>
        <button
          type="submit"
          className="rounded bg-black px-4 py-2 text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400"
          disabled={messageTextIsEmpty}
        >
          Send
        </button>
      </form>
    </div>
  );
}
