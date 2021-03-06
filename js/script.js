$(document).ready(function() {

  $('#btn-login').on('click', function (e) {
    e.preventDefault();
    lock.show();
  });

  $('#logout').on('click', function (e) {
    //console.log('clicked');
    e.preventDefault();
    logout();
  });
  if (isLoggedIn()) {
    loadLists();
    loadSharedLists();
    showProfile();
    loadStores();
    $('#welcome').hide();
    $('#home').hide();
    $('#blank').hide();
    $('.row').show();
    $('#footer').show();
  }
  $('#new-list-form').on('submit', addNewList);
  $('#foodItemForm').on('submit', submitFood);
  $(document).on('click', 'button.list-group-item', loadListInfo);
  $(document).on('click', '.storeclick', selectStore);
  $(document).on('click', 'a.delete-link', deleteListItem);
  $('#user-list-form').on('submit', shareList);
});

// ********* Show profile information
function showProfile() {
  $('#btn-login').hide();
  $('#logout').show();
  $('#food-lists').show();
  $('.row').show();
  $('.col-md-6').show();
  $('.col-md-3').show();
  $('#nav').show();
  $('#footer').show();
  lock.getProfile(localStorage.getItem('idToken'), function (error, profile) {
    if (error){
      logout();
    } else {
      //console.log('profile', profile);
      //  ajaxCheck(profile);
      $('#firstName').text("Welcome " + profile.given_name);
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
      //console.log(authResult);
      $.ajax({
        url: 'https://boiling-wildwood-13698.herokuapp.com/users/'+profile.user_id
      }).done(function () {
        //console.log("user already in db");
        loadLists();
        loadSharedLists();
        loadStores();
      }).fail(function () {
        //console.log("user now added to db");
        addUserToDb(profile);
        loadLists();
      })
    }
  })
};

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
    //console.log("added user to db");
  }).fail(function (err) {
    console.log(err);
  })
};

// *********** Load stores into create food item form
function loadStores() {
  $.ajax({
    url: 'https://boiling-wildwood-13698.herokuapp.com/stores',
    headers: {
      'Authorization': 'Bearer ' + localStorage.getItem('idToken')
      }
    }).done(function (data) {
    var optionsize = data.length;
    data.forEach(function (datum) {
      loadStore(datum)
    })
  })
};

// *********** Load Store
function loadStore(stores) {
    var p = $('<p />');
    var input = $('<input type="checkbox" name="storelist" />');
    input.attr('class', 'storecheckbox');
    var label = $('<label />');
    label.attr('class', 'storeclick');
    label.text(stores.name);
    input.attr('value', stores._id);
    p.append(input);
    p.append(label);
    $('#foodstoresubmit').append(p);
};

// *********** Create new list item
function addNewList(e) {
    e.preventDefault()
    var listName = $('#list-name').val();
    if (listName !== '') {
      $.ajax({
        url: 'https://boiling-wildwood-13698.herokuapp.com/lists',
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('idToken')
          },
        data: {
          listName: $('#list-name').val(),
          listOwner: $('#food-lists h2').data('userId')
          }
        }).done(function (newList) {
        loadList(newList);
        $('#list-name').val('').focus();
        })
    } else {
      console.log("empty");
    }
};

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
    var button = $('<button />');
    button.text(list.listName);
    button.attr('class', 'list-group-item')
    button.data('id', list._id);
    $('#lists').append(button);
};

// ************ Load Shared lists
function loadSharedLists() {
  $.ajax({
    url:'https://boiling-wildwood-13698.herokuapp.com/lists/sharedLists',
    headers: {
      'Authorization': 'Bearer ' + localStorage.getItem('idToken')
    }
  }).done(function (data) {
    data.forEach(function (datum) {
      loadSharedList(datum)
    })
  })
};

// *********** Load shared list item

function loadSharedList(list) {
  var button = $('<button />');
  button.text(list.listName);
  button.attr('class', 'list-group-item');
  button.data('id', list._id);
  $('#sharedLists').append(button);
};

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
    var button = $('<button />');
    button.text(list.listName);
    button.attr('class', 'list-group-item')
    button.data('id', list._id);
    $('#lists').append(button);
};

// *********** Load list information
function loadListInfo(e){
  e.preventDefault();
  loadUsers();
  var listTitle = $(this).text();
  var listId = $(this).data('id');
  $('#new-food').removeClass('hidden');
  $('#list-content').removeClass('hidden');
  $('#list-placeholder').addClass('hidden');
  $('#form-placeholder').addClass('hidden');
  $('h2#list-title').text(listTitle);
  $('h2#list-title').data('id', listId);
  fetchFoodItems(listId);
};

function fetchFoodItems(listId){
  $.ajax({
    url: 'https://boiling-wildwood-13698.herokuapp.com/foods/' + listId,
    headers: {
      'Authorization': 'Bearer ' + localStorage.getItem('idToken')
      }
    }).done(function (data) {
      $('#list-content-items').empty();
      data.forEach(function (datum) {
        loadFoodItem(datum)
      })
  })
};

