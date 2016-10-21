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
