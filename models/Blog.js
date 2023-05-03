const { model, Schema } = require('mongoose')

const blogSchema = new Schema(
    {
      title: String,  
      // date: { type: Date, default: Date.now },
      author: { type: Schema.Types.ObjectId, ref: "User"},
      post: String,
      comments: [{ type: Schema.Types.ObjectId, ref: "Comment"}],
      imageUrl: String,
      location: String
    },
    {
      timestamps: true
    }
)

module.exports = model('Blog', blogSchema)