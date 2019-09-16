package com.jksk.riskmanagement.eduinstitution.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * @Author
 * @create 2019-07-10
 **/
@Configuration
public class WebConfigurer implements WebMvcConfigurer {

    @Autowired
    private LoginInterceptor loginInterceptor;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(loginInterceptor)
                // addPathPatterns("/**") 表示拦截所有的请求，
                // excludePathPatterns("/login", "/register") 表示除了登陆与注册之外，因为登陆注册不需要登陆也可以访问
                .addPathPatterns("/**")
                .excludePathPatterns("/","/login","/logout","/loginSuccess","/error","/static/**");
    }

}
