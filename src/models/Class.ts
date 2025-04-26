import mongoose, { Schema, Document } from "mongoose";

export interface IClass extends Document {
    name: string;
    course: mongoose.Types.ObjectId; // Reference to Course
    students: mongoose.Types.ObjectId[]; // Array of Student IDs
    term: string;
}

const ClassSchema: Schema = new Schema({
    name: { type: String, required: true },
    course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    students: [{ type: Schema.Types.ObjectId, ref: "User" }],
    term: { type: String, required: true },
});

export default mongoose.models.Class || mongoose.model<IClass>("Class", ClassSchema);
