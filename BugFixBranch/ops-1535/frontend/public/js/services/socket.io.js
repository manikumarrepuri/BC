app.factory('socket', function ($location) {
  "use strict";
  let port = "9443";
  let scheme = $location.protocol();

  if ((scheme == "http" && port == "80")
    || (scheme == "https" && port == "443")) {
    port = "";
  } else {
    port = ":" + port;
  }
  let url = $location.protocol() + "://" + $location.host() + port;
  console.log('Connecting to pubsub at: ' + url);
  return io.connect(url);
});
