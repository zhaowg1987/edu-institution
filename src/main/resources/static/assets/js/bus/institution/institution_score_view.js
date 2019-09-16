
$(function() {

    $('#q_groupName').typeahead({
        source:function (query, process) {
            return $.ajax({
                url: ajaxReqPre + "/groupscore/getGroupScoresByLikeNameFromEs",
                type:'POST',
                contentType: "application/x-www-form-urlencoded",
                data:{'likeName': query},
                dataType: "json"
            }).done(function(data) {
                if(200 != data.status) {
                    toastr.error(data.msg, '查询机构评分出现异常。');
                    return;
                }
                var res = [];
                $.each(JSON.parse(data.data), function (i, item) {
                    var aItem = { id: item.id, name: item.groupName };//把后台传回来的数据处理成带name形式
                    res.push(aItem);
                });
                return process(res);
            }).fail(function(data){
                console.log("失败回调：" + JSON.stringify(data));
                toastr.error(JSON.stringify(data), '系统异常!');
            });
        },
        showHintOnFocus: "true",//将显示所有匹配项
        fitToElement: true,//选项框宽度与输入框一致
        items: 'all',//下拉选项中出现条目的最大数量。也可以设置为“all”
        minLength:1,//默认1，触发发下拉提示的最小长度字符串。可以设置为0，即使没有填写任何内容，也会出现提示。
        // scrollHeight:5, // Number of pixels the scrollable parent container scrolled down (scrolled out the viewport).
        // highlighter:,   //显示处理(使用指定的方式，高亮(指出)匹配的部分)
        autoSelect:false,
        updater: function (item) {
            $('#q_id').val(item.id);
            // console.log(item);
            //这里一定要return，否则选中不显示，外加调用display的时候null reference错误。
            return item.name;
        },
        afterSelect: function (item) {
            // console.log($('#q_id').val());
            //选择项之后的事件 ，item是当前选中的。
            $('#close_clear_btn').removeClass('close_clear_btn');
        },
        delay: 500//延迟时间
    });

    /*清除按钮事件*/
    $('#close_clear_btn').click(function(){
        $('#q_id').val('');
        $('#q_groupName').val('');
        $('#q_groupName').text('');
        $('#close_clear_btn').addClass('close_clear_btn');
    });
});

/**
 * 查询按钮
 */
function queryData() {
    if('' == $('#q_groupName').val()) {
        toastr.warning('请您录入机构名称！','系统提示');
        return;
    }
    console.log($('#q_id').val());
    $.ajax({
        url: ajaxReqPre + "/groupscore/getGroupScoreById",
        type:'POST',
        contentType: "application/x-www-form-urlencoded",
        data:{'groupId': $('#q_id').val()},
        dataType: "json"
    }).done(function(data) {
        //
        if(200 != data.status) {
            toastr.error(data.msg, '查询机构评分出现异常。');
            return;
        }
        // 处理添加成功请求。
        dealQuerySuccess(data);
    }).fail(function(data){
        console.log("失败回调：" + JSON.stringify(data));
        toastr.error(JSON.stringify(data), '系统异常!');
    });
}

function dealQuerySuccess(_data) {
    var _respDataJson = JSON.parse(_data.data);
    if(null != _respDataJson.groupName) {
        $('#s_group_name').html('&nbsp;&nbsp;&nbsp;&nbsp;' + _respDataJson.groupName);
    }
    if(null != _respDataJson.syntheticalScore) {
        $('#s_group_score').html('&nbsp;&nbsp;&nbsp;&nbsp;' + _respDataJson.syntheticalScore);
    }
    if(null != _respDataJson.groupLevel) {
        $('#s_group_level').html('&nbsp;&nbsp;&nbsp;&nbsp;' + _respDataJson.groupLevel);
    }
    if(null != _respDataJson.riskAnalysis) {
        $('#s_group_risk').html('&nbsp;&nbsp;&nbsp;&nbsp;' + _respDataJson.riskAnalysis);
    }
    if(null != _respDataJson.updateTime) {
        $('#s_last_update_time').html('&nbsp;&nbsp;&nbsp;&nbsp;' + _respDataJson.updateTime);
    }
}

/*
*  重置按钮
**/
function resetQueryData() {
    $('#search_form')[0].reset();
    $("#search_form input[type='hidden']").val('');
    $('#q_groupName').text('');
    $('#close_clear_btn').addClass('close_clear_btn');
}