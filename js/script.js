
// AUTH0 LOCK FOR CUSTOM LOGIN

// var lock = new Auth0Lock('GoBNjyrd7W9Jg1HECE7nH82QUhjTsM2B', 'jeauxy.auth0.com', {
//     additionalSignUpFields: [{
//       name: "address",                              // required
//       placeholder: "Enter your address",            // required
//       icon: "https://example.com/address_icon.png", // optional
//       validator: function(value) {                  // optional
//         // only accept addresses with more than 10 characters
//         return value.length > 10;
//       }
//     }]
//   });
//
// var showUserProfile = function(profile) {
//
//   if (profile.hasOwnProperty('user_metadata')) {
//     $('#address').text(profile.user_metadata.address);
//   }
// }

$(document).ready(function() {
  var auth0 = null;
  auth0 = new Auth0({
    domain: 'jeauxy.auth0.com',
    clientID: 'GoBNjyrd7W9Jg1HECE7nH82QUhjTsM2B',
    callbackOnLocationHash: true,
    responseType: 'token',
    callbackURL: './',
  });

  $('#btn-login').on('click', function(e) {
    console.log("LOGIN CLICKED");
    e.preventDefault();
    var username = $('#username').val();
    var password = $('#password').val();
    auth0.login({
      connection: 'Username-Password-Authentication',
      responseType: 'token',
      email: username,
      password: password,
    }, function(err) {
      if (err) {
        alert("something went wrong: " + err.message);
      } else {
        show_logged_in(username);
      }
    });
  });

  $('#btn-register').on('click', function(e) {
    console.log("SIGN UP CLICKED");
    e.preventDefault();
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

  $('#btn-google').on('click', function(ev) {
    console.log("GOOGLE CLICKED");
    ev.preventDefault();
    auth0.login({
      connection: 'google-oauth2'
    }, function(err) {
      if (err) alert("something went wrong: " + err.message);
    });
  });

  $('#btn-logout').on('click', function(ev) {
    console.log("LOGOUT CLICKED");
     ev.preventDefault();
     localStorage.removeItem('id_token');
     window.location.href = "/";
  })

  var parseHash = function() {
    var token = localStorage.getItem('id_token');
    if (null != token) {
      show_logged_in();
    } else {
      var result = auth0.parseHash(window.location.hash);
      if (result && result.idToken) {
        localStorage.setItem('id_token', result.idToken);
        show_logged_in();
      } else if (result && result.error) {
        alert('error: ' + result.error);
        show_sign_in();
      }
    }
  };

  parseHash();

});

var settings = {
  "async": true,
  "crossDomain": true,
  "url": "https://${account.namespace}/dbconnections/signup",
  "method": "POST",
  "headers": {
    "content-type": "application/json"
  },
  "processData": false,
  "data": "{\"client_id\": \"GoBNjyrd7W9Jg1HECE7nH82QUhjTsM2B\",\"email\": \"$('#signup-email').val()\",\"password\": \"$('#signup-password').val()\",\"user_metadata\": {\"name\": \"john\",\"color\": \"red\"}}"
}

$.ajax(settings).done(function (response) {
  console.log(response);
});

window.auth0 = new Auth0({
  domain: 'jeauxy.auth0.com',
  clientID: 'GoBNjyrd7W9Jg1HECE7nH82QUhjTsM2B',
  // Callback made to your server's callback endpoint
  callbackURL: './',
});
