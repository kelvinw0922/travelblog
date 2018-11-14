const moment = require("moment");

module.exports = {
  // Truncate the body to a reasonable length
  truncate: function(str, len) {
    if (str.length > len && str.length > 0) {
      var new_str = str + " ";
      new_str = str.substr(0, len);
      new_str = str.substr(0, new_str.lastIndexOf(" "));
      new_str = new_str.length > 0 ? new_str : str.substr(0, len);
      return new_str + "...";
    }
    return str;
  },
  // Strip away the HTML tags from the body
  stripTags: function(input) {
    return input.replace(/<(?:.|\n)*?>/gm, "");
  },
  // Change the Date to a human-readable format
  formatDate: function(date, format) {
    return moment(date).format(format);
  },
  // Read select value
  select: function(selected, options) {
    return options
      .fn(this)
      .replace(new RegExp(' value="' + selected + '"'), '$&selected="selected"')
      .replace(
        new RegExp(">" + selected + "</option>"),
        'selected="selected"$&'
      );
  },
  // Check User - Remove Edit Icons
  editIcon: function(blogUser, loggedUser, blogID, floating = true) {
    if (blogUser == loggedUser) {
      if (floating) {
        return `<a href="/blogs/edit/${blogID}" class="btn-floating halfway-fab waves-effect waves-light red"><i class="fa fa-pencil"></i></a>`;
      } else {
        return `<a href="/blogs/edit/${blogID}"><i class="fa fa-pencil"></i></a>`;
      }
    } else {
      return "";
    }
  },
  checkScoreStatus: function(scoreStatus, userID, blogID, score) {
    if (scoreStatus.length == 0) {
      return `
      <form action="/blogs/upvote/${blogID}" method="POST" class="karmaForm">
        <button type="submit" class="unstyled_button"><i class="small material-icons">arrow_upward</i></button>
      </form>
      <div class="story_score">${score}</div>
      <form action="/blogs/downvote/${blogID}" method="POST" class="karmaForm">
        <button type="submit" class="unstyled_button"><i class="small material-icons">arrow_downward</i></button>
      </form>`;
    } else {
      var found = false;
      for (var i = 0; i < scoreStatus.length; i++) {
        if (scoreStatus[i].voteUser.id == userID) {
          if (scoreStatus[i].vote == "upvote") {
            found = true;
            return `
            <form action="/blogs/upvote/${blogID}" method="POST" class="karmaForm">
              <button type="submit" class="unstyled_button"><i class="small material-icons orange-text">arrow_upward</i></button>
            </form>
            <div class="story_score">${score}</div>
            <form action="/blogs/downvote/${blogID}" method="POST" class="karmaForm">
              <button type="submit" class="unstyled_button"><i class="small material-icons">arrow_downward</i></button>
            </form>`;
          } else {
            found = true;
            return `
            <form action="/blogs/upvote/${blogID}" method="POST" class="karmaForm">
              <button type="submit" class="unstyled_button"><i class="small material-icons">arrow_upward</i></button>
            </form>
            <div class="story_score">${score}</div>
            <form action="/blogs/downvote/${blogID}" method="POST" class="karmaForm">
              <button type="submit" class="unstyled_button light-blue-text text-darken-2"><i class="small material-icons">arrow_downward</i></button>
            </form>`;
          }
        }
      }
      // User not found in scoreStatus = hasn't voted yet
      if (!found) {
        return `
        <form action="/blogs/upvote/${blogID}" method="POST" class="karmaForm">
          <button type="submit" class="unstyled_button"><i class="small material-icons">arrow_upward</i></button>
        </form>
        <div class="story_score">${score}</div>
        <form action="/blogs/downvote/${blogID}" method="POST" class="karmaForm">
          <button type="submit" class="unstyled_button"><i class="small material-icons">arrow_downward</i></button>
        </form>`;
      }
    }
  }
};
