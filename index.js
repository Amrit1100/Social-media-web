require('dotenv').config();
const express = require('express')
const uploadToAzure = require("./uploadToAzure");
const deleteFromAzure = require("./deleteFromAzure")
const multer = require("multer")
const path = require("path")
const { MongoClient } = require("mongodb");
const cookieParser = require("cookie-parser");
const { error, profile } = require('console');
const { title } = require('process');
const { console } = require('inspector');
const app = express()
const port = 3000


app.set("view engine", "ejs");
app.set("views", "./templates");
app.use(express.json())
app.use(cookieParser())

app.use((req,res,next)=>{
    let cookies = req.cookies
    if(cookies.login){
      req.loggedIn = true
      req.useremail = cookies.email
    }else{
      req.loggedIn = false
    }
  next()
})


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },

    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);  // get .jpg / .png / etc
        // const email = req.useremail.replace(/[@.]/g, "_"); // safe filename
        const email = req.useremail
        cb(null, `${email}${ext}`);
    }
});

const uploads = multer({storage : storage})
const client = new MongoClient(process.env.MONGO_URI)


async function connectmongo(){
  try{
    await client.connect()
    return "connected"
  }catch(err){
    console.error(error)
    return "notconnected"
  }
}
connectmongo()

// All pages get request
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"))
})

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, "/public/login.html"))
})

app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, "/public/signup.html"))
})

app.get('/profile', (req, res) => {
  res.sendFile(path.join(__dirname, "/public/profile.html"))
})

app.get('/add-blog', (req, res) => {
  res.sendFile(path.join(__dirname, "/public/addblog.html"))
})

app.get("/blog/:slug", async(req,res)=>{
    const slug = req.params.slug
    try{
      let db = client.db("Quora-Clone")
      let blogs = db.collection("Blogs")
      let blog = await blogs.findOne({blogid : slug})
       if(!blog){
      res.status(400).json({msg : "Blog Not found"})
    }else{
        let title = blog.title
        let content = blog.content
        let email = blog.email
        let users = db.collection("Users")
        let user = await users.findOne({email})
        if(!user){
          res.json({msg : "Something wrong with this blog."})
        }else{
          let name = user.name
          res.render("blog", {blogtitle : title, content : content, name : name})
        }
      }
    }catch(err){
      res.json({msg : "Something went wrong! Please refresh the page"})
    }
    
   
})


app.use(express.static('public'))

app.post("/signup", async(req,res)=>{
  if (req.loggedIn === true){
    res.json({msg : "loggedIn"})
  }else{
    let name = req.body.name
    let email = req.body.email
    let password = req.body.password
    if (!name || !email || !password){
      res.json({msg : "All fields are required"})
    }else{
      try{
      let db = client.db("Quora-Clone")
      let users = db.collection("Users")
      let result = await users.findOne({ email })
      if(result){
        res.json({msg : "Account Already exist with this email"})
      }else{
        let insertid = await users.insertOne({name,email,password})
        res.json({msg : "Success"})
      }
      }catch(err){
        console.error(err)
      }
      
    }
  }
   
})

app.post("/login", async(req,res)=>{
  if (req.loggedIn === true){
    res.json({msg : "loggedIn"})
  }else{
    let email = req.body.email
    let password = req.body.password
    if (!email || !password){
      res.json({msg : "All Fields are Required"})
    }else{
      try{
      let db = client.db("Quora-Clone")
      let users = db.collection("Users")
      let result = await users.findOne({ email })
      if(result){
        let savedpassword = result.password
        if(savedpassword === password){
          res.cookie("login", true, {httpOnly : true, sameSite : "strict"})
          res.cookie("email", email, {httpOnly : true, sameSite : "strict"})
          res.json({msg : `success`})
        }else{
          res.json({msg : "InCorrect Password."})
        }
      }else{
        res.json({msg : "No Account found with this email account"})
      }
    }catch(err){
      console.error(err)
      res.json({msg : `An Error Occurred. Please try again! ${err}`})
    }
  }

}})

app.post("/logout", (req,res)=>{
  if (req.loggedIn === true){
    try{
      res.clearCookie("login")
      res.clearCookie("email")
      res.json({msg : "Logout Successful"})
    }catch(err){
      res.json({msg : err})
    }
  }else{
    res.json({msg : "NotloggedIn"})
  }
})

app.post("/me", (req,res)=>{
    if(req.loggedIn){
      res.json({msg: "loggedIn", email : req.useremail})
    }else{
      res.json({msg : "NotloggedIn"})
    }
})

