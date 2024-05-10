import { UserDocument } from './models/User'; // Adjust the import path according to your actual user model file

declare module 'express-serve-static-core' {
  interface Request {
    user?: UserDocument; // Define the `user` property on the Request interface
  }
}