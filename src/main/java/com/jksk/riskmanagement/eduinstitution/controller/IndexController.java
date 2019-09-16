package com.jksk.riskmanagement.eduinstitution.controller;

import com.alibaba.fastjson.JSON;
import com.jksk.riskmanagement.eduinstitution.config.ConstantUtils;
import com.jksk.riskmanagement.eduinstitution.config.LoginUser;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;

/**
 * 首页
 *
 * @Author
 * @create 2019-06-27
 **/
@Controller
public class IndexController {

    @RequestMapping({"", "login"})
    public String login(HttpServletRequest request) {
        // 如果已经登录，则无需登录，直接跳转至首页.
        if(null != request.getSession().getAttribute(ConstantUtils.SESSION_KEY_USER_INFO)) {
            return "index";
        }
        return "login";
    }

    @RequestMapping("logout")
    public String logout(HttpServletRequest request) {
        request.getSession().invalidate();
        return "login";
    }

    /**
     * 登录后跳转至首页
     * @return
     */
    @RequestMapping({"/index"})
    public String index() {
        return "index";
    }


    @ResponseBody
    @RequestMapping(value = "/loginSuccess",method = RequestMethod.POST)
    public String loginSuccess(HttpServletRequest request, String loginUserStr) {
        if(null == request.getSession().getAttribute(ConstantUtils.SESSION_KEY_USER_INFO)) {
            if(StringUtils.isNotEmpty(loginUserStr)) {
                LoginUser loginUser = JSON.toJavaObject(JSON.parseObject(loginUserStr), LoginUser.class);
                // 获取ajax请求传递过来的session值
                request.getSession().setAttribute(ConstantUtils.SESSION_KEY_USER_INFO,loginUser);
                request.getSession().setAttribute(ConstantUtils.SESSION_KEY_USER_REAL_NAME,loginUser.getRealName());
                request.getSession().setAttribute(ConstantUtils.SESSION_KEY_USER_ROLE_NAME,loginUser.getRoleName());
            }
        }
        return "success";
    }

    /**
     * 机构评分列表
     * @return
     */
    @RequestMapping({"/institution_score"})
    public String institution_score() {
        return "institution/institution_score";
    }

    /**
     * 新增机构评分列表
     * @return
     */
    @RequestMapping({"/institution_add"})
    public String institution_add() {
        return "institution/institution_add";
    }

    /**
     * 查看机构评分来源
     * @return
     */
    @RequestMapping({"/view_group_score_source"})
    public String view_group_score_source(Model model, String groupId) {
        model.addAttribute("groupId",groupId);
        return "institution/view_group_score_source";
    }

    /**
     * 查看机构评分来源
     * @return
     */
    @RequestMapping({"/edit_group_score_source"})
    public String edit_group_score_source(Model model, String groupId) {
        model.addAttribute("groupId",groupId);
        return "institution/edit_group_score_source";
    }


    /**
     * 机构评分列表
     * @return
     */
    @RequestMapping({"/institution_score_view"})
    public String institution_score_view() {
        return "institution/institution_score_view";
    }

}
