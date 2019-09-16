$(function(){
    // 动态获取高度
    var winHeight = $(window).height();
    $("#canvasBg").css("height",winHeight);
    // 设置登录页面动态效果高度
    $('#canvasBg').particleground({
        dotColor: '#fff',
        lineColor: '#f0f0f0'
    });
});

/**
 * 登录事件
 */
function loginMethod() {
    // 用户名
    var userName = $("#userName").val();
    // 密码
    var userPwd = $("#userPwd").val();
    if(userName.trim().length == 0 || userPwd.trim().length == 0) {
        toastr.error('请输入用户名和密码！', '登录异常');
        return;
    }
    // console.log(JSON.stringify($('#login').serializeJSON()));
    $.ajax({
        url: ajaxReqPre + "/org_credit_rating_login",
        type:'POST',
        contentType: "application/json",
        data:JSON.stringify($('#login').serializeJSON()),
        dataType: "json"
    }).done(function(data) {
      //console.log("成功：" + JSON.stringify(data));
        if(200 != data.status) {
            toastr.error(data.msg, '登录异常');
            return;
        }
        dealLoginSuccess(data.data);
    }).fail(function(data){
        console.log("失败回调：" + JSON.stringify(data));
        toastr.error(JSON.stringify(data), '系统异常!');
    });
}

/**
 * 处理请求成功事件
 * @param _dataStr
 */
function dealLoginSuccess(_dataStr) {
    $.ajax({
        url: "/loginSuccess",
        type:'POST',
        data:{"loginUserStr":_dataStr},
        dataType: "text"
    }).done(function(data) {
        toastr.success(data, '登录成功');
        $(location).attr('href', '/index');
    }).fail(function(data){
        console.log("失败回调：" + JSON.stringify(data));
        toastr.error(JSON.stringify(data), '系统异常!');
    });
}