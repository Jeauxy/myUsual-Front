$(document).ready(function() {

  $('#btn-login').on('click', function (e) {
    e.preventDefault();
    lock.show();
  });

  $('#logout').on('click', function (e) {
    console.log('clicked');
    e.preventDefault();
    logout();
  });

  if (isLoggedIn()){
    loadLists();
    showProfile();
    addNewList();
    $('#welcome').hide();
    $('#home').hide();
    $('#blank').hide();
  }

});

function deleteFood(e) {
  e.preventDefault();
  e.stopPropagation();
  var link = $(this)
  $.ajax({
    url: link.attr('href'),
    method: 'DELETE',
    headers: {
      'Authorization': 'Bearer ' + localStorage.getItem('idToken')
    }
  }).done(function () {
    link.parent('li').remove();
  })
}

function showProfile() {
  $('#btn-login').hide();
  $('#logout').show();
  $('#food-lists').show();
  lock.getProfile(localStorage.getItem('idToken'), function (error, profile) {
    if (error){
      logout();
    } else {
      console.log('profile', profile);
      $('#fullName').text(profile.given_name);
    }
  })
}

function addNewList() {
  $('#food-lists').on('submit', function (e) {
    e.preventDefault()
    $.ajax({
      url: 'https://boiling-wildwood-13698.herokuapp.com/lists',
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('idToken')
      },
      data: {
        text: $('#list-name').val()
      }
    }).done(function (newList) {
      loadList(newList)
      $('#list-name').val('').focus()
    })
  })
}

function loadLists() {
  $.ajax({
    url: 'https://boiling-wildwood-13698.herokuapp.com/lists',
    headers: {
      'Authorization': 'Bearer ' + localStorage.getItem('idToken')
    }
  }).done(function (data) {
    data.forEach(function (datum) {
      loadList(datum)
  })
})
}

function loadList(list) {
  console.log(list);
    var button = $('<button type="button" class="list-group-item" />')
    button.text(list.listName + ' ')
    button.data('id', list._id);
    $('#lists').append(button);
}

var lock = new
//1. Client ID, 2. Client Domain, 3. Oject of Attr
  Auth0Lock('GoBNjyrd7W9Jg1HECE7nH82QUhjTsM2B', 'jeauxy.auth0.com', {
    auth: {
      params: {
        scope: 'openid email'
    }
  }
});

function isLoggedIn() {
  var token = localStorage.getItem('idToken')
  var expired = isJwtValid(token);

  if (token) {
    return true;
  } else {
    return false;
  }
}


function isJwtValid(token) {
  var token = localStorage.getItem('idToken');
  if (!token){
    return false;
  }
}


lock.on('authenticated', function (authResult) {
  console.log(authResult);
  localStorage.setItem('idToken', authResult.idToken);
  console.log('Logged In!');
  loadLists();
  showProfile();
  addNewList();
  $('#welcome').hide();
  $('#home').hide();
  $('#blank').hide();
});

function logout() {
    localStorage.removeItem('idToken')
    window.location.href = '/';
}
