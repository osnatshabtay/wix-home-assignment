import { Fab } from '@mui/material';

function Tag({
  tagName,
  postId = '',
  handleOnClick,
  selectedTagId,
  isDisabled,
}) {
  const dataTestId = postId ? `tag-${tagName}-${postId}` : `tag-${tagName}`;
  const color_ = selectedTagId.includes(tagName) ? 'primary' : 'default';

  return (
    <Fab
      key={tagName}
      variant='extended'
      size='small'
      disableRipple
      className='Badge'
      disabled={isDisabled}
      onClick={() => handleOnClick(tagName, dataTestId)}
      color={color_}
      data-testid={dataTestId}
    >
      {tagName}
    </Fab>
  );
}

export default Tag;
