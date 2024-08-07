import React, { useEffect, useState } from "react";
import type { InjectedFormProps } from "redux-form";
import { reduxForm, formValueSelector } from "redux-form";
import { AUTH_LOGIN_URL } from "constants/routes";
import { SIGNUP_FORM_NAME } from "@appsmith/constants/forms";
import type { RouteComponentProps } from "react-router-dom";
import { useHistory, useLocation, withRouter } from "react-router-dom";
import { SpacedSubmitForm, FormActions } from "pages/UserAuth/StyledComponents";
import {
  SIGNUP_PAGE_TITLE,
  SIGNUP_PAGE_EMAIL_INPUT_PLACEHOLDER,
  SIGNUP_PAGE_PASSWORD_INPUT_PLACEHOLDER,
  SIGNUP_PAGE_LOGIN_LINK_TEXT,
  FORM_VALIDATION_EMPTY_PASSWORD,
  FORM_VALIDATION_INVALID_EMAIL,
  FORM_VALIDATION_INVALID_PASSWORD,
  SIGNUP_PAGE_SUBMIT_BUTTON_TEXT,
  ALREADY_HAVE_AN_ACCOUNT,
  createMessage,
  SIGNUP_PAGE_SUBTITLE,
  GOOGLE_RECAPTCHA_KEY_ERROR,
} from "@appsmith/constants/messages";
import FormTextField from "components/utils/ReduxFormTextField";
import ThirdPartyAuth from "pages/UserAuth/ThirdPartyAuth";
import { FormGroup } from "design-system-old";
import { Button, Link, Callout } from "design-system";
import { isEmail, isStrongPassword, isEmptyString } from "utils/formhelpers";

import type { SignupFormValues } from "pages/UserAuth/helpers";
import AnalyticsUtil from "utils/AnalyticsUtil";

import { SIGNUP_SUBMIT_PATH } from "@appsmith/constants/ApiConstants";
import { connect, useSelector } from "react-redux";
import type { AppState } from "@appsmith/reducers";
import PerformanceTracker, {
  PerformanceTransactionName,
} from "utils/PerformanceTracker";

import { SIGNUP_FORM_EMAIL_FIELD_NAME } from "@appsmith/constants/forms";
import { getAppsmithConfigs } from "@appsmith/configs";
import { useScript, ScriptStatus, AddScriptTo } from "utils/hooks/useScript";

import { getIsSafeRedirectURL } from "utils/helpers";
import Container from "pages/UserAuth/Container";
import { FormIcons } from "icons/FormIcons";
import {
  LoginForm,
  StyledEmailIcon,
  StyledEyeOffIcon,
  StyledEyeOnIcon,
} from "./Login";
import { message } from "antd";
import {
  getIsFormLoginEnabled,
  getTenantConfig,
  getThirdPartyAuths,
} from "@appsmith/selectors/tenantSelectors";
import Helmet from "react-helmet";
import { useFeatureFlag } from "utils/hooks/useFeatureFlag";
import { FEATURE_FLAG } from "@appsmith/entities/FeatureFlag";
import { getHTMLPageTitle } from "@appsmith/utils/BusinessFeatures/brandingPageHelpers";
import log from "loglevel";

declare global {
  interface Window {
    grecaptcha: any;
  }
}
const { googleRecaptchaSiteKey } = getAppsmithConfigs();

const validate = (values: SignupFormValues) => {
  const errors: SignupFormValues = {};
  if (!values.password || isEmptyString(values.password)) {
    errors.password = createMessage(FORM_VALIDATION_EMPTY_PASSWORD);
  } else if (!isStrongPassword(values.password)) {
    errors.password = createMessage(FORM_VALIDATION_INVALID_PASSWORD);
  }

  const email = values.email || "";
  if (!isEmptyString(email) && !isEmail(email)) {
    errors.email = createMessage(FORM_VALIDATION_INVALID_EMAIL);
  }
  return errors;
};

type SignUpFormProps = InjectedFormProps<
  SignupFormValues,
  { emailValue: string }
> &
  RouteComponentProps<{ email: string }> & { emailValue: string };

export function SignUp(props: SignUpFormProps) {
  const history = useHistory();
  const isFormLoginEnabled = useSelector(getIsFormLoginEnabled);
  useEffect(() => {
    if (!isFormLoginEnabled) {
      const search = new URL(window.location.href)?.searchParams?.toString();
      history.replace({
        pathname: AUTH_LOGIN_URL,
        search,
      });
    }

    AnalyticsUtil.logEvent("SIGNUP_REACHED", {
      referrer: document.referrer,
    });
  }, []);
  const { emailValue: email, error, pristine, submitting, valid } = props;
  const isFormValid = valid && email && !isEmptyString(email);
  const shouldDisableSignupButton = pristine || !isFormValid;
  const location = useLocation();
  const isBrandingEnabled = useFeatureFlag(
    FEATURE_FLAG.license_branding_enabled,
  );
  const tentantConfig = useSelector(getTenantConfig);
  const { instanceName } = tentantConfig;
  const htmlPageTitle = getHTMLPageTitle(isBrandingEnabled, instanceName);

  const recaptchaStatus = useScript(
    `https://www.google.com/recaptcha/api.js?render=${googleRecaptchaSiteKey.apiKey}`,
    AddScriptTo.HEAD,
  );

  let showError = false;
  let errorMessage = "";
  const queryParams = new URLSearchParams(location.search);
  if (queryParams.get("error")) {
    errorMessage = queryParams.get("error") || "";
    showError = true;
  }

  const signupURL = new URL(
    `/api/v1/` + SIGNUP_SUBMIT_PATH,
    window.location.origin,
  );
  const appId = queryParams.get("appId");
  if (appId) {
    signupURL.searchParams.append("appId", appId);
  } else {
    const redirectUrl = queryParams.get("redirectUrl");
    if (redirectUrl != null && getIsSafeRedirectURL(redirectUrl)) {
      signupURL.searchParams.append("redirectUrl", redirectUrl);
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formElement: HTMLFormElement = document.getElementById(
      "signup-form",
    ) as HTMLFormElement;
    if (
      googleRecaptchaSiteKey.enabled &&
      recaptchaStatus === ScriptStatus.READY
    ) {
      try {
        window.grecaptcha
          .execute(googleRecaptchaSiteKey.apiKey, {
            action: "submit",
          })
          .then(function (token: any) {
            if (formElement) {
              signupURL.searchParams.append("recaptchaToken", token);
              formElement.setAttribute("action", signupURL.toString());
              formElement.submit();
            }
          })
          .catch(() => {
            log.error(createMessage(GOOGLE_RECAPTCHA_KEY_ERROR));
          });
      } catch (e) {
        log.error(e);
      }
    } else {
      formElement && formElement.submit();
    }
  };

  const [isShowPassword, setIsShowPassword] = useState(false);
  const showPassword = () => {
    setIsShowPassword(!isShowPassword);
  };

  useEffect(() => {
    if (showError) {
      message.open({
        type: "error",
        duration: 5,
        content: errorMessage,
        className: "my-msg",
      });
    }
  }, []);

  return (
    <Container
      footer={null}
      subtitle={createMessage(SIGNUP_PAGE_SUBTITLE)}
      title={createMessage(SIGNUP_PAGE_TITLE)}
    >
      <Helmet>
        <title>{htmlPageTitle}</title>
      </Helmet>

      {isFormLoginEnabled && (
        <SpacedSubmitForm
          action={signupURL.toString()}
          id="signup-form"
          method="POST"
          onSubmit={(e: any) => handleSubmit(e)}
        >
          <FormGroup intent={error ? "danger" : "none"}>
            <LoginForm>
              <FormTextField
                autoFocus
                className="pp-height login-form"
                name="email"
                placeholder={createMessage(SIGNUP_PAGE_EMAIL_INPUT_PLACEHOLDER)}
                type="email"
              />
            </LoginForm>
            <StyledEmailIcon height={15} width={15} />
          </FormGroup>
          <FormGroup intent={error ? "danger" : "none"}>
            <LoginForm>
              <FormTextField
                className="pp-height"
                name="password"
                placeholder={createMessage(
                  SIGNUP_PAGE_PASSWORD_INPUT_PLACEHOLDER,
                )}
                type={isShowPassword ? "text" : "password"}
              />
            </LoginForm>
            {isShowPassword ? (
              <StyledEyeOnIcon
                height={15}
                onClick={() => setIsShowPassword(false)}
                width={15}
              />
            ) : (
              <StyledEyeOffIcon
                height={15}
                onClick={() => setIsShowPassword(true)}
                width={15}
              />
            )}
          </FormGroup>
          <FormActions>
            <Button
              className="pp-height pp-font"
              isDisabled={shouldDisableSignupButton}
              isLoading={submitting}
              kind="primary"
              onClick={() => {
                AnalyticsUtil.logEvent("SIGNUP_CLICK", {
                  signupMethod: "EMAIL",
                });
                PerformanceTracker.startTracking(
                  PerformanceTransactionName.SIGN_UP,
                );
              }}
              size="md"
              type="submit"
            >
              {createMessage(SIGNUP_PAGE_SUBMIT_BUTTON_TEXT)}
            </Button>
          </FormActions>
        </SpacedSubmitForm>
      )}
      {/* 底部提示 */}
      <div className="flex-middle myfont">
        {createMessage(ALREADY_HAVE_AN_ACCOUNT)}
        <Link
          className="t--sign-up t--signup-link pl-[var(--ads-v2\-spaces-3)] fs-16 a_link"
          kind="primary"
          target="_self"
          to={AUTH_LOGIN_URL}
        >
          {createMessage(SIGNUP_PAGE_LOGIN_LINK_TEXT)}
        </Link>
      </div>
    </Container>
  );
}

const selector = formValueSelector(SIGNUP_FORM_NAME);
export default connect((state: AppState, props: SignUpFormProps) => {
  const queryParams = new URLSearchParams(props.location.search);
  return {
    initialValues: {
      email: queryParams.get("email"),
    },
    emailValue: selector(state, SIGNUP_FORM_EMAIL_FIELD_NAME),
  };
}, null)(
  reduxForm<SignupFormValues, { emailValue: string }>({
    validate,
    form: SIGNUP_FORM_NAME,
    touchOnBlur: true,
  })(withRouter(SignUp)),
);
