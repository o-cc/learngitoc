$(document.body).infinite(100);
var loading = false;  //状态标记
$(document.body).infinite().on("infinite", function() {
    console.log( loading );
    //if(loading) return;
    //loading = true;
    //setTimeout(function() {
    //    $("#list").append("<p> 我是新加载的内容 </p>");
    //    loading = false;
    //}, 1500);   //模拟延迟
});


$("#ipt").change(function () {
    $(this).click();
    console.log( $( this ).val() );

})
