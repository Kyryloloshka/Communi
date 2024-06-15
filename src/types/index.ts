import { FieldValue, Timestamp } from "firebase/firestore";

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
  Chat = "chat",
  Group = "group",
  Channel = "channel",
}

export interface PropsUserCard {
  name: string;
  avatarUrl: string;
  latestMessage: IMessage;
  type: ChatType;
  isSelected?: boolean;
}

export interface ChatData {
  users: any[];
  usersData: {
    [x: number]: any;
  };
  timestamp: FieldValue;
  lastMessage: null;
  id: string;
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
}

export type MessageType = "text" | "voice" | "sticker" | "gif";

export type typeAttached = "image" | "video" | "file";