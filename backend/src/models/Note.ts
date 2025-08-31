import mongoose, { Document, Schema } from 'mongoose';

export interface INote extends Document {
    title: string;
    content: string;
    user: mongoose.Types.ObjectId;
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
}

const noteSchema = new Schema<INote>({
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200,
    },
    content: {
        type: String,
        required: true,
        maxlength: 10000,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    tags: [{
        type: String,
        trim: true,
    }],
}, {
    timestamps: true,
});

// Index for better performance
noteSchema.index({ user: 1, createdAt: -1 });

export default mongoose.model<INote>('Note', noteSchema);
