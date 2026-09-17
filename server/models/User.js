import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            default: 'Reader',
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
        },
        subscribedCategories: {
            type: [String],
            default: ['Technology', 'Politics', 'Sports', 'Business', 'Entertainment', 'Health', 'Science'],
        },
        preferredSources: {
            type: [String],
            default: ['TechCrunch', 'BBC News', 'Reuters', 'CNN', 'Bloomberg', 'The Wall Street Journal', 'Associated Press'],
        },
        alertFrequency: {
            type: String,
            enum: ['Immediate', 'Hourly', 'Daily'],
            default: 'Immediate',
        },
        channels: {
            email: { type: Boolean, default: true },
            push: { type: Boolean, default: true },
            inApp: { type: Boolean, default: true },
        },
        isGuest: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('User', userSchema);
