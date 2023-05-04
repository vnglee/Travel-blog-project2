const { model, Schema } = require('mongoose')

const userSchema = new Schema(
    {
        firstName: { type: String, required: [true, 'First name is required'] },
        lastName: { type: String, required: [true, 'Last name is required'] },
        userName: { type: String, required: [true, 'Username is required'], unique: true },
        email: { type: String, required: [true, 'Email is required'], unique: true, lowercase: true },
        password: { type: String, required: [true, 'Password is required'] },
        imageUrl: String
    },
    {
        timestamps: true
    }
)

module.exports = model('User', userSchema)