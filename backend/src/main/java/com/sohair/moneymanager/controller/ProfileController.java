package com.sohair.moneymanager.controller;

import com.sohair.moneymanager.dto.AuthDTO;
import com.sohair.moneymanager.dto.ProfileDTO;
import com.sohair.moneymanager.entity.ProfileEntity;
import com.sohair.moneymanager.repository.ProfileRepository;
import com.sohair.moneymanager.service.ProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/profile")
public class ProfileController {

    @Autowired
    ProfileRepository profileRepository;

    @Autowired
    ProfileService profileService;

    @PostMapping("/register")
    public ResponseEntity<ProfileDTO> register(@RequestBody ProfileDTO p){
        ProfileDTO profileDTO = profileService.registerProfile(p);
        return ResponseEntity.status(HttpStatus.CREATED).body(profileDTO);
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody AuthDTO authDTO){
        try{
            if(!profileService.isAccountActive(authDTO.getEmail())){
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("message", "Account is not activated. Please check your email for activation link."));
            }
            Map<String, Object> response = profileService.authenticateAndGenerateToken(authDTO);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Login failed: " + e.getMessage()));
        }
    }

    @GetMapping("/activate")
    public ResponseEntity<String> activate(@RequestParam String token) {
        boolean isActivated = profileService.activateProfile(token);
        if (isActivated) {
            return ResponseEntity.ok("Profile activated successfully.");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Activation token not found or already used.");
        }
    }

    @GetMapping("/getProfile")
    public ResponseEntity<ProfileDTO> getProfile(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        ProfileDTO profileDTO = profileService.getPublicProfile(authentication.getName());
        return ResponseEntity.ok(profileDTO);
    }

}
