import { List, Typography } from '@mui/material';
import FloatingMenu from '../components/FloatingMenu';
import Post from '../components/Post';
import TagsCloud from '../components/TagsCloud';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

function Home({
  Posts,
  Tags,
  tagsList,
  handleAddNewTag, 
  selectedTagId,
  selectedPopularityQuery,
  userId,
  handleAddTagToPost,
  handleAddLikeOrDislikeToPost,
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [anchorEl, setAnchorEl] = useState(null);
  const [currPostID, setCurrPostID] = useState(null); // used to set current set to post id

  ///////////////////////////////////// handle query param /////////////////////////////////////
  searchParams.get('popularity');

  useEffect(() => {
    if (selectedPopularityQuery !== '') {
      setSearchParams({ popularity: `${selectedPopularityQuery}` });
    }
  }, [selectedPopularityQuery, setSearchParams]);

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
  const handleTagClick = (tagName, tagId) => {};

  ///////////////////////////////////// render components /////////////////////////////////////
  return (
    <div className='container'>
      <List sx={{ width: '650px' }}>
        {Posts.length !== 0 &&
          Posts.map((post) => {            
            return (
              <Post
                key={`home-${post.id}`}
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
                handleAddLikeOrDislikeToPost = {handleAddLikeOrDislikeToPost}
              />
            );
          })}
        {Posts.length === 0 && (
          <Typography variant='h5' component='div' data-testid='emptyPostList'>
            No Posts Were Found
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

export default Home;
