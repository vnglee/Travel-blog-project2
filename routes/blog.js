var express = require("express");
var router = express.Router();

// const User = require('../models/User')
const Blog = require("../models/Blog");
// const Comment = require('../models/Comment')

// ********* require fileUploader in order to use it *********
const fileUploader = require("../config/cloudinary.js");

router.get("/add", (req, res, next) => {
  res.render("blog/add.hbs");
});

router.post("/add", fileUploader.single("imageUrl"), (req, res, next) => {
  const { title, author, post, location } = req.body;
  console.log(title);
  Blog.create({
    title,
    location,
    author: req.session.user._id,
    post,
    imageUrl: req.file.path,
  })
    .then((createdBlog) => {
      console.log("New blog:", createdBlog);
      // res.redirect(`/blog/add/${createdBlog._id}`)
      res.redirect("/blog/home");
    })
    .catch((error) => {
      console.log(error);
    });
});

router.get("/home", (req, res, next) => {
  Blog.find()
    .sort({ updatedAt: "desc" })
    .limit(5)
    .then((blogs) => {
        const blogPost = blogs.map((element) => {
            
            return {...element._doc, updatedAt : element.updatedAt.toString().slice(0,10)}
        
        })
        console.log("blog post:", blogPost)
      res.render("blog/blog-home.hbs", blogPost);
    })
    .catch((error) => {
      console.log(error);
    });
});

router.get("/entry/:id", (req, res, next) => {
  const { id } = req.params;
  Blog.findById(id)
    .populate("author")
    .populate({ path: "comments", populate: { path: "user" } })
    .then((entry) => {
      console.log("entry:", entry);

      let bool;
      
      if (req.session.user) {

          
          if (entry.author._id.toString() === req.session.user._id) {
                  bool = true
                } else {
                  bool = false
              }
            }
      const tripPost = {...entry._doc, updatedAt: entry.updatedAt.toString().slice(0,10), isOwner: bool}
      console.log(tripPost)
      res.render("blog/blog-entry.hbs", tripPost);
    })
    .catch((error) => {
      console.log(error);
    });
});


router.get("/delete/:id", (req, res, next) => {
  const { id } = req.params;

  Blog.findByIdAndRemove(id)
    .then(() => {
      res.redirect("/blog/home");
    })
    .catch((error) => {
      console.log(error);
    });
  });

router.get("/edit/:id", (req, res, next) => {
  const { id } = req.params;

  Blog.findById(id)
    .then((blog) => {
      res.render("blog/edit.hbs", blog);
    })
    .catch((error) => {
      console.log(error);
    });
});

router.post("/edit/:id", fileUploader.single('imageUrl'), (req, res, next) => {
  const { id } = req.params;
  const { title, date, author, post } = req.body;
  console.log("this is req body: ", req.body)
    console.log("this is req file: ", req.file)
    Blog.findById(id)
    .then((blog) => {
      let postImage = blog.imageUrl;
      if (req.file) {
        postImage = req.file.path;
      } 
      Blog.findByIdAndUpdate(id,
        {
          title,
          post,
          imageUrl: postImage
        }
        , { new: true })
    .then((blog) => {
      res.redirect(`/blog/entry/${id}`);
    })
    .catch((error) => {
      console.log(error);
    });
    })
    .catch((error) => {
      console.log(error);
    });
  

  Blog.findByIdAndUpdate(id, req.body, { new: true })
    .then((blog) => {
      res.redirect(`/blog/entry/${id}`);
    })
    .catch((error) => {
      console.log(error);
    });
});

router.get("/location/:name", (req, res, next) => {
  console.log(req.params.name);

  Blog.find({ location: req.params.name.replace("-", " ") })
  .sort({ updatedAt: "desc" })
    .then((loc) => {
     const locations = loc.map((element)=> {
        return {...element._doc, updatedAt: element.updatedAt.toString().slice(0,10)}
     })
     console.log(locations)
      res.render("blog/location.hbs", locations);
    })
    .catch((error) => {
      console.log(error);
    });
});

module.exports = router;
