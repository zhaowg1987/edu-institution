$(function() {
    // 初始化页面数据
    initRadiosData();
});

/**
 * 初始化radio选项
 */
function initRadiosData() {
    $.ajax({
        url: ajaxReqPre + "/groupscore/getGroupScoreSourceRadios",
        type:'POST',
        contentType: "application/json",
        data:null,
        dataType: "json"
    }).done(function(data) {
        //console.log("成功：" + JSON.stringify(data));
        if(200 != data.status) {
            toastr.error(data.msg, '获取数据异常。');
            return;
        }
        // 处理radio
        initData(data.data);
    }).fail(function(data){
        console.log("失败回调：" + JSON.stringify(data));
        toastr.error(JSON.stringify(data), '系统异常!');
    });
}

/**
 * 解析请求json
 * @param _data
 */
function initData(_data) {
    // 转化为json对象
    var _radisoDataJson = JSON.parse(_data);
    $.each(_radisoDataJson, function (index) {
        foreachData(_radisoDataJson,index,$('#'+index+''));
    });
    // 机构资料 groupInfoRadios
    // 机构三方核查 groupThirdCheckRadios
    // 机构网络查询 groupNetworkCheckRadios
    // 历史数据分析 groupHistoryDataRadios
    // IT（校招） groupItSchoolRadios
    //  IT（社招） groupItSocietyRadios
    // 证书 groupCertificateRadios
    //  学历（网教） groupEducationNetworkRadios
    // 学历（自考） groupEducationSelfTaughtRadios
    // 学历（成考） groupEducationAdultRadios
    // 学历（电大） groupEducationOpenRadios
    // K12 groupK12Radios

    var view_add_edit_flag = $('#view_add_edit_flag').val();
    if('view' == view_add_edit_flag || 'edit' == view_add_edit_flag) {
        // 请求数据，进行赋值
        initViewData();
    }

    //Flat purple color scheme for iCheck 为radio添加样式
    $('input[type="checkbox"].flat-purple, input[type="radio"].flat-purple').on('ifClicked',function (event) {
        if($(this).is(":checked")){
            // console.log($(this).prop('checked'));
            $(this).prop("checked",false);
            $(this).parent().attr('aria-checked','false').removeClass('checked');
            // console.log($(this).prop('checked'));
        }
    }).iCheck({
        checkboxClass: 'icheckbox_flat-purple',
        radioClass: 'iradio_flat-purple'
    });
}

/**
 * 循环处理子对象
 * @param _jsonObj json对象
 * @param _item_name json key值
 * @param _div_id 前端页面id
 */
function foreachData(_jsonObj,_item_name,_div_id) {
    var info_radios_html = '';
    $.each(_jsonObj[_item_name], function (index, item) {
        // console.log(item);
        info_radios_html += '<div class="form-group row"><label class="col-md-1-5 col-form-label">'+ item.description +'</label>';
        $.each(item.children, function (index2, item2) {
            info_radios_html += '<label class="col-md-21-25 col-form-label"><input type="radio" name="'+item.code+'" value="'+item2.id+'" class="flat-purple" />' +
                item2.description+ '</label>';
        });
        info_radios_html += '</div>';
    });
    _div_id.append(info_radios_html);
}

/**
 * 保存机构----返回一个对象
 */
function saveGroupScoreSource() {
    var req_data;
    var view_add_edit_flag = $('#view_add_edit_flag').val();
    if('add' == view_add_edit_flag) {
        req_data = $('#radios_add_form').serialize();
    } else if('edit' == view_add_edit_flag) {
        req_data = $('#radios_edit_form').serialize();
    }
    // console.log(req_data);
    $.ajax({
        url: ajaxReqPre + "/groupscore/saveGroupScore",
        type:'POST',
        contentType: "application/x-www-form-urlencoded",
        data:req_data,
        dataType: "json"
    }).done(function(data) {
        //
        if(200 != data.status) {
            toastr.error(data.msg, '新增机构出现异常。');
            return;
        }
        // 处理添加成功请求。
        dealAddSuccess(data);
    }).fail(function(data){
        console.log("失败回调：" + JSON.stringify(data));
        toastr.error(JSON.stringify(data), '系统异常!');
    });
}

function dealAddSuccess(_dataMsg) {
    toastr.success('','保存成功！');
    // 转化为json对象
    var _radisoDataJson = JSON.parse(_dataMsg.data);
    // 返回的是GroupScore对象 赋值  groupScoreSourceId  id
    $('input[name="group_score_id"]').val(_radisoDataJson.id);
    $('input[name="id"]').val(_radisoDataJson.groupScoreSourceId);
    var sysScoreFirst = _radisoDataJson.sysScore;
    if('1' == _radisoDataJson.containD) {
        sysScoreFirst += '，D';
    }
    // 赋值
    $('#sys_score_first').val(sysScoreFirst);
    // 弹框
    $('#sys_score_result_div').modal('show');
}

/*计算评分规则*/
function calc_score_level() {
    var sys_score = $('#sys_score_first').val();
    if(sys_score.indexOf("，D") != -1) {
        sys_score = sys_score.replace('，D','');
    }
    var weight_score = $('#weight_score').val();
    var form = $('<form></form>');
    // 创建Input
    var sys_score_input = $('<input type="text" name="sysScore" />');
    sys_score_input.attr('value', sys_score);
    // 附加到Form
    form.append(sys_score_input);
    // 创建Input
    var weight_score_input = $('<input type="text" name="weightScore" />');
    weight_score_input.attr('value', weight_score);
    // 附加到Form
    form.append(weight_score_input);
    $.ajax({
        url: ajaxReqPre + "/groupscore/calcGroupScore",
        type:'POST',
        contentType: "application/x-www-form-urlencoded",
        data:form.serialize(),
        dataType: "json"
    }).done(function(data) {
        //
        if(200 != data.status) {
            toastr.error(data.msg, '计算机构评分出现异常。');
            return;
        }
        var _radisoDataJson = JSON.parse(data.data);
        $('#synthetical_score').val(_radisoDataJson.syntheticalScore);
        $('#group_level').val(_radisoDataJson.groupLevel);
    }).fail(function(data){
        console.log("失败回调：" + JSON.stringify(data));
        toastr.error(JSON.stringify(data), '系统异常!');
    });
}

/*保存系统评分*/
function updateGroupScore() {
    var groupScoreId = $('input[name="group_score_id"]').val();
    var groupName = $('input[name="group_name"]').val();
    var sysScore = $('#sys_score_first').val();
    if(sysScore.indexOf("，D") != -1) {
        sysScore = sysScore.replace('，D','');
    }
    var weightScore = $('#weight_score').val();
    var syntheticalScore = $('#synthetical_score').val();
    var groupLevel = $('#group_level').val();

    var form = $('<form></form>');
    var params = {"id":groupScoreId,"groupName":groupName,"sysScore":sysScore,
        "weightScore":weightScore,"syntheticalScore":syntheticalScore,"groupLevel":groupLevel};
    //
    $.each(params,function (key,value) {
        input = $("<input type='hidden'>");
        input.attr({"name":key});
        input.val(value);
        form.append(input);
    });
    /*// 主键ID
    var id_input = $('<input type="text" name="id" />');
    id_input.attr('value', groupScoreId);
    // 机构名称
    var groupName_input = $('<input type="text" name="groupName" />');
    groupName_input.attr('value', groupName);
    // 系统评分
    var sysScore_input = $('<input type="text" name="sysScore" />');
    sysScore_input.attr('value', sysScore);
    // 权重分
    var weightScore_input = $('<input type="text" name="weightScore" />');
    weightScore_input.attr('value', weightScore);
    // 综合得分
    var syntheticalScore_input = $('<input type="text" name="syntheticalScore" />');
    syntheticalScore_input.attr('value', syntheticalScore);
    // 机构等级
    var groupLevel_input = $('<input type="text" name="groupLevel" />');
    groupLevel_input.attr('value', groupLevel);

    form.append(id_input);
    form.append(groupName_input);
    form.append(sysScore_input);
    form.append(weightScore_input);
    form.append(syntheticalScore_input);
    form.append(groupLevel_input);*/
    $.ajax({
        url: ajaxReqPre + "/groupscore/updateGroupScore",
        type:'POST',
        contentType: "application/x-www-form-urlencoded",
        data:form.serialize(),
        dataType: "json"
    }).done(function(data) {
        //
        if(200 != data.status) {
            toastr.error(data.msg, '更新机构评分出现异常。');
            return;
        }
        toastr.success(data.msg,'机构评测完成！');
        $(location).attr('href', '/institution_score');
    }).fail(function(data){
        console.log("失败回调：" + JSON.stringify(data));
        toastr.error(JSON.stringify(data), '系统异常!');
    });
}


/*刷新新增form*/
function refreshAddGroupScoreSource() {
    // 获取ID
    var reqId = $('input[name="id"]').val().trim();
    if(reqId.length == 0) {
        $(location).attr('href', '/institution_add');
    } else {
        var form = $('<form></form>');
        // 主键ID
        var id_input = $('<input type="text" name="groupScoreSourceId" />');
        id_input.attr('value', reqId);
        form.append(id_input);
        // 请求数据
        $.ajax({
            url: ajaxReqPre + "/groupscore/getGroupScoreSourceById",
            type:'POST',
            contentType: "application/x-www-form-urlencoded",
            data:form.serialize(),
            dataType: "json"
        }).done(function(data) {
            //
            if(200 != data.status) {
                toastr.error(data.msg, '获取机构评分来源出现异常。');
                return;
            }
            dealRefreshDataEcho(data.data);
        }).fail(function(data){
            console.log("失败回调：" + JSON.stringify(data));
            toastr.error(JSON.stringify(data), '系统异常!');
        });
    }
}

/**
 * 查看和编辑时初始化数据
 */
function initViewData() {
    var groupId = $('#groupId').val();
    var form = $('<form></form>');
    // 主键ID
    var id_input = $('<input type="text" name="groupId" />');
    id_input.attr('value', groupId);
    form.append(id_input);
    // 请求数据
    $.ajax({
        url: ajaxReqPre + "/groupscore/getGroupScoreSourceByGroupId",
        type:'POST',
        contentType: "application/x-www-form-urlencoded",
        data:form.serialize(),
        dataType: "json"
    }).done(function(data) {
        //
        if(200 != data.status) {
            toastr.error(data.msg, '获取机构评分来源出现异常。');
            return;
        }
        dealRefreshDataEcho(data.data);
    }).fail(function(data){
        console.log("失败回调：" + JSON.stringify(data));
        toastr.error(JSON.stringify(data), '系统异常!');
    });
}

/**
 * 处理刷新数据回显动作。
 * @param _dataJsonStr
 */
function dealRefreshDataEcho(_dataJsonStr) {
    var jsonObj = JSON.parse(_dataJsonStr);
    $.each(jsonObj, function (index,item) {
        if(null == item) {
            return true;
        }
        var domObject = $('input[name="'+index+'"]');
        if(null == domObject) {
            // 类似java中的continue
            return true;
        }
        if(domObject.is("input")) {
            if(domObject.attr("type") == 'text'
                || domObject.attr("type") == 'hidden'
                || domObject.attr("type") == 'number') {
                domObject.val(item);
            } else if(domObject.attr("type") == 'radio') {
                // 循环去除选中
                $('input:radio[name="'+index+'"]').each(function(){
                    $(this).parent().attr('aria-checked','false').removeClass('checked');
                });
                $('input:radio[name="'+index+'"][value="'+item+'"]').attr('checked','true');
                $('input:radio[name="'+index+'"][value="'+item+'"]').parent()
                    .attr('aria-checked','true').addClass('checked');
            }
        }
    });
    var view_add_edit_flag = $('#view_add_edit_flag').val();
    if('view' == view_add_edit_flag) {
        // 所有input增加disable属性
        $("input").each(function(){
            $(this).attr("disabled","disabled");
        });
    }
}

/*校验机构名称*/
function checkGroupName() {
    var groupName = $('input[name="group_name"]').val();
    if(groupName.trim().length == 0) {
        showWrongBtn();
        return;
    }
    $.ajax({
        url: ajaxReqPre + "/groupscore/getGroupScoreByName",
        type:'POST',
        contentType: "application/x-www-form-urlencoded",
        data:{"groupName":groupName},
        dataType: "json"
    }).done(function(data) {
        //
        if(200 == data.status) {
            toastr.error('['+groupName+']机构名称已存在，请您核对后再操作。', '机构名称已存在！');
            showWrongBtn();
        } else {
            showRightBtn();
        }
    }).fail(function(data){
        // console.log("失败回调：" + JSON.stringify(data));
        toastr.error(JSON.stringify(data), '系统异常!');
    });
}

function showWrongBtn() {
    $('#wrong_btn').removeClass('close_clear_btn');
    $('#right_btn').addClass('close_clear_btn');
}

function showRightBtn() {
    $('#wrong_btn').addClass('close_clear_btn');
    $('#right_btn').removeClass('close_clear_btn');
}

