package com.autohub.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "security.cookie")
public record CookieProperties(
        String domain,
        boolean secure,
        String sameSite
) {
}
