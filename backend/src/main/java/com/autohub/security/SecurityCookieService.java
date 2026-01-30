package com.autohub.security;

import com.autohub.config.CookieProperties;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;

@Component
public class SecurityCookieService {

    private final CookieProperties cookieProperties;

    public SecurityCookieService(CookieProperties cookieProperties) {
        this.cookieProperties = cookieProperties;
    }

    public void clearAuthCookies(HttpServletResponse response) {
        response.addCookie(expireCookie(SecurityConstants.ACCESS_TOKEN_COOKIE));
        response.addCookie(expireCookie(SecurityConstants.REFRESH_TOKEN_COOKIE));
    }

    private Cookie expireCookie(String name) {
        Cookie cookie = new Cookie(name, "");
        cookie.setHttpOnly(true);
        cookie.setSecure(cookieProperties.secure());
        cookie.setPath("/");
        if (cookieProperties.domain() != null && !cookieProperties.domain().isBlank()) {
            cookie.setDomain(cookieProperties.domain());
        }
        cookie.setMaxAge(0);
        return cookie;
    }
}
