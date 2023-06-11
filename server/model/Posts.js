const Posts = [
    {id: "11", title: 'Example Title 1', content: 'Example content 1', userId: "11", likes: 0, dislikes: 0},
    {id: "12", title: 'Example Title 2', content: 'Example content 2', userId: "11", likes: 0, dislikes: 0},
    {id: "13", title: 'Example Title 3', content: 'Example content that has more then 300 characters, Example content that has more then 300 characters, Example content that has more then 300 characters, Example content that has more then 300 characters, Example content that has more then 300 characters, Example content that has more then 300 characters', userId: "11", likes: 0, dislikes: 0}
];



// A data structure that will hold the users who liked each post
const Likes = {
    "11": new Set(), 

    "12": new Set(), 

    "13": new Set(),
};

// A data structure that will hold the users who disliked each post
const Dislikes = {
    "11": new Set(), 

    "12": new Set(), 

    "13": new Set(),
};

// Adding/subtracting a like from the list of posts 
function updateLikes(postId, operation) {
    // Find the post with the given id
    const postToUpdate = Posts.find((post) => post.id === postId);
  
    // If the post is found, update the likes based on the operation
    if (postToUpdate) {
      if (operation === 'add') {
        postToUpdate.likes += 1;
      } else if (operation === 'subtract') {
        postToUpdate.likes -= 1;
      }
    }
  }

  // Adding/subtracting a dislike from the list of posts
  function updateDislikes(postId, operation) {
    // Find the post with the given id
    const postToUpdate = Posts.find((post) => post.id === postId);
  
    // If the post is found, update the likes based on the operation
    if (postToUpdate) {
      if (operation === 'add') {
        postToUpdate.dislikes += 1;
      } else if (operation === 'subtract') {
        postToUpdate.dislikes -= 1;
      }
    }
  }
  
function getRecommendedPosts(userId) {
  const recommendedPosts_attribute2 = new Set();
  const likedPosts = new Set();

  // Get posts that the current user has liked
  for (const postId in Likes) {
    if (Likes.hasOwnProperty(postId)) {
      const usersWhoLikedPost = Likes[postId]; // Get the users who liked the curr post (postId)

      // if curr user (userId) liked curr post (postId)
      if (usersWhoLikedPost.has(userId)) {
        for (const user of usersWhoLikedPost) {

          // Collect the liked posts of the users who liked postId, excluding the ones the current user has already liked
          for(const postId_ in Likes){
            if (user !== userId && Likes[postId_].has(user) && !Likes[postId_].has(userId)) {
              recommendedPosts_attribute2.add(postId_);
            }
          }
        }
      }
    }
  }
  const recommendedPosts_attribute1Array = Posts.filter((post) => !recommendedPosts_attribute2.has(post.id) && !Likes[post.id].has(userId) && !Dislikes[post.id].has(userId));
  const recommendedPosts_attribute2Array = Posts.filter((post) => recommendedPosts_attribute2.has(post.id));

  return recommendedPosts_attribute1Array.concat(recommendedPosts_attribute2Array);
}

module.exports = { Posts, Likes, Dislikes, updateLikes, updateDislikes, getRecommendedPosts };