
$( function () {


    if( !window.localStorage.getItem("token") ){
        $.alert({
            title: '提示',
            text: "请先登录",
            onOK: function () {
                //点击确认
                window.location.href = "./login.html?meetingId=" + meetingId ;

            }
        });
        return;
    }


    var url = {
        hotelslist  : globalUrl.globalUrl + "hotelslist",
        meetings    : globalUrl.globalUrl + "meetings/",
        usermeetings: globalUrl.globalUrl + "usermeetings",
        payments    : globalUrl.globalUrl,
    };



    //从serviceInfo 传递了会议的id过来  需要获取缴费信息
    var meetingId = loadPageVar("meetingId");
    var hotelId   = "";
    var meetingCost = "";


    $(".go_back").attr( "href", "serviceInfo.html?meetingId=" + meetingId );

    $.ajax({
        url    : url.meetings + meetingId,
        method : "GET",
        success: function ( data ) {
            /*
            * {
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
            if ( data[ "errno" ] !== "0" ) {
                $.alert( {
                    title: '提示',
                    text : data[ "errmsg" ],
                    onOK : function () {

                    }
                } );
                return;
            }
            meetingCost = "会议费用：" + data[ "meeting" ][ "cost" ];
            $( "#cost-info" ).html( meetingCost );

        },
        error  : function () {
            $.alert( {
                title: '提示',
                text : "获取缴费信息失败",
                onOK : function () {
                    //回到会议列表
                    //window.open("./serviceInfo.html");
                }
            } );

        }
    });
    //获取酒店信息
    $("#show-hotel").click(function (){

        $(".hotel-info").removeClass("hide");

    });

    getHotelInfo( function (tf) {

        if( tf ){
            return;
        }

    })

    function getHotelInfo ( callback ){
        $.ajax({
            url    : url.hotelslist,
            method : "GET",
            success: function ( data ) {
                /*
                * {
                  "errmsg": "请求成功",
                  "errno": "0",
                  "hotel_list": [
                    {
                      "address": "广州市臭水沟旁",
                      "id": 1,
                      "price": 99.99,
                      "standard": "5星级标准",
                      "title": "万达嘉华酒店",
                      'total': 50  // 剩余总数
                    }
                  ]
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
                    callback(false);
                }

                var hotel_list = data["hotel_list"];
                var temp       = "";
                for ( var i = 0; i < hotel_list.length; i++ ) {

                    temp = '<div>' +
                        '            <div class="weui-cell">' +
                        '                    <div class="hotel-list">' +
                        '                        <span class="hotel-name">'+hotel_list[i]["title"]+'</span>' +
                        '                        <span class="star">'+getStar(hotel_list[i]["standard"])+'</span>' +
                        '                    </div>' +
                        '            </div>' +
                        '            <div class="hotel-detail">' +
                        '                <div class="weui-cell">' +
                        '                    <div class="weui-cell__bd">' +
                        '                        <p class="hotel-address">'+hotel_list[i]["address"]+'</p>' +
                        '                        <div class="hotel-price-total" data='+hotel_list[i]["id"]+'>' +
                        '                            <p>' +
                        '                                <span>价格：</span> <span class="price">'+hotel_list[i]["price"]+'</span>' +
                        '                            </p>' +
                        '                            <p>' +
                        '                                <span>剩余：</span> <span class="total">'+hotel_list[i]["total"]+'</span>' +
                        '                            </p>' +
                        '                        </div>' +
                        '                    </div>' +
                        '                </div>' +
                        '            </div>' +
                        '   </div>';

                    $(".hotel-info-items").append(temp);
                }

                $(".hotel-price-total").click(function () {
                    let self = $(this);
                    for( var i = 0; i < $(".hotel-price-total").length; i++ ) {

                        $(".hotel-price-total").eq(i).css("border","1px solid #ccc");
                        self.css( "border", "1px solid blue" );
                    }

                    $.alert({
                        title: '提示',
                        text: "确认选择酒店?",
                        onOK: function () {

                            $(".hotel-info").addClass("hide");

                            //获取酒店的id和价格 价格写到缴费信息中
                            hotelId          = self.attr( "data" );
                            var hotelPrice   = "<br>"+"酒店费用：" + self.children( "p" ).eq( 0 ).children( "span" ).eq( 1 ).html();

                            $( "#cost-info" ).html( meetingCost + hotelPrice );
                        }
                    });
                });
                callback( true );

            },
            error : function () {
                $.alert({
                    title: '提示',
                    text: "无法获取酒店信息",
                    onOK: function () {
                        //点击确认
                    }
                });
                callback( false);
            }

        })


    };


    $("#confrim").click(function () {

        if( !$(".this-way").attr("data") ){
            $.alert({
                title: '提示',
                text: "请选择支付方式",
                onOK: function () {
                }
            });
            return;
        }

        var pushData = {

        };

        if ( !hotelId ) {
            pushData = {
                meeting_id: Number( meetingId ),
                pay_type  : Number( $( ".this-way" ).attr( "data" ) ),
            }

        } else {
            pushData = {
                meeting_id: Number( meetingId ),
                pay_type  : Number( $( ".this-way" ).attr( "data" ) ),
                hotel_id  : Number( hotelId )
            }
        }

        $.ajax( {
            url        : url.usermeetings,
            method     : "POST",
            contentType: "application/json",
            headers    : {
                "Authorization": "MeetingJWT " +window.localStorage.getItem( "token" )
            },
            data       : JSON.stringify( pushData ),
            success    : function ( data ) {
                /*
                *{
                    'errno': '0',
                    'errmsg': '保存用户会议信息成功',
                    'pay_num': '20181107103546000000001'  // 交易号
                }
                **/
                if ( data[ "errno" ] !== "0" ) {
                    $.alert( {
                        title: '提示',
                        text : data[ "errmsg" ],
                        onOK : function () {

                        }
                    } );
                    return;
                }

                if ( $( ".this-way" ).attr( "data" ) === "2" ) {
                    //显示参加成功
                    $.toast( "报名参加成功" );
                    setTimeout(function () {
                        window.location.href = "./meetingHomePage.html";
                    },2000)
                    return;
                }

                //跳转到支付宝页面
                $.alert( {
                    title: '提示',
                    text : "确认支付",
                    onOK : function () {

                        $.ajax( {
                            url    : url.payments + data[ "pay_num" ] + "/payments",
                            method : "GET",
                            headers: {
                                "Authorization":  "MeetingJWT " + window.localStorage.getItem( "token" )
                            },
                            success: function ( data ) {
                                /*{
                                    'errno': '0',
                                    'errmsg': '',
                                    'pay_url': 'https://openapi.alipaydev.com/gateway.do?app_id=2016091900543828&biz_content=%7B%22total_amount%22%3A200.25%2C%22out_trade_no%22%3A%2220181107155350000000002%22%2C%22product_code%22%3A%22QUICK_WAP_PAY%22%2C%22subject%22%3A%22meeting%22%7D&charset=utf-8&method=alipay.trade.wap.pay&return_url=http%3A%2F%2Fwww.baidu.com&sign_type=RSA2&timestamp=2018-11-07+16%3A00%3A52&version=1.0&sign=d1mTkryzrfi5J4loaP1m33FBjZ5qVtx%2BVIs5R3cL75oubfKs6fJmL1becw5UVmnX2oOOCmAcXSS5nh8ouuRNnA2Twwig69G6xPmLt2E3%2ByTKvB0zOjxKI%2FiwCM3u9GDRnkt%2B9AQoMT8dUvkRN9lppQcHijcjpcvsyhla9isyTALx%2BavHIk7T1ljUOsCbbe6vqtmL7bk%2BjrhVWotQKIxhs6O7oS5%2FoFFYs%2FrDh%2B%2BY%2FbHtsqmYxwEySDC4oFv5pdUlaku31rz%2FBuDHQfH5i97ZMHHDBO8oY1D3%2BY%2BrjE2JIVRWwgmGli3ux%2BV4lv5a51cICFifE3zPjsj1938cZg5zeA%3D%3D'  // 请求支付宝支付的url
                                }*/

                                if( data["errno"] !== "0" ){

                                    $.alert( {
                                        title: '提示',
                                        text : data["errmsg"],
                                        onOK : function () {
                                            window.location.href = "./serviceInfo.html";
                                        }
                                    } );
                                    return;
                                }
                                window.location.href =  data[ "pay_url" ];

                            },
                            error  : function () {

                                $.alert( {
                                    title: '提示',
                                    text : "无法连接服务器,支付失败",
                                    onOK : function () {
                                        window.location.href = "./serviceInfo.html";
                                    }
                                });

                            }
                        })

                    }
                });

            },
            error      : function () {
                $.alert( {
                    title: '提示',
                    text : "无法连接服务器",
                    onOK : function () {
                    }
                } );

            }
        } );


    });

    $(".pay-way").click(function () {
        $(this).addClass("this-way").siblings("div").eq(0).removeClass("this-way");
    });


    function getStar ( starNum ) {

        starNum = parseInt( starNum );

        if( isNaN( starNum ) ) {
            return "";
        }

        var temp = "";
        for( var i = 0; i< starNum; i++ ){
            temp += "★";
        }

        return temp;

    };


    //获取URL参数
    /*
    * param1 { String } 参数名
    * */
    function loadPageVar( sVar ) {
        return decodeURI( window.location.search.replace( new RegExp( "^(?:.*[&\\?]" + encodeURI( sVar ).replace( /[\.\+\*]/g, "\\$&" ) + "(?:\\=([^&]*))?)?.*$", "i" ), "$1" ) );
    }

})
