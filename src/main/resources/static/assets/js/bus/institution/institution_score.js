// 全局变量
var mydataTable;
$(function() {
    // 页面初始化加载数据
    mydataTable = $('#myTable').DataTable({
        searching: false, // 控制控件的搜索功能,如果为false,控件的搜索功能被完全禁用,而且默认搜索组件会被隐藏.
        responsive: true, // 将提供自动适应屏幕的功能，让你的表格在不同的设备上都能够显示。
        ordering:  false,
        bLengthChange: true, //改变每页显示数据数量
        aLengthMenu: [[10, 20, 50, 100,200], [10, 20, 50, 100, 200]], // 二组数组，第一组数量，第二组说明文字;
        language: {
            url: '/static/Chinese.json'
        },  // 国际化 详见配置文件
        sPaginationType: 'full_numbers',
        processing: true, //打开数据加载时的等待效果
        serverSide: true,//打开后台分页
        sAjaxSource: ajaxReqPre + '/groupscore/getGroupScoreList',
        fnServerParams: function(aoData) { // 设置查询参数
            aoData.push(
                { name: 'groupName', value: $('#q_groupName').val()},
                { name: 'createTimeStart', value: $('#q_createTimeStart').val()},
                { name: 'createTimeEnd', value: $('#q_createTimeEnd').val()}
            );
        },
        fnServerData: function(sSource, aoData, fnCallback) { // ajax调用
            $.ajax({
                'dataType': 'json',
                'type'    : 'POST',
                'url'     : sSource,
                'data'    : aoData,
                'dataFilter': function(response) {
                    var json_response = JSON.parse(response);
                    if (null != json_response.error) {
                        toastr.error(json_response.error, '请求出现异常!');
                    }
                    return response;
                },
                'success' : fnCallback,
                'error': handleAjaxError
            });
        },
        //列表表头字段
        columns: [
            {
                data:'id',
                render: function (data, type, full, meta) {
                    // 显示行号
                    var startIndex = meta.settings._iDisplayStart + meta.row + 1;
                    return startIndex;
                }
            },
            { data: 'groupName' },
            { data: 'syntheticalScore' },
            { data: 'groupLevel' },
            { data: 'createTime' },
            { data: 'updateTime' },
            {
                data:'id',
                render: function (data) {
                    return '<a onclick="viewGroupScoreSource('+data+')" class="btn btn-action btn-info m-l-5">查看</a>' +
                        '<a onclick="editGroupScoreSource('+data+')" class="btn btn-action btn-info m-l-5">修改</a>';
                }
            }
        ]
    });
});

/**
 * 查询按钮
 */
function queryData() {
    mydataTable.ajax.reload();
}

/**
 * 分页信息不会重置
 */
function refreshData() {
    mydataTable.ajax.reload(null, false );
}

/*
*  重置按钮
**/
function resetQueryData() {
    $('#search_form')[0].reset();
}


function handleAjaxError(xhr, textStatus, error ) {
    if (textStatus === 'timeout') {
        toastr.error('请求超时，请重新尝试。', '请求出现异常!');
    } else {
        toastr.error('请求出现未知异常，请重新尝试。尝试多次后仍无响应，请联系管理员。', '请求出现异常!');
    }

    $(".dataTables_processing").css('display', 'none');
}

/*根据机构ID查看*/
function viewGroupScoreSource(_sId) {
    // $(location).attr('href', '/view_group_score_source?groupId=' + _sId);
    var form = $("<form method='post'></form>");
    var input;
    form.attr({"action":"/view_group_score_source"});
    var params = {"groupId":_sId};
    // var params = JSON.parse(str_params);
    $.each(params,function (key,value) {
        input = $("<input type='hidden'>");
        input.attr({"name":key});
        input.val(value);
        form.append(input);
    });
    $(document.body).append(form);
    form.submit();
}

/**
 * 编辑机构评分来源
 * @param _sId
 */
function editGroupScoreSource(_sId) {
    // $(location).attr('href', '/view_group_score_source?groupId=' + _sId);
    var form = $("<form method='post'></form>");
    var input;
    form.attr({"action":"/edit_group_score_source"});
    var params = {"groupId":_sId};
    //
    $.each(params,function (key,value) {
        input = $("<input type='hidden'>");
        input.attr({"name":key});
        input.val(value);
        form.append(input);
    });
    $(document.body).append(form);
    form.submit();
}