import mongoose, { Schema, Document } from "mongoose";
// import Course from "./Course";

export interface ITimetable extends Document {
    course: mongoose.Types.ObjectId; // Reference to Course
    class: mongoose.Types.ObjectId; // Reference to Class
    unit: mongoose.Types.ObjectId; // Reference to Unit
    teacher: mongoose.Types.ObjectId; // Reference to Teacher
    date: Date;
    time: string;
    term: string;
}

const TimetableSchema: Schema = new Schema({
    course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    class: { type: Schema.Types.ObjectId, ref: "Class", required: true },
    unit: { type: Schema.Types.ObjectId, ref: "Unit", required: true },
    teacher: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Assuming "User" includes teacher
    date: { type: Date, required: true },
    time: { type: String, required: true },
    term: { type: String, required: true },
});

export default mongoose.models.Timetable || mongoose.model<ITimetable>("Timetable", TimetableSchema);
