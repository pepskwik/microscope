Posts = new Mongo.Collection('posts');

postWithSameLink = function(url) {
  return Posts.findOne({ url: url });
};

validatePost = function(post) {
  var errors = {};

  if (!post.title) {
    errors.title = 'Please fill in a headline';
  }

  if (!post.url) {
    errors.url = 'Please fill in a URL';
  }

  return errors;
};

Posts.allow({
  update: function(userId, post) {
    return ownsDocument(userId, post);
  },

  remove: function(userId, post) {
    return ownsDocument(userId, post);
  }
});

/*jshint -W075 */
Posts.deny({
  update: function(userId, post, fieldNames) {
    // may only edit the following two fields:
    return (_.without(fieldNames, 'url', 'title').length > 0);
  },
  update: function(userId, post, fieldNames, modifier) {
    var errors = validatePost(modifier.$set);
    return errors.title || errors.url;
  }
});

Meteor.methods({
  postInsert: function(postAttributes) {
    check(Meteor.userId(), String);
    check(postAttributes, {
      title: String,
      url: String
    });

    var errors = validatePost(postAttributes);
    if (errors.title || errors.url) {
      throw new Meteor.Error('invalid-post',
        'You must set a title and URL for your post');
    }
    if (postWithSameLink(postAttributes.url)) {
      return {
        postExists: true,
        _id: postWithSameLink._id
      };
    }

    var user = Meteor.user();
    var post = _.extend(postAttributes, {
      userId: user._id,
      author: user.username,
      submitted: new Date()
    });

    var postId = Posts.insert(post);

    return {
      _id: postId
    };
  }
});