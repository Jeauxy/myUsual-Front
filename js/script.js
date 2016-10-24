$(document).ready(function() {

  $('#btn-login').on('click', function (e) {
    e.preventDefault();
    lock.show();
  });

  $('#logout').on('click', function (e) {
    e.preventDefault();
    logout();
  });

  if (isLoggedIn()){
    loadFoods();
    showProfile();
    addNewFood();
    $('#welcome').hide();
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

function addNewFood() {
  $('#new-food-form').on('submit', function (e) {
    e.preventDefault()
    $.ajax({
      url: 'https://boiling-wildwood-13698.herokuapp.com/foods',
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('idToken')
      },
      data: {
        text: $('#food-name').val()
      }
    }).done(function (newFood) {
      loadFood(newFood)
      $('#food-name').val('').focus()
    })
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
    li.text(itemName.text + ' ')
    li.data('id', itemName._id);
    if (itemName.text){
      li.addClass('done');
    }

    $('#foods').append(li);
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
  loadFoods();
  showProfile();
  addNewFood();
  $('#welcome').hide();
});

function logout() {
    localStorage.removeItem('idToken')
    window.location.href = '/';
}
