import React, { useState, useEffect } from "react";
import { Input, Icon, Modal, Button } from "../../../../components/common";
import {
  fetchFileUploadStream,
  payChannelUrl,
  primaryColor,
  secondaryColor
} from "../../../utils/data";
import { axiosFunc } from "../../../utils/helper";
import { Table } from "antd";

const data = (props, providers, showNetwork) => {
  const newArray = [];

  providers.map((item, key) => {
    newArray.push({
      key,
      logo: (
        <div className={"img-con"}>
          <img src={fetchFileUploadStream(item.logo)} alt="" />
        </div>
      ),
      name: item.name,
      type: item.type,
      action: (
        <span>
          <Icon
            name={"eye"}
            type={"feather"}
            onClick={() => showNetwork(item.paymentChannelId)}
            style={{ color: primaryColor, marginRight: "20px" }}
          />
          <Icon
            name={"edit"}
            type={"feather"}
            onClick={() =>
              props.history.push(`/admin/channel/edit/${item.paymentChannelId}`)
            }
            style={{ color: secondaryColor, marginRight: "20px" }}
          />
        </span>
      )
    });
    return null;
  });
  return newArray;
};

const columns = [
  {
    title: "logo",
    dataIndex: "logo",
    key: "logo"
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name"
  },
  {
    title: "Type",
    dataIndex: "type",
    key: "type"
  },
  {
    title: "Action", // Custom title components!
    dataIndex: "action",
    key: "action"
  }
];

function TabPaymentChannel(props) {
  const [showNetwork, setShowNetwork] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [channels, setChannels] = useState([]);
  const [activeChannels, setActiveChannels] = useState(null);

  const setActiveChannel = id => {
    let activeChan = channels.filter(item => item.paymentChannelId === id)[0];
    setActiveChannels(activeChan);
    setShowNetwork(true);
  };

  const onFetchData = (status, payload) => {
    if (status) {
      setChannels(payload.data.data);
      setFetching(false);
    } else {
    }
  };

  useEffect(() => {
    axiosFunc("get", payChannelUrl("fetch"), null, "yes", onFetchData);
  }, []);

  return (
    <React.Fragment>
      <Modal
        onClose={() => setShowNetwork(false)}
        visible={showNetwork}
        footer={false}
      >
        {activeChannels && (
          <React.Fragment>
            <div className="flex flex-wrap category-view-main">
              <div className="flex-left flex-1 padding-20 max-width-600">
                <div className="img-con">
                  <img
                    src={fetchFileUploadStream(activeChannels.logo)}
                    alt=""
                  />
                </div>

                <table>
                  <tbody>
                    <tr>
                      <th>Name:</th>
                      <td>{activeChannels.name}</td>
                    </tr>
                    <tr>
                      <th>Type:</th>
                      <td>{activeChannels.type}</td>
                    </tr>
                    <tr>
                      <th>Description:</th>
                      <td>{activeChannels.description}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="padding-20">
              <Button
                onClick={() =>
                  props.history.push(
                    `/admin/channel/edit/${activeChannels.paymentChannelId}`
                  )
                }
              >
                <span style={{ marginRight: "5px" }}>Edit</span>{" "}
                <Icon name={"edit"} type={"feather"} />
              </Button>
            </div>
          </React.Fragment>
        )}
      </Modal>
      <div>
        <div className="flex align-c justify-between">
          <Input
            iconLeft={<Icon name={"search"} type={"feather"} />}
            onChange={() => null}
            placeholder={"filter channels"}
          />
          <div
            className="flex align-c create-comp"
            onClick={() => props.history.push("channel/add")}
          >
            <div>
              <Icon type={"feather"} name={"plusCircle"} />
            </div>
            <div>Create Channel</div>
          </div>
        </div>

        <br />
        <br />

        <Table
          loading={fetching}
          columns={columns}
          dataSource={fetching ? [] : data(props, channels, setActiveChannel)}
        />
      </div>
    </React.Fragment>
  );
}

export default TabPaymentChannel;
