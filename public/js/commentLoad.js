$(function() {
  var pathName = window.location.pathname;
  var blogid = window.location.pathname.split("/").pop();
  const limit = 10;
  var payload = { commentIndex: 1, commentLimit: limit };
  var theEnd = false;
  var Initload = false;

  if (pathName.indexOf("/blogs/show/") >= 0) {
    // Initial Loading
    $.get(`../comment/${blogid}`, payload, function(data) {
      payload.commentIndex += limit;
      loadComments(data.comments, blogid);
      theEnd = data.theEnd;
      Initload = true;
    });

    // Scrolling
    if (!theEnd) {
      $(window).scroll(function() {
        var position = $(window).scrollTop();
        var bottom = $(document).height() - $(window).height();

        if (pathName.indexOf("/blogs/show/") >= 0) {
          if (position == bottom && !theEnd && Initload) {
            $.get(`../comment/${blogid}`, payload, function(data) {
              payload.commentIndex += limit;
              loadComments(data.comments, blogid);
              theEnd = data.theEnd;
            });
          }
        }
      });
    }
  }
});

function loadComments(data, blogid) {
  var result = "";
  var commentDiv = document.getElementById(`comment_${blogid}`);
  data.forEach(comment => {
    console.log(comment.commentUser);
    var newComment = `
      <hr>
      <div class="card-content">
        <h5 class="word-wrapping">${comment.commentBody}</h5>
        <div class="chip">
          <img src="${comment.commentUser.image}" alt="${
      comment.commentUser.firstName
    } ${comment.commentUser.lastName}">
          <a href="/blogs/user/${comment.commentUser._id}">${
      comment.commentUser.firstName
    } ${comment.commentUser.lastName}</a>
        </div>
        <br>
        <small>Posted at: ${$.format.date(
          comment.commentDate,
          "H:mm MMMM d, yyyy"
        )}</small>
      </div>
    `;
    result += newComment;
  });
  commentDiv.insertAdjacentHTML("beforeend", result);
}
