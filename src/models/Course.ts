import mongoose, { Schema, Document } from "mongoose";

export interface ICourse extends Document {
    name: string;
    duration: string;
    units: mongoose.Types.ObjectId[]; // References Unit
    classes: mongoose.Types.ObjectId[]; // References Class
}

const CourseSchema: Schema = new Schema({
    name: { type: String, required: true },
    duration: { type: String, required: true },
    units: [{ type: Schema.Types.ObjectId, ref: "Unit" }],
    classes: [{ type: Schema.Types.ObjectId, ref: "Class" }],
});

export default mongoose.models.Course || mongoose.model<ICourse>("Course", CourseSchema);
