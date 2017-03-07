/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$(document).ready(function () {
    updateUsers();
//        timer();

});


// ------ FONCTION AFK ------
function updateAfk(flag) {
    if (flag) {
        $.ajax({
            async: true,
            type: 'POST',
            dataType: 'text',
            url: "./user/afk",
            success: function () {
                //change le style de la page en tant que Afk
                $("#wrapper").attr('class', 'away afkBack');
                $("#afk").attr('class', 'afkAlert2');
            }

        });

    } else {
        $.ajax({
            async: true,
            type: 'POST',
            dataType: 'text',
            url: "./user/noafk",
            success: function () {
                //change le style de la page en tant que noAfk
                $("#wrapper").attr('class', 'noAway');
                $("#afk").attr('class', 'afkAlert');
            }
        });
    }
}

//déclencheur
$("body").click(function () {
    updateAfk(false);
    setTimeout(function () {
        updateAfk(true);
    }, 15000
            );
});

// ---------- FIN AFK


// ------- FONCTION TYPING --------
function switchTyping() {
    $.ajax({
        async: true,
        type: 'POST',
        dataType: 'text',
        url: "./user/typing"
    });
}
$("#msg").focusin(function () {
    switchTyping();
});
$("#msg").focusout(function () {
    switchTyping();
});

// ----------FIN TYPING


// ---- ADD MESSAGE
$("form").submit(function (e) {
    e.preventDefault();
    $.ajax({
        async: true,
        type: 'POST',
        dataType: 'text',
        data: {
            "msg": $("#msg").val()
        },
        url: "./message/add",
        success: function (data, textStatus, jqXHR) {
            $("#msg").val("");
            updateMessages();
        }

    });
});


function updateUsers() {
    $.ajax({
        async: true,
        type: 'GET',
        dataType: 'text',
        url: "./users",
        success: function (data, textStatus, jqXHR) {
            $("#users").empty();
            $("#usersAfk").empty();
            var liste = $.parseJSON(data);
            $(liste).each(function (e) {
                var typ = "";
                if (this.typing == 1) {
                    typ = "...";
                }
                if (this.afk == 1) {
                    $("#users").append("<p> AFK - " + "@" + this.email + typ + "</p>");
                } else {
                    $("#users").append("<p>" + "@" + this.email + typ + "</p>");

                }
            });
            setTimeout(function () {
                updateMessages();
            }, 1000);
        }

    });
}

function updateMessages() {
    $.ajax({
        async: true,
        type: 'GET',
        dataType: 'text',
        url: "./messages",
        success: function (data, textStatus, jqXHR) {
            $("#messages").empty();
            var liste = $.parseJSON(data);
            $(liste).each(function (e) {
                $("#messages").append("<p>" + this.heure.date + "</p><p>@" + this.utilisateur + " : " + this.message + "</p><br/>");

            });

            $("#messages").animate({scrollTop: $('#messages').height() + 10000}, 1000);
            setTimeout(function () {
                updateUsers();
            }, 1000);
        }
    });
}