// This is a separate js file for custom logins



<!-- index.html -->
  ...

  <script src="https://cdn.auth0.com/w2/auth0-7.2.min.js"></script>

  ...


var auth0 = null;
  // Configure Auth0
  auth0 = new Auth0({
    domain: 'jeauxy.auth0.com',
    clientID: 'GoBNjyrd7W9Jg1HECE7nH82QUhjTsM2B',
    responseType: 'token',
    callbackURL: 'http://localhost:3000/'
  });

  // app.js

  $('#btn-login').on('click', function(ev) {
    ev.preventDefault();
    var username = $('#username').val();
    var password = $('#password').val();
    auth0.login({
      connection: 'Username-Password-Authentication',
      responseType: 'token',
      email: username,
      password: password,
    }, function(err) {
      if (err) alert("something went wrong: " + err.message);
    });
  });

  /* ===== ./app.js ===== */
...
var parseHash = function() {
  var result = auth0.parseHash(window.location.hash);
  if (result && result.idToken) {
    localStorage.setItem('id_token', result.idToken);
  } else if (result && result.error) {
    alert('error: ' + result.error);
  }
};

parseHash();
 ...



 // app.js for SIGNING IN

 $('#btn-register').on('click', function(ev) {
   ev.preventDefault();
   var username = $('#username').val();
   var password = $('#password').val();
   auth0.signup({
     connection: 'Username-Password-Authentication',
     responseType: 'token',
     email: username,
     password: password,
   }, function(err) {
     if (err) alert("something went wrong: " + err.message);
   });
 });
