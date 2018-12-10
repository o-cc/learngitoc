$(function () {


    if( !window.localStorage.getItem("token") ){
        $.alert({
            title: '提示',
            text: "签证过期",
            onOK: function () {
                //点击确认
                window.location.href = "./index.html";

            }
        });
        return;
    }

    var paymentUrl = window.location.search;

    var url        = {
        payments: globalUrl.globalUrl + "usermeetings",
    }

    $.ajax( {
        url        : url.payments + paymentUrl,
        method     : "PUT",
        contentType: "application/json",
        headers    : {
            "Authorization": "MeetingJWT " + window.localStorage.getItem( "token" )
        },
        success    : function ( data ) {
            /*
            * {
                    'errno': '0',
                    'errmsg': '',
                    'trade_num': '208515118455515155'  //支付宝流水号,
                    "meeting_id": "12"
                }
            * */
            if ( data[ "errno" ] !== "0" ) {
                $.alert( {
                    title: '提示',
                    text : data[ "errmsg" ],
                    onOK : function () {
                    }
                } );
                return;
            }

            $.toast( "支付成功" );
            $( ".loading" ).addClass( "hide" );
            $( ".center-box" ).removeClass( "hide" );

            $( ".go_back" ).attr( "href", "./meetingHomePage.html?meetingId=" + data["meeting_id"] );

            $( "#trade-num" ).html( data[ "trade_num" ] );

        },
        error      : function () {
            $.alert( {
                title: '提示',
                text : "获取流水号失败",
                onOK : function () {
                }
            } );
            return;
        }
    } )
})