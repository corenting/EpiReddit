import getSumOfProperty from '../utils/calc';

// Convert the returned model from sequelize to a proper output for the API
export function convertPostsResult(results) {
  return results.map((item) => {
    // Get score
    const computedScore = getSumOfProperty(item.Votes, 'score');

    return {
      id: item.id,
      content: item.content,
      link: item.link,
      createdAt: item.createdAt,
      categoryId: item.categoryId,
      categoryName: item.Category.name,
      upvotes: computedScore,
      hotness: item.hotness === null ? 0 : item.hotness,
      downvote: item.downvote,
      upvote: item.upvote,
      username: item.User.username,
      userId: item.User.userId,
      title: item.title,
      picture: item.picture,
    };
  });
}

// Compute the hotness of a post
export function getPostHotness(post) {
  // Get score
  const computedScore = getSumOfProperty(post.Votes, 'score');
  const order = Math.log10(Math.max(Math.abs(computedScore), 1));
  let sign = 0;
  if (computedScore > 0) {
    sign = 1;
  } else if (computedScore < 0) {
    sign = -1;
  }

  const seconds = (post.createdAt / 1000) - 1134028003;
  return ((sign * order) + (seconds / 45000)).toFixed(7);
}

export function mapUpvotesOnPost(post, req) {
  const newItem = post;
  newItem.upvote = false;
  newItem.downvote = false;
  if (typeof (newItem.Votes) !== 'undefined') {
    const userVote = newItem.Votes.find(elt => elt.UserId === req.user.id);
    if (typeof (userVote) !== 'undefined' && userVote !== null) {
      newItem.upvote = userVote.score === 1;
      newItem.downvote = userVote.score === -1;
    }
  }
  return newItem;
}
