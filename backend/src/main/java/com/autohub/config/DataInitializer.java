package com.autohub.config;

import com.autohub.entity.AppUser;
import com.autohub.entity.Role;
import com.autohub.repository.AppUserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.Optional;

/**
 * DataInitializer - Ensures admin user exists with correct credentials
 * 
 * This component runs on application startup and:
 * 1. Checks if admin@autohub.com exists
 * 2. If exists: Updates password to correct BCrypt hash and ensures role is
 * ADMIN
 * 3. If not exists: Creates new admin user
 * 
 * This ensures login always works even if DB is corrupted
 */
@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    // Admin credentials
    private static final String ADMIN_EMAIL = "itspasinduhimal@gmail.com";
    private static final String ADMIN_FULL_NAME = "AutoHub Admin";
    private static final String ADMIN_RAW_PASSWORD = "admin123"; // ✅ Store raw password, encode dynamically

    private final AppUserRepository appUserRepository;
    private final PasswordEncoder passwordEncoder; // ✅ Inject the same encoder Spring Security uses

    public DataInitializer(AppUserRepository appUserRepository, PasswordEncoder passwordEncoder) {
        this.appUserRepository = appUserRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        log.info("═══════════════════════════════════════════════════════");
        log.info("           DATA INITIALIZER - Starting");
        log.info("═══════════════════════════════════════════════════════");

        initializeAdminUser();

        log.info("═══════════════════════════════════════════════════════");
        log.info("           DATA INITIALIZER - Complete");
        log.info("═══════════════════════════════════════════════════════");
    }

    /**
     * Initialize or update admin user
     * Ensures admin user always exists with correct credentials
     */
    private void initializeAdminUser() {
        log.info("🔍 Checking for admin user: {}", ADMIN_EMAIL);

        Optional<AppUser> existingAdmin = appUserRepository.findByEmail(ADMIN_EMAIL);

        if (existingAdmin.isPresent()) {
            // Admin exists - update to ensure correct credentials
            AppUser admin = existingAdmin.get();

            log.info("✅ Admin user found with ID: {}", admin.getId());
            log.info("🔄 Updating admin credentials to ensure login works...");

            // ✅ Generate FRESH BCrypt hash using the SAME encoder Spring Security uses
            String freshPasswordHash = passwordEncoder.encode(ADMIN_RAW_PASSWORD);
            admin.setPasswordHash(freshPasswordHash);

            // Ensure role is ADMIN (not CUSTOMER or USER)
            admin.setRole(Role.ADMIN);

            // Update full name if needed
            admin.setFullName(ADMIN_FULL_NAME);

            appUserRepository.save(admin);

            log.info("✅ Admin user UPDATED successfully");
            log.info("   Email: {}", admin.getEmail());
            log.info("   Role: {}", admin.getRole());
            log.info("   Password: Updated to correct BCrypt hash");
            log.info("   Hash preview: {}...", freshPasswordHash.substring(0, 20));

        } else {
            // Admin doesn't exist - create new one
            log.info("⚠️  Admin user NOT found - creating new admin user...");

            // ✅ Generate FRESH BCrypt hash
            String freshPasswordHash = passwordEncoder.encode(ADMIN_RAW_PASSWORD);

            AppUser newAdmin = new AppUser();
            newAdmin.setEmail(ADMIN_EMAIL);
            newAdmin.setPasswordHash(freshPasswordHash);
            newAdmin.setFullName(ADMIN_FULL_NAME);
            newAdmin.setRole(Role.ADMIN);
            newAdmin.setCreatedAt(Instant.now());

            AppUser savedAdmin = appUserRepository.save(newAdmin);

            log.info("✅ Admin user CREATED successfully");
            log.info("   ID: {}", savedAdmin.getId());
            log.info("   Email: {}", savedAdmin.getEmail());
            log.info("   Role: {}", savedAdmin.getRole());
            log.info("   Password: BCrypt hash set");
        }

        log.info("");
        log.info("🎉 Admin Login Credentials:");
        log.info("   Email: {}", ADMIN_EMAIL);
        log.info("   Password: {}", ADMIN_RAW_PASSWORD);
        log.info("   Role: ADMIN (becomes ROLE_ADMIN in Spring Security)");
        log.info("");
        log.info("🔐 Security Details:");
        log.info("   Hash Algorithm: BCrypt");
        log.info("   Work Factor: 10 (2^10 = 1024 iterations)");
        log.info("   Hash Format: $2a$10$[22 char salt][31 char hash]");
        log.info("");
    }

    /**
     * Optional: Initialize sample customer user for testing
     * Uncomment this method and call it from run() if needed
     */
    @SuppressWarnings("unused")
    private void initializeCustomerUser() {
        String customerEmail = "customer@autohub.com";
        String customerPasswordHash = "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy"; // password:
                                                                                                      // customer123

        Optional<AppUser> existingCustomer = appUserRepository.findByEmail(customerEmail);

        if (existingCustomer.isEmpty()) {
            log.info("🔍 Creating sample customer user: {}", customerEmail);

            AppUser customer = new AppUser();
            customer.setEmail(customerEmail);
            customer.setPasswordHash(customerPasswordHash);
            customer.setFullName("Customer User");
            customer.setRole(Role.CUSTOMER);
            customer.setCreatedAt(Instant.now());

            appUserRepository.save(customer);

            log.info("✅ Customer user created");
            log.info("   Email: {}", customerEmail);
            log.info("   Password: customer123");
            log.info("   Role: CUSTOMER");
        } else {
            log.info("✅ Customer user already exists: {}", customerEmail);
        }
    }
}
