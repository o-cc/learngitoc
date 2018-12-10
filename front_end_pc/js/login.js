

$(function () {

    var url = {
        login: globalUrl.globalUrl + "users/login",
        homepages: globalUrl.globalUrl + "homepages"
    }

    $( ".register" ).attr( "href", "./register.html?meetingId="+ loadPageVar( "meetingId") );

    //获取URL参数
    /*
    * param1 { String } 参数名
    * */
    function loadPageVar( sVar ) {
        return decodeURI( window.location.search.replace( new RegExp( "^(?:.*[&\\?]" + encodeURI( sVar ).replace( /[\.\+\*]/g, "\\$&" ) + "(?:\\=([^&]*))?)?.*$", "i" ), "$1" ) );
    }


//get index info
    $.ajax({
        url    : url.homepages,
        method : "GET",
        success: function ( data ) {
            $( "#head_img" ).attr( "src" , data);
        },
        error  : function ( xmlerr, err ) {
            $.alert({
                title: '提示',
                text: "连接服务器失败",
                onOK: function () {
                    //点击确认
                }
            });
        }
    } )

    $("#user-num").blur(function () {


        if( checkUser() ) {

            showErrorTips();
        }

        if( !checkUser() ){

            if( checkPswLength() ){
                showErrorTips();
            }

            if( !checkPswLength() ){
                hideErrorTips();
            }

        }

  });

    $("#user-psw").blur(function () {

        if( checkPswLength() ) {
            showErrorTips();
        }

        if( !checkPswLength() ){

            if( checkUser() ){
                showErrorTips();
            }

            if( !checkUser() ){
                hideErrorTips();
            }

        }
    });


    $("#login").click(function () {

        if( checkUser() ){
            showErrorTips();
            return;
        }

        if( checkPswLength() ) {

            showErrorTips();
            return;
        }

        if( !$("#error-tip").hasClass("hide") ){
            $.alert({
                title: '提示',
                text: "请填写正确信息",
            });
            return;
        }

        $.ajax({
            url        : url.login,
            method     : "POST",
            contentType: "application/json",
            data       : JSON.stringify( {
                "passport" : $( "#user-num" ).val().trim(),
                "password" : $( "#user-psw" ).val().trim(),

            } ),
            success: function ( data ) {

                /*
                * {
                    "errno": "0",
                    "errmsg": "登陆成功!",
                    "user_id": "1",
                    "username":  "偶珍惜",
                    "token": "MeetingJWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2MDM3ODE2MTEsImlhdCI6MTU0MTU3MzYxMSwiZGF0YSI6eyJsb2dpbl90aW1lIjoxNTQxNTczNjExLCJ1c2VybmFtZSI6Ilx1NTA3Nlx1NTcxZlx1OGM2YSIsImlkIjoxfX0.7T6hQcD23do7LTDinPkTizOqDeS0XZOrCvGvCZP4MnQ"
                 }
                * */
                if ( data[ "errno" ] !== "0" ) {
                    $.alert({
                        title: '提示',
                        text: data[ "errmsg" ],
                        onOK: function () {
                            //点击确认
                        }
                    });
                    return;
                }

                if( data[ "errno" ] === "0" ){

                    var token = data["token"];
                    window.localStorage.setItem("token", token);

                    $.alert({
                        title: '提示',
                        text: data[ "errmsg" ],
                        onOK: function () {
                            window.location.href = "./meetingHomePage.html?meetingId=" + loadPageVar( "meetingId");

                        }
                    });
                }

            },
            error  : function ( xmlerr, err ) {
                $.alert({
                    title: '提示',
                    text: "连接服务器失败",
                    onOK: function () {
                        //点击确认
                    }
                });
            }
        } )

    })

})



function checkUser () {

    if( checkPhone($( "#user-num" ).val().trim()) && checkEmail($( "#user-num" ).val().trim()) ){
        $("#error-tip").html( "请输入正确的手机号码或邮箱" );
        return true;
    }
}

function checkPswLength () {

    if( checkPassword( $("#user-psw").val() ) ){

        $("#error-tip").html( checkPassword( $("#user-psw").val() ) );
        return true;
    }
}


function checkPassword( value ) {
    if( value.length < 6 ) {
        return "密码长度不能小于6位"
    }
};

function showErrorTips(  ) {
    $("#error-tip").removeClass("hide");
}

function hideErrorTips(  ) {
    $("#error-tip").addClass("hide");
}


function checkPhone( phoneNum ){

    if(!(/^1[34578]\d{9}$/.test(phoneNum))){

        return "手机号码有误";
    }
};



function checkEmail ( str ) {
    var re = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/;

    if ( !re.test( str )) {
        return "请输入正确邮箱";
    }
};