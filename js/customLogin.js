// This is a separate js file for custom logins

var lock = new Auth0Lock('GoBNjyrd7W9Jg1HECE7nH82QUhjTsM2B', 'jeauxy.auth0.com', {
    additionalSignUpFields: [{
      name: "address",                              // required
      placeholder: "Enter your address",            // required
      icon: "https://example.com/address_icon.png", // optional
      validator: function(value) {                  // optional
        // only accept addresses with more than 10 characters
        return value.length > 10;
      }
    }]
  });

var showUserProfile = function(profile) {

  if (profile.hasOwnProperty('user_metadata')) {
    $('#address').text(profile.user_metadata.address);
  }
}



var auth0 = null;
  // Configure Auth0
  auth0 = new Auth0({
    domain: 'jeauxy.auth0.com',
    clientID: 'GoBNjyrd7W9Jg1HECE7nH82QUhjTsM2B',
    responseType: 'token',
    callbackURL: 'http://localhost:3000/'
  });

  // LOGIN EVENT HANDLER FOR CUSTOM LOGIN

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


var btn_login = $('#btn-login');
var btn_logout = $('#btn-logout');


btn_login.click(function(e) {
  e.preventDefault();
  lock.show();
});

btn_logout.click(function(e) {
  e.preventDefault();
  logout();
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



 // app.js for REGISTERING CUSTOM USER

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

 // app.js for SOCIAL SIGN IN

$('#btn-google').on('click', function(ev) {
  ev.preventDefault();
  auth0.login({
    connection: 'google-oauth2'
  }, function(err) {
    if (err) alert("something went wrong: " + err.message);
  });
});
