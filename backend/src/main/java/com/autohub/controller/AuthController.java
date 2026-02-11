package com.autohub.controller;

import com.autohub.dto.ApiResponse;
import com.autohub.dto.auth.RegisterRequest;
import com.autohub.dto.auth.UserProfileResponse;
import com.autohub.dto.security.AuthTokens;
import com.autohub.entity.AppUser;
import com.autohub.security.JwtTokenService;
import com.autohub.security.SecurityCookieService;
import com.autohub.service.UserService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")  // ✅ FIXED: Removed duplicate /api prefix (context-path handles it)
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenService jwtTokenService;
    private final SecurityCookieService securityCookieService;
    private final UserService userService;

    public AuthController(AuthenticationManager authenticationManager,
                          JwtTokenService jwtTokenService,
                          SecurityCookieService securityCookieService,
                          UserService userService) {
        this.authenticationManager = authenticationManager;
        this.jwtTokenService = jwtTokenService;
        this.securityCookieService = securityCookieService;
        this.userService = userService;
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<Void>> login(@RequestBody LoginRequest request,
                                                   jakarta.servlet.http.HttpServletResponse response) {
        try {
            // ✅ VERIFIED: Raw password passed directly to authentication token (NOT hashed)
            // ✅ VERIFIED: AuthenticationManager called to verify credentials
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                        request.email(),      // ✅ Email from request
                        request.password()    // ✅ Raw password (BCrypt comparison done by AuthenticationManager)
                    )
            );
            
            // Extract role from authorities
            String role = authentication.getAuthorities().stream()
                    .findFirst()
                    .map(Object::toString)
                    .orElse("");
            
            // Generate JWT tokens with role claim
            AuthTokens tokens = jwtTokenService.issueTokens(authentication.getName(), Map.of("role", role));
            jwtTokenService.addAuthCookies(tokens, response);
            
            return ResponseEntity.ok(ApiResponse.success("Login successful", null));
            
        } catch (org.springframework.security.authentication.InternalAuthenticationServiceException e) {
            // ✅ ENHANCED: Specific logging for InternalAuthenticationServiceException
            // This usually indicates a UserDetailsService mapping error
            System.err.println("═════════════════════════════════════════════════════════");
            System.err.println("❌ CRITICAL ERROR: InternalAuthenticationServiceException");
            System.err.println("═════════════════════════════════════════════════════════");
            System.err.println("This error typically indicates:");
            System.err.println("  1. UserDetailsService threw an unexpected exception");
            System.err.println("  2. Database connection failed during user lookup");
            System.err.println("  3. Entity mapping error in AppUser or AppUserDetailsService");
            System.err.println("  4. NullPointerException in loadUserByUsername()");
            System.err.println("");
            System.err.println("Exception Details:");
            System.err.println("  Type: " + e.getClass().getName());
            System.err.println("  Message: " + e.getMessage());
            System.err.println("  Cause: " + (e.getCause() != null ? e.getCause().getClass().getName() : "None"));
            System.err.println("");
            System.err.println("Stack Trace:");
            e.printStackTrace();
            System.err.println("═════════════════════════════════════════════════════════");
            
            return ResponseEntity.status(500).body(
                ApiResponse.failure("Authentication service error. Please check server logs.")
            );
            
        } catch (org.springframework.security.authentication.BadCredentialsException e) {
            // ✅ ENHANCED: Specific logging for wrong password/username
            System.err.println("⚠️  Login Failed: Bad Credentials");
            System.err.println("   Email: " + request.email());
            System.err.println("   Reason: Invalid email or password");
            
            return ResponseEntity.status(401).body(
                ApiResponse.failure("Invalid email or password")
            );
            
        } catch (org.springframework.security.core.userdetails.UsernameNotFoundException e) {
            // ✅ ENHANCED: Specific logging for user not found
            System.err.println("⚠️  Login Failed: User Not Found");
            System.err.println("   Email: " + request.email());
            System.err.println("   Reason: No user with this email exists");
            
            return ResponseEntity.status(401).body(
                ApiResponse.failure("Invalid email or password")
            );
            
        } catch (org.springframework.security.authentication.DisabledException e) {
            // ✅ ENHANCED: Account disabled
            System.err.println("⚠️  Login Failed: Account Disabled");
            System.err.println("   Email: " + request.email());
            
            return ResponseEntity.status(401).body(
                ApiResponse.failure("Account is disabled")
            );
            
        } catch (org.springframework.security.authentication.LockedException e) {
            // ✅ ENHANCED: Account locked
            System.err.println("⚠️  Login Failed: Account Locked");
            System.err.println("   Email: " + request.email());
            
            return ResponseEntity.status(401).body(
                ApiResponse.failure("Account is locked")
            );
            
        } catch (org.springframework.security.authentication.AccountExpiredException e) {
            // ✅ ENHANCED: Account expired
            System.err.println("⚠️  Login Failed: Account Expired");
            System.err.println("   Email: " + request.email());
            
            return ResponseEntity.status(401).body(
                ApiResponse.failure("Account has expired")
            );
            
        } catch (org.springframework.security.authentication.CredentialsExpiredException e) {
            // ✅ ENHANCED: Password expired
            System.err.println("⚠️  Login Failed: Credentials Expired");
            System.err.println("   Email: " + request.email());
            
            return ResponseEntity.status(401).body(
                ApiResponse.failure("Password has expired")
            );
            
        } catch (Exception e) {
            // ✅ ENHANCED: Catch-all for unexpected errors
            System.err.println("═════════════════════════════════════════════════════════");
            System.err.println("❌ UNEXPECTED LOGIN ERROR");
            System.err.println("═════════════════════════════════════════════════════════");
            System.err.println("  Type: " + e.getClass().getName());
            System.err.println("  Message: " + e.getMessage());
            System.err.println("");
            System.err.println("Stack Trace:");
            e.printStackTrace();
            System.err.println("═════════════════════════════════════════════════════════");
            
            return ResponseEntity.status(500).body(
                ApiResponse.failure("An unexpected error occurred. Please check server logs.")
            );
        }
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<Void>> refresh(@CookieValue(name = "autohub_refresh", required = false) String refreshToken,
                                                     jakarta.servlet.http.HttpServletResponse response) {
        if (refreshToken == null || !jwtTokenService.isRefreshToken(refreshToken)) {
            return ResponseEntity.status(401).body(ApiResponse.failure("Invalid refresh token"));
        }
        String subject = jwtTokenService.extractSubject(refreshToken);
        AuthTokens tokens = jwtTokenService.issueTokens(subject, Map.of("typ", "access"));
        jwtTokenService.addAuthCookies(tokens, response);
        return ResponseEntity.ok(ApiResponse.success("Token refreshed", null));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(jakarta.servlet.http.HttpServletResponse response) {
        securityCookieService.clearAuthCookies(response);
        return ResponseEntity.ok(ApiResponse.success("Logged out", null));
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<Void>> register(@RequestBody @Valid RegisterRequest request) {
        try {
            userService.registerUser(request);
            return ResponseEntity.ok(ApiResponse.success("Registration successful", null));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.failure(e.getMessage()));
        }
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserProfileResponse>> getCurrentUser(
            @AuthenticationPrincipal UserDetails userDetails) {
        AppUser user = userService.getUserByEmail(userDetails.getUsername());
        UserProfileResponse profile = new UserProfileResponse(
                user.getId(),
                user.getEmail(),
                user.getFullName(),
                user.getRole()
        );
        return ResponseEntity.ok(ApiResponse.success("User profile retrieved", profile));
    }

    public record LoginRequest(
            @Email @NotBlank String email,
            @NotBlank String password
    ) {
    }
}
