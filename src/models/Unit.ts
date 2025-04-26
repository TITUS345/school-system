import mongoose, { Schema, Document } from "mongoose";

export interface IUnit extends Document {
    name: string;
    course: mongoose.Types.ObjectId; // Reference to Course
    teacher: mongoose.Types.ObjectId; // Reference to Teacher
    semester: string;
}

const UnitSchema: Schema = new Schema({
    name: { type: String, required: true },
    course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    teacher: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Assuming "User" includes teacher
    semester: { type: String, required: true },
});

export default mongoose.models.Unit || mongoose.model<IUnit>("Unit", UnitSchema);
