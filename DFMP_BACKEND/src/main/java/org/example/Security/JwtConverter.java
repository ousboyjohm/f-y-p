package org.example.Security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import org.example.Models.AppUser;
import org.springframework.stereotype.Component;
import org.springframework.security.core.GrantedAuthority;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.List;


@Component
public class JwtConverter {

    private final SecretKey key = Jwts.SIG.HS256.key().build();
    private final String ISSUER = "dfmp";
    private final int EXPIRATION_MINUTES = 60;
    private final int EXPIRATION_MILLIS = EXPIRATION_MINUTES * 60 * 1000;


    public String getTokenFromUser(AppUser user) {

        List<String> authorities = user.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .toList();

        return Jwts.builder()
                .issuer(ISSUER)
                .subject(user.getUsername())
                .claim("authorities", user.getAuthorities().stream()
                        .map(GrantedAuthority::getAuthority)
                        .toList())

                .claim("user_id", user.getId())
                .expiration(new Date(System.currentTimeMillis() + EXPIRATION_MILLIS))
                .signWith(key)
                .compact();
    }

    public AppUser getUserFromToken(String token) {

        if (token == null || !token.startsWith("Bearer ")) {
            return null;
        }

        try {
            Jws<Claims> jws = Jwts.parser()
                    .requireIssuer(ISSUER)
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(token.substring(7));



            String username = jws.getPayload().getSubject();
            int appUserId = jws.getPayload().get("user_id", Integer.class);
            List<String> authorities = (List<String>) jws.getPayload().get("authorities", List.class);

            return new AppUser(appUserId, username, null, authorities);
        } catch (JwtException e) {
            e.printStackTrace();
        }

        return null;
    }
}
