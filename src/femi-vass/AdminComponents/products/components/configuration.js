import React, { useState, useEffect } from "react";
import { Icon } from "../../../../components/common/icons";
import {
  primaryColor,
  productChannelConfigBaseUrl,
  productContentConfigBaseUrl,
  productContentConfigUrl,
  secondaryColor
} from "../../../utils/data";
import {
  Spinner,
  Card,
  FormGroup,
  Input,
  Select,
  Notification,
  TextAreaField
} from "../../../../components/common";
import { axiosFunc } from "../../../utils/helper";
import { errorHandler } from "../../../../components/utils/helper";

function Configuration(props) {
  const [activeTab, setActiveTab] = useState(1);
  const [contentConfig, setContentConfig] = useState({});
  const [fetchingChan, setFetchingChan] = useState(true);
  const [fetchingCont, setFetchingCont] = useState(true);
  const [channelConfig, setChannelConfig] = useState({});
  const [contentSub, setContentSub] = useState(false);

  const onFetchData = (status, payload) => {
    if (status) {
      setContentConfig(payload.data.data || {});
      setFetchingCont(false);
    } else {
    }
  };
  const onFetchData2 = (status, payload) => {
    if (status) {
      setChannelConfig(payload.data.data || {});
      setFetchingChan(false);
    } else {
    }
  };

  useEffect(() => {
    axiosFunc(
      "get",
      productContentConfigUrl(props.productId),
      null,
      null,
      onFetchData
    );
    axiosFunc(
      "get",
      productChannelConfigBaseUrl(`?productId=${props.productId}`),
      null,
      null,
      onFetchData2
    );
  }, []);

  const onUpdate = (status, payload) => {
    setContentSub(false);

    if (status) {
      Notification.bubble({
        type: "success",
        content: "Configuration Updated successfully"
      });
    } else {
    }
  };

  const updateConfig = type => {
    let url = productContentConfigBaseUrl();
    let data = contentConfig;
    if (type === "channel") {
      url = productChannelConfigBaseUrl();
      data = channelConfig;
    }

    setContentSub(true);
    axiosFunc(
      "post",
      url,
      { productId: props.productId, ...data },
      null,
      onUpdate
    );
  };

  return (
    <div>
      <br />
      {props.fetching ? (
        <Spinner color={secondaryColor} />
      ) : (
        <Card round heading={"Product Configuration"}>
          <div className="padding-20">
            <div className="tab-heading">
              <li
                className={`${activeTab === 1 && "active"}`}
                onClick={() => setActiveTab(1)}
              >
                Channels
              </li>
              <li
                className={`${activeTab === 2 && "active"}`}
                onClick={() => setActiveTab(2)}
              >
                Content
              </li>
            </div>

            <div className="tab-content">
              <div
                className={`tab-item ${activeTab === 1 && "active"}`}
                id={"tab-category"}
              >
                {fetchingChan ? (
                  <Spinner color={secondaryColor} />
                ) : (
                  <React.Fragment>
                    <div className="grid-2">
                      <FormGroup title={"SMS"}>
                        <Input
                          name={"accessKeyword"}
                          disabled
                          value={
                            (channelConfig.sms &&
                              channelConfig.sms.accessKeyword) ||
                            ""
                          }
                          onChange={e =>
                            setChannelConfig({
                              ...channelConfig,
                              sms: {
                                ...channelConfig.sms,
                                [e.target.name]: e.target.value
                              }
                            })
                          }
                          placeholder={"access keyword"}
                        />
                        <Input
                          name={"shortCode"}
                          value={
                            (channelConfig.sms &&
                              channelConfig.sms.shortCode) ||
                            ""
                          }
                          disabled
                          onChange={e =>
                            setChannelConfig({
                              ...channelConfig,
                              sms: {
                                ...channelConfig.sms,
                                [e.target.name]: e.target.value
                              }
                            })
                          }
                          placeholder={"short_code"}
                        />
                      </FormGroup>
                      <FormGroup title={"USSD"}>
                        <Input
                          name={"accessKeyword"}
                          disabled
                          value={
                            (channelConfig.ussd &&
                              channelConfig.ussd.accessKeyword) ||
                            ""
                          }
                          onChange={e =>
                            setChannelConfig({
                              ...channelConfig,
                              ussd: {
                                ...channelConfig.ussd,
                                [e.target.name]: e.target.value
                              }
                            })
                          }
                          placeholder={"access keyword"}
                        />
                        <Input
                          name={"shortCode"}
                          disabled
                          value={
                            (channelConfig.ussd &&
                              channelConfig.ussd.shortCode) ||
                            ""
                          }
                          onChange={e =>
                            setChannelConfig({
                              ...channelConfig,
                              ussd: {
                                ...channelConfig.ussd,
                                [e.target.name]: e.target.value
                              }
                            })
                          }
                          placeholder={"short_code"}
                        />
                        <Input
                          name={"url"}
                          disabled
                          value={
                            (channelConfig.ussd && channelConfig.ussd.url) || ""
                          }
                          onChange={e =>
                            setChannelConfig({
                              ...channelConfig,
                              ussd: {
                                ...channelConfig.ussd,
                                [e.target.name]: e.target.value
                              }
                            })
                          }
                          placeholder={"url"}
                        />
                      </FormGroup>
                    </div>
                    <div className="grid-2">
                      <FormGroup title={"IVR"}>
                        <Input
                          name={"did"}
                          disabled
                          value={
                            (channelConfig.ivr && channelConfig.ivr.did) || ""
                          }
                          onChange={e =>
                            setChannelConfig({
                              ...channelConfig,
                              ivr: {
                                ...channelConfig.ivr,
                                [e.target.name]: e.target.value
                              }
                            })
                          }
                          placeholder={"did"}
                        />
                        <Input
                          name={"dfmf"}
                          disabled
                          value={
                            (channelConfig.ivr && channelConfig.ivr.dfmf) || ""
                          }
                          onChange={e =>
                            setChannelConfig({
                              ...channelConfig,
                              ivr: {
                                ...channelConfig.ivr,
                                [e.target.name]: e.target.value
                              }
                            })
                          }
                          placeholder={"dfmf"}
                        />
                        <Input
                          name={"fieldId"}
                          value={
                            (channelConfig.ivr && channelConfig.ivr.fieldId) ||
                            ""
                          }
                          disabled
                          onChange={e =>
                            setChannelConfig({
                              ...channelConfig,
                              ivr: {
                                ...channelConfig.ivr,
                                [e.target.name]: e.target.value
                              }
                            })
                          }
                          placeholder={"fieldId"}
                        />
                      </FormGroup>
                      <FormGroup title={"WEB"}>
                        <Input
                          name={"type"}
                          disabled
                          value={
                            (channelConfig.web && channelConfig.web.type) || ""
                          }
                          onChange={e =>
                            setChannelConfig({
                              ...channelConfig,
                              web: {
                                ...channelConfig.web,
                                [e.target.name]: e.target.value
                              }
                            })
                          }
                          placeholder={"type"}
                        />
                        <Input
                          name={"url"}
                          disabled
                          value={
                            (channelConfig.web && channelConfig.web.url) || ""
                          }
                          onChange={e =>
                            setChannelConfig({
                              ...channelConfig,
                              web: {
                                ...channelConfig.web,
                                [e.target.name]: e.target.value
                              }
                            })
                          }
                          placeholder={"url"}
                        />
                      </FormGroup>
                    </div>
                    <br />
                    {/*<Button*/}
                    {/*  loading={contentSub}*/}
                    {/*  disabled={contentSub}*/}
                    {/*  onClick={() => updateConfig("channel")}*/}
                    {/*>*/}
                    {/*  Update*/}
                    {/*</Button>*/}
                  </React.Fragment>
                )}
              </div>
              <div
                className={`tab-item ${activeTab === 2 && "active"}`}
                id={"tab-category"}
              >
                {fetchingCont ? (
                  <Spinner color={secondaryColor} />
                ) : (
                  <React.Fragment>
                    <React.Fragment>
                      <div className="heading-content">Delivery Method</div>
                      <div className="divider" />
                      <br />
                      <div className="grid-3">
                        <FormGroup title={"name"}>
                          <Input
                            name={"name"}
                            disabled
                            value={
                              (contentConfig.deliveryMethod &&
                                contentConfig.deliveryMethod.name) ||
                              ""
                            }
                            placeholder={"Input name"}
                            onChange={e =>
                              setContentConfig({
                                ...contentConfig,
                                deliveryMethod: {
                                  ...contentConfig.deliveryMethod,
                                  [e.target.name]: e.target.value
                                }
                              })
                            }
                          />
                        </FormGroup>
                        <FormGroup title={"type"}>
                          <Select
                            name={"type"}
                            disabled
                            value={
                              (contentConfig.deliveryMethod &&
                                contentConfig.deliveryMethod.type) ||
                              ""
                            }
                            placeholder={"Choose a type"}
                            onChange={e =>
                              setContentConfig({
                                ...contentConfig,
                                deliveryMethod: {
                                  ...contentConfig.deliveryMethod,
                                  [e.target.name]: e.target.value
                                }
                              })
                            }
                          >
                            <Select.Option value={"age"}>Age</Select.Option>
                          </Select>
                        </FormGroup>
                        <FormGroup title={"metric"}>
                          <Select
                            name={"metric"}
                            disabled
                            value={
                              (contentConfig.deliveryMethod &&
                                contentConfig.deliveryMethod.metric) ||
                              ""
                            }
                            placeholder={"Choose metric"}
                            onChange={e =>
                              setContentConfig({
                                ...contentConfig,
                                deliveryMethod: {
                                  ...contentConfig.deliveryMethod,
                                  [e.target.name]: e.target.value
                                }
                              })
                            }
                          >
                            <Select.Option value={"years"}>Years</Select.Option>
                            <Select.Option value={"months"}>
                              Months
                            </Select.Option>
                            <Select.Option value={"days"}>Days</Select.Option>
                            <Select.Option value={"hours"}>Hours</Select.Option>
                            <Select.Option value={"minutes"}>
                              Minutes
                            </Select.Option>
                          </Select>
                        </FormGroup>
                      </div>
                      <FormGroup title={"description"}>
                        <TextAreaField
                          name={"description"}
                          disabled
                          value={
                            (contentConfig.deliveryMethod &&
                              contentConfig.deliveryMethod.description) ||
                            ""
                          }
                          placeholder={"Choose metric"}
                          onChange={e =>
                            setContentConfig({
                              ...contentConfig,
                              deliveryMethod: {
                                ...contentConfig.deliveryMethod,
                                [e.target.name]: e.target.value
                              }
                            })
                          }
                        />
                      </FormGroup>
                    </React.Fragment>

                    <div className="max-width-400">
                      <FormGroup title={"delivery time"}>
                        <Input
                          name={"deliveryTime"}
                          disabled
                          value={contentConfig.deliveryTime || ""}
                          onChange={e =>
                            setContentConfig({
                              ...contentConfig,
                              [e.target.name]: e.target.value
                            })
                          }
                        />
                      </FormGroup>
                    </div>

                    <br />
                    <div className="heading-content">Sources</div>
                    <div className="divider" />
                    <br />
                    <div className="grid-4">
                      <FormGroup title={"SMS"}>
                        <Select
                          name={"sms"}
                          disabled
                          value={
                            (contentConfig.sources &&
                              contentConfig.sources.sms &&
                              contentConfig.sources.sms.type) ||
                            ""
                          }
                          placeholder={"Choose a type"}
                          onChange={e =>
                            setContentConfig({
                              ...contentConfig,
                              sources: {
                                ...contentConfig.sources,
                                [e.target.name]: {
                                  ...contentConfig.sources[e.target.name],
                                  type: e.target.value
                                }
                              }
                            })
                          }
                        >
                          <Select.Option value={"default"}>
                            Default
                          </Select.Option>
                          <Select.Option value={"custom"}>Custom</Select.Option>
                        </Select>
                      </FormGroup>
                      <FormGroup title={"USSD"}>
                        <Select
                          name={"ussd"}
                          disabled
                          value={
                            (contentConfig.sources &&
                              contentConfig.sources.ussd &&
                              contentConfig.sources.ussd.type) ||
                            ""
                          }
                          placeholder={"Choose a type"}
                          onChange={e =>
                            setContentConfig({
                              ...contentConfig,
                              sources: {
                                ...contentConfig.sources,
                                [e.target.name]: {
                                  ...contentConfig.sources[e.target.name],
                                  type: e.target.value
                                }
                              }
                            })
                          }
                        >
                          <Select.Option value={"default"}>
                            Default
                          </Select.Option>
                          <Select.Option value={"custom"}>Custom</Select.Option>
                        </Select>
                      </FormGroup>
                      <FormGroup title={"IVR"}>
                        <Select
                          name={"ivr"}
                          disabled
                          value={
                            contentConfig.sources
                              ? contentConfig.sources.ivr &&
                                contentConfig.sources.ivr.type
                              : ""
                          }
                          placeholder={"Choose a type"}
                          onChange={e =>
                            setContentConfig({
                              ...contentConfig,
                              sources: {
                                ...contentConfig.sources,
                                [e.target.name]: {
                                  ...contentConfig.sources[e.target.name],
                                  type: e.target.value
                                }
                              }
                            })
                          }
                        >
                          <Select.Option value={"default"}>
                            Default
                          </Select.Option>
                          <Select.Option value={"custom"}>Custom</Select.Option>
                        </Select>
                      </FormGroup>
                      <FormGroup title={"WEB"}>
                        <Select
                          name={"web"}
                          disabled
                          value={
                            contentConfig.sources
                              ? contentConfig.sources.web &&
                                contentConfig.sources.web.type
                              : ""
                          }
                          placeholder={"Choose a type"}
                          onChange={e =>
                            setContentConfig({
                              ...contentConfig,
                              sources: {
                                ...contentConfig.sources,
                                [e.target.name]: {
                                  ...contentConfig.sources[e.target.name],
                                  type: e.target.value
                                }
                              }
                            })
                          }
                        >
                          <Select.Option value={"default"}>
                            Default
                          </Select.Option>
                          <Select.Option value={"custom"}>Custom</Select.Option>
                        </Select>
                      </FormGroup>
                    </div>
                    <br />
                    {/*<Button*/}
                    {/*  loading={contentSub}*/}
                    {/*  disabled={contentSub}*/}
                    {/*  onClick={() => updateConfig("content")}*/}
                    {/*>*/}
                    {/*  Update*/}
                    {/*</Button>*/}
                  </React.Fragment>
                )}
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

export default Configuration;
