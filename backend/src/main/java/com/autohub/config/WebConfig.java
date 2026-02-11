package com.autohub.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.io.File;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    private final String uploadDir;

    public WebConfig(@Value("${storage.upload-dir:uploads}") String uploadDir) {
        this.uploadDir = uploadDir;
    }

    @Override
    public void addResourceHandlers(@NonNull ResourceHandlerRegistry registry) {
        String path = new File(uploadDir).getAbsolutePath();

        // Normalize path separators for cross-platform compatibility
        String normalizedPath = path.replace("\\", "/");
        if (!normalizedPath.endsWith("/")) {
            normalizedPath += "/";
        }
        String location = "file:///" + normalizedPath;

        // Single handler for /uploads/** (accessed via /api/uploads/** due to
        // context-path)
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations(location);
    }
}