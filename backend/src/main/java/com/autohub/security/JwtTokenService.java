package com.autohub.security;

import com.autohub.config.CookieProperties;
import com.autohub.config.JwtProperties;
import com.autohub.dto.security.AuthTokens;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.Map;

@Service
public class JwtTokenService {

    private final JwtProperties jwtProperties;
    private final CookieProperties cookieProperties;
    private final SecretKey secretKey;

    public JwtTokenService(JwtProperties jwtProperties, CookieProperties cookieProperties) {
        this.jwtProperties = jwtProperties;
        this.cookieProperties = cookieProperties;
        this.secretKey = Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtProperties.secret()));
    }

    public AuthTokens issueTokens(String subject, Map<String, Object> claims) {
        Instant now = Instant.now();
        String accessToken = buildToken(subject, now, jwtProperties.accessTokenTtlMinutes(), ChronoUnit.MINUTES, claims);
        String refreshToken = buildToken(subject, now, jwtProperties.refreshTokenTtlDays(), ChronoUnit.DAYS, Map.of("typ", "refresh"));
        return AuthTokens.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .build();
    }

    public void addAuthCookies(AuthTokens tokens, HttpServletResponse response) {
        response.addCookie(createCookie(SecurityConstants.ACCESS_TOKEN_COOKIE, tokens.getAccessToken(),
                jwtProperties.accessTokenTtlMinutes() * 60));
        response.addCookie(createCookie(SecurityConstants.REFRESH_TOKEN_COOKIE, tokens.getRefreshToken(),
                (int) ChronoUnit.DAYS.getDuration().getSeconds() * (int) jwtProperties.refreshTokenTtlDays()));
    }

    public String extractSubject(String token) {
        return Jwts.parserBuilder()
                .requireIssuer(jwtProperties.issuer())
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    public boolean isRefreshToken(String token) {
        return "refresh".equals(Jwts.parserBuilder()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .get("typ"));
    }

    private String buildToken(String subject, Instant now, long ttl, ChronoUnit unit, Map<String, Object> claims) {
        Instant expiry = now.plus(ttl, unit);
        return Jwts.builder()
                .setIssuer(jwtProperties.issuer())
                .setSubject(subject)
                .addClaims(claims)
                .setIssuedAt(Date.from(now))
                .setExpiration(Date.from(expiry))
                .signWith(secretKey, SignatureAlgorithm.HS256)
                .compact();
    }

    private Cookie createCookie(String name, String value, long maxAgeSeconds) {
        Cookie cookie = new Cookie(name, value);
        cookie.setHttpOnly(true);
        cookie.setSecure(cookieProperties.secure());
        cookie.setPath("/");
        if (cookieProperties.domain() != null && !cookieProperties.domain().isBlank()) {
            cookie.setDomain(cookieProperties.domain());
        }
        cookie.setMaxAge((int) maxAgeSeconds);
        return cookie;
    }
}
