import { FieldValue, Timestamp } from 'firebase/firestore';

export interface TimeType {
  seconds: number;
  nanoseconds: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  onlineStatus: string;
  lastOnline: TimeType;
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
  timestamp: TimeType;
  lastMessage: IMessage | null;
  id: string;
  unreadCount: {
    [x: string]: number;
  };
  type: ChatType;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  avatarUrl: string;
  members: string[];
  admins: string[];
  createdAt: TimeType;
  unreadCount: {
    [x: string]: number;
  };
  timestamp: TimeType;
  lastMessage: IMessage | null;
  type: ChatType;
}

export interface SelectedChatData {
  id: string;
  myId: string;
  type: ChatType;
  otherId?: string;
  groupData?: Group;
}

export interface IMessage {
  id: string;
  chatRoomId: string;
  senderId: string;
  text: string;
  time: Timestamp;
  image?: string;
  video?: string;
  file?: string;
  messageType: MessageType;
  previousMessage?: IMessage | null;
  nextMessage?: IMessage | null;
  read: {
    [userId: string]: boolean;
  };
}

export type MessageType = 'text' | 'voice' | 'sticker' | 'gif';

export type TypeAttached = 'image' | 'video' | 'file';
