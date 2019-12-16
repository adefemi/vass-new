import React, { useState, useEffect } from "react";
import { Input, Icon, Modal, Button } from "../../../../components/common";
import {
  fetchFileUploadStream,
  networkUrl,
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
          <img src={fetchFileUploadStream(item.icon)} alt="" />
        </div>
      ),
      name: item.name,
      action: (
        <span>
          <Icon
            name={"eye"}
            type={"feather"}
            onClick={() => showNetwork(item.networkId)}
            style={{ color: primaryColor, marginRight: "20px" }}
          />
          <Icon
            name={"edit"}
            type={"feather"}
            onClick={() =>
              props.history.push(`/admin/network/edit/${item.networkId}`)
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
    title: "Action", // Custom title components!
    dataIndex: "action",
    key: "action"
  }
];

function TabNetwork(props) {
  const [showNetwork, setShowNetwork] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [networks, setNetworks] = useState([]);
  const [activeNetworks, setActiveNetworks] = useState(null);

  const setActiveNetwork = id => {
    let activeChan = networks.filter(item => item.networkId === id)[0];
    setActiveNetworks(activeChan);
    setShowNetwork(true);
  };

  const onFetchData = (status, payload) => {
    if (status) {
      setNetworks(payload.data.data);
      setFetching(false);
    } else {
    }
  };

  useEffect(() => {
    axiosFunc("get", networkUrl("fetch"), null, "yes", onFetchData);
  }, []);
  return (
    <React.Fragment>
      <Modal
        onClose={() => setShowNetwork(false)}
        visible={showNetwork}
        footer={false}
      >
        {activeNetworks && (
          <React.Fragment>
            <div className="flex flex-wrap category-view-main">
              <div className="flex-left flex-1 padding-20 max-width-600">
                <div className="img-con">
                  <img
                    src={fetchFileUploadStream(activeNetworks.icon)}
                    alt=""
                  />
                </div>

                <table>
                  <tbody>
                    <tr>
                      <th>Name:</th>
                      <td>{activeNetworks.name}</td>
                    </tr>
                    <tr>
                      <th>Description:</th>
                      <td>{activeNetworks.description}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="padding-20">
              <Button
                onClick={() =>
                  props.history.push(
                    `/admin/network/edit/${activeNetworks.networkId}`
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
            placeholder={"filter networks"}
          />
          <div
            className="flex align-c create-comp"
            onClick={() => props.history.push("network/add")}
          >
            <div>
              <Icon type={"feather"} name={"plusCircle"} />
            </div>
            <div>Create Network</div>
          </div>
        </div>

        <br />
        <br />
        <Table
          loading={fetching}
          columns={columns}
          dataSource={fetching ? [] : data(props, networks, setActiveNetwork)}
        />
      </div>
    </React.Fragment>
  );
}

export default TabNetwork;
