
$(function () {


    if( window.localStorage.getItem("token") ){
        $(".bomBtn-item").html( "登出" );
    }else {
        $(".bomBtn-item").html( "登录" );
    }


    if( !loadPageVar( "meetingId" ) ){
        $.alert({
            title: '提示',
            text: "获取会议失败",
            onOK: function () {
                //点击确认
                window.location.href = "./index.html";
            }
        });
        return;
    }


    function getDetailMeeting( callback ) {

        $.ajax({
            url    : globalUrl.globalUrl + "meetings/" + loadPageVar( "meetingId" ),
            method : "GET",
            success: function ( data ) {

                $( ".publicImg" ).attr( "src" , data["meeting"]["homepage"] );
                callback( true );
            },
            error  : function ( xmlerr, err ) {
                $.alert({
                    title: '提示',
                    text: "连接服务器失败",
                    onOK: function () {
                        //点击确认
                    }
                });
                callback( false );
            }
        })

    };

    getDetailMeeting(function( tf ) {
        if( !tf ){

        }

        //获取九宫格背景
        $.ajax({
            url: globalUrl.globalUrl + "meetings/" + loadPageVar( "meetingId" ),
            method: "GET",
            success: function ( data ) {

                if( data[ "errno" ] !== "0" ){
                    $.alert("图标获取失败,返回: " +data[ "errmsg" ]);
                    return;
                }

                //生成九宫格
                var dataList = data[ "data" ];
                for ( var i = 0; i < dataList.length; i++ ) {
                    var  temp = '<a href='+ dataList[ "url" ]+"?meetingId="+ loadPageVar( "meetingId") +'>\n' +
                        '           <img src=' +dataList[ "icon" ]+ ' class="index-icon" alt="">\n' +
                        '           <p>' +dataList[ "icon_name" ] +'</p>\n' +
                        '        </a>';

                    $(".bomBtn").before( temp );
                }

            },
            error: function ( err ) {
                $.alert( "无法连接服务器" );
                return;
            }

        })

    });


    //$("#personInfo").attr( "href", "personInfo.html?meetingId="+ loadPageVar( "meetingId") );
    //$( "#attend_meet" ).attr( "href", "./serviceInfo.html?meetingId="+ loadPageVar( "meetingId") );
    //$( "#register" ).attr( "href", "./register.html?meetingId="+ loadPageVar( "meetingId") );

    $(".bomBtn-item").click(function() {
        delete window.localStorage.token;
        window.location.href = "./login.html?meetingId=" + loadPageVar( "meetingId" );
    });





    //获取URL参数
    /*
    * param1 { String } 参数名
    * */
    function loadPageVar( sVar ) {
        return decodeURI( window.location.search.replace( new RegExp( "^(?:.*[&\\?]" + encodeURI( sVar ).replace( /[\.\+\*]/g, "\\$&" ) + "(?:\\=([^&]*))?)?.*$", "i" ), "$1" ) );
    }






})






