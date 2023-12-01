import { PluginType } from "entities/Action";
import type { Datasource } from "entities/Datasource";

export const DB_NOT_SUPPORTED = [PluginType.REMOTE, PluginType.SAAS];

export const getUserPreferenceFromStorage = () => {
  return "true";
};

export const getCurrentEditingEnvID = () => {
  // Get the values of environment ID being edited
  return getCurrentEnvironment();
};

// function to get the current environment from the URL
export const getCurrentEnvironment = () => {
  return "unused_env";
};

// function to get the current environment from the URL
export const getCurrentEnvName = () => {
  return "";
};

// function to check if the datasource is created for the current environment
export const isStorageEnvironmentCreated = (
  datasource: Datasource | null,
  environment?: string,
) => {
  !environment && (environment = getCurrentEnvironment());
  return (
    !!datasource &&
    datasource.hasOwnProperty("datasourceStorages") &&
    !!datasource.datasourceStorages &&
    datasource.datasourceStorages.hasOwnProperty(environment) &&
    datasource.datasourceStorages[environment].hasOwnProperty("id") &&
    datasource.datasourceStorages[environment].hasOwnProperty(
      "datasourceConfiguration",
    )
  );
};

// function to check if the datasource is configured for the current environment
export const isEnvironmentConfigured = (
  datasource: Datasource | null,
  environment?: string,
) => {
  !environment && (environment = getCurrentEnvironment());
  const isConfigured =
    !!datasource &&
    !!datasource.datasourceStorages &&
    datasource.datasourceStorages[environment]?.isConfigured;
  return !!isConfigured ? isConfigured : false;
};

// function to check if the datasource is configured for any environment
export const doesAnyDsConfigExist = (
  datasource: Datasource | null,
  environment?: string,
) => {
  !environment && (environment = getCurrentEnvironment());
  let isConfigured = false;
  if (!!datasource && !!datasource.datasourceStorages) {
    const envsList = Object.keys(datasource.datasourceStorages);
    if (envsList.length === 0) {
      isConfigured = false;
    } else {
      // Allow user to create a query even though the config is not
      // there for the current environment
      isConfigured = true;
    }
  }
  return isConfigured;
};

// function to check if the datasource is valid for the current environment
export const isEnvironmentValid = (
  datasource: Datasource | null,
  environment?: string,
) => {
  !environment && (environment = getCurrentEnvironment());
  const isValid =
    datasource &&
    datasource.datasourceStorages &&
    datasource.datasourceStorages[environment]?.isValid;
  return isValid ? isValid : false;
};

export const onUpdateFilterSuccess = (id: string) => {
  return id;
};

/*
 * Functiont to check get the datasource configuration for current ENV
 */
export const getEnvironmentConfiguration = (
  datasource: Datasource | null,
  environment = getCurrentEnvironment(),
) => {
  return datasource?.datasourceStorages?.[environment]?.datasourceConfiguration;
};