export enum CHAT {
    USER,
    AI,
  }
  
  export type t_Chat = {
    type: CHAT;
    content: string;
  };