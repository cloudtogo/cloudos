import Api from "./Api";
import { ContainerWidgetProps } from "../widgets/ContainerWidget";
import { ApiResponse } from "./ApiResponses";
import { WidgetProps } from "../widgets/BaseWidget";
import { RenderMode } from "../constants/WidgetConstants";
import { PageAction } from "../constants/ActionConstants";

export interface FetchPageRequest {
  pageId: string;
  renderMode: RenderMode;
}

export interface SavePageRequest {
  dsl: ContainerWidgetProps<WidgetProps>;
  layoutId: string;
  pageId: string;
}

export interface PageLayout {
  id: string;
  dsl: Partial<ContainerWidgetProps<any>>;
  actions: PageAction[];
}

export type FetchPageResponse = ApiResponse & {
  data: {
    id: string;
    name: string;
    applicationId: string;
    layouts: Array<PageLayout>;
  };
};

export interface SavePageResponse {
  pageId: string;
}

class PageApi extends Api {
  static url = "api/v1/pages";
  static getLayoutUpdateURL = (pageId: string, layoutId: string) => {
    return `api/v1/layouts/${layoutId}/pages/${pageId}`;
  };

  static fetchPage(pageRequest: FetchPageRequest): Promise<FetchPageResponse> {
    return Api.get(PageApi.url + "/" + pageRequest.pageId);
  }

  static savePage(savePageRequest: SavePageRequest): Promise<SavePageResponse> {
    const body = { dsl: savePageRequest.dsl };
    return Api.put(
      PageApi.getLayoutUpdateURL(
        savePageRequest.pageId,
        savePageRequest.layoutId,
      ),
      undefined,
      body,
    );
  }
}

export default PageApi;
