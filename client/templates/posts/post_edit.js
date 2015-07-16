Template.postEdit.onCreated(function() {
  Session.set('postEditErrors', {});
});

Template.postEdit.helpers({
  errorMessage: function(field) {
    return Session.get('postEditErrors')[field];
  },
  errorClass: function(field) {
    return !!Session.get('postEditErrors')[field] ? 'has-error' : '';
  }
});

Template.postEdit.events({
  'submit form': function(event) {
    event.preventDefault();

    var currentPostId = this._id;

    var postProperties = {
      url: $(event.target).find('[name=url]').val(),
      title: $(event.target).find('[name=title]').val()
    };

    var errors = validatePost(postProperties);
    if (errors.title || errors.url) {
      return Session.set('postEditErrors', errors);
    }

    Posts.update(currentPostId, { $set: postProperties }, function(error) {
      if (error) {
        // display the error to the user
        Errors.throw(error.reason);
      } else {
        Router.go('postPage', { _id: currentPostId });
      }
    });
  },

  'click .delete': function(event) {
    event.preventDefault();

    if (confirm('Delete this post?')) {
      var currentPostId = this._id;
      Posts.remove(currentPostId);
      Router.go('postsList');
    }
  }
});
