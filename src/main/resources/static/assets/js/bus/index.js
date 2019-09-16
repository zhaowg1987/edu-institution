$(function(){
    // 百度地图API功能
    var geolocation = new BMap.Geolocation();
    geolocation.getCurrentPosition(function (r) {
        if (this.getStatus() == BMAP_STATUS_SUCCESS) {
            // 用户地理位置授权同意是否标志
            if(r.accuracy==null) {
            }
            // 先获取经纬度 经纬度格式为lng,lat
            var location_point = r.point.lng + "," + r.point.lat;
            if("" == location_point) {
                location_point = "北京";
            }
            // console.log("获取经纬度：" + location_point);
            // 初始化天气数据
            getWeatherData(location_point);
        }
    }, {enableHighAccuracy: true});
});

function getWeatherData(_point) {
    $.ajax({
        // 备用地址：http://wthrcdn.etouch.cn/weather_mini?city=北京
        url: "//api.map.baidu.com/telematics/v3/weather?location="+_point+"&output=json&ak=LbA00KkpRwb5AIeHeURUwd6F",
        type:"get",
        dataType: "jsonp"
    }).done(function(data) {
        // console.log("成功：" + JSON.stringify(data));
        // toastr.success('成功啦。','请求成功！');
        // 处理天气数据
        dealWeatherData(data);
    }).fail(function(data){
        console.log("失败回调：" + JSON.stringify(data));
        toastr.error('请求百度API出现异常，请您联系管理员。', '请求出现异常!');
    });
}

/**
 * 处理天气预报数据
 * @param _data
 */
function dealWeatherData(_data) {
    if("success" != _data.status) {
        toastr.error('百度API返回天气数据，出现异常。', '请求正常，解析出现异常!');
        return;
    }
    // 获取当前周几 (实时：30℃)
    var current_date = _data.results[0].weather_data[0].date;
    if(current_date.indexOf("(") >= 0 ) {
        current_date = current_date.replace("(","<br/>（")
            .replace(/[ ]/g,"")
            .replace(")","）");
    }
    $("#which_day_of_the_week").html(current_date);

    $("#current_city").text("当前城市：" + _data.results[0].currentCity);
    /*$("#current_date").text("当前日期：" + _data.date);*/
    $("#current_pm25").text("当前PM25：" + _data.results[0].pm25);
    $("#current_temperature").html(_data.results[0].weather_data[0].temperature
        + " <span class='h3 '>"+
        _data.results[0].weather_data[0].weather
        +"</span>");
    // future_weather 未来三天天气预报
    /*
    <div class="col-sm-4 col-4 mt-2 pb-2">
        <h6 class="text-muted mb-3">TUE</h6>
        <i class="fe fe-cloud-rain"></i>
        <p class="mb-0 text-muted">18<sup>o</sup>c</p>
    </div>
    * */
    var future_weather_html = "";
    $.each(_data.results[0].weather_data, function(i, item){
        if(i != 0) {
            var _weather ="<div class=\"col-sm-4 col-4 mt-2 pb-2\">" +
                "<h6 class=\"text-muted mb-3\">"+ item.date + "  " + item.weather+"</h6>" +
                "<i class=\"fe \"><img src='"+item.dayPictureUrl+"'></img></i>" +
                "<p class=\"mt-2 text-muted\">"+item.temperature+"</p></div>";
            future_weather_html +=_weather;
        }
    });
    if("" != future_weather_html) {
        $("#future_weather").html(future_weather_html);
    }
}