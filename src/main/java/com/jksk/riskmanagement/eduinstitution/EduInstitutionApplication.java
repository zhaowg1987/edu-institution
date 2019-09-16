package com.jksk.riskmanagement.eduinstitution;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.core.env.Environment;
import org.thymeleaf.spring5.view.ThymeleafViewResolver;

import javax.annotation.Resource;
import java.util.HashMap;
import java.util.Map;

@SpringBootApplication
public class EduInstitutionApplication {

    public static void main(String[] args) {
        SpringApplication.run(EduInstitutionApplication.class, args);
    }


    @Resource
    private Environment env;

    @Resource
    private void configureThymeleafStaticVars(ThymeleafViewResolver viewResolver) {
        if(viewResolver != null) {
            Map<String, Object> vars = new HashMap<String, Object>();
            vars.put("ajaxReqPre", env.getProperty("request.server.address"));
            viewResolver.setStaticVariables(vars);
        }
    }
}
