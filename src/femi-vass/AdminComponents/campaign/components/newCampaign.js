import React, { useEffect, useState } from "react";
import {
  Button,
  Checkbox,
  FormGroup,
  Input,
  Select,
  TextAreaField,
  Notification,
  Card,
  Spinner
} from "../../../../components/common";
import {
  campaignURL,
  fileUpload,
  networkUrl,
  productUrl,
  secondaryColor,
  USERDATA
} from "../../../utils/data";
import { axiosFunc } from "../../../utils/helper";
import { errorHandler } from "../../../../components/utils/helper";
import Divider from "antd/lib/divider";
import qs from "query-string";

let Option = Select.Option;

function NewCampaign(props) {
  const getActiveProduct = () => {
    return props.match.params.slug;
  };
  const query = qs.parse(props.location.search);
  const duplicate = query.campaignId;

  const [active, setActive] = useState("sms");
  const [submit, setSubmit] = useState(false);
  const [receptType, setRecieptType] = useState(1);
  const [payload, setPayload] = useState({});
  const [loadingIVR, setLoadingIVR] = useState(false);
  const [scheduleStatus, setScheduleStatus] = useState(true);
  const [activeProductId] = useState(getActiveProduct());
  const [activeProduct, setActiveProduct] = useState({
    data: null,
    fetching: true
  });
  const [networks, setNetworks] = useState({
    data: [],
    fetching: true
  });

  const onChange = e => {
    setPayload({ ...payload, [e.target.name]: e.target.value });
  };
  const onChangeFile = e => {
    setPayload({ ...payload, [e.target.name]: e.target.files[0] });
  };

  const onSave = (status, payload) => {
    setSubmit(false);
    if (status) {
      Notification.bubble({
        type: "success",
        content: "Campaign created successfully"
      });
      setPayload({});
    } else {
      Notification.bubble({
        type: "error",
        content: errorHandler(payload)
      });
    }
  };

  const onSubmit = () => {
    setSubmit(true);
    let userData = JSON.parse(localStorage.getItem(USERDATA));
    const contentData = payload;
    delete contentData["campaignId"];

    if (!contentData.phoneNumbers) {
      Notification.bubble({
        type: "error",
        content: "Provide Recipients..."
      });
      setSubmit(false);
      return;
    }

    let data = {
      ...contentData,
      channelType: active,
      productId: props.match.params.slug,
      providerId: userData.userId
    };
    if (receptType === 2) {
      let phoneNumbers = contentData.phoneNumbers.replace(/ /g, "").split(",");
      data = {
        ...data,
        phoneNumbers
      };
    } else {
      data = new FormData();
      data.append("phoneNumbers", payload.phoneNumbers);
      data.append("title", payload.title);
      data.append("message", payload.message);
      data.append("schedule", payload.schedule);
      data.append("channelType", active);
      data.append("productId", props.match.params.slug);
      data.append("providerId", userData.userId);
    }
    axiosFunc("post", campaignURL("create"), data, "yes", onSave);
  };

  const onSaveMain = (status, data) => {
    setLoadingIVR(false);
    if (status) {
      setPayload({
        ...payload,
        message: data.data.data.id
      });
    } else {
      Notification.bubble({
        type: "error",
        content: errorHandler(data)
      });
    }
  };

  const fileChanged = e => {
    let payload = new FormData();
    payload.append("file_url", e.target.files[0]);
    setLoadingIVR(true);
    axiosFunc("post", fileUpload, payload, "yes", onSaveMain);
  };

  useEffect(() => {
    axiosFunc(
      "get",
      productUrl(`?productId=${activeProductId}`),
      null,
      "yes",
      (status, data) => {
        if (status) {
          setActiveProduct({
            data: data.data.data,
            fetching: false
          });
        } else {
          Notification.bubble({
            type: "error",
            content: errorHandler(data)
          });
        }
      }
    );

    axiosFunc("get", networkUrl("fetch"), null, "yes", (status, data) => {
      if (status) {
        setNetworks({
          data: data.data.data,
          fetching: false
        });
      } else {
        Notification.bubble({
          type: "error",
          content: errorHandler(data)
        });
      }
    });

    if (duplicate) {
      axiosFunc(
        "get",
        campaignURL(`?campaignId=${duplicate}`),
        null,
        "yes",
        (status, payload) => {
          if (status) {
            const _tempData = payload.data.data;
            setPayload({
              ..._tempData,
              title: `${_tempData.title} -copy`,
              message: `${_tempData.message} -copy`,
              phoneNumbers: _tempData.phoneNumbers.join()
            });
            setRecieptType(2);
          }
        }
      );
    }
  }, []);

  const getOptions = data => {
    let returnArray = [];
    data.map(item => {
      returnArray.push(<Option value={item.name}>{item.name}</Option>);
      return null;
    });
    returnArray.unshift(<Option value="">--select a network--</Option>);
    return returnArray;
  };

  return (
    <div className={"category-container max-width-1200"}>
      <br />
      {activeProduct.fetching ? (
        <div className="padding-20">
          <Spinner color="#999999" />
        </div>
      ) : !activeProduct.data ? (
        <div> The product you are looking for does not exist</div>
      ) : (
        <>
          <div className="heading-content">{activeProduct.data.name}</div>
          <br />
          <div className="breadcrum">
            <li className="link" onClick={() => props.history.goBack()}>
              Back
            </li>
            <li className="active">New campaign</li>
          </div>
          <Card round>
            <div className="padding-20">
              <div>
                <FormGroup title="Choose campaign type">
                  <Select
                    value={active}
                    onChange={e => setActive(e.target.value)}
                  >
                    <Option displayed={"IVR"} value={"ivr"}>
                      IVR
                    </Option>
                    <Option displayed={"SMS"} value={"sms"}>
                      SMS
                    </Option>
                    <Option displayed={"USSD"} value={"ussd"}>
                      USSD
                    </Option>
                  </Select>
                </FormGroup>
                <Divider />
                <form
                  onSubmit={e => {
                    e.preventDefault();
                    onSubmit();
                  }}
                >
                  <div className="grid-2">
                    <div>
                      <FormGroup title="Title">
                        <Input
                          placeholder="Enter campaign title"
                          name="title"
                          required
                          value={payload.title || ""}
                          onChange={onChange}
                        />
                      </FormGroup>
                      {active === "sms" || active === "ussd" ? (
                        <FormGroup title="Message">
                          <TextAreaField
                            required
                            placeholder="Enter campaign message"
                            name="message"
                            value={payload.message || ""}
                            onChange={onChange}
                          />
                        </FormGroup>
                      ) : (
                        <div>
                          <FormGroup title="Audio Input">
                            {loadingIVR && <Spinner color={secondaryColor} />}
                            <input type="file" onChange={fileChanged} />
                          </FormGroup>
                          <div className="info input-small-top">
                            Supported types includes: Mp3, WAV and AFF
                          </div>
                        </div>
                      )}
                      <FormGroup title="Network">
                        <Select
                          name="network"
                          required
                          value={payload.network || ""}
                          onChange={onChange}
                        >
                          {networks.fetching ? (
                            <Option value="">--loading--</Option>
                          ) : (
                            getOptions(networks.data)
                          )}
                        </Select>
                      </FormGroup>
                      <FormGroup title="Sender ID (optional)">
                        <Input
                          name="senderId"
                          value={payload.senderId || ""}
                          onChange={onChange}
                        />
                      </FormGroup>
                    </div>
                    <div>
                      <FormGroup
                        title={
                          <Checkbox
                            id={1}
                            checked={scheduleStatus}
                            onChange={e => {
                              setScheduleStatus(e.target.checked);
                            }}
                            label="Schedule (Date/Time)"
                          />
                        }
                      >
                        {scheduleStatus && (
                          <div class="grid-2">
                            <Input
                              type="date"
                              name="schedule"
                              value={payload.schedule || ""}
                              onChange={onChange}
                              required
                            />
                            <Input
                              type="time"
                              name="schedule_time"
                              value={payload.schedule_time || ""}
                              onChange={onChange}
                              required
                            />
                          </div>
                        )}
                      </FormGroup>
                      <div className="tab-heading">
                        <li
                          className={`${receptType === 1 && "active"}`}
                          onClick={() => setRecieptType(1)}
                        >
                          Upload CSV file
                        </li>
                        <li
                          className={`${receptType === 2 && "active"}`}
                          onClick={() => setRecieptType(2)}
                        >
                          Enter numbers
                        </li>
                      </div>
                      <br />
                      <br />
                      <div className="heading-content">Recipients</div>
                      <div className="divider" />
                      {receptType === 1 && (
                        <div>
                          <FormGroup title="">
                            <input
                              type="file"
                              onChange={onChangeFile}
                              name="phoneNumbers"
                            />
                          </FormGroup>
                          <div className="info input-small-top">
                            Supported types includes: CSV
                          </div>
                        </div>
                      )}
                      {receptType === 2 && (
                        <FormGroup>
                          <TextAreaField
                            placeholder="e.g: 0909390303030, 090302039930, 09018393939 ..."
                            name="phoneNumbers"
                            value={payload.phoneNumbers || ""}
                            onChange={onChange}
                          />
                        </FormGroup>
                      )}
                    </div>
                  </div>

                  <br />
                  <Button type="submit" loading={submit} disabled={submit}>
                    Submit
                  </Button>
                  <br />
                  <br />
                </form>
              </div>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}

export default NewCampaign;
