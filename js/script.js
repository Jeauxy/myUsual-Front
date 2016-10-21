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

    showProfile();
    $('#welcome').hide();
});


$(document).ready(function () {

  $('#btn-login').on('click', function (e) {
    e.preventDefault();
    lock.show();
  });

  $('#logout').on('click', function (e) {
    e.preventDefault();
    logout();
  });


});

function logout() {
  localStorage.removeItem('idToken')
  window.location.href = '/';
}


function showProfile() {
  $('#btn-login').hide();
  $('#user-info').show();
  lock.getProfile(localStorage.getItem('idToken'), function (error, profile) {
    if (error){
      logout();
    } else {
      console.log('profile', profile);
      $('#firstName').text(profile.given_name);
    }
  // Display user information
    $('.nickname').text(profile.nickname);
    $('.avatar').attr('src', profile.picture);
  })
});
