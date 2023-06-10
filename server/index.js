const express = require('express');
const { v4: uuidv4 } = require('uuid');
const cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const cors = require('cors');

const { baseUrl } = require('../constants');
const { Posts, Likes, Dislikes, updateLikes, updateDislikes } = require('./model/Posts');
const { Tags } = require('./model/Tags');

const app = express();
const port = 3080;

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

const corsOptions = {
  origin: `${baseUrl.client}`,
  credentials: true,
};

app.get('/', cors(corsOptions), (req, res) => {
  res.send('Welcome to your Wix Enter exam!');
});

app.get('/user', cors(corsOptions), (req, res) => {
  const userId = req.cookies?.userId || uuidv4();
  res.cookie('userId', userId).send({ id: userId });
});

///////////////////////////////////// posts /////////////////////////////////////

app.get('/posts', cors(corsOptions), (req, res) => {
  if (req.query.popularity) {
    // TODO - implement popularity filter functionality here
    const popularity = Number(req.query.popularity); 
    const filteredPosts = Posts.filter((post) => post.likes >= popularity);
    res.send({ filteredPosts });
    return;
    // End of TODO
  }
  res.send({ Posts });
});

app.get('/user-like-post', cors(corsOptions), (req, res) => {
  const postID = req.query.postID;
  const userID = req.query.userID;

  if(!Likes[postID] || !Dislikes[postID]){
    res.status(400).end("postID not found");
  }

  res.send({ like: Likes[postID].has(userID), dislike: Dislikes[postID].has(userID) });
});


app.post('/posts', cors(corsOptions), (req, res) => {
  const userId = req.cookies?.userId;
  if (!userId) {
    res.status(403).end();
    return;
  }
  const{ id, title, content, selectedTag } = req.body.post;
  if(!title || !content){
    res.status(400).end("Required fields are empty");
    return;
  }

  // Create new post object.
  const newPost = {id: id, title: title, content: content, userId: userId, likes: 0, dislikes: 0}
  // Add post to a Posts model.
  Posts.push(newPost);
  Likes[id] = new Set();
  Dislikes[id] = new Set();

  // if tag was provided.
  if(selectedTag){

    // create new tag in Tags.
    if(!Tags[selectedTag]){
      Tags[selectedTag] = {};
    }
    Tags[selectedTag][id] = true;
  }
  res.send({ Posts, Tags }).status(200).end();
});

app.post('/post/postID/:postID/likeOrDis/:likeOrDis', cors(corsOptions), (req, res) => {
  const userId = req.cookies?.userId;
  if (!userId) {
    res.status(403).end();
    return;
  }
  const {postID, likeOrDis} = req.params
  if(!postID || !likeOrDis){
    res.status(400).end();
    return;
  }

  if(likeOrDis === "like"){
    if(!Likes[postID].has(userId)){ 
      if(Dislikes[postID].has(userId)){
        Dislikes[postID].delete(userId)
        updateDislikes(postID, 'subtract');
      }
      Likes[postID].add(userId);
      updateLikes(postID, 'add');
    }
  }
  if(likeOrDis === "dislike"){
    if(!Dislikes[postID].has(userId)){
      if(Likes[postID].has(userId)){
        Likes[postID].delete(userId)
        updateLikes(postID, 'subtract');
      }
      Dislikes[postID].add(userId);
      updateDislikes(postID, 'add');
    }
  }
  res.send({ Posts }).status(200).end();
});
///////////////////////////////////// tags /////////////////////////////////////
app.get('/tags', cors(corsOptions), (req, res) => {
  res.send({ Tags });
});

app.post('/tags/tagName/:tagName', cors(corsOptions), (req, res) => {
  const userId = req.cookies?.userId;
  if (!userId) {
    res.status(403).end();
    return;
  }
  const { tagName } = req.params;
  if (Tags[tagName]) {
    res.status(400).end();
    return;
  }
  Tags[tagName] = {};
  res.send({ Tags }).status(200).end();
});


app.post(`/addTags/postID/:postID/tagName/:tagName`, cors(corsOptions), (req, res) => {
  const userId = req.cookies?.userId;
  if (!userId) {
    res.status(403).end();
    return;
  }
  const { tagName, postID } = req.params;
  if ( !tagName || !postID ) {
    res.status(400).end("Invalid TagName or PostID");
    return;
  }
  if(!Tags[tagName]){
    res.status(400).end("Invalid Tag");
    return;
  }
  Tags[tagName][postID] = true;
  res.send({ Tags }).status(200).end();
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
