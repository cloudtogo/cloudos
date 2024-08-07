package com.appsmith.server.dtos.ce;

import com.appsmith.server.domains.OAuth2Authorization;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Data
public class UserProfileCE_DTO {
    String email;

    Set<String> workspaceIds;

    String username;

    String name;

    String gender;

    @JsonProperty(value = "isAnonymous")
    boolean isAnonymous;

    @JsonProperty(value = "isEnabled")
    boolean isEnabled;

    boolean isEmptyInstance = false;

    @JsonProperty("isSuperUser")
    boolean isSuperUser = false;

    @JsonProperty("isConfigurable")
    boolean isConfigurable = false;

    @JsonProperty("adminSettingsVisible")
    boolean adminSettingsVisible = false;

    @JsonProperty("isIntercomConsentGiven")
    boolean isIntercomConsentGiven = false;

    String photoId;

    String role;

    String useCase;

    boolean enableTelemetry = false;

    List<String> roles;

    List<String> groups;

    Map<String, Object> idToken = new HashMap<>();

    boolean cloudOSLogged;

    public boolean isAccountNonExpired() {
        return this.isEnabled;
    }

    public boolean isAccountNonLocked() {
        return this.isEnabled;
    }

    public boolean isCredentialsNonExpired() {
        return this.isEnabled;
    }

    private Set<OAuth2Authorization> authorizations;
}
