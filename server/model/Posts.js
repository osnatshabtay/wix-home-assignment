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
  

module.exports = { Posts, Likes, Dislikes, updateLikes, updateDislikes };