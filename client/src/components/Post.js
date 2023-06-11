import {
  ListItem,
  ListItemButton,
  IconButton,
  Card,
  CardContent,
  CardActions,
  Typography,
} from '@mui/material';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import AddTagButton from './AddTagButton';
import Tag from './Tag';
import { useState } from 'react';

function Post({
  postId,
  postTitle,
  postContent,
  numOfLikes,
  numOfDislikes,
  isAddTagBtn,
  handleAddTagClick,
  handleTagClick,
  selectedTagId,
  isTagDisabled,
  Tags,
  userId,
  handleAddLikeOrDislikeToPost,
  getLikeInformaion,
}) {
  const getTagsByPostId = (postID) => {
    const tagsArr = [];
    for (const tagName in Tags) {
      if (Tags[tagName][postID]) {
        tagsArr.push(tagName);
      }
    }
    return tagsArr;
  };

  const tagsNameArr = getTagsByPostId(postId);
  const isTag = tagsNameArr.length > 0 ? true : false;

  const [didUserLikePost, setDidUserLikePost] = useState(false);
  const [didUserDislikePost, setDidUserDislikePost] = useState(false);


  // a callback function. when a response (about like and dislike of specific user to a specific post)
  // comse back from server this function is activated and sets to states of like and dislike of the post
  const handleResponse = (like, dislike) => {
    // Handle the response data
    setDidUserLikePost(like);
    setDidUserDislikePost(dislike);
  };

  // sends get req to the server to get info wether user liked/disliked post
  getLikeInformaion(postId, userId, handleResponse)

  return (
    <ListItem
      alignItems='flex-start'
      key={`post-${postId}`}
      className='post'
      data-testid={`post-${postId}`}
    >
      <Card className='post'>
        <ListItemButton disableGutters>
          <CardContent>
            <Typography
              variant='h5'
              gutterBottom
              data-testid={`postTitle-${postId}`}
            >
              {postTitle}
            </Typography>
            <Typography
              variant='body1'
              gutterBottom
              data-testid={`postContent-${postId}`}
            >
              {postContent}
            </Typography>
          </CardContent>
        </ListItemButton>
        <CardActions>
          {isAddTagBtn && (
            <AddTagButton
              dataTestId={`postAddTagBtn-${postId}`}
              onClick={(e) => handleAddTagClick(e, postId)} //send postID to Home
            />
          )}
          {isTag &&
            tagsNameArr.map((tagName, index) => (
              <Tag
                key={`post-${index}-${tagName}`}
                tagName={tagName}
                postId={postId}
                handleOnClick={handleTagClick}
                selectedTagId={selectedTagId}
                isDisabled={isTagDisabled}
              />
            ))}
          <IconButton
            aria-label='dislike'
            size='small'
            data-testid={`postDislikeBtn-${postId}`}
            onClick={(e) => {
              setDidUserLikePost(false);
              setDidUserDislikePost(true);
              handleAddLikeOrDislikeToPost(postId, userId, "dislike")}}
          >
            {didUserDislikePost ? (
              <ThumbDownAltIcon
                color='error'
                data-testid={`fullDislikeIcon-${postId}`}
              />
            ) : (
              <ThumbDownOffAltIcon
                color='error'
                data-testid={`hollowDislikeIcon-${postId}`}
              />
            )}
          </IconButton>
          <Typography
            variant='string'
            data-testid={`postDislikeNum-${postId}`}
            color='red'
          >
            {numOfDislikes}
          </Typography>
          <IconButton
            aria-label='like'
            size='small'
            data-testid={`postLikeBtn-${postId}`}
            onClick={(e) => {
              setDidUserLikePost(true);
              setDidUserDislikePost(false);
              handleAddLikeOrDislikeToPost(postId, userId, "like")}
            }
          >
            {didUserLikePost ? (
              <ThumbUpAltIcon
                color='success'
                data-testid={`fullLikeIcon-${postId}`}
              />
            ) : (
              <ThumbUpOffAltIcon
                color='success'
                data-testid={`hollowLikeIcon-${postId}`}
              />
            )}
          </IconButton>
          <Typography
            variant='string'
            data-testid={`postLikeNum-${postId}`}
            color='green'
          >
            {numOfLikes}
          </Typography>
        </CardActions>
      </Card>
    </ListItem>
  );
}

export default Post;
