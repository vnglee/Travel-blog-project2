const { model, Schema } = require('mongoose')

const userSchema = new Schema(
    {
        firstName: String,
        lastName: String,
        userName: String,
        email: String,
        password: String,
    },
    {
        timestamp: true
    }
)

module.exports = model('User', userSchema)