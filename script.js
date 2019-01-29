function localStorageTest() {
    try {
        localStorage.length
        return true;
    } catch(e) {
        return false;
    }
}

function getContactList(page) {
    $.ajax({
        url: 'http://API/contacts',
        data: {
            'page': page
        },
        type: 'GET',
        success: function(data) {
            if (data._items.length !== 0 && localStorage.length !== data._meta.total) {
                for (var i = 0, len = data._items.length; i < len; i++) {
                    localStorage.setItem(data._items[i].name, data._items[i].phone)
                }
                if (typeof data._links.next !== "undefined") {
                    getContactList(page + 1)
                }
            }
        }
    });
}


function searchInAPI(user_name) {
    $.ajax({
        url: 'http://API/contacts',
        data: {
            'where': '{"name":"' + user_name + '"}'
        },
        type: 'GET',
        retryLimit : 3,
        timeout: 5000,
        success: function(data) {
            if (data._items.length == 0) {
                $('.result').text('❌ Contact not found!');
                $('.result').css('color', 'red');
            } else {
                var user_phone = data._items[0]['phone'];
                $('.result').text(user_name + ': ✆ ' + user_phone);
                $('.result').css('color', 'green');
                if (localStorageTest() === true) {
                    localStorage.setItem(user_name, user_phone)
                }
            }
        },
        error: function(xhr, textStatus, errorThrown) {
            if (textStatus == 'timeout' || textStatus == 'error') {
                this.retryLimit--;
                if (this.retryLimit) {
                    $.ajax(this);
                    return;
                }
            }
            if (xhr.status == 500) {
                $('.result').text('❌ Internal Server Error!');
                $('.result').css('color', 'red');
            } else {
                $('.result').text('❌ Connection Error!');
                $('.result').css('color', 'red');
            }
        }
    });
}

function search() {
    var user_name = $('#user_name').val().trim();
    $('#user_phone').val('');
    $('#errors_in_name').text('');
    $('#errors_in_phone').text('');
    $('#user_phone').css('border', '1px solid #eee');
    $('#user_name').css('border', '1px solid #eee');
    $('.result').text('');
    var nameRegex = new RegExp(/^\s*[а-яА-ЯёЁa-zA-Z]+[а-яА-ЯёЁa-zA-Z\s\d\-\—]*$/);
    var checkName = nameRegex.test(user_name);
    if (user_name == '') {
        $('#errors_in_name').text('❌ Please enter a name!');
        $('#user_name').css('border', '1px solid red');
    } else if (!checkName) {
        $('#errors_in_name').text('❌ You entered is not a name!');
        $('#user_name').css('border', '1px solid red');
    } else {
        if (localStorageTest() === true) {
            var user_phone_in_cache = localStorage.getItem(user_name);
            if (user_phone_in_cache !== null) {
                $('.result').text(user_name + ': ✆ ' + user_phone_in_cache);
                $('.result').css('color', 'green');
            } else {
                searchInAPI(user_name);
            }
        } else {
            searchInAPI(user_name);
        }
    }
}

function addToAPI(user_name, user_phone) {
    $.ajax({
        url: 'http://API/contacts',
        data: {
            'name': user_name,
            'phone': user_phone
        },
        type: 'POST',
        success: function(data) {
            if (data._status == 'OK') {
                $('.result').text('✓ Contact successfully added!');
                $('.result').css('color', 'green');
                if (localStorageTest() === true) { 
                    localStorage.setItem(user_name, user_phone)
                }
            } else {
                $('.result').text('');
                if(typeof data._issues.name !== "undefined") {
                    $('#user_name').css('border', '1px solid red');
                    if (!Array.isArray(data._issues.name)) {
                        $('#errors_in_name').text('❌ — ' + data._issues.name);
                    } else {
                        $('#errors_in_name').html(data._issues.name.map(i => '❌ — ' + i).join('<br>'));
                    }
                }
                if(typeof data._issues.phone !== "undefined") {
                    $('#user_phone').css('border', '1px solid red');
                    if (!Array.isArray(data._issues.phone)) {
                        $('#errors_in_phone').text('❌ — ' + data._issues.phone);
                    } else {
                        $('#errors_in_phone').html(data._issues.phone.map(i => '❌ — ' + i).join('<br>'));
                    }
                }
            }
        },
        error: function(xhr, textStatus, errorThrown) {
            if (textStatus == 'timeout' || textStatus == 'error') {
                this.retryLimit--;
                if (this.retryLimit) {
                    $.ajax(this);
                    return;
                }
            }
            if (xhr.status == 500) {
                $('.result').text('❌ Internal Server Error!');
                $('.result').css('color', 'red');
            } else {
                $('.result').text('❌ Connection Error!');
                $('.result').css('color', 'red');
            }
        }
    });
}

