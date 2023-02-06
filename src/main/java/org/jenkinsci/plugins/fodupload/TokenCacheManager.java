package org.jenkinsci.plugins.fodupload;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import okhttp3.*;
import org.apache.commons.io.IOUtils;
import org.jenkinsci.plugins.fodupload.FodApi.IHttpClient;
import org.jenkinsci.plugins.fodupload.FodApi.ResponseContent;
import org.jenkinsci.plugins.fodupload.models.FodEnums;

import java.io.IOException;
import java.io.InputStream;
import java.util.Calendar;
import java.util.HashMap;
import java.util.Map;

public class TokenCacheManager {

    // delete tokens that are this much close to expiry (in seconds)
    private static int DELETE_TOKEN_BEFORE_SECONDS = 120;

    private HashMap<String, Token> tokens;

    public TokenCacheManager() {
        this.tokens = new HashMap<>();
    }

    public synchronized String getToken(IHttpClient client, String apiUrl, FodEnums.GrantType grantType, String scope, String id, String secret) throws IOException {
        String key = buildCacheKey(apiUrl, grantType, scope, id, secret);
        clearCache();

        if (!tokens.containsKey(key)) {
            Token token = retrieveToken(client, apiUrl, grantType, scope, id, secret);
            tokens.put(key, token);
            return token.value;
        }

        return tokens.get(key).value;
    }

    private String buildCacheKey(String apiUrl, FodEnums.GrantType grantType, String scope, String id, String secret) {
        return apiUrl + "$" + grantType + "$" + scope + "$" + id + "$" + secret;
    }

    private void clearCache() {
        for (Map.Entry<String, Token> token : tokens.entrySet()) {
            if (isCloseToExpiry(token.getValue())) {
                tokens.remove(token.getKey());
            }
        }
    }

    private Token retrieveToken(IHttpClient client, String apiUrl, FodEnums.GrantType grantType, String scope, String id, String secret) throws IOException {
        RequestBody formBody = null;
        if (grantType == FodEnums.GrantType.CLIENT_CREDENTIALS) {
            formBody = new FormBody.Builder()
                    .add("scope", scope)
                    .add("grant_type", "client_credentials")
                    .add("client_id", id)
                    .add("client_secret", secret)
                    .build();
        } else if (grantType == FodEnums.GrantType.PASSWORD) {
            formBody = new FormBody.Builder()
                    .add("scope", scope)
                    .add("grant_type", "password")
                    .add("username", id)
                    .add("password", secret)
                    .build();
        } else {
            throw new IOException("Invalid Grant Type");
        }

        Request request = new Request.Builder()
                .url(apiUrl + "/oauth/token")
                .post(formBody)
                .build();
        ResponseContent response = client.execute(request);

        if (!response.isSuccessful())
            throw new IOException("Unexpected code " + response);

        String content = response.bodyContent();

        if (content == null || content.isEmpty())
            throw new IOException("Unexpected body to be null");

        JsonParser parser = new JsonParser();
        JsonObject obj = parser.parse(content).getAsJsonObject();
        Calendar expiryTime = Calendar.getInstance();

        expiryTime.add(Calendar.SECOND, obj.get("expires_in").getAsInt());

        return new Token(obj.get("access_token").getAsString(), expiryTime);
    }

    private Boolean isCloseToExpiry(Token token) {
        return token.expiry.getTimeInMillis() - Calendar.getInstance().getTimeInMillis() < 1000L * DELETE_TOKEN_BEFORE_SECONDS;
    }

    private static class Token {
        private String value;
        private Calendar expiry;

        public Token(String value, Calendar expiry) {
            this.value = value;
            this.expiry = expiry;
        }
    }
}
