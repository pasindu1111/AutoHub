package com.autohub.config;

import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableConfigurationProperties({JwtProperties.class, CookieProperties.class})
public class SecurityPropertiesConfig {
}
