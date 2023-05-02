const { model, Schema } = require('mongoose')

const blogSchema = new Schema(
    {
      title: String,  
      // date: { type: Date, default: Date.now },
      author: { type: Schema.Types.ObjectId, ref: "User"},
      post: String
    },
    {
      timestamps: true
    }
)

module.exports = model('Blog', blogSchema)