import axios from 'axios';
import './App.css';
import { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AddNewPost from './pages/AddNewPost';
import MyRecommendedPosts from './pages/MyRecommendedPosts';
import FloatingMenu from './components/FloatingMenu';
import {
  Typography,
  AppBar,
  Toolbar,
  Button,
  ButtonGroup,
  Alert,
  Snackbar,
} from '@mui/material';

import AddCircleIcon from '@mui/icons-material/AddCircle';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import RecommendIcon from '@mui/icons-material/Recommend';
import HomeIcon from '@mui/icons-material/Home';

function App() {
  const baseURL = 'http://localhost:3080';
  const popularityOptions = [1, 2, 4, 10, 20];

  const [userId, setUserId] = useState('');

  const [selectedPopularityQuery, setSelectedPopularityQuery] = useState('');
  const [selectedTagQuery, setSelectedTagQuery] = useState('');

  const [allPosts, setAllPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [recommendedPosts, setRecommendedPosts] = useState([]);


  const [tags, setTags] = useState({});
  const [tagsList, setTagsList] = useState([]);
  const [selectedTagId, setSelectedTagId] = useState('');

  const [anchorEl, setAnchorEl] = useState(null);

  const [alertMsg, setAlertMsg] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState('');

  useEffect(() => {
    if (showAlert) {
      setTimeout(() => {
        handleAlert('', false, '');
      }, 1500);
    }
  }, [showAlert]); 

  const handleAlert = (message, isShow, type) => {
    setAlertMsg(message);
    setShowAlert(isShow);
    setAlertType(type);
  };

  ///////////////////////////////////// data req /////////////////////////////////////
  axios.defaults.withCredentials = true;
  ///////////////////// get req /////////////////////

  // sets a userId cookie
  const getUser = useCallback(() => {
    axios
      .get(`${baseURL}/user`)
      .then((response) => {
        setUserId(response.data.id);
      })
      .catch((error) => {
        handleAlert(error.message, true, 'error');
      });
  }, []);

  const getPosts = useCallback(() => {
    axios
      .get(`${baseURL}/posts`)
      .then((response) => {
        setAllPosts([...response.data['filteredPosts']]);
        setFilteredPosts([...response.data['filteredPosts']]);
        setRecommendedPosts([...response.data['filteredPosts']]);
      })
      .catch((error) => {
        handleAlert(error.message, true, 'error');
      });
  }, []);

  const getTags = useCallback(() => {
    axios
      .get(`${baseURL}/tags`)
      .then((response) => {
        setTags({ ...response.data['Tags'] });
        const tagsList = [];
        for (const tagName in response.data['Tags']) {
          tagsList.push(tagName);
        }
        setTagsList(tagsList);
      })
      .catch((error) => {
        handleAlert(error.message, true, 'error');
      });
  }, []);

  useEffect(() => {
    getPosts();
    getTags();
    getUser();
  }, [getPosts, getTags, getUser]);

  // Send a get request to the server so that we receive filtered posts (by popularity and/or tag) or all of them
  const getFilteredPosts = (popularity, tag) => {
    const tmp = popularity !== '' ? `popularity=${popularity}` : '';
    const url = tag !== '' ? (popularity !== '' ? `tag=${tag}&popularity=${popularity}` : `tag=${tag}`) : tmp;

    axios
      .get(`${baseURL}/posts?${url}`)
      .then((response) => {
        setFilteredPosts([...response.data['filteredPosts']]);  
      })
      .catch((error) => {
        handleAlert(error.message, true, 'error');
      });
  };

// A get request to the server requests information for a particular user if he liked or disliked a specific post
  const getLikeInformaion = (postID, userID, callback) => {
    axios
      .get(`${baseURL}/user-like-post?postID=${postID}&userID=${userID}`)
      .then((response) => {
        // send callback to Post.js 
        callback(response.data.like, response.data.dislike);
      })
      .catch((error) => {
        handleAlert(error.message, true, 'error');
      });
  };

  const getRecommendedPostsForMe = () => {

    axios
    .get(`${baseURL}/my-recommended-posts?userId=${userId}`)
    .then((response) => {
      setRecommendedPosts([...response.data['recommendedPosts']]);
    })
    .catch((error) => {
      handleAlert(error.message, true, 'error');
    });
  };

  ///////////////////// post req /////////////////////
  const addPost = (id, title, content, selectedTag, navigate) => {
    axios
      .post(
        `${baseURL}/posts`,
        {
          post: {
            id,
            title,
            content,
            selectedTag
          },
        },
        {
          headers: {
            // to send a request with a body as json you need to use this 'content-type'
            'content-type': 'application/x-www-form-urlencoded',
          },
        }
      )
      .then((response) => {
        navigate('/');
        setAllPosts([...response.data['Posts']]);
        setFilteredPosts([...response.data['Posts']]); 
        setTags({ ...response.data['Tags'] }); 
        handleAlert("Post added successfully", true, "success");
      })
      .catch((error) => {
        handleAlert(error.message, true, "error");
      }
      );

  };

  const addNewTag = (tagName) => {
    axios
      .post(`${baseURL}/tags/tagName/${tagName}`)
      .then((response) => {
        setTags({ ...response.data['Tags'] });
        const tagsList = [];
        for (const tagName in response.data['Tags']) {
          tagsList.push(tagName);
        }
        setTagsList(tagsList);
      })
      .catch((error) => {
        handleAlert(error.message, true, 'error');
      });
  };

  // Send req to server to add tag to a post
  const addTagToPost = (tagName, postID) => { 
    axios
      .post(`${baseURL}/addTags/postID/${postID}/tagName/${tagName}`)
      .then((response) => {
        setTags({ ...response.data['Tags'] });
        handleAlert("Tag was added successfully", true, "success");
      })
      .catch((error) => {
        handleAlert(error.message, true, 'error');
      });
  };

  // Sending a post request to the server that will update when the user likes or dislikes the post
  const addLikeOrDislikeToPost = (postID, userID, likeOrDis) => { 
    axios
      .post(`${baseURL}/post/postID/${postID}/likeOrDis/${likeOrDis}`)
      .then((response) => {
        setAllPosts([...response.data['Posts']]);
        setFilteredPosts([...response.data['Posts']]);
        handleAlert("like or dislike was added successfully", true, "success");
      })
      .catch((error) => {
        handleAlert(error.message, true, 'error');
      });
  };


  ///////////////////////////////////// handle click events /////////////////////////////////////
  const handlePopularityClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopularityMenuClose = (selectedOption) => {
    setAnchorEl(null);
    filterPostsByPopularity(selectedOption);
  };

  const handleHomeClick = () => {
    setFilteredPosts(allPosts);
    setSelectedPopularityQuery('');
    setSelectedTagId('');
  };

  const handleRecommendedClick = () => {
    setSelectedPopularityQuery('');
    setSelectedTagId('');
  };

  ///////////////////////////////////// filters /////////////////////////////////////
  const filterPostsByPopularity = (minLikeNum = 1) => {
    setSelectedPopularityQuery(`${minLikeNum}`);
    getFilteredPosts(minLikeNum, selectedTagQuery);
  };

  const filterPostsByTag = (selectedTag = '', tagId) => {
    setSelectedTagQuery(`${selectedTag}`);
    setSelectedTagId(`${tagId}`);
    getFilteredPosts(selectedPopularityQuery, selectedTag);
  };

  ///////////////////////////////////// render components /////////////////////////////////////
  const renderToolBar = () => {
    return (
      <AppBar position='sticky' color='inherit'>
        <Toolbar>
          <ButtonGroup variant='text' aria-label='text button group'>
            <Button
              onClick={handleHomeClick}
              href='/'
              size='large'
              startIcon={<HomeIcon />}
            >
              Home
            </Button>
            <Button
              href='/add-new-post'
              size='large'
              startIcon={<AddCircleIcon />}
              data-testid='addNewPostBtn'
            >
              Add a New Post
            </Button>
          </ButtonGroup>
          <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
            Enter 2023 Blog Exam
          </Typography>
          <Button
              href='/my-recommended-posts'
              onClick={handleRecommendedClick}
              size='large'
              startIcon={<RecommendIcon />}
            >
              Explore more posts
            </Button>
          <Button
            className={
              window.location.href !==
                'http://localhost:3000/my-recommended-posts' &&
              window.location.href !== 'http://localhost:3000/add-new-post'
                ? ''
                : 'visibilityHidden'
            }
            size='large'
            startIcon={<FilterAltIcon />}
            onClick={(e) => handlePopularityClick(e)}
            data-testid='popularityBtn'
          >
            Filter by Popularity
          </Button>
          <FloatingMenu
            menuOptions={popularityOptions}
            anchorElement={anchorEl}
            handleMenuClose={handlePopularityMenuClose}
          />
        </Toolbar>
      </AppBar>
    );
  };

  return (
    <div className='App'>
      {renderToolBar()}
      {showAlert && (
        <Snackbar>
          <Alert severity={alertType} data-testid='alert'>
            {alertMsg}
          </Alert>
        </Snackbar>
      )}
      <Router>
        <Routes>
          <Route
            path='/my-recommended-posts'
            element={
              <MyRecommendedPosts
                Posts={recommendedPosts}
                Tags={tags}
                tagsList={tagsList}
                handleAddNewTag={addNewTag}
                getRecommendedPostsForMe={getRecommendedPostsForMe}
                userId={userId}
                handleAddTagToPost={addTagToPost}
                filterPostsByTag={filterPostsByTag}
                selectedTagId={selectedTagId}
                handleAddLikeOrDislikeToPost={addLikeOrDislikeToPost}
                getLikeInformaion={getLikeInformaion}

              />
            }
          />
          <Route
            path='/add-new-post'
            element={<AddNewPost handleAddPost={addPost} tagsList={tags} />}
          />
          <Route
            path='/'
            element={
              <Home
                Posts={filteredPosts} 
                Tags={tags}
                tagsList={tagsList}
                handleAddNewTag={addNewTag}
                selectedTagId={selectedTagId}
                selectedPopularityQuery={selectedPopularityQuery}
                selectedTagQuery={selectedTagQuery}
                userId={userId}
                handleAddTagToPost={addTagToPost}
                handleAddLikeOrDislikeToPost={addLikeOrDislikeToPost}
                getLikeInformaion={getLikeInformaion}
                filterPostsByTag={filterPostsByTag}
              />
            }
          />
          {/* <Route
            path="/?popularity=:popularity"
          /> */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
