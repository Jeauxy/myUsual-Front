$(document).ready(function() {
  var auth0 = null;
  auth0 = new Auth0({
    domain: 'jeauxy.auth0.com',
    clientID: 'GoBNjyrd7W9Jg1HECE7nH82QUhjTsM2B',
    callbackOnLocationHash: true,
    responseType: 'token',
    callbackURL: 'https://boiling-wildwood-13698.herokuapp.com/foods',
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

  $('#btn-google').on('click', function(e) {
    console.log("GOOGLE CLICKED");
    e.preventDefault();
    auth0.login({
      connection: 'google-oauth2'
    }, function(err) {
      if (err) alert("something went wrong: " + err.message);
    });
  });

  $('#btn-logout').on('click', function(e) {
    console.log("LOGOUT CLICKED");
     e.preventDefault();
     localStorage.removeItem('id_token');
     logout();
  })


// var show_logged_in = function(username) {
//   $('form.form-signin').hide();
//   $('div.logged-in').show();
// };
//
// var show_sign_in = function() {
//   $('div.logged-in').hide();
//   $('form.form-signin').show();
// };

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

  if (isLoggedIn()){
    showProfile();
    $('.container').hide();
  }

});

var lock = new
//1. Client ID, 2. Client Domain, 3. Oject of Attr
  Auth0Lock('GoBNjyrd7W9Jg1HECE7nH82QUhjTsM2B', 'jeauxy.auth0.com', {
    auth: {
      params: {
        scope: 'openid email'
    }
  }
});

lock.on('authenticated', function (authResult) {
  console.log(authResult);
  localStorage.setItem('idToken', authResult.idToken);
  console.log('Logged In!');
  loadFoods();
  showProfile();
  $('.container').hide();
});

function logout() {
    localStorage.removeItem('idToken')
    window.location.href = '/';
}

function showProfile() {
  $('.container').hide();
  $('#user-info').show();
  lock.getProfile(localStorage.getItem('idToken'), function (error, profile) {
    if (error){
      logout();
    } else {
      console.log('profile', profile);
      $('#fullName').text(profile.given_name);
    }
  })
}

function loadFoods() {
  $.ajax({
    url: 'https://boiling-wildwood-13698.herokuapp.com/foods',
    headers: {
      'Authorization': 'Bearer ' + localStorage.getItem('idToken')
    }
  }).done(function (data) {
    data.forEach(function (datum) {
      loadFood(datum)
  })
})
}

function loadFood(food) {
    var li = $('<li />')
    li.text(food.text + ' ')
    li.data('id', food._id);
    if (food.text){
      li.addClass('done');
    }

    $('#foods').append(li);
}

function isLoggedIn() {
  var token = localStorage.getItem('idToken')
  // var expired = isJwtValid(token);

  if (token) {
    return true;
  } else {
    return false;
  }
}

// function isJwtValid(token) {
//   var token = localStorage.getItem('idToken');
//   if (!token){
//     return false;
//   }
// }
