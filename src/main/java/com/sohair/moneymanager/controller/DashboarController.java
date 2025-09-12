package com.sohair.moneymanager.controller;

import com.sohair.moneymanager.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/dashboard")
public class DashboarController {

    private final DashboardService dashboardService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getDashboardData() {
        Map<String, Object> data = dashboardService.getDashboardData();
        return ResponseEntity.ok(data);
    }
}
