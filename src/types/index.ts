import { FieldValue, Timestamp } from 'firebase/firestore';

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  onlineStatus: string;
  lastOnline: string;
  tag: string;
}

export enum ChatType {
  Chat = 'chat',
  Group = 'group',
  Channel = 'channel',
}

export interface PropsUserCard {
  name: string;
  avatarUrl: string;
  latestMessage: IMessage | null;
  type: ChatType;
  isSelected?: boolean;
  unreadCount?: number;
}

export interface ChatData {
  users: any[];
  usersData: {
    [x: number]: any;
  };
  timestamp: FieldValue;
  lastMessage: IMessage | null;
  id: string;
  unreadCount: {
    [x: number]: number;
  };
}

export interface SelectedChatData {
  id: string;
  myData: User;
  otherData: User;
}

export interface IMessage {
  id: string;
  chatRoomId: string;
  senderId: string;
  senderName: string;
  text: string;
  time: Timestamp;
  image?: string;
  video?: string;
  file?: string;
  messageType: MessageType;
  previousMessage?: IMessage | null;
  nextMessage?: IMessage | null;
  read: {
    userId: string;
    read: boolean;
  }[];
}

export type MessageType = 'text' | 'voice' | 'sticker' | 'gif';

export type TypeAttached = 'image' | 'video' | 'file';
