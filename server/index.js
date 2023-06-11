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

///////////////////////////////////// get req /////////////////////////////////////


app.get('/', cors(corsOptions), (req, res) => {
  res.send('Welcome to your Wix Enter exam!');
});

app.get('/user', cors(corsOptions), (req, res) => {
  const userId = req.cookies?.userId || uuidv4();
  res.cookie('userId', userId).send({ id: userId });
});

app.get('/tags', cors(corsOptions), (req, res) => {
  res.send({ Tags });
});

app.get('/posts', cors(corsOptions), (req, res) => {
  let filteredPosts = Posts;

  // filter by popularity
  if (req.query.popularity) {
    const popularity = Number(req.query.popularity); 
    filteredPosts = filteredPosts.filter((post) => post.likes >= popularity);
  }

  // filter by tag 
  if (req.query.tag) {
    const tag = req.query.tag; 
    filteredPosts = filteredPosts.filter(post => Tags[tag] && Tags[tag][post.id]);
  }

  res.send({ filteredPosts });
});

app.get('/user-like-post', cors(corsOptions), (req, res) => {
  const postID = req.query.postID;
  const userID = req.query.userID;

  if(!Likes[postID] || !Dislikes[postID]){
    res.status(400).end("Invalid postID");
    return;
  }

  res.send({ like: Likes[postID].has(userID), dislike: Dislikes[postID].has(userID) });
});

app.get('/my-recommended-posts', cors(corsOptions), (req, res) => {
  const userId = req.query.userId;

  if(!userId){
    res.status(400).end("Invalid userId");
    return;
  }

  // get posts that the user did not react to
  let recommendedPosts = Posts.filter((post) => !Likes[post.id].has(userId) && !Dislikes[post.id].has(userId))
  res.send({ recommendedPosts });
});


///////////////////////////////////// post req /////////////////////////////////////


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

  if(title.length > 80){
    res.status(400).end("title can not be over 80 charecters");
    return;
  }

  // Create new post object.
  const newPost = {id: id, title: title, content: content, userId: userId, likes: 0, dislikes: 0}

  // Add post to a Posts model.
  Posts.push(newPost);
  Likes[id] = new Set();
  Dislikes[id] = new Set();

  if(selectedTag){   // if tag was provided.

    // create new tag in Tags.
    if(!Tags[selectedTag]){
      Tags[selectedTag] = {};
    }
    Tags[selectedTag][id] = true;
  }
  res.send({ Posts, Tags }).status(200).end();
});

// A post function that updates the array of Like, Dislike, Posts
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

// A post request to the server that adds tagName (@param) to the post with postID (@param)
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
