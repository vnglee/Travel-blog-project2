const { model, Schema } = require('mongoose')

const blogSchema = new Schema(
    {
      title: String,  
      date: Date,
      author: { type: Schema.Types.ObjectId, ref: "User"},
      


    }
)