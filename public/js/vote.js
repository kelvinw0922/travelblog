$("button.upvote").click(function() {
  var payload = { blogid: $(this).attr("value") };
  let upvotePath = "blogs/upvote";
  if (window.location.pathname != "/blogs") {
    upvotePath = "upvote";
  }
  $.get(upvotePath, payload, function(data) {
    $(`#score_${payload.blogid}`).text(data.newScore);
    if (data.colored) {
      $(`#upvote_${payload.blogid}`).addClass("orange-text");
      $(`#downvote_${payload.blogid}`).removeClass("light-blue-text");
      $(`#downvote_${payload.blogid}`).removeClass("text-darken-2");
    } else {
      $(`#upvote_${payload.blogid}`).removeClass("orange-text");
    }
  });
});

$("button.downvote").click(function() {
  var payload = { blogid: $(this).attr("value") };
  let downvotePath = "blogs/downvote";
  if (window.location.pathname != "/blogs") {
    downvotePath = "downvote";
  }
  $.get(downvotePath, payload, function(data) {
    $(`#score_${payload.blogid}`).text(data.newScore);
    if (data.colored) {
      $(`#downvote_${payload.blogid}`).addClass("light-blue-text");
      $(`#downvote_${payload.blogid}`).addClass("text-darken-2");
      $(`#upvote_${payload.blogid}`).removeClass("orange-text");
    } else {
      $(`#downvote_${payload.blogid}`).removeClass("light-blue-text");
      $(`#downvote_${payload.blogid}`).removeClass("text-darken-2");
    }
  });
});
