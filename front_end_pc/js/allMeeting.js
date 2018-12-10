
$(function () {


//get index info
    function getIndexPic ( callback ) {

        $.ajax({
            url    : globalUrl.globalUrl + "homepages",
            method : "GET",
            success: function ( data ) {
                $( ".publicImg" ).attr( "src" , data);
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

    getIndexPic( function ( tf ) {
        if( !tf ) {
            return;
        }

        $.ajax({
            url    : globalUrl.globalUrl + "meetings",
            method : "GET",
            success: function ( data ) {

                if( data["errno"] !== "0" ) {

                    $.alert("获取信息不成功");
                    return;
                }
                console.log( data );
                /*
                * {
                    "errno": "0",
                    "errmsg": "获取会议列表信息成功",
                    "data": [
                                {"title": "广东省2018年度大会", "id": 1},
                                {"title": "广东省打假反腐大会", "id":2},
                                {"title": "广东省2018年度大会", "id": 3},
                                {"title": "广东省2018年度大会", "id": 4},
                                ...
                            ]
                }
                * */
                var temp = "";
                var dataList = data[ "data" ];
                for( var i = 0; i< dataList.length; i++ ){

                    temp = "<div class=\"center_item\">" +
                        "            <div class=\"item_center\">" +
                        "                <p class=\"item_title\" style='background: "+dataList[i][ 'bgcolor' ]+"'><span class=\"title_txt\"> "+ dataList[i]["title"] +" </span></p>" +
                        "                <img src="+ dataList[i][ "homepage" ] +" class=\"meet_pic\" alt='获取图片失败'>" +
                        "                <div class=\"address_time\">" +
                        "                    <p>" +
                        "                        <i class=\"weui-icon-waiting weui-icon_msg\" style=\"font-size: 2rem;\"></i>" +
                        "                        <span>时间:</span>" +
                        "                        <span class=\"meet_time\"> "+ dataList[i][ "start_time" ]+" </span>" +
                        "                    </p>" +
                        "                    <p>" +
                        "                        <i class=\"weui-icon-info-circle\" style=\"font-size: 2rem;\"></i>" +
                        "                        <span>地点:</span>" +
                        "                        <span class=\"address\"> "+dataList[i][ "address" ]+" </span>" +
                        "                    </p>" +
                        "                </div>" +
                        "                <p style=\"text-align: right\">" +
                        "                    <a href='./meetingHomePage.html?meetingId="+dataList[i][ "id" ]+"' class=\"attend_meet\">参加会议</a>" +
                        "                </p>" +
                        "            </div>" +
                        "        </div>";

                    $("#section").append( temp );
                }


            },
            error  : function ( xmlerr, err ) {
                $.alert({
                    title: '提示',
                    text: "获取会议数据失败",
                    onOK: function () {
                        //点击确认
                    }
                });
            }
        } );


    })



})