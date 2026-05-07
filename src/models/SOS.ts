import mongoose, { Schema, model, models } from "mongoose";


const SOSSchema = new Schema(
    {
        userId: { type: String, required: true },
        location: {
            lat: { type: Number, required: true },
            lng: { type: Number, required: true },
            accuracy: { type: Number }
        },
        timestamp: { type: Date, default: Date.now },
        status: {
            type: String,
            enum: ["active", "resolved"],
            default: "active"
        }
    },
    {
        timestamps: false
    }
);

// ✅ Prevent model overwrite error in Next.js
const SOS = models.SOS || model("SOS", SOSSchema);
export default SOS;

