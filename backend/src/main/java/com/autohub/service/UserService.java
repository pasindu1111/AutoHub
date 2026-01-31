package com.autohub.service;

import com.autohub.dto.user.UpdateProfileRequest;

import com.autohub.dto.auth.RegisterRequest;
import com.autohub.entity.AppUser;
import com.autohub.entity.Role;
import com.autohub.repository.AppUserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    private final AppUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    public UserService(AppUserRepository userRepository, PasswordEncoder passwordEncoder, EmailService emailService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
    }

    @Transactional
    public AppUser registerUser(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new IllegalArgumentException("Email already registered");
        }

        AppUser user = new AppUser();
        user.setEmail(request.email());
        user.setFullName(request.fullName());
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setRole(Role.CUSTOMER);

        AppUser savedUser = userRepository.save(user);

        // Send welcome email asynchronously (non-blocking)
        try {
            emailService.sendWelcomeEmail(savedUser.getEmail(), savedUser.getFullName());
        } catch (Exception e) {
            // Log error but don't fail registration if email fails
            System.err.println("Failed to send welcome email: " + e.getMessage());
        }

        return savedUser;
    }

    public AppUser getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    @Transactional
    public AppUser updateUserProfile(String email, UpdateProfileRequest request) {
        AppUser user = getUserByEmail(email);
        user.setFullName(request.fullName());
        return userRepository.save(user);
    }
}