function add_contact() {
    var user_name = $('#user_name').val().trim();
    var user_phone = $('#user_phone').val().trim();
    var nameRegex = new RegExp(/^\s*[а-яА-ЯёЁa-zA-Z]+[а-яА-ЯёЁa-zA-Z\s\d\-\—]*$/);
    var phoneRegex = new RegExp(/^\s*[\+\(]?[\d]{1,5}[\-\s\/\)]?[\(\s]?[\d]{0,5}[\)]?[\-\s\/\.]?[\d]{0,5}[\-\s\/\.]?[\d]{0,5}[\-\s\/\.]?[\d]{0,5}\s*$/);
    var checkName = nameRegex.test(user_name);
    var checkPhone = phoneRegex.test(user_phone);
    $('#errors_in_name').text('');
    $('#errors_in_phone').text('');
    $('#user_phone').css('border', '1px solid #eee');
    $('#user_name').css('border', '1px solid #eee');
    $('.result').text('');
    if (user_name == '' && user_phone == '') {
        $('#errors_in_name').text('❌ Please enter a name!');
        $('#user_name').css('border', '1px solid red');
        $('#errors_in_phone').text('❌ Please enter the number!');
        $('#user_phone').css('border', '1px solid red');
    } else if (user_name == '' && user_phone !== '') {
        $('#errors_in_name').text('❌ Please enter a name!');
        $('#user_name').css('border', '1px solid red');
        $('#errors_in_phone').text('');
        $('#user_phone').css('border', '1px solid #eee');
    } else if (user_phone == '' && user_name !== '') {
        $('#errors_in_phone').text('❌ Please enter the number!');
        $('#user_phone').css('border', '1px solid red');
        $('#errors_in_name').text('');
        $('#user_name').css('border', '1px solid #eee');
    }  else if (!checkName && !checkPhone) {
        $('#errors_in_name').text('❌ You entered is not a name!');
        $('#user_name').css('border', '1px solid red');
        $('#errors_in_phone').text('❌ You entered is not a phone!');
        $('#user_phone').css('border', '1px solid red');
    } else if (!checkName && checkPhone) {
        $('#errors_in_name').text('❌ You entered is not a name!');
        $('#user_name').css('border', '1px solid red');
        $('#errors_in_phone').text('');
        $('#user_phone').css('border', '1px solid #eee');
    } else if (checkName && !checkPhone) {
        $('#errors_in_name').text('');
        $('#user_name').css('border', '1px solid #eee');
        $('#errors_in_phone').text('❌ You entered is not a phone!');
        $('#user_phone').css('border', '1px solid red');
    } else {
        if (localStorageTest() === true) {
            var user_phone_in_cache = localStorage.getItem(user_name);
            var user_name_in_cache = null;
            for (var i = 0, len = localStorage.length; i < len; i++) {
                var key = localStorage.key(i);
                var value = localStorage.getItem(key);
                if (value == user_phone) {
                    user_name_in_cache = key;
                }
            }
            if (user_phone_in_cache !== null) {
                $('#errors_in_name').text('❌ The entered name is already exists!');
                $('#user_name').css('border', '1px solid red');
                $('#user_phone').css('border', '1px solid red');
                $('.result').text(user_name + ': ✆ ' + user_phone_in_cache);
                $('.result').css('color', 'green');
            } else if (user_name_in_cache !== null) {
                $('#errors_in_phone').text('❌ The entered phone is already exists!');
                $('#user_name').css('border', '1px solid red');
                $('#user_phone').css('border', '1px solid red');
                $('.result').text(user_name_in_cache + ': ✆ ' + user_phone);
                $('.result').css('color', 'green');
            } else {
                addToAPI(user_name, user_phone);
            }
        } else {
            addToAPI(user_name, user_phone);
        }
    }
}
$(document).ready(function() {
    if (localStorageTest() === true) {
        getContactList(1);
    }
    $('.search').on('click', function() {
        search();
    });
    $('#user_name').on('keypress', function(e) {
        if (e.which === 13) {
            $(this).attr("disabled", "disabled");
            search();
            $(this).removeAttr("disabled");
        }
    });
    $('.add').on('click', function() {
        add_contact();
    });
    $('#user_phone').on('keypress', function(e) {
        if (e.which === 13) {
            $(this).attr("disabled", "disabled");
            add_contact();
            $(this).removeAttr("disabled");
        }
    });

});