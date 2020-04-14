import { all, spawn } from "redux-saga/effects";
import pageSagas from "sagas/PageSagas";
import { fetchWidgetCardsSaga } from "./WidgetSidebarSagas";
import { watchActionSagas } from "./ActionSagas";
import widgetOperationSagas from "./WidgetOperationSagas";
import errorSagas from "./ErrorSagas";
import configsSagas from "./ConfigsSagas";
import applicationSagas from "./ApplicationSagas";
import { watchDatasourcesSagas } from "./DatasourcesSagas";
import initSagas from "./InitSagas";
import apiPaneSagas from "./ApiPaneSagas";
import userSagas from "./userSagas";
import pluginSagas from "./PluginSagas";
import orgSagas from "./OrgSagas";
import importedCollectionsSagas from "./CollectionSagas";
import providersSagas from "./ProvidersSaga";
import curlImportSagas from "./CurlImportSagas";
import modalSagas from "./ModalSagas";
import batchSagas from "./BatchSagas";

export function* rootSaga() {
  yield all([
    spawn(initSagas),
    spawn(pageSagas),
    spawn(fetchWidgetCardsSaga),
    spawn(watchActionSagas),
    spawn(widgetOperationSagas),
    spawn(errorSagas),
    spawn(configsSagas),
    spawn(watchDatasourcesSagas),
    spawn(applicationSagas),
    spawn(apiPaneSagas),
    spawn(userSagas),
    spawn(pluginSagas),
    spawn(orgSagas),
    spawn(importedCollectionsSagas),
    spawn(providersSagas),
    spawn(curlImportSagas),
    spawn(modalSagas),
    spawn(batchSagas),
  ]);
}