app.post("/add-blog", async(req,res)=>{
    if(req.loggedIn === true){
      let email = req.useremail
      let title = req.body.title
      let content = req.body.content
      let blogid = title.replace(/ /g, "-") +"-" + Date.now().toString()
      if(!title || !content){
        res.json({msg : "All Fields are required."})
      }else{
        try{
          let db = client.db("Quora-Clone")
          let Blogs = db.collection("Blogs")
          let result = await Blogs.insertOne({blogid, email, title, content})
          if(result.acknowledged){
            res.json({msg : "success"})
          }else{
            res.json({msg : "An error occurred! Please try again."})
          }
        }catch(err){
          console.error(err)
          res.json({msg : `An Error occured. Please try again ${err}`})
        }
       
      }
    }else{
      res.json({msg : "User Not logged In"})
    }
})

app.post("/profile", async(req,res)=>{
  if(req.loggedIn===true){
      let email = req.useremail
      try{
        let db = client.db("Quora-Clone")
        let Blogs = db.collection("Blogs")
        let blogs = await Blogs.find({email}).toArray()
        let Users = db.collection("Users")
        let details = await Users.findOne({email})
        let profilephotoslinks = db.collection("profilephotoslinks")
        let profilephotodata = await profilephotoslinks.findOne({email : email})
        let profileurl = null
        if(profilephotodata!=null){
          profileurl = profilephotodata.url
        }
        res.json({msg : blogs, name : details.name, bio : details.bio, profileurl : profileurl})
      }catch(err){
        console.error(err)
        res.json({msg : "An Error Occured. Please try again.", email})
      }
     
  }else{
    res.json({msg : "Not Logged In"})
  }
})

app.post("/getblogs", async(req,res)=>{
   let db = client.db("Quora-Clone")
   let Blogs = db.collection("Blogs")
   let blogs = await Blogs.find({}).toArray()
   res.status(200).json({blogs})
})

app.post("/changeinfo", async(req,res)=>{
      let email = req.useremail
      let username = req.body.username
      let bio = req.body.bio
      try{
        let db = client.db("Quora-Clone")
        let users = db.collection("Users")
        let user = await users.findOne({email})
        if(!user){
          res.status(400).json({msg : "User not Found"})
        }else{
            let result = await users.updateOne({email :email}, {$set : {name : username,  bio : bio}})
            if(result.acknowledged){
              res.status(200).json({msg : "Username Updated"})
            }else{
              res.status(500).json({msg : "Something went wrong"})
            }}
      }catch(err){
        console.log(err)
        res.status(500).json({msg : "Something went wrong"})
      }
      
})

function isLoggedIn(req, res, next) {
  if (req.loggedIn) {
    return next();
  }
  return res.status(400).json({ msg: "User not logged in." });
}

app.post(
  "/uploadphoto",
  isLoggedIn,
  uploads.single("photo"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ msg: "No file uploaded" });
      }
      const azureFileName = `${req.useremail}.png`;
      const filePath = req.file.path;
      const url = await uploadToAzure(filePath, azureFileName);
      let email = req.useremail
      let db = client.db("Quora-Clone")
      let profilephotoslinks = db.collection("profilephotoslinks")
      let result = await profilephotoslinks.insertOne({email: email, url, azureFileName})
      if (result.acknowledged){
        res.json({ msg: "Uploaded to Azure"});
      }else{
        res.json({msg : "Something wrong occured in inserting link to database."})
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({ msg: "Upload failed" });
    }
  }
);


// Delete the profile photo
app.post("/deleteprofilephoto", async(req,res)=>{
  if(req.loggedIn){
    let useremail = req.useremail
    try{
      let db = client.db("Quora-Clone")
      let photolinks = db.collection("profilephotoslinks")
      let result = await photolinks.findOne({email : useremail})
      if(result){
          let imagename = result.azureFileName
          console.log(imagename)
          let response = await deleteFromAzure(imagename)
          console.log(response)
          if(response=="success"){
            let result = await photolinks.deleteOne({email : useremail})
            if(result.acknowledged){
              res.json({msg : "Profile Photo Deleted successfully."})
            }else{
               res.json({msg : "Something went wrong deleting the image. Please try again later."})
            }
          }else{
            res.json({msg : "Something went wrong deleting the image. Please try again later."})
          }
      }
    }catch(err){
        res.json({msg : err})
    } 
      
}else{
    res.json({msg : "User not logged In"})
  }
})

// Delete Blog
app.post("/delete-blog", async(req,res)=>{
  if(req.loggedIn){
      let blogid = req.body.blogid
      try{
        let db = client.db("Quora-Clone")
        let blogs = db.collection("Blogs")
        let result = await blogs.deleteOne({blogid})
        if (result.acknowledged){
          res.json({msg : "Blog Deleted!"})
        }else{
          res.json({msg : "Something went wrong. Please try again"})
        }
      }catch(err){
          res.json({msg : `Something Went wrong.Please try again`})
      }


  }else{
    res.status(400).json({msg : "User not Logged In"})
  }
})



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