function loadFoodItem(item){
  var fooditemid = item._id;
  var $itemdiv = $('<div />');
  $itemdiv.attr('class', 'list-food-item');
  var $itemtitle = $('<h3 />');
  $itemtitle.text(item.itemName);
  var $deleteLink = $('<a />');
  $deleteLink.text('Delete');
  $deleteLink.attr('href', 'https://boiling-wildwood-13698.herokuapp.com/foods/'+fooditemid);
  $deleteLink.addClass('delete-link');
  $itemtitle.append($deleteLink);
  var $itemdescription = $('<p />');
  $itemdescription.text(item.description);
  var $itemdetails = $('<p />');
  $itemdetails.html('<span class = "bold">Desired price:</span> $' + item.price + '<span class="space"> </span>' + '<span class = "bold">Number needed:</span> ' + item.avgQuantityPurchased);
  var $itemstorestring = $('<p />')
  $itemstorestring.attr('id', fooditemid);
  $itemdiv.append($itemtitle);
  $itemdiv.append($itemdescription);
  $itemdiv.append($itemdetails);
  $itemdiv.append($itemstorestring)
  $('#list-content-items').append($itemdiv);
  var itemstorelistids = item.stores;
  itemstorelistids.forEach(function(item){
    fetchStoreName(item, fooditemid);
  })
};

function fetchStoreName(storeId, paragraphid){
  $.ajax({
    url: 'https://boiling-wildwood-13698.herokuapp.com/stores/' + storeId,
    headers: {
      'Authorization': 'Bearer ' + localStorage.getItem('idToken')
      }
    }).done(function (data) {
      var storaname = data.name;
      var storedisplay = $('#' + paragraphid).text();
      if (storedisplay === "") {
        storedisplay = storaname;
      } else {
        storedisplay = storedisplay + ", " + storaname;
      }
      $('#' + paragraphid).text(storedisplay)
    })
};

// *********** Submit food
function submitFood(e){
  e.preventDefault();
  var associatedStores = [];
  $(".storecheckbox:checkbox:checked").each(function(){
    var store = $(this).val();
    associatedStores.push(store);
  });
  var listId = [];
  listId.push($('h2#list-title').data('id'));
  var theData = {
    itemName: $('#itemname').val(),
    description: $('#itemdescription').val(),
    price: $('#itemprice').val(),
    avgQuantityPurchased: $('#quantitypurchased').val(),
    lists: listId,
    stores: associatedStores
  }
  $.ajax({
    url: 'https://boiling-wildwood-13698.herokuapp.com/foods',
    method: 'POST',
    data: JSON.stringify(theData),
    contentType: 'application/json',
    headers: {
      'Authorization': 'Bearer ' + localStorage.getItem('idToken')
    }
  }).done(function (data) {
    loadFoodItem(data);
    $('#itemname').val("");
    $('#itemdescription').val("");
    $('#itemprice').val("");
    $('#quantitypurchased').val("");
    $('.storecheckbox').prop('checked', false);
  }).fail(function(err, err1, err3){
    console.log(err, err1, err3);
  })
};

function selectStore(e){
  e.preventDefault();
  if ($(this).parent().find('.storecheckbox').is(':checked')){
    $(this).parent().find('.storecheckbox').prop('checked', false);
  } else {
    $(this).parent().find('.storecheckbox').prop('checked', true);
  }
};
// ************ Load Users for sharing
// *********** Load lists from Mongo
function loadUsers() {
  $('#user-list-form').find('.user-check-paragraph').remove();
  $.ajax({
    url: 'https://boiling-wildwood-13698.herokuapp.com/users',
    headers: {
      'Authorization': 'Bearer ' + localStorage.getItem('idToken')
      }
    }).done(function (data) {
      data.forEach(function (datum) {
        loadUser(datum)
    })
  })
};

// *********** Load User item
function loadUser(user) {
    var loggedInUser = $('#food-lists h2').data('userId');
    if (user.userId !== loggedInUser) {
      var p = $('<p />');
      p.attr('class', 'user-check-paragraph');
      var input = $('<input type="checkbox" name="userlist" />');
      input.attr('class', 'usercheckbox');
      var label = $('<label />');
      label.attr('class', 'userclick');
      label.text(user.firstName + ' ' + user.lastName );
      input.attr('value', user.userId);
      p.append(input);
      p.append(label);
      $('#user-list-form').prepend(p);
    } else {}

};
// *********** Share List functions
function shareList(e){
  e.preventDefault();
  var currentList = $('h2#list-title').data('id');
  var sharedUsers = [];
  $("input.usercheckbox:checkbox:checked").each(function(){
    var user = $(this).val()
    sharedUsers.push(user);
  });
  console.log(sharedUsers);
  var theData = {sharedOwners: sharedUsers};
  $.ajax({
    url: 'https://boiling-wildwood-13698.herokuapp.com/lists/' + currentList,
    method: 'PUT',
    data: JSON.stringify(theData),
    contentType: 'application/json',
    headers: {
      'Authorization': 'Bearer ' + localStorage.getItem('idToken')
      }
    }).done(function (data) {
      $("input.usercheckbox:checkbox").prop("checked", false);
    }).fail(function(header, code, err){
      console.log(header, code, err);
    })
}

//  ************* Delete List Item function

function deleteListItem(e) {
  e.preventDefault();
  e.stopPropagation();
  var $link = $(this);
  $link.parent('h3').parent('div').remove();
  $.ajax({
    url: $link.attr('href'),
    method: 'DELETE',
    headers: {
      'Authorization': 'Bearer ' + localStorage.getItem('idToken')
    }
  }).done(function () {
    console.log("item removed");
    //  $link.find('div').remove();
  })
}
// *********** Auth0 lock and login check
//1. Client ID, 2. Client Domain, 3. Oject of Attr
var options = {
  allowedConnections: ['google-oauth2', 'facebook', 'linkedin']
};

var lock = new Auth0Lock('GoBNjyrd7W9Jg1HECE7nH82QUhjTsM2B', 'jeauxy.auth0.com', options, {
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
  //addNewList();
  $('#welcome').hide();
  $('#home').hide();
  $('#blank').hide();
});

function logout() {
  localStorage.removeItem('idToken')
  window.location.href = '/myUsual-Front/';
};
