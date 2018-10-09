import getSumOfProperty from '../utils/calc';

function commentScoreCompare(a, b) {
  if (a.upvotes < b.upvotes) {
    return 1;
  } else if (a.upvotes > b.upvote) {
    return -1;
  }
  return 0;
}

// Comment converting function, as we don't want all the properties
export function convertCommentForApi(dbComment, isForUserRoute) {
  // Get score
  const computedScore = getSumOfProperty(dbComment.CommentVotes, 'score');

  // Process child comments
  let convertedChildComments = null;
  if (typeof (dbComment.childComments) !== 'undefined' && dbComment.childComments.length !== 0) {
    convertedChildComments = dbComment
      .childComments.map(item => convertCommentForApi(item, isForUserRoute));
  }

  const comment = {
    id: dbComment.id,
    content: dbComment.content,
    createdAt: dbComment.createdAt,
    userId: dbComment.userId,
    username: dbComment.User.username,
    upvotes: computedScore,
    downvote: dbComment.downvote,
    upvote: dbComment.upvote,
    childComments: convertedChildComments,
  };

  // Special case for user route
  if (isForUserRoute) {
    comment.post = dbComment.Post;
  }

  return comment;
}

function mapCommentRec(rootComments, results) {
  // Stop case
  if (!rootComments) {
    return [];
  }

  // Map comments recursively
  return rootComments.map((item) => {
    const newItem = item;
    const childComments = results.filter(elt => elt.ParentId === item.id);
    newItem.childComments = childComments.sort(commentScoreCompare);
    if (typeof (newItem.childComments) !== 'undefined') {
      newItem.childComments = mapCommentRec(newItem.childComments, results);
    }
    return newItem;
  });
}

// Convert the returned model from sequelize to a proper output for the API
export default function convertCommentsResult(results, isForUserRoute) {
  // First set comments as a tree
  let rootComments = [];
  if (!isForUserRoute) {
    rootComments = results.filter(elt => elt.ParentId === null);
  } else {
    rootComments = results;
  }

  rootComments = mapCommentRec(rootComments, results);

  if (isForUserRoute) {
    return rootComments.map(item => convertCommentForApi(item, isForUserRoute));
  }

  return rootComments.map(item => convertCommentForApi(item, isForUserRoute))
    .sort(commentScoreCompare);
}
