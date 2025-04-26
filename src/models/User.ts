import mongoose, { Schema, Document } from 'mongoose';
// import Course from './Course';

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    role: 'Admin' | 'Teacher' | 'Student'; // roles 
    signupKey?: string; // Only used for Teacher/Student signup
    refreshToken: string;
    resetTokenExpiry: Date;
    resetToken: string;
}

const UserSchema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['Admin', 'Teacher', 'Student'], required: true },
    signupKey: { type: String },
    resetToken: { type: String },
    resetTokenExpiry: { type: Date },
    refreshToken: { type: String },


});

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
