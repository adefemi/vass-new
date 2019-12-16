import React, { useState, Fragment, useEffect } from "react";
import {
  Button,
  Input,
  Select,
  Icon,
  Notification,
  Spinner
} from "../../../../components/common";
import { axiosFunc } from "../../../utils/helper";
import {
  payChannelUrl,
  revenueSharingUrl,
  secondaryColor
} from "../../../utils/data";
import { errorHandler } from "../../../../components/utils/helper";

function TabRevenueSharing(props) {
  const [revSharer, setRevShare] = useState([
    { title: "Aggregator", percentage: 0, disabled: true },
    { title: "provider", percentage: 0, disabled: true }
  ]);
  const [revInfo, setRevInfo] = useState([]);
  const [channel, setChannel] = useState("AIRTIME");
  const [zone, setZone] = useState("");
  const [airtimeArray, setAirTimeArray] = useState([]);
  const [gatewayArray, setGatewayArray] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [submit, setSubmit] = useState(false);

  const addRevSharer = () => {
    setRevInfo([...revInfo, { title: "", percentage: 0 }]);
  };

  const removeSharer = index => {
    let newSharer = revInfo.filter((item, id) => id !== index);
    setRevInfo(newSharer);
  };

  const onSubmit = (status, payload) => {
    setSubmit(false);
    if (status) {
      Notification.bubble({
        type: "success",
        content: "Revenue sharing Updated successfully"
      });
    } else {
      Notification.bubble({
        type: "error",
        content: errorHandler(payload)
      });
    }
  };

  const submitRev = () => {
    setSubmit(true);
    axiosFunc(
      "post",
      revenueSharingUrl(props.providerId ? "save" : "save/default"),
      {
        providerId: props.providerId ? props.providerId : "default",
        channel,
        channelType: zone,
        revenue: revInfo
      },
      "yes",
      onSubmit
    );
  };

  const onchange = (e, index) => {
    let newSharer = revInfo.filter((item, id) => {
      if (index === id) {
        let val = e.target.value;
        if (e.target.name.toLowerCase() === "percentage") {
          val = parseFloat(val);
        }
        item[e.target.name.toString()] = val;
      }
      return item;
    });
    setRevInfo(newSharer);
  };

  const onFetchData = (status, payload) => {
    if (status) {
      setAirTimeArray(
        payload.data.data.filter(item => item.type.toLowerCase() === "airtime")
      );
      setGatewayArray(
        payload.data.data.filter(
          item => item.type.toLowerCase() === "payment_gateway"
        )
      );
    } else {
    }
  };

  const onFetchRev = (status, payload) => {
    if (status) {
      if (payload.data.data && payload.data.data.length > 0) {
        setRevShare(payload.data.data);
      }
      setFetching(false);
    } else {
    }
  };

  useEffect(() => {
    axiosFunc("get", payChannelUrl("fetch"), null, "yes", onFetchData);
    axiosFunc(
      "get",
      `${revenueSharingUrl("fetch")}?providerId=default`,
      null,
      "yes",
      onFetchRev
    );
  }, []);

  const getRevShare = () => {
    let newRev;
    if (!zone) {
      return [];
    }
    newRev = revSharer.filter(
      item =>
        item.channel.toLowerCase() === channel.toLowerCase() &&
        item.channelType.toLowerCase() === zone.toLowerCase()
    );
    if (newRev.length > 0) {
      setRevInfo(newRev[0].revenue);
      return newRev[0].revenue;
    }

    setRevInfo([
      { title: "Aggregator", percentage: 0, disabled: true },
      { title: "provider", percentage: 0, disabled: true }
    ]);
    return [
      { title: "Aggregator", percentage: 0, disabled: true },
      { title: "provider", percentage: 0, disabled: true }
    ];
  };

  useEffect(() => {
    getRevShare();
  }, [zone]);

  const setOptionData = (data, targetValue = "", targetName = "") => {
    let returnArray = [];
    data.map((item, key) => {
      returnArray.push(
        <Select.Option key={key} value={item[targetValue]}>
          {item[targetName]}
        </Select.Option>
      );
      return null;
    });
    returnArray.unshift(
      <Select.Option value="">-- make a selection --</Select.Option>
    );
    return returnArray;
  };

  return (
    <React.Fragment>
      <div className="flex">
        <div className="v-tab">
          <li
            onClick={() => {
              setChannel("AIRTIME");
              setZone(null);
            }}
            className={channel === "AIRTIME" ? "active" : ""}
          >
            Airtime
          </li>
          <li
            onClick={() => {
              setChannel("PAYMENT_GATEWAY");
              setZone(null);
            }}
            className={channel === "PAYMENT_GATEWAY" ? "active" : ""}
          >
            Payment Gateway
          </li>
        </div>
        <div>
          {fetching ? (
            <div className={"padding-20"}>
              <Spinner color={secondaryColor} />
            </div>
          ) : (
            <React.Fragment>
              <div>
                {channel === "AIRTIME" && (
                  <Select onChange={e => setZone(e.target.value)} value={zone}>
                    {setOptionData(airtimeArray, "name", "name")}
                  </Select>
                )}
                {channel === "PAYMENT_GATEWAY" && (
                  <Select onChange={e => setZone(e.target.value)} value={zone}>
                    {setOptionData(gatewayArray, "name", "name")}
                  </Select>
                )}
              </div>
              <br />
              <br />
              <div className="content-heading">
                Revenue share stakeholders/percentage commission...
              </div>

              <br />

              <form
                onSubmit={e => {
                  e.preventDefault();
                  submitRev();
                }}
              >
                {zone &&
                  revInfo.map((item, index) => {
                    return (
                      <Fragment key={index}>
                        <br />
                        <div className="flex max-width-400 align-c">
                          <Input
                            onChange={e => onchange(e, index)}
                            name={"title"}
                            value={item.title || ""}
                            disabled={item.disabled}
                            required
                            style={{ width: "100%", marginRight: "20px" }}
                          />
                          <Input
                            onChange={e => onchange(e, index)}
                            name={"percentage"}
                            required
                            value={item.percentage || ""}
                            type={"number"}
                            iconRight={
                              <span
                                style={{
                                  padding: "0 10px",
                                  borderLeft: "1px solid #f5f5f5"
                                }}
                              >
                                %
                              </span>
                            }
                          />
                          <div
                            style={{
                              width: "30px",
                              marginLeft: "10px",
                              cursor: "pointer"
                            }}
                            onClick={() => removeSharer(index)}
                          >
                            <Icon size={20} name={"x"} type={"feather"} />
                          </div>
                        </div>
                      </Fragment>
                    );
                  })}

                {zone && (
                  <React.Fragment>
                    <br />
                    <div
                      className="flex align-c create-comp"
                      onClick={addRevSharer}
                    >
                      <div>
                        <Icon type={"feather"} name={"plusCircle"} />
                      </div>
                      <div>Add Revenue ShareHolder</div>
                    </div>
                    <br />
                    <Button type={"submit"} loading={submit} disabled={submit}>
                      Update
                    </Button>
                  </React.Fragment>
                )}
              </form>

              <br />
              <br />
            </React.Fragment>
          )}
        </div>
      </div>
    </React.Fragment>
  );
}

export default TabRevenueSharing;
