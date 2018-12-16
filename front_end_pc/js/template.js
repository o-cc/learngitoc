$(function (){

    $("#homepage").attr("href", "./meetingHomePage.html?meetingId=" + loadPageVar("meetingId") );
    $("#go_back").attr("href", "./meetingHomePage.html?meetingId=" + loadPageVar("meetingId") );
    $("#attend").attr("href", "./serviceInfo.html?meetingId=" + loadPageVar("meetingId") );

    $.ajax({
        url: globalUrl.globalUrl + "modules/"+ loadPageVar("moduleId") + "/meetings/" + loadPageVar("meetingId"),
        method: "GET",
        success: function ( data ) {
            /*
            * content: "<p>请输入内容</p><p>ddddd</p>"
              errmsg: "请求成功"
              "title": ""
              errno: "0"
            * */
            if( data["errno"] !== "0" ){
                 alert( data["errmsg"] );
                 return;
            }

            let temp = '<a href="" style="color: #fff;">'+ data["title"] +'</a>\n';
            $(".header_title").append( temp );

            $("#section").html( data["content"] );

        },
        error: function ( err ) {
            console.log( err );
        }
    })


    //获取URL参数
    /*
    * param1 { String } 参数名
    * */
    function loadPageVar( sVar ) {
        return decodeURI( window.location.search.replace( new RegExp( "^(?:.*[&\\?]" + encodeURI( sVar ).replace( /[\.\+\*]/g, "\\$&" ) + "(?:\\=([^&]*))?)?.*$", "i" ), "$1" ) );
    }

})