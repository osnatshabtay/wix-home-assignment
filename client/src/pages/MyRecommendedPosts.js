import { List, Typography } from '@mui/material';
import { useState, useEffect } from 'react';
import Post from '../components/Post';
import TagsCloud from '../components/TagsCloud';
import FloatingMenu from '../components/FloatingMenu';

// import { useSearchParams } from 'react-router-dom';


function MyRecommendedPosts({ 
  Posts, 
  Tags, 
  tagsList,
  handleAddNewTag,
  getRecommendedPostsForMe, 
  userId, 
  handleAddTagToPost,
  filterPostsByTag, 
  selectedTagId,
  handleAddLikeOrDislikeToPost,
  getLikeInformaion,

 }) {
  // const [searchParams, setSearchParams] = useSearchParams();
  const [anchorEl, setAnchorEl] = useState(null);
  const [currPostID, setCurrPostID] = useState(null); // used to set current set to post id

  useEffect(() => {
    getRecommendedPostsForMe();
  }, [userId]);

  ///////////////////////////////////// handle tag on post /////////////////////////////////////
  const handleAddTagClick = (event, selectedPostId) => { 
    setCurrPostID(selectedPostId);
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = (selectedOption) => {
    handleAddTagToPost(selectedOption, currPostID);
    setAnchorEl(null);
  };

  ///////////////////////////////////// handle filter tag /////////////////////////////////////
  const handleTagClick = (tagName, tagId) => {
    filterPostsByTag(tagName, tagId);
  };

  return (
    <div className='container'>
      <List sx={{ width: '650px' }}>
        { 
          Posts.sort((a, b) => b.likes - a.likes) &&  // sort by amount of likes
          Posts.length !== 0 &&
          Posts.map((post) => {
            return (
              <Post
                key={`myRecommendedPosts-${post.id}`}
                postId={post.id}
                postTitle={post.title}
                postContent={post.content}
                numOfLikes={post.likes}
                numOfDislikes={post.dislikes}
                isAddTagBtn={true}
                handleAddTagClick={handleAddTagClick}
                handleTagClick={handleTagClick}
                selectedTagId={selectedTagId}
                isTagDisabled={false}
                Tags={Tags}
                userId={userId}
                handleAddLikeOrDislikeToPost={handleAddLikeOrDislikeToPost}
                getLikeInformaion={getLikeInformaion}
              />
            );
          })}
        {Posts.length === 0 && (
          <Typography variant='h5' component='div' data-testid='emptyPostList'>
            No Posts Were Foundxs
          </Typography>
        )}
      </List>
      <TagsCloud
        tagsList={tagsList}
        handleAddNewTag={handleAddNewTag}
        selectedTagId={selectedTagId}
        handleTagClick={handleTagClick}
      />
      <FloatingMenu
        menuOptions={tagsList}
        anchorElement={anchorEl}
        handleMenuClose={handleMenuClose}
      />
    </div>
  );
}

export default MyRecommendedPosts;
