import { Document } from "mongoose";

export interface UserInterface extends Document {
    firstName: String;
    lastName:string
    password: string;
    email: String;
    phoneNumber: String;
  
  }