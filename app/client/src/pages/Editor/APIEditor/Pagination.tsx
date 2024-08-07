import React from "react";
import styled from "styled-components";

import DynamicTextField from "components/editorComponents/form/fields/DynamicTextField";
import FormRow from "components/editorComponents/FormRow";
import { PaginationType } from "entities/Action";
import RadioFieldGroup from "components/editorComponents/form/fields/RadioGroupField";
import { Classes, Text, TextType } from "design-system-old";
import { Button } from "design-system";
import type { EditorTheme } from "components/editorComponents/CodeEditor/EditorConfig";
import { CodeEditorBorder } from "components/editorComponents/CodeEditor/EditorConfig";
import { GifPlayer } from "design-system-old";
import thumbnail from "assets/icons/gifs/thumbnail.png";
import configPagination from "assets/icons/gifs/config_pagination.gif";

interface PaginationProps {
  actionName: string;
  onTestClick: (test?: "PREV" | "NEXT") => void;
  paginationType: PaginationType;
  theme?: EditorTheme;
}
const PaginationFieldWrapper = styled.div`
  display: flex;
  margin-bottom: ${(props) => props.theme.spaces[5]}px;
  margin-left: ${(props) => props.theme.spaces[11] + 2}px;
  width: 420px;
  button {
    margin-left: ${(props) => props.theme.spaces[5]}px;
  }
`;

const Step = styled(Text)`
  display: block;
  margin-bottom: ${(props) => props.theme.spaces[5]}px;
  color: var(--ads-v2-color-fg);
  margin-left: ${(props) => props.theme.spaces[11] + 2}px;
`;

const StepTitle = styled.div`
  display: flex;
  margin-bottom: ${(props) => props.theme.spaces[4]}px;
  span {
    color: var(--ads-v2-color-fg);
  }
`;

const PaginationTypeView = styled.div`
  margin-left: 28px;
  display: flex;
  justify-content: space-between;
  margin-bottom: ${(props) => props.theme.spaces[11]}px;
`;

const PaginationSection = styled.div`
  display: flex;
  padding: var(--ads-v2-spaces-4) 0 0 0;
`;

const Example = styled(Text)`
  display: block;
  margin-left: ${(props) => props.theme.spaces[11] + 2}px;
  margin-bottom: ${(props) => props.theme.spaces[3]}px;
  color: var(--ads-v2-color-fg);
`;

const BindingKey = styled.div`
  padding: ${(props) => props.theme.spaces[1] - 2}px
    ${(props) => props.theme.spaces[1]}px;
  margin-left: ${(props) => props.theme.spaces[11] + 2}px;
  width: fit-content;
  span {
    color: var(--ads-v2-color-fg);
  }
  background: var(--ads-v2-color-bg);
`;

const GifContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  img {
    width: 320px;
    height: 161px;
  }

  .${Classes.TEXT} {
    margin-top: 12px;
  }
`;

export default function Pagination(props: PaginationProps) {
  return (
    <PaginationSection>
      <FormRow>
        <RadioFieldGroup
          className="t--apiFormPaginationType"
          name="actionConfiguration.paginationType"
          options={[
            {
              label: "不分页",
              value: PaginationType.NONE,
            },
            {
              label: "使用表格页号分页",
              value: PaginationType.PAGE_NO,
            },
            {
              label: "上一页下一页",
              value: PaginationType.URL,
            },
          ]}
          placeholder="Method"
          rows={3}
          selectedOptionElements={[
            null,
            <PaginationTypeView key={PaginationType.PAGE_NO}>
              <div>
                <StepTitle>
                  <Text type={TextType.P1}>1. 配置表格分页</Text>
                </StepTitle>
                <Step type={TextType.P1}>1. 打开服务端分页</Step>
                <Step type={TextType.P1}>2. 配置 OnPageChange 动作</Step>
                <StepTitle>
                  <Text type={TextType.P1}>2. 配置请求参数</Text>
                </StepTitle>
                <Step style={{ width: "336px" }} type={TextType.P1}>
                  1. 在你的请求头或者请求参数中配置 UsersTable 的页号
                </Step>
                <Example type={TextType.P2}>
                  例如：<i>pageNo</i> 或者其他类似值
                </Example>
                <BindingKey>
                  <Text type={TextType.P2}>{"{{UsersTable.pageNo}}"}</Text>
                </BindingKey>
              </div>
              <GifContainer>
                <GifPlayer gif={configPagination} thumbnail={thumbnail} />
                <Text type={TextType.P3}>1. 如何配置表格分页</Text>
              </GifContainer>
            </PaginationTypeView>,
            <PaginationTypeView key={PaginationType.URL}>
              <div>
                <StepTitle>
                  <Text type={TextType.P1}>1. 配置表格分页</Text>
                </StepTitle>
                <Step type={TextType.P1}>1. 打开服务端分页</Step>
                <Step type={TextType.P1}>2. 配置 OnPageChange 动作</Step>
                <StepTitle>
                  <Text type={TextType.P1}>2. 配置请求参数</Text>
                </StepTitle>
                <Step type={TextType.P1}>配置上一页、下一页 url </Step>
                <Step type={TextType.P1}>上一页 url</Step>
                <PaginationFieldWrapper
                  data-location-id={btoa("actionConfiguration.prev")}
                >
                  <DynamicTextField
                    border={CodeEditorBorder.ALL_SIDE}
                    className="t--apiFormPaginationPrev"
                    evaluatedPopUpLabel="Previous Url"
                    fill={!!true}
                    focusElementName={`${props.actionName}.actionConfiguration.prev`}
                    height="100%"
                    name="actionConfiguration.prev"
                    theme={props.theme}
                  />
                  <Button
                    className="t--apiFormPaginationPrevTest"
                    kind="secondary"
                    onClick={() => {
                      props.onTestClick("PREV");
                    }}
                    size="md"
                  >
                    Test
                  </Button>
                </PaginationFieldWrapper>
                <Step type={TextType.P1}>下一页 url</Step>
                <PaginationFieldWrapper
                  data-location-id={btoa("actionConfiguration.next")}
                >
                  <DynamicTextField
                    border={CodeEditorBorder.ALL_SIDE}
                    className="t--apiFormPaginationNext"
                    evaluatedPopUpLabel="Next Url"
                    fill={!!true}
                    focusElementName={`${props.actionName}.actionConfiguration.next`}
                    height="100%"
                    name="actionConfiguration.next"
                    theme={props.theme}
                  />
                  <Button
                    className="t--apiFormPaginationNextTest"
                    kind="secondary"
                    onClick={() => {
                      props.onTestClick("NEXT");
                    }}
                    size="md"
                  >
                    Test
                  </Button>
                </PaginationFieldWrapper>
              </div>
              <GifContainer>
                <GifPlayer gif={configPagination} thumbnail={thumbnail} />
                <Text type={TextType.P3}>1. 如何配置表格分页</Text>
              </GifContainer>
            </PaginationTypeView>,
          ]}
        />
      </FormRow>
    </PaginationSection>
  );
}
