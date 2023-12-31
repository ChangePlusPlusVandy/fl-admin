export interface IUser {
  firebaseUserId: string;
  name: string;
  emailAddress: string;
  forgotPasswordCode: string;
  type: string;
  posts: string[]; // Assuming posts are referenced by their IDs
  timestamp: Date;
  friends: string[]; // Assuming friends are referenced by their IDs
  chats: string[]; // Assuming chats are referenced by their IDs
  schedule: string[];
}

export interface IPost {
  userId: string; // Assuming user ID is used to reference the user who created the post
  user: string;
  title: string;
  postBody: string;
  image?: string;
  likes: string[]; // Assuming likes are referenced by user IDs
  dateCreated: Date;
}

export interface IMessage {
  messageBody: string;
  timestamps: Date;
  sender: string; // Assuming sender and recipient are referenced by user IDs
  recipient: string;
  chatId: string; // Assuming chat ID is used to reference the chat
}

export interface IFriend {
  friendName: string;
  profilePicture: string;
  reports: string[]; // Assuming reports are referenced by their IDs
  attendance: string[]; // Assuming attendance records are referenced by their IDs
}

export interface IChat {
  users: string[]; // Assuming users are referenced by their IDs
  messages: string[]; // Assuming messages are referenced by their IDs
}

export interface IAttendance {
  date: Date;
  friendId: string; // Assuming friend ID is used to reference the friend
  timeIns: Date[];
  timeOuts: Date[];
}

export interface IReport {
  friendId: string; // Assuming friend ID is used to reference the friend
  reportBody: string;
  date: Date;
}
