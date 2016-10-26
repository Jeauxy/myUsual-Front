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

    $('#welcome').hide();
    $('#home').hide();
    $('#blank').hide();
    $('.row-eq-height').show();
  }
  $('#new-list-form').on('submit', addNewList);
  $('#foodItemForm').on('submit', submitFood);

  $(document).on('click', 'button.list-group-item', loadListInfo);
  $(document).on('click', '.storeclick', selectStore);
  loadStores();
});

// ********* Show profile information
function showProfile() {
  $('#btn-login').hide();
  $('#logout').show();
  $('#food-lists').show();
  $('.row-eq-height').show();
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
        loadSharedLists();
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
    //$('#foodstoresubmit').attr('size', optionsize)
    //console.log(optionsize);
    data.forEach(function (datum) {
      loadStore(datum)
    })
  })
}
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
}
// *********** Create new list item
function addNewList(e) {
    e.preventDefault()
    var listName = $('#list-name').val();
    //console.log(listName);
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
        loadList(newList)
        $('#list-name').val('').focus()
        })
    } else {
      console.log("empty");
    }
};

// ************ Load Shared lists
function loadSharedLists() {
    $.ajax({
      url:'https://boiling-wildwood-13698.herokuapp.com/lists/sharedLists',
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('idToken')
      }
    }).done(function (data) {
      console.log(data);
      data.forEach(function (datum) {
        loadSharedList(datum)
      })
    })

}

// *********** Load shared list item

function loadSharedList(list) {
  var button = $('<button />');
  button.text(list.listName);
  button.attr('class', 'list-group-item');
  button.data('id', list._id);
  $('#sharedLists').append(button);
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
    var button = $('<button />');
    button.text(list.listName);
    button.attr('class', 'list-group-item')
    button.data('id', list._id);
    $('#lists').append(button);
};
// *********** Load list information
function loadListInfo(e){
  e.preventDefault();
  var listTitle = $(this).text();
  var listId = $(this).data('id');
  $('#new-food').removeClass('hidden');
  $('#list-content').removeClass('hidden');
  $('#list-placeholder').addClass('hidden');
  $('#form-placeholder').addClass('hidden');
  $('h2#list-title').text(listTitle);
  $('h2#list-title').data('id', listId);
  fetchFoodItems(listId);
}

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
      addShareListOptions();
  })
}

function loadFoodItem(item){
  var fooditemid = item._id;
  var $itemdiv = $('<div />');
  var $itemtitle = $('<h3 />');
  $itemtitle.text(item.itemName);
  var $itemdescription = $('<p />');
  $itemdescription.text(item.description);
  var $itemdetails = $('<p />');
  $itemdetails.html('<span class = "bold">Desired price:</span> $' + item.price + '<span class="space"> </span>' + '<span class = "bold">Number needed:</span> ' + item.avgQuantityPurchased);
  var $itemstorestring = $('<p />')
  $itemstorestring.attr('id', fooditemid);
  //$itemstorestring.text('laksdfkasdf');
  $itemdiv.append($itemtitle);
  $itemdiv.append($itemdescription);
  $itemdiv.append($itemdetails);
  $itemdiv.append($itemstorestring)
  $('#list-content-items').append($itemdiv);
  var itemstorelistids = item.stores;
  itemstorelistids.forEach(function(item){
    fetchStoreName(item, fooditemid);
  })

}

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
}

// *********** Submit food
function submitFood(e){
  e.preventDefault();
  var associatedStores = [];
  $("input:checkbox:checked").each(function(){
    var store = $(this).val()
    associatedStores.push(store);
  });
  //var associatedStores = $('#foodstoresubmit').val();
  var listId = [];
  listId.push($('h2#list-title').data('id'));
  //console.log(listId);
  var theData = {
    itemName: $('#itemname').val(),
    description: $('#itemdescription').val(),
    price: $('#itemprice').val(),
    avgQuantityPurchased: $('#quantitypurchased').val(),
    lists: listId,
    stores: associatedStores
  }
  //console.log('theData', theData);
  $.ajax({
    url: 'https://boiling-wildwood-13698.herokuapp.com/foods',
    method: 'POST',
    data: JSON.stringify(theData),
    contentType: 'application/json',
    headers: {
      'Authorization': 'Bearer ' + localStorage.getItem('idToken')
    }
  }).done(function (data) {
    //loadFood(data)
    loadFoodItem(data);
    $('#itemname').val("");
    $('#itemdescription').val("");
    $('#itemprice').val("");
    $('#quantitypurchased').val("");
    $('#foodstoresubmit').val("");
  }).fail(function(err, err1, err3){
    console.log(err, err1, err3);
  })

}
function selectStore(e){
  e.preventDefault();
  //console.log($(this).parent().find('.storecheckbox').prop('checked', true));
  if ($(this).parent().find('.storecheckbox').is(':checked')){
    // console.log('checked');
    $(this).parent().find('.storecheckbox').prop('checked', false);
  } else {
    //console.log('not checked');
    $(this).parent().find('.storecheckbox').prop('checked', true);
  }
}
// *********** Auth0 lock and login check
//1. Client ID, 2. Client Domain, 3. Oject of Attr
var lock = new Auth0Lock('GoBNjyrd7W9Jg1HECE7nH82QUhjTsM2B', 'jeauxy.auth0.com', {
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
    window.location.href = '/';
};
