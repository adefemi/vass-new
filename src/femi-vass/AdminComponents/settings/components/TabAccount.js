import React, { useState, useEffect } from "react";
import {
  Button,
  Icon,
  Input,
  Spinner,
  TextAreaField,
  Notification,
  Modal
} from "../../../../components/common";
import {
  fileDepUrl,
  primaryColor,
  secondaryColor,
} from "../../../utils/data";
import AnimateHeight from "react-animate-height";
import { axiosFunc } from "../../../utils/helper";
import { errorHandler } from "../../../../components/utils/helper";
import moment from "moment";
import Table from "antd/lib/table";

const data = (
  props,
  providers,
  showAccount,
  setEdit,
  setUpdate,
  accountInfo,
  setContent,
  submit
) => {
  const newArray = [];

  providers.map((item, key) => {
    newArray.push({
      key,
      sn: item.requirementId,
      name: item.editMode ? (
        <Input
          onChange={setContent}
          name={"name"}
          placeholder={"name"}
          value={accountInfo.name}
          required
        />
      ) : (
        item.name
      ),
      description: item.editMode ? (
        <Input
          onChange={setContent}
          name={"name"}
          placeholder={"name"}
          value={accountInfo.description}
          required
        />
      ) : (
        <span>
          {item.description.substring(0, 30)}
          {item.description.length > 30 && "..."}
        </span>
      ),
      effectiveFrom: item.editMode ? (
        <Input
          onChange={setContent}
          name={"name"}
          placeholder={"name"}
          value={moment.unix(accountInfo.effectiveFrom).format("yyyy-MM-dd")}
          type={"date"}
          required
        />
      ) : (
        moment.unix(item.effectiveFrom).format("DD-MM-YYYY")
      ),
      action: (
        <span>
          <Icon
            name={"eye"}
            type={"feather"}
            onClick={() => showAccount(item.requirementId)}
            style={{ color: primaryColor, marginRight: "20px" }}
          />
          {item.editMode ? (
            submit ? (
              <span style={{ color: primaryColor, marginRight: "20px" }}>
                <Spinner color={primaryColor} />
              </span>
            ) : (
              <Icon
                name={"arrowRight"}
                type={"feather"}
                onClick={() => setUpdate(item.requirementId)}
                style={{ color: primaryColor, marginRight: "20px" }}
              />
            )
          ) : (
            <Icon
              name={"edit"}
              type={"feather"}
              onClick={() => setEdit(item.requirementId)}
              style={{ color: secondaryColor, marginRight: "20px" }}
            />
          )}
          {item.editMode && (
            <Icon
              name={"x"}
              type={"feather"}
              onClick={() => setEdit(item.requirementId, true)}
              style={{ color: secondaryColor, marginRight: "20px" }}
            />
          )}
        </span>
      )
    });
    return null;
  });
  return newArray;
};

const columns = [
  {
    Header: "#",
    dataIndex: "sn",
    key: "sn"
  },
  {
    Header: "Name",
    dataIndex: "name",
    key: "name"
  },
  {
    Header: "Description",
    dataIndex: "description",
    key: "description"
  },
  {
    Header: "Effective From", // Custom header components!
    dataIndex: "effectiveFrom",
    key: "effectiveFrom"
  },
  {
    Header: "Action", // Custom header components!
    dataIndex: "action",
    key: "action"
  }
];

