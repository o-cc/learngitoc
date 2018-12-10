$(function () {

    if( !window.localStorage.getItem("token") ){
        $.alert({
            title: '提示',
            text: "请先登录",
            onOK: function () {
                //点击确认
                window.location.href = "./login.html?meetingId=" + loadPageVar( "meetingId" );

            }
        });
        return;
    }


    $(".go_back").attr( "href", "meetingHomePage.html?meetingId=" + loadPageVar( "meetingId" ) );
    $("#serviceInfo").attr( "href", "serviceInfo.html?meetingId=" + loadPageVar( "meetingId" ) );
    $(".modify").attr( "href", "modify.html?meetingId=" + loadPageVar( "meetingId" ) );

    //获取URL参数
    /*
    * param1 { String } 参数名
    * */
    function loadPageVar( sVar ) {
        return decodeURI( window.location.search.replace( new RegExp( "^(?:.*[&\\?]" + encodeURI( sVar ).replace( /[\.\+\*]/g, "\\$&" ) + "(?:\\=([^&]*))?)?.*$", "i" ), "$1" ) );
    }




    var url = {
        users       : globalUrl.globalUrl + "users",
        usermeetings: globalUrl.globalUrl + "usermeetings",
        password    : globalUrl.globalUrl + "passwords",

    };
    //需要图片 用户名  公司地址 二维码

    function getUserInfo ( callback ) {
        $.ajax({
            url: url.users,
            method: "GET",
            headers: {
                "Authorization":  "MeetingJWT " + window.localStorage.getItem("token")
            },
            success: function (data) {

                /*
                * {
                  "errmsg": "获取用户信息成功",
                  "errno": "0",
                  "meetings": [
                    {
                      "start_time": "2018年11月09日 00:00",
                      "title": "第6届别人听一边他也"
                    },
                    {
                      "start_time": "2018年11月08日 00:00",
                      "title": "第4届别人听一边他也"
                    },
                    {
                      "start_time": "2018年11月08日 00:00",
                      "title": "第5届别人听一边他也"
                    }
                  ],
                  "user": {
                    "user_pic": "",
                    "username": "偶珍惜",
                    "work_addr": "广东省广州市劳改教育所",
                    "qrcode"： ""
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
                }

                if( data["errno"] === "0" ){
                    //返回了最新的会议记录和用户信息
                    var personInfo = data["user"];

                    $("#user-name").html(personInfo["username"]);
                    $(".company").html(personInfo["work_addr"])
                    $(".erweima").attr("src",personInfo["qrcode"]);
                    $(".show-erweima").children("img").eq(0).attr("src", personInfo["qrcode"]);
                    $(".header-person-img").attr("src",personInfo["user_pic"])

                    //拿到最新的会议记录  遍历多少条
                    var temp        = "";
                    var record      = data[ "meetings" ];
                    for ( var i = 0; i < record.length; i++ ) {
                        var recordTitle = record[ i ][ "title" ];


                        if( record[i]["is_pay"] ){
                            //已经给钱了 字体如果超过了
                            if( recordTitle.length >14 ) {
                                recordTitle = recordTitle.slice(0,6) +"····" +recordTitle.slice(-6);
                            }
                        }

                        if( !record[i]["is_pay"] ){

                            if( recordTitle.length >10 ) {
                                recordTitle = recordTitle.slice(0,5) +"····" +recordTitle.slice(-5);
                            }

                        }

                        //if( recordTitle.length > 11 ) {
                        //   recordTitle = recordTitle.slice(0,5) +"···"+ recordTitle.slice(-4);
                        //}

                        temp = '<div class="weui-cells">' +
                            '       <div class= "weui-cell" pay_num='+ record[ i ][ "pay_num" ] +' is_pay='+record[i]["is_pay"]+' data='+ record[i]["id"] +'>' +
                            '          <div class="weui-cell__bd handle_click" >' +
                            '             <p  class="section-time">' + record[ i ][ "start_time" ] + '</p>' +
                            '          </div>' +
                            '          <div class="weui-cell__ft handle_click" style="font-size: 1.3rem">' + recordTitle+ '</div>' +

                            '          <div class="weui-cell__ft" style="font-size: 1.3rem;">' +
                            '               <button class="pay_btn" data=' + record[ i ][ "pay_num" ] + ' style="margin-left:0.3rem;display: ' + (record[ i ][ "is_pay" ] ? 'none' : 'block') + ';">立即付款</button>' +
                            '           </div>' +
                            '       </div>' +
                            '   </div>';
                        $(".person-record").append(temp);

                    }
                }
                callback( true );
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
    getUserInfo( function ( tf ) {
        if( !tf ){
            return;
        }


        $(".handle_click").click(function () {

            var self = $(this);
            var meetingId = self.parent( "div" ).attr( "data" );
            var is_pay = self.parent("div").attr( "is_pay" );
            var pay_num = self.parent("div").attr( "pay_num" );
            $.ajax({
                url: globalUrl.globalUrl +"meetings/"+ meetingId,
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
                        return;
                    }

                    if( data["errno"] === "0" ){

                        //显示详细信息
                        $(".detail-info").removeClass( "hide" );

                        var record = data["meeting"];
                        let intoduce = record["introduce"] + "<br>"+
                                        "开始时间:"+record["start_time"]+"<br>"+
                                        "结束时间:"+record["end_time"]+"<br>"+
                                        "赞助方:"+record["support"]+"<br>"+
                                        "主办方:"+record["committee"];

                        $("#introduce").html( intoduce );

                        if( is_pay === "false" ){

                            $(".bottom-btns").show();

                        }

                        if( is_pay !== "false" ){

                            $(".bottom-btns").hide();

                        }


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
                }
            });

            payBtn( meetingId );

        });

        //五条会议记录已经生成完了，处理点击立即付款
        payment();
    });


    function payBtn( meetingId ) {
        $(".pay").click(function () {

            window.location.href = "./order.html?meetingId="+ meetingId;

            var self = $(this);
            $.confirm({
                title: '提示',
                text: '确认支付?',
                onOK: function () {
                    //点击确认
                    //console.log( self.attr( "data" ).trim() );//交易号

                    //$.ajax( {
                    //    url    : globalUrl.globalUrl + self.attr("data").trim() + "/payments",
                    //    method : "GET",
                    //    headers: {
                    //        "Authorization":  "MeetingJWT " + window.localStorage.getItem( "token" )
                    //    },
                    //    success: function ( data ) {
                    //        /*{
                    //            'errno': '0',
                    //            'errmsg': '',
                    //            'pay_url': 'https://openapi.alipaydev.com/gateway.do?app_id=2016091900543828&biz_content=%7B%22total_amount%22%3A200.25%2C%22out_trade_no%22%3A%2220181107155350000000002%22%2C%22product_code%22%3A%22QUICK_WAP_PAY%22%2C%22subject%22%3A%22meeting%22%7D&charset=utf-8&method=alipay.trade.wap.pay&return_url=http%3A%2F%2Fwww.baidu.com&sign_type=RSA2&timestamp=2018-11-07+16%3A00%3A52&version=1.0&sign=d1mTkryzrfi5J4loaP1m33FBjZ5qVtx%2BVIs5R3cL75oubfKs6fJmL1becw5UVmnX2oOOCmAcXSS5nh8ouuRNnA2Twwig69G6xPmLt2E3%2ByTKvB0zOjxKI%2FiwCM3u9GDRnkt%2B9AQoMT8dUvkRN9lppQcHijcjpcvsyhla9isyTALx%2BavHIk7T1ljUOsCbbe6vqtmL7bk%2BjrhVWotQKIxhs6O7oS5%2FoFFYs%2FrDh%2B%2BY%2FbHtsqmYxwEySDC4oFv5pdUlaku31rz%2FBuDHQfH5i97ZMHHDBO8oY1D3%2BY%2BrjE2JIVRWwgmGli3ux%2BV4lv5a51cICFifE3zPjsj1938cZg5zeA%3D%3D'  // 请求支付宝支付的url
                    //        }*/
                    //
                    //        if( data["errno"] !== "0" ){
                    //
                    //            $.alert( {
                    //                title: '提示',
                    //                text : data["errmsg"],
                    //                onOK : function () {
                    //                    window.location.href = "./serviceInfo.html";
                    //                }
                    //            } );
                    //            return;
                    //        }
                    //        window.location.href =  data[ "pay_url" ];
                    //
                    //    },
                    //    error  : function () {
                    //
                    //            $.alert( {
                    //                title: '提示',
                    //                text : "无法连接服务器,支付失败",
                    //                onOK : function () {
                    //                    window.location.href = "./serviceInfo.html";
                    //                }
                    //        });
                    //
                    //    }
                    //})
                },
                onCancel: function () {
                }
            });


            $.confirm({
                title: '提示',
                text: '确认支付?',
                onOK: function () {
                    //点击确认

                    /*2018-11-23修改，直接跳转到order页面*/
                    //$.ajax( {
                    //    url    : globalUrl.globalUrl + pay_num.trim() + "/payments",
                    //    method : "GET",
                    //    headers: {
                    //        "Authorization":  "MeetingJWT " + window.localStorage.getItem( "token" )
                    //    },
                    //    success: function ( data ) {
                    //        /*{
                    //            'errno': '0',
                    //            'errmsg': '',
                    //            'pay_url': 'https://openapi.alipaydev.com/gateway.do?app_id=2016091900543828&biz_content=%7B%22total_amount%22%3A200.25%2C%22out_trade_no%22%3A%2220181107155350000000002%22%2C%22product_code%22%3A%22QUICK_WAP_PAY%22%2C%22subject%22%3A%22meeting%22%7D&charset=utf-8&method=alipay.trade.wap.pay&return_url=http%3A%2F%2Fwww.baidu.com&sign_type=RSA2&timestamp=2018-11-07+16%3A00%3A52&version=1.0&sign=d1mTkryzrfi5J4loaP1m33FBjZ5qVtx%2BVIs5R3cL75oubfKs6fJmL1becw5UVmnX2oOOCmAcXSS5nh8ouuRNnA2Twwig69G6xPmLt2E3%2ByTKvB0zOjxKI%2FiwCM3u9GDRnkt%2B9AQoMT8dUvkRN9lppQcHijcjpcvsyhla9isyTALx%2BavHIk7T1ljUOsCbbe6vqtmL7bk%2BjrhVWotQKIxhs6O7oS5%2FoFFYs%2FrDh%2B%2BY%2FbHtsqmYxwEySDC4oFv5pdUlaku31rz%2FBuDHQfH5i97ZMHHDBO8oY1D3%2BY%2BrjE2JIVRWwgmGli3ux%2BV4lv5a51cICFifE3zPjsj1938cZg5zeA%3D%3D'  // 请求支付宝支付的url
                    //        }*/
                    //
                    //        if( data["errno"] !== "0" ){
                    //
                    //            $.alert( {
                    //                title: '提示',
                    //                text : data["errmsg"],
                    //                onOK : function () {
                    //                    window.location.href = "./serviceInfo.html";
                    //                }
                    //            } );
                    //            return;
                    //        }
                    //        window.location.href =  data[ "pay_url" ];
                    //
                    //    },
                    //    error  : function () {
                    //
                    //        $.alert( {
                    //            title: '提示',
                    //            text : "无法连接服务器,支付失败",
                    //            onOK : function () {
                    //                window.location.href = "./serviceInfo.html";
                    //            }
                    //        });
                    //
                    //    }
                    //})
                },
                onCancel: function () {
                }
            });
        })
    };

    function payment () {

        $(".pay_btn").click( function () {

            var self = $(this);
            $.confirm({
                title: '提示',
                text: '确认支付?',
                onOK: function () {
                    //点击确认
                    //console.log( self.attr( "data" ).trim() );//交易号
                    window.location.href = "./order.html?meetingId="+ self.parent().parent("div").attr("data").trim();

                },
                onCancel: function () {
                }
            });
        });

    }

    $(".detail-info").click(function () {

        $(this).addClass("hide");
    })

    $("#record").click(function () {

        //显示了所有记录
        $(".show-record").addClass("show");

        $.ajax({
                url: url.usermeetings,
                method: "GET",
                headers: {
                    "Authorization": "MeetingJWT " + window.localStorage.getItem("token")
                },
                success: function (data) {

                    if( data["errno"] !== "0" ){
                        $.alert({
                            title: '提示',
                            text: data["errmsg"],
                            onOK: function () {
                                //点击确认
                            }
                        });
                        return;
                    }

                    if( data["errno"] === "0" ){
                        var msgObj = data["meetings"];
                        //返回了最新的会议记录和用户信息
                        if( msgObj.length >14 ){
                            $(".show-record").css("justify-content","flex-start");
                        }

                        var temp = "";
                        for( var i= 0; i< msgObj.length; i++ ){
                            var tempTit = msgObj[i]["title"];

                            if( msgObj[i]["is_pay"] ){
                                //已经给钱了 字体如果超过了
                                if( tempTit.length >14 ) {
                                    tempTit = tempTit.slice(0,6) +"····" +tempTit.slice(-6);
                                }
                            }

                            if( !msgObj[i]["is_pay"] ){

                                if( tempTit.length > 9 ) {
                                    tempTit = tempTit.slice(0,5) +"····" +tempTit.slice(-3);
                                }

                            }


                            temp += ' <div>' +
                                '       <div class="weui-cells">' +
                                '            <div class="weui-cell"  pay_num='+ msgObj[ i ][ "pay_num" ] +' is_pay='+msgObj[i]["is_pay"]+'  data='+msgObj[i]["id"]+'>' +
                                '                <div class="weui-cell__bd allrecord_click">' +
                                '                   <p class="section-time" style="color:#999;">'+msgObj[i]["start_time"]+'</p>' +
                                '                </div>' +
                                '                <div class="weui-cell__ft allrecord_click" style="color: #000;font-size: 1.3rem;">'+tempTit+'</div>' +
                                    '           <div class="weui-cell__ft" style="font-size: 1.3rem">' +
                                    '               <button class="pay_btn" data=' + msgObj[ i ][ "pay_num" ] + ' style="display: ' + (msgObj[ i ][ "is_pay" ] ? 'none' : 'block') + ';">立即付款</button>' +
                                    '           </div>' +
                                '            </div>' +
                                '       </div>' +
                                '    </div>';

                            $(".show-record").html(temp);

                        }

                        //定义立即付款按钮
                        payment();

                        $(".allrecord_click").click(function (  ) {


                            var self = $(this);
                            var meetingId = self.parent( "div" ).attr( "data" );
                            var is_pay = self.parent("div").attr( "is_pay" );
                            var pay_num = self.parent("div").attr( "pay_num" );

                            $.ajax({
                                url: globalUrl.globalUrl +"meetings/"+ meetingId,
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
                                        return;
                                    }

                                    if( data["errno"] === "0" ){

                                        //显示详细信息
                                        $(".detail-info").removeClass( "hide" );

                                        var record = data["meeting"];
                                        let intoduce = record["introduce"] + "<br>"+
                                            "开始时间:"+record["start_time"]+"<br>"+
                                            "结束时间:"+record["end_time"]+"<br>"+
                                            "赞助方:"+record["support"]+"<br>"+
                                            "主办方:"+record["committee"];

                                        $("#introduce").html( intoduce );

                                        if( is_pay === "false" ){

                                            $(".bottom-btns").show();

                                        }

                                        if( is_pay !== "false" ){

                                            $(".bottom-btns").hide();

                                        }

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
                                }
                            });

                            payBtn( meetingId );

                        })

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
                }
            });

    });


    $(".show-record").click(function () {
        $(this).removeClass("show");
    })

    $(".erweima").click(function () {
        $(".show-erweima").addClass("show");
    })

    $(".show-erweima").click(function (  ) {
        $(this).removeClass("show");
    });


    //修改密码:
    $("#check-psw").click(function () {
        $(".check-pwd").addClass("show");
    });

    $("#cancel-pwd").click(function () {

        $(".check-pwd").removeClass("show");

    });

    $("#confirm-pwd").click(function () {

        for ( var i =0; i<  $(".check-pwd-cont>input").length; i++ ){
            var temp = $(".check-pwd-cont>input").eq(i).val().trim();

            if( !temp ){
                $.alert({
                    title: '提示',
                    text: "密码不能为空",
                    onOK: function () {
                        //点击确认
                    }
                });
                return ;
            }
        }
        var error = "";

        if ( checkPassword( $(".old-pwd").val().trim() ) ) {
            error = checkPassword( $(".old-pwd").val().trim() );
        }

        if ( checkPassword( $(".new-pwd").val().trim() ) ) {
            error = checkPassword( $(".new-pwd").val().trim() );
        }

        if ( checkPasswordIsPwd( $(".again-pwd").val().trim() ) ) {
            error = checkPasswordIsPwd( $(".again-pwd").val().trim() );
        }

        if( error !=="" ){
            $.alert({
                title: '提示',
                text: error,
                onOK: function () {
                    //点击确认
                }
            });
            return;
        }

        $.ajax( {
            url        : url.password,
            method     : "PUT",
            contentType: "application/json",
            data       : JSON.stringify( {
                "password" : $( ".old-pwd" ).val().trim(),
                "new_pwd"  : $( ".new-pwd" ).val().trim(),
                "renew_pwd": $( ".again-pwd" ).val().trim()
            }),
            headers     : {
                "Authorization": "MeetingJWT " + window.localStorage.getItem( "token" )
            },
            success    : function ( data ) {
                /**
                 * {
                    "errmsg": "修改密码成功",
                    "errno": "0"
                }
                 */

                if ( data[ "errno" ] !== "0" ) {
                    $.alert( {
                        title: '提示',
                        text : data[ "errmsg" ],
                        onOK : function () {
                            //点击确认
                        }
                    } );
                    return;
                }

                $.alert( {
                    title: '提示',
                    text : data[ "errmsg" ],
                    onOK : function () {
                        window.location.href =  "./login.html";

                    }
                });
            },
            error      : function () {

                $.alert( {
                    title: '提示',
                    text : "无法连接服务器",
                    onOK : function () {
                        //点击确认
                    }
                } );
            }
        } )

    });

    function checkPassword( value ) {
        if( value.length < 6 ) {
            return "密码长度不能小于6位"
        }
    };

    function checkPasswordIsPwd( value ) {
        if( $( ".new-pwd" ).val().trim() !== value ) {
            return "确认密码不匹配";
        }
    };



})



