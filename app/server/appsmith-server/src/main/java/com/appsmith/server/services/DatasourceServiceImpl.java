package com.appsmith.server.services;

import com.appsmith.server.constants.FieldName;
import com.appsmith.server.domains.Datasource;
import com.appsmith.server.domains.Organization;
import com.appsmith.server.domains.User;
import com.appsmith.server.exceptions.AppsmithError;
import com.appsmith.server.exceptions.AppsmithException;
import com.appsmith.server.repositories.DatasourceRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.ReactiveMongoTemplate;
import org.springframework.data.mongodb.core.convert.MongoConverter;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Scheduler;

import javax.validation.Validator;
import javax.validation.constraints.NotNull;
import java.util.HashSet;
import java.util.Set;

import static com.appsmith.server.helpers.MustacheHelper.extractMustacheKeys;

@Slf4j
@Service
public class DatasourceServiceImpl extends BaseService<DatasourceRepository, Datasource, String> implements DatasourceService {

    private final DatasourceRepository repository;
    private final OrganizationService organizationService;
    private final SessionUserService sessionUserService;
    private final ObjectMapper objectMapper;

    @Autowired
    public DatasourceServiceImpl(Scheduler scheduler,
                                 Validator validator,
                                 MongoConverter mongoConverter,
                                 ReactiveMongoTemplate reactiveMongoTemplate,
                                 DatasourceRepository repository,
                                 OrganizationService organizationService,
                                 AnalyticsService analyticsService,
                                 SessionUserService sessionUserService,
                                 ObjectMapper objectMapper) {
        super(scheduler, validator, mongoConverter, reactiveMongoTemplate, repository, analyticsService);
        this.repository = repository;
        this.organizationService = organizationService;
        this.sessionUserService = sessionUserService;
        this.objectMapper = objectMapper;
    }

    @Override
    public Mono<Datasource> create(@NotNull Datasource datasource) {
        if (datasource.getId() != null) {
            return Mono.error(new AppsmithException(AppsmithError.INVALID_PARAMETER, FieldName.ID));
        }
        if (datasource.getPluginId() == null) {
            return Mono.error(new AppsmithException(AppsmithError.PLUGIN_ID_NOT_GIVEN));
        }
        if (datasource.getDatasourceConfiguration() == null) {
            return Mono.error(new AppsmithException(AppsmithError.NO_CONFIGURATION_FOUND_IN_DATASOURCE));
        }

        Mono<User> userMono = sessionUserService.getCurrentUser();

        Mono<Organization> organizationMono = userMono.flatMap(user -> organizationService.findByIdAndPluginsPluginId(user.getCurrentOrganizationId(), datasource.getPluginId()));

        //Add organization id to the datasource.
        Mono<Datasource> updatedDatasourceMono = organizationMono
                .map(organization -> {
                    datasource.setOrganizationId(organization.getId());
                    return datasource;
                });

        return organizationMono
                .switchIfEmpty(Mono.error(new AppsmithException(AppsmithError.PLUGIN_NOT_INSTALLED, datasource.getPluginId())))
                .then(updatedDatasourceMono)
                .flatMap(super::create);
    }

    @Override
    public Mono<Datasource> findByName(String name) {
        return repository.findByName(name);
    }

    @Override
    public Mono<Datasource> findById(String id) {
        return repository.findById(id);
    }

    @Override
    public Set<String> extractKeysFromDatasource(Datasource datasource) {
        if(datasource.getDatasourceConfiguration() == null) {
            return new HashSet<>();
        }
        // Convert the object to String as a preparation to send it to mustache extraction
        try {
            String datasourceConfigStr = objectMapper.writeValueAsString(datasource.getDatasourceConfiguration());
            return extractMustacheKeys(datasourceConfigStr);
        } catch (JsonProcessingException e) {
            log.error("Exception caught while extracting mustache keys from action configuration. ", e);
        }
        return new HashSet<>();
    }
}
