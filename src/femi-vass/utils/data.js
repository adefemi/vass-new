export const primaryColor = "#36C4CE";
export const secondaryColor = "#023054";
export const dangerColor = "#da4e6a";

const REACT_APP_USERTOKEN = vas_token;
const REACT_APP_USERDATA = vas_data;
const REACT_APP_USERACCESSCONTROL = vas_access_control;

const REACT_APP_baseOnboardUrl = "http://staging-1.tm30.net:8093/";

const REACT_APP_baseEndpoint2 =
  "http://staging-1.tm30.net:8096/contents/api/v1/";
const REACT_APP_baseCampaign =
  "http://staging-1.tm30.net:8096/campaigns/api/v1/";
const REACT_APP_baseProductUrl =
  "http://staging-1.tm30.net:8096/products/api/v1/";
const REACT_APP_baseBillingUrl =
  "http://staging-1.tm30.net:8096/billings/api/v1/";
const REACT_APP_baseUserUrl = "http://staging-1.tm30.net:8096/users/api/v1/";
const REACT_APP_baseSubscriptionUrl =
  "http://staging-1.tm30.net:8096/subscriptions/api/v1/";
const REACT_APP_baseNotificationUrl = "http://staging-1.tm30.net:8096/api/";
const REACT_APP_baseFileUploadUrl =
  "http://staging-1.tm30.net:8096/files/v1/upload";

const REACT_APP_SupportUrl = "http://staging-1.tm30.net:8096/supports/api/v1/";
const REACT_APP_ProductOnBoardUrl = "product/create";
const REACT_APP_AccountOnBoardUrl = "provider/product/create";

const REACT_APP_SubscriberInterfaceBaseURL = "http://staging-1.tm30.net:8094/";

export const USERTOKEN = REACT_APP_USERTOKEN;
export const USERDATA = REACT_APP_USERDATA;
export const USERACCESSCONTROL = REACT_APP_USERACCESSCONTROL;

export const baseEndpoint2 = REACT_APP_baseEndpoint2;
export const baseCampaign = REACT_APP_baseCampaign;
export const baseNotification = REACT_APP_baseNotificationUrl;

export const baseProductUrl = REACT_APP_baseProductUrl;
export const baseBillingUrl = REACT_APP_baseBillingUrl;
export const SubscriberInterfaceBaseURL = REACT_APP_SubscriberInterfaceBaseURL;

export const baseUserUrl = REACT_APP_baseUserUrl;
export const baseSubscriptionUrl = REACT_APP_baseSubscriptionUrl;
export const baseFileUploadUrl = REACT_APP_baseFileUploadUrl;
export const supportUrl = REACT_APP_SupportUrl;

export const categoryUrl = baseProductUrl + "category";
export const productsUrl = baseProductUrl + "products?";

export const payChannelUrl = (type = "save") =>
  baseUserUrl + `settings/payments/channels/${type}`;

export const billingUrl = (type = "") => baseBillingUrl + type;

export const userUrl = (type = "") => baseUserUrl + type;

export const notificationUrl = (type = "") => baseNotification + type;

export const networkUrl = (type = "save") =>
  baseUserUrl + `settings/networks/${type}`;

export const invoiceStatusUrl = (type = "") =>
  baseBillingUrl + `invoices/status${type}`;

export const whiteListUrl = (type = "") => baseCampaign + `whitelists${type}`;

export const newSubscriptionUrl = (type = "") => baseSubscriptionUrl + type;

export const subAccountUrl = (type = "") => baseUserUrl + `sub-accounts${type}`;

export const subscriptionUrl2 = (type = "") => baseSubscriptionUrl + type;

export const subscriptionUrl = props => {
  let { dateFrom, dateTo, dataType, stepType, type, page, extra } = props;
  dateFrom = dateFrom || "2019-06-01";
  dataType = dataType || "subscribed";
  dateTo = dateTo || "2019-07-10";
  stepType = stepType || "daily";
  type = type || "count";
  page = page || 1;
  extra = extra || "";
  return (
    baseSubscriptionUrl +
    `counts?dateFrom=${dateFrom}&dateTo=${dateTo}&dataType=${dataType}&stepType=${stepType}&type=${type}&page=${page}&limit=10&${extra}`
  );
};

