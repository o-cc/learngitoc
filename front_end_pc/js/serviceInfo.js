$( function () {

    var url = {
        meetings : globalUrl.globalUrl + "meetings"
    };

    if ( !loadPageVar("meetingId") ) {
          $.alert( "获取会议详情失败." );
        console.log( "会议id为: " +loadPageVar( "meetingId" ) );
        return;
    }

    //获取详细信息
    function getDetailInfo ( callback ) {


        $.ajax({
            url: url.meetings +"/"+ loadPageVar( "meetingId" ),
            method: "GET",
            success: function (data) {

                /*
                *{
                    "errno": "0",
                    "errmsg": "修改用户信息成功",
                    "meeting": {
                                "title": "广东省2018年度大会",
                                "id": 1,
                                "start_time": "2018-11-02",
                                "end_time":"2018-11-05",
                                "deadline": "2018-10-29",
                                "committee":"国际主委会",
                                "introduce":"该会议是由广东省委开的, ....",
                                "homepage":"http://www.mweimw.com",
                                "support":"由蒙牛酸奶支持",
                                "sign_num": 50,
                                "attend_num": 0
                                }
                }
                * */
                if( data["errno"] !== "0" ){
                    $.alert({
                        title: '提示',
                        text: data["errmsg"],
                        onOK: function () {
                            //点击确认
                        }
                    });
                    callback( false );
                    return;
                }

                if( data["errno"] === "0" ){

                    //显示详细信息
                    $(".all-wrap").hide();

                    var record    = data[ "meeting" ];
                    //修改标题
                    $("#detail-title").html( record["title"] );


                    var introdece = record[ "introduce" ] + "<br>" +
                        "开始时间: " + record[ "start_time" ] + "<br>" +
                        "结束时间: " + record[ "end_time" ] + "<br>" +
                        "会议地址: "+ record[ "address" ]+ "<br>" +
                        "主办方  : " + record[ "committee" ];

                    $( "#introduce" ).html( introdece );

                    $( ".detail-info" ).show();

                    callback( true );

                }
            },
            error: function ( xmlerr, err) {

                $.alert({
                    title: '提示',
                    text: "无法连接服务器",
                    onOK: function () {
                        //点击确认
                    }
                });
                callback( false );
            }
        });

    };

    getDetailInfo( function( tf ) {

        if( !tf ){
            return;
        }


        $(".goOrder").click(function () {

            if( !window.localStorage.getItem("token") ){
                $.alert({
                    title: '提示',
                    text: "请先登录",
                    onOK: function () {
                        //点击确认
                        window.location.href =  "./login.html?meetingId=" + loadPageVar( "meetingId" );
                    }
                });
                return;
            }

            window.location.href =  "./order.html?meetingId=" + loadPageVar( "meetingId" );
        });

    });

    $("#go-back").click( function () {
       window.location.href = "./meetingHomePage.html?meetingId=" + loadPageVar( "meetingId" );
    })

    //获取URL参数
    /*
    * param1 { String } 参数名
    * */
    function loadPageVar( sVar ) {
        return decodeURI( window.location.search.replace( new RegExp( "^(?:.*[&\\?]" + encodeURI( sVar ).replace( /[\.\+\*]/g, "\\$&" ) + "(?:\\=([^&]*))?)?.*$", "i" ), "$1" ) );
    }


});
