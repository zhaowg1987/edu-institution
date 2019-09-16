package com.jksk.riskmanagement.eduinstitution.config;

import java.io.Serializable;

/**
 * 登录用户
 *
 * @Author
 * @create 2019-07-02
 **/
public class LoginUser implements Serializable {

    private static final long serialVersionUID = -6059399343395204392L;

    // 用户ID
    private Long id;
    /** 登录账号 */
    private String userName;
    /** 登录密码 */
    private String userPwd;
    /** 真实姓名 */
    private String realName;

    /** 用户角色（有可能有多个角色--目前只展示一个角色） */
    private String roleName;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getUserPwd() {
        return userPwd;
    }

    public void setUserPwd(String userPwd) {
        this.userPwd = userPwd;
    }

    public String getRealName() {
        return realName;
    }

    public void setRealName(String realName) {
        this.realName = realName;
    }

    public String getRoleName() {
        return roleName;
    }

    public void setRoleName(String roleName) {
        this.roleName = roleName;
    }
}