export const transactionUrl = (
  dateFrom = "2019-06-01",
  dateTo = "2019-07-10",
  stepType = "daily",
  type = "data",
  page = 1,
  keyword = ""
) =>
  baseBillingUrl +
  `transactions?dateFrom=${dateFrom}&dateTo=${dateTo}&stepType=${stepType}&type=${type}&page=${page}&limit=10&keyword=${keyword}`;

export const revenueSharingUrl = (type = "save") =>
  baseUserUrl + `settings/revenues/${type}`;

export const fileDepUrl = (type = "") =>
  baseUserUrl + `settings/requirements/files${type}`;

export const loginUrl = baseUserUrl + "auths/login";
export const providerUrl = (type = "") => baseUserUrl + "providers?" + type;
export const bankAccountUrl = () => baseBillingUrl + "settings/accounts/save";
export const bankAccountFetchUrl = (type = "") =>
  baseBillingUrl + "settings/accounts/fetch?" + type;
export const providerBaseUrl = (type = "") => baseUserUrl + "providers" + type;
export const approveProviderUrl = (prId, status = "approve", extra = "") =>
  baseUserUrl + `providers/status?providerId=${prId}&status=${status}${extra}`;
export const shortCodeUrl = (type = "") => baseUserUrl + "shortcodes?" + type;
export const licenseUrl = (type = "") => baseUserUrl + "licenses/" + type;
export const contentUrl = id => baseEndpoint2 + `service/${id}`;
export const productContentConfigUrl = id =>
  baseProductUrl + `configurations/contents?productId=${id}`;
export const planConfigUrl = (id = null) =>
  baseProductUrl + `plans${id ? `?productId=${id}` : ""}`;

export const subscribersUrl = (type = "") => baseUserUrl + "subscribers" + type;
export const subscriptionsUrl = (type = "") => baseSubscriptionUrl + type;

export const revenueUrl = (type = "") =>
  baseBillingUrl + "revenue/count" + type;

export const invoiceUrl = (type = "") => baseBillingUrl + "invoices/" + type;

export const invoiceCreateUrl = (type = "") =>
  baseBillingUrl + "invoices/create" + type;

export const invoiceFetchUrl = (type = "") =>
  baseBillingUrl + "invoices/fetch" + type;

export const walletTotalUrl = (type = "") =>
  baseBillingUrl + "wallets/sum" + type;

export const auditUrl = (type = "") => baseUserUrl + "audits" + type;

export const revenueSumUrl = (type = "") => baseBillingUrl + "sum" + type;

export const utilitiesUrl = (type = "") =>
  baseBillingUrl + "settings/utilities" + type;

export const productUrl = (type = "") => baseProductUrl + "products" + type;
export const productContentConfigBaseUrl = (type = "") =>
  baseProductUrl + "configurations/contents" + type;

export const productChannelConfigBaseUrl = (type = "") =>
  baseProductUrl + "configurations/channels" + type;

export const contentURL = (type = "") => baseEndpoint2 + "content" + type;

export const campaignURL = (type = "") => baseCampaign + type;

export const resetPasswordURL = (email, redirect = "") =>
  `${baseUserUrl}auths/reset/password?email=${email}&redirectUrl=${redirect}`;
export const changePasswordURL = `${baseUserUrl}auths/password/create`;

export const walletUrl = (contentId = null, type = null) =>
  baseBillingUrl +
  `wallets?${contentId ? `typeId=${contentId}` : ""}${
    type ? `&type=${type}` : ""
  }`;

export const contentByServiceURL = (type = "") =>
  baseEndpoint2 + "service/serviceid";

export const fileUpload = baseFileUploadUrl;

export const fetchFileUpload = id => baseFileUploadUrl + id;

export const zipkinUrl = (type = "") => REACT_APP_Zipkin_URL + type;

export const newProductUrl = token =>
  `${REACT_APP_baseOnboardUrl + REACT_APP_ProductOnBoardUrl}?token=${token}`;

export const newProviderUrl = token =>
  `${REACT_APP_baseOnboardUrl + REACT_APP_AccountOnBoardUrl}?token=${token}`;

export const fetchFileUploadStream = id => `${baseFileUploadUrl}/stream/${id}`;

export const HTML_NAIRA = "&#8358;";

export const supportUrlMain = (type = "") => supportUrl + type;
