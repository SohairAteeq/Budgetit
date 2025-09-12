package com.sohair.moneymanager.service;

import com.sohair.moneymanager.dto.AuthDTO;
import com.sohair.moneymanager.dto.ProfileDTO;
import com.sohair.moneymanager.entity.ProfileEntity;
import com.sohair.moneymanager.repository.ProfileRepository;
import com.sohair.moneymanager.util.JWTUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.authorization.AuthorizationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProfileService {
    private final ProfileRepository profileRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JWTUtil jwtUtil;

    public ProfileDTO registerProfile(ProfileDTO profileDTO){
        ProfileEntity newProfile = toEntity(profileDTO);
        newProfile.setActivationToken(UUID.randomUUID().toString());
        profileRepository.save(newProfile);

        // send email implementation
        String activationLink = "http://localhost:8080/api/v1.0/profile/activate?token=" + newProfile.getActivationToken();
        String subject = "Activate your Money Manager account";
        String body = "Click here to activate Money Manager account: " + activationLink;
        emailService.sendEmail(newProfile.getEmail(), subject, body);

        return toDTO(newProfile);
    }
    public ProfileEntity toEntity(ProfileDTO profileDTO){
        return ProfileEntity.builder()
                .id(profileDTO.getId())
                .fullName(profileDTO.getFullName())
                .email(profileDTO.getEmail())
                .password(passwordEncoder.encode(profileDTO.getPassword()))
                .profileImageUrl(profileDTO.getProfileImageUrl())
                .createdAt(profileDTO.getCreatedAt())
                .updatedAt(profileDTO.getUpdatedAt())
                .build();
    }

    public ProfileDTO toDTO(ProfileEntity profileEntity){
        return ProfileDTO.builder()
                .id(profileEntity.getId())
                .fullName(profileEntity.getFullName())
                .email(profileEntity.getEmail())
                .profileImageUrl(profileEntity.getProfileImageUrl())
                .createdAt(profileEntity.getCreatedAt())
                .updatedAt(profileEntity.getUpdatedAt())
                .build();
    }

    public boolean activateProfile(String activationToken) {
        return profileRepository.findByActivationToken(activationToken)
                .map(profile -> {
                    profile.setIsActive(true);
                    profileRepository.save(profile);
                    return true;
                })
                .orElse(false);
    }

    public boolean isAccountActive(String email){
        return profileRepository.findByEmail(email)
                .map(ProfileEntity::getIsActive)
                .orElse(false);
    }

    public ProfileEntity getCurrentProfile(String email) {
        if (email != null) {
            return profileRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Profile not found for email: " + email));
        }

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()
                || authentication.getPrincipal().equals("anonymousUser")) {
            throw new RuntimeException("No authenticated user found");
        }

        String loggedInEmail = authentication.getName(); // since UsernamePasswordAuthenticationToken uses email
        return profileRepository.findByEmail(loggedInEmail)
                .orElseThrow(() -> new RuntimeException("Profile not found for email: " + loggedInEmail));
    }

    public ProfileDTO getPublicProfile(String email) {
        ProfileEntity currentUser = null;
        if(email==null){
            currentUser = getCurrentProfile(email);
        }
        else {
            currentUser = profileRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Profile not found for email: " + email));
        }

        return ProfileDTO.builder()
                .id(currentUser.getId())
                .fullName(currentUser.getFullName())
                .email(currentUser.getEmail())
                .profileImageUrl(currentUser.getProfileImageUrl())
                .createdAt(currentUser.getCreatedAt())
                .updatedAt(currentUser.getUpdatedAt())
                .build();
    }

    public Map<String, Object> authenticateAndGenerateToken(AuthDTO authDTO) {
        try{
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(authDTO.getEmail(), authDTO.getPassword()));
            //Generate JWT token here
            String token = jwtUtil.generateToken(authDTO.getEmail());
            return Map.of(
                    "token", token,
                    "user", getCurrentProfile(authDTO.getEmail())
            );
        }
        catch (Exception e) {
            throw new RuntimeException("Authentication failed: " + e.getMessage());
        }
    }

    public ProfileEntity getCurrentProfile(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()
                || authentication.getPrincipal().equals("anonymousUser")) {
            throw new RuntimeException("No authenticated user found");
        }

        String loggedInEmail = authentication.getName(); // since UsernamePasswordAuthenticationToken uses email
        return profileRepository.findByEmail(loggedInEmail)
                .orElseThrow(() -> new RuntimeException("Profile not found for email: " + loggedInEmail));
    }

    public List<ProfileDTO> getAllProfiles(){
        List<ProfileEntity> profiles = profileRepository.findAll();
        return profiles.stream().map(this::toDTO).toList();
    }


}