function TabAccountSetup(props) {
  const [showAdd, setShowAdd] = useState(false);
  const [activeTab, setActiveTab] = useState("product-provider");
  const [serviceDep, setServiceDep] = useState([]);
  const [contentDep, setContentDep] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [submit, setSubmit] = useState(false);
  const [showAccount, setShowAccount] = useState(false);
  const [activeAccount, setActiveAccount] = useState(null);
  const [accountInfo, setAccountInfo] = useState({});

  const onContentFetch = (status, payload) => {
    if (status) {
      setFetching(false);
      let data = payload.data.data;
      setContentDep(data.filter(item => item.type === "content-provider"));
      setServiceDep(data.filter(item => item.type === "product-provider"));
    } else {
      Notification.bubble({
        type: "error",
        content: errorHandler(payload)
      });
    }
  };

  const changeContent = e => {
    setAccountInfo({ ...accountInfo, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    axiosFunc("get", fileDepUrl(), null, "yes", onContentFetch);
  }, []);

  const setEdit = (id, close = false) => {
    let activeChan = activeAccount;
    if (activeTab === "product-provider") {
      activeChan = serviceDep.filter(item => {
        if (item.requirementId === id) {
          if (close) {
            delete item["editMode"];
          } else {
            item.editMode = true;
          }
        }
        return item;
      });
      setServiceDep(activeChan);
    } else {
      activeChan = contentDep.filter(item => {
        if (item.requirementId === id) {
          if (close) {
            delete item["editMode"];
          } else {
            item.editMode = true;
          }
        }
        return item;
      });
      setContentDep(activeChan);
    }
    setAccountInfo(activeChan[0]);
  };

  const onUpdate = (status, payload) => {
    setSubmit(false);
    let activeChan = [];
    if (status) {
      Notification.bubble({
        type: "success",
        content: "Account Dependency Updated successfully"
      });
      if (payload.data.data.type === "product-provider") {
        activeChan = serviceDep.filter(item => {
          if (item.requirementId === accountInfo.id) {
            delete item["editMode"];
            return payload.data.data;
          }
          return item;
        });
        setServiceDep(activeChan);
      } else {
        activeChan = serviceDep.filter(item => {
          if (item.requirementId === accountInfo.id) {
            delete item["editMode"];
            return payload.data.data;
          }
          return item;
        });
        setContentDep(activeChan);
      }
      setAccountInfo({});
    } else {
      Notification.bubble({
        type: "error",
        content: errorHandler(payload)
      });
    }
  };

  const setUpdate = id => {
    setSubmit(true);
    axiosFunc(
      "post",
      fileDepUrl("/create"),
      { ...accountInfo, requirementId: id },
      "yes",
      onUpdate
    );
  };

  const onSubmit = (status, payload) => {
    setSubmit(false);
    if (status) {
      Notification.bubble({
        type: "success",
        content: "Account Dependency Added successfully"
      });
      if (payload.data.data.type === "product-provider") {
        payload.data.data.type = "product-provide";
        setServiceDep([...serviceDep, payload.data.data]);
      } else {
        setContentDep([...contentDep, payload.data.data]);
      }
      setAccountInfo({});
    } else {
      Notification.bubble({
        type: "error",
        content: errorHandler(payload)
      });
    }
  };

  const submitAccountInfo = () => {
    setSubmit(true);
    axiosFunc(
      "post",
      fileDepUrl("/create"),
      { ...accountInfo, type: activeTab },
      "yes",
      onSubmit
    );
  };

  const setActiveNetwork = id => {
    let activeChan = activeAccount;
    if (activeTab === "product-provider") {
      activeChan = serviceDep.filter(item => item.requirementId === id)[0];
    } else {
      activeChan = contentDep.filter(item => item.requirementId === id)[0];
    }

    setActiveAccount(activeChan);
    setShowAccount(true);
  };

  const onChangeAccountInfo = e => {
    setAccountInfo({ ...accountInfo, [e.target.name]: e.target.value });
  };

  return (
    <React.Fragment>
      <Modal
        onClose={() => setShowAccount(false)}
        visible={showAccount}
        footer={false}
      >
        {activeAccount && (
          <React.Fragment>
            <div className="flex flex-wrap category-view-main">
              <div className="flex-left flex-1 padding-20 max-width-600">
                <table>
                  <tbody>
                    <tr>
                      <th>Name:</th>
                      <td>{activeAccount.name}</td>
                    </tr>
                    <tr>
                      <th>Description:</th>
                      <td>{activeAccount.description}</td>
                    </tr>
                    <tr>
                      <th>Effective From:</th>
                      <td>
                        {moment
                          .unix(activeAccount.effectiveFrom)
                          .format("DD-MM-YYYY")}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </React.Fragment>
        )}
      </Modal>
      <div>
        <div className="flex">
          <div className="v-tab">
            <li
              className={activeTab === "product-provider" ? "active" : null}
              onClick={() => setActiveTab("product-provider")}
            >
              Service Provider
            </li>
          </div>

          <div className={"flex-1"}>
            {fetching ? (
              <Spinner color={secondaryColor} />
            ) : (
              <React.Fragment>
                <div
                  className="flex align-c create-comp"
                  onClick={() => {
                    setShowAdd(!showAdd);
                    setAccountInfo({});
                  }}
                >
                  <div>
                    <Icon type={"feather"} name={"plusCircle"} />
                  </div>
                  <div>Add Dependency</div>
                </div>
                <br />
                <AnimateHeight duration={300} height={showAdd ? "auto" : 0}>
                  <form
                    onSubmit={e => {
                      e.preventDefault();
                      submitAccountInfo();
                    }}
                  >
                    <div className="flex max-width-600">
                      <Input
                        onChange={onChangeAccountInfo}
                        placeholder={"Name"}
                        name={"name"}
                        required
                        value={accountInfo.name || ""}
                        className={"flex-1"}
                      />
                      <Input
                        onChange={onChangeAccountInfo}
                        type={"date"}
                        name={"effectiveFrom"}
                        required
                        value={accountInfo.effectiveFrom || ""}
                        placeholder={"Effective From"}
                        style={{ marginLeft: "10px" }}
                      />
                    </div>
                    <br />
                    <div className="max-width-600">
                      <TextAreaField
                        onChange={onChangeAccountInfo}
                        name={"description"}
                        required
                        value={accountInfo.description || ""}
                        placeholder={"Description"}
                      />
                    </div>
                    <br />
                    <Button type={"submit"} disabled={submit} loading={submit}>
                      Submit
                    </Button>
                  </form>
                </AnimateHeight>

                <br />
                {activeTab === "product-provider" && (
                  <Table
                    loading={fetching}
                    columns={columns}
                    dataSource={
                      fetching
                        ? []
                        : data(
                            props,
                            serviceDep,
                            setActiveNetwork,
                            setEdit,
                            setUpdate,
                            accountInfo,
                            changeContent,
                            submit
                          )
                    }
                  />
                )}
                {activeTab === "content-provider" && (
                  <Table
                    loading={fetching}
                    columns={columns}
                    dataSource={
                      fetching
                        ? []
                        : data(
                            props,
                            contentDep,
                            setActiveNetwork,
                            setEdit,
                            setUpdate,
                            accountInfo,
                            changeContent,
                            submit
                          )
                    }
                  />
                )}
              </React.Fragment>
            )}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default TabAccountSetup;
