$(function() {
  var timesSubmitted = 0;
  var maxSubmits = 1;
  var intervalMilliseconds = 60000; // for testing
  var interval;
  $("input[type=submit]").click(function(event) {
    if (!interval) {
      interval = setTimeout(function() {
        interval = undefined;
        timesSubmitted = 0;
        console.log(interval);
      }, intervalMilliseconds);
    }
    timesSubmitted++;
    if (timesSubmitted > maxSubmits) {
      alert("You have submitted too many times. Please try again later!");
      event.preventDefault();
    }
  });
});
