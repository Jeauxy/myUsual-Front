var lock = new
//1. Client ID, 2. Client Domain, 3. Oject of Attr
  Auth0Lock('GoBNjyrd7W9Jg1HECE7nH82QUhjTsM2B', 'jeauxy.auth0.com', {
    auth: {
      params: {
        scope: 'openid email'
    }
  }
});

<!-- CHECK SESSION -->

var id_token = localStorage.getItem('id_token');

if (null != id_token) {
  lock.getProfile(id_token, function (err, profile) {
    if (err) {
      // Remove expired token (if any) from localStorage
      localStorage.removeItem('id_token');
      return alert('There was an error getting the profile: ' + err.message);
    } // else: user is authenticated
  });
}

lock.on('authenticated', function (authResult) {
  console.log(authResult);
  localStorage.setItem('idToken', authResult.idToken);
  loadStores();
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

function loadStores() {
  $.ajax({
    url: 'https://boiling-wildwood-13698.herokuapp.com/stores',
    headers: {
      'Authorization': 'Bearer ' + localStorage.getItem('idToken')
    }
  }).done(function (data) {
    data.forEach(function (datum) {
      loadStore(datum)
  })
})
}

function loadStore(store) {
  console.log(store);
  var li = $('<li />')
  li.text(store.name + ' ')
  li.data('id', store._id);
  if (store.completed){
    li.addClass('done');
  }
  var deleteLink = $('<a />');
  deleteLink.text('Delete')
  deleteLink.attr('href','https://boiling-wildwood-13698.herokuapp.com/stores' + store._id)
  deleteLink.addClass('delete-link')

  li.append(deleteLink)

  $('#stores').append(li);
}


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
}
