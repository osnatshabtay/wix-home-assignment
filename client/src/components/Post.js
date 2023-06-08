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

function Post({
  postId,
  postTitle,
  postContent,
  isAddTagBtn,
  handleAddTagClick,
  handleTagClick,
  selectedTagId,
  isTagDisabled,
  Tags,
  userId,
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
  const didUserLikePost = false;
  const didUserDislikePost = false;

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
              onClick={(e) => handleAddTagClick(e, postId)}
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
            0
          </Typography>
          <IconButton
            aria-label='like'
            size='small'
            data-testid={`postLikeBtn-${postId}`}
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
            0
          </Typography>
        </CardActions>
      </Card>
    </ListItem>
  );
}

export default Post;
