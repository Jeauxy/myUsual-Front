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
  }
  $('#new-list-form').on('submit', addNewList);
  $('#foodItemForm').on('submit', submitFood)
  //$(document).on()
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
    var button = $('<button type="button" class="list-group-item" />')
    button.text(list.listName + ' ')
    button.data('id', list._id);
    $('#mylists').append(button);
}

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

function submitFood(e){
  e.preventDefault();
  var associatedStores = $('#foodstoresubmit').val();
  var theData = {
    itemName: $('#itemname').val(),
    description: $('#itemdescription').val(),
    price: $('#itemprice').val(),
    avgQuantityPurchased: $('#quantitypurchased').val(),
    stores: associatedStores
  }
  //console.log('theData', theData);
  $.ajax({
    url: 'http://localhost:3000/foods',
    method: 'POST',
    data: JSON.stringify(theData),
    contentType: 'application/json',
    headers: {
      'Authorization': 'Bearer ' + localStorage.getItem('idToken')
    }
  }).done(function (data) {
    //loadFood(data)
    console.log(data);
  }).fail(function(err, err1, err3){
    console.log(err, err1, err3);
  })

}
function loadStore(stores) {
    var option = $('<option />')
    option.text(stores.name)
    option.attr('value', stores._id);
    $('#foodstoresubmit').append(option);
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
  //console.log(authResult);
  localStorage.setItem('idToken', authResult.idToken);
  //console.log('Logged In!');
  loadLists();
  showProfile();
  addNewList();
  $('#welcome').hide();
  $('#home').hide();
});

function logout() {
    localStorage.removeItem('idToken')
    window.location.href = '/';
}
