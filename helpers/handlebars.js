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
      <button type="submit" id="upvote" value="${blogID}" class="unstyled_button"><i id="upvote_${blogID}" class="small material-icons">arrow_upward</i></button>
      <div class="story_score" id="score_${blogID}">${score}</div>
      <button type="submit" id="downvote" value="${blogID}" class="unstyled_button"><i id="downvote_${blogID}" class="small material-icons">arrow_downward</i></button>
      `;
    } else {
      var found = false;
      for (var i = 0; i < scoreStatus.length; i++) {
        if (scoreStatus[i].voteUser.id == userID) {
          if (scoreStatus[i].vote == "upvote") {
            found = true;
            return `
            <button type="submit" id="upvote" value="${blogID}" class="unstyled_button"><i id="upvote_${blogID}" class="small material-icons orange-text">arrow_upward</i></button>
            <div class="story_score" id="score_${blogID}">${score}</div>
            <button type="submit" id="downvote" value="${blogID}" class="unstyled_button"><i id="downvote_${blogID}" class="small material-icons">arrow_downward</i></button>
            `;
          } else {
            found = true;
            return `
            <button type="submit" id="upvote" value="${blogID}" class="unstyled_button"><i id="upvote_${blogID}" class="small material-icons">arrow_upward</i></button>
            <div class="story_score" id="score_${blogID}">${score}</div>
            <button type="submit" id="downvote" value="${blogID}" class="unstyled_button light-blue-text text-darken-2"><i id="downvote_${blogID}" class="small material-icons">arrow_downward</i></button>
            `;
          }
        }
      }
      if (!found) {
        return `
        <button type="submit" id="upvote" value="${blogID}" class="unstyled_button"><i id="upvote_${blogID}" class="small material-icons">arrow_upward</i></button>
        <div class="story_score" id="score_${blogID}">${score}</div>
        <button type="submit" id="downvote" value="${blogID}" class="unstyled_button"><i id="downvote_${blogID}" class="small material-icons">arrow_downward</i></button>
        `;
      }
    }
  },
  writeImage: function(bufferImage) {
    const image = bufferImage.toString("base64");
    return `<img src="data:image/png;base64,${image}" alt="coverImage" class="coverImage">`;
  },
  defaultImage: function() {
    const num = Math.floor(Math.random() * 4) + 1;
    return `<img src="/img/default-coverimage/${num}.png" alt="default-${num}.png" class="coverImage">`;
  }
};
