package com.sohair.moneymanager.controller;

import com.sohair.moneymanager.dto.ProfileDTO;
import com.sohair.moneymanager.entity.ProfileEntity;
import com.sohair.moneymanager.service.ProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping({"/status", "/health"})
public class HomeController {


    @GetMapping("/")
    public String healthCheck(){
        return "Application is running";
    }


}
