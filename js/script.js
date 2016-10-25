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
    loadStores();
    $('#welcome').hide();
    $('#home').hide();
    $('#blank').hide();
  }
$('#new-list-form').on('submit', addNewList);
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
};

// ********* Show profile information
function showProfile() {
  $('#btn-login').hide();
  $('#logout').show();
  $('#food-lists').show();
  $('.col-md-6').show();
  $('.col-md-3').show();
  $('#nav').show();
  lock.getProfile(localStorage.getItem('idToken'), function (error, profile) {
    if (error){
      logout();
    } else {
      //console.log('profile', profile);
      //  ajaxCheck(profile);
      $('#fullName').text(profile.given_name);
      $('#food-lists h2').data('userId', profile.user_id)
    }
  })
};
// ***** Check to see if profile exists
function ajaxCheck(authResult) {
  console.log("ajaxCheck run");
  lock.getProfile(localStorage.getItem('idToken'), function (error, profile) {
    if (error) {
      logout();
    } else {
      console.log(authResult);
      $.ajax({
        url: 'https://boiling-wildwood-13698.herokuapp.com/users/'+profile.user_id
      }).done(function () {
        console.log("user already in db");
        loadLists();
      }).fail(function () {
        console.log("user now added to db");
        addUserToDb(profile);
        loadLists();
      })
    }
})
}
// ***** Retrieve profile information from Mongo
function addUserToDb(profile) {
  var options = {
  url: 'https://boiling-wildwood-13698.herokuapp.com/users',
  method: 'POST',
  data: {
    firstName: profile.given_name,
    lastName: profile.family_name,
    email: profile.email,
    userId: profile.user_id
  },
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('idToken')
  }
}
$.ajax(options).done(function () {
  console.log("added user to db");
}).fail(function (err) {
  console.log(err);
})
}
// *********** Load stores into create food item form

function loadStores() {
  $.ajax({
    url: 'https://boiling-wildwood-13698.herokuapp.com/stores',
    headers: {
      'Authorization': 'Bearer ' + localStorage.getItem('idToken')
      }
    }).done(function (data) {
    var optionsize = data.length;
    $('#foodstoresubmit').attr('size', optionsize)
    //console.log(optionsize);
    data.forEach(function (datum) {
      loadStore(datum)
    })
  })
}
function loadStore(stores) {
    var option = $('<option />')
    option.text(stores.name)
    option.attr('value', stores._id);
    $('#foodstoresubmit').append(option);
}
// *********** Create new list item
function addNewList(e) {
    e.preventDefault()
    var submitdata = {
      url: 'https://boiling-wildwood-13698.herokuapp.com/lists',
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('idToken')
        },
      data: {
        listName: $('#list-name').val()
        }
      }
    $.ajax(submitdata).done(function (newList) {
      loadList(newList)
      $('#list-name').val('').focus()
    })
}

// *********** Load lists from Mongo
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
};
// *********** Load list item
function loadList(list) {
  //console.log(list);
    var button = $('<button type="button" class="list-group-item" />')
    button.text(list.listName + ' ')
    button.data('id', list._id);
    $('#lists').append(button);
};

// *********** Auth0 lock and login check
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
};

function isJwtValid(token) {
  var token = localStorage.getItem('idToken');
  if (!token){
    return false;
  }
};

lock.on('authenticated', function (authResult) {
  console.log(authResult);
  localStorage.setItem('idToken', authResult.idToken);
  console.log('Logged In!');
  ajaxCheck(authResult);
  // loadLists();
  showProfile();
  addNewList();
  $('#welcome').hide();
  $('#home').hide();
  $('#blank').hide();
});

function logout() {
    localStorage.removeItem('idToken')
    window.location.href = '/';
};
