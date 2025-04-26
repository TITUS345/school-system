import mongoose, { Schema, Document } from "mongoose";

export interface IEnrollment extends Document {
    student: mongoose.Types.ObjectId; // Reference to User
    course: mongoose.Types.ObjectId; // Reference to Course
    class: mongoose.Types.ObjectId; // Reference to Class
    units: mongoose.Types.ObjectId[]; // Array of Unit IDs
    timetables: mongoose.Types.ObjectId[]; // Array of Timetable IDs
    term: string;
}

const EnrollmentSchema: Schema = new Schema({
    student: { type: Schema.Types.ObjectId, ref: "User", required: true },
    course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    class: { type: Schema.Types.ObjectId, ref: "Class", required: true },
    units: [{ type: Schema.Types.ObjectId, ref: "Unit", required: true }],
    timetables: [{ type: Schema.Types.ObjectId, ref: "Timetable" }], // Ensure this is defined
    term: { type: String, required: true },
});

export default mongoose.models.Enrollment || mongoose.model<IEnrollment>("Enrollment", EnrollmentSchema);
