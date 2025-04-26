import mongoose, { Schema, Document } from "mongoose";

export interface IGrade extends Document {
    student: mongoose.Types.ObjectId; // Reference to User
    unit: mongoose.Types.ObjectId; // Reference to Unit
    grade: number; // Grade or score
    term: string; // Academic term
}

const GradeSchema: Schema = new Schema({
    student: { type: Schema.Types.ObjectId, ref: "User", required: true },
    unit: { type: Schema.Types.ObjectId, ref: "Unit", required: true },
    grade: { type: Number, required: true },
    term: { type: String, required: true },
});

export default mongoose.models.Grade || mongoose.model<IGrade>("Grade", GradeSchema);
