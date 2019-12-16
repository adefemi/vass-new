import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  Modal,
  Notification,
  Spinner,
  TextAreaField,
  Icon
} from "../../../components/common";
import {
  approveProviderUrl,
  bankAccountFetchUrl,
  licenseUrl,
  newProviderUrl,
  providerUrl,
  secondaryColor,
  shortCodeUrl,
  USERACCESSCONTROL,
  USERDATA,
  USERTOKEN
} from "../../utils/data";
import { Link } from "react-router-dom";
import { axiosFunc } from "../../utils/helper";
import { errorHandler } from "../../../components/utils/helper";
import TabRevenueSharing from "../settings/components/TabRevenue";
import AllSubAccounts from "./allSubAccounts";
import ResourceTab from "./components/ResoureTab";
import BasicTab from "./components/BasicTab";
import ProviderDashboard from "./components/providerDashboard";
import ProviderProducts from "./components/providerProducts";
import SubAccount from "./subAccount";
import TabBankAccount from "../settings/components/TabBankAccount";

function AccountView(props) {
  const getActiveId = () => {
    let activeUrl = props.history.location.pathname.split("/");
    return activeUrl[activeUrl.length - 1];
  };

  let user_data = JSON.parse(localStorage.getItem(USERDATA));

  const [activeTab, setActiveTab] = useState(1);
  const [activeTabMain, setActiveTabMain] = useState(
    user_data.role === "admin" ? 1 : 3
  );
  const [activeId] = useState(getActiveId());
  const [basicData, setBasicData] = useState(null);
  const [fetchBasic, setFetchBasic] = useState(true);
  const [license, setLicense] = useState(null);
  const [fetchLicense, setFetchLicense] = useState(true);
  const [shortCodes, setShortCodes] = useState(null);
  const [fetchShortCodes, setFetchShortCodes] = useState(true);
  const [submit, setSubmit] = useState(false);
  const [bankInfo, setBankInfo] = useState({});
  const [fetchingBank, setFetchingBank] = useState(true);
  const [bankAvailable, setBankAvailable] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [reason, setReason] = useState("");

  let user_access = JSON.parse(localStorage.getItem(USERACCESSCONTROL));
  const user_access_profile = user_access.sideBar.profile.data;
  user_access = user_access.sideBar.accounts.data.single_account;

  useEffect(() => {
    if (!user_access.status) {
      Notification.bubble({
        type: "error",
        content: "You don't have access to this page!!!"
      });
      props.history.goBack();
    } else {
      axiosFunc(
        "get",
        providerUrl(`providerId=${activeId}`),
        null,
        "yes",
        onFetchData
      );
      axiosFunc(
        "get",
        shortCodeUrl(`providerId=${activeId}`),
        null,
        "yes",
        onFetchShortCode
      );
      axiosFunc(
        "get",
        licenseUrl(`fetch?providerId=${activeId}`),
        null,
        "yes",
        onFetchLicense
      );
      axiosFunc(
        "get",
        bankAccountFetchUrl(`providerId=${activeId}`),
        null,
        "yes",
        onFetchBank
      );
    }
  }, []);

  const onFetchData = (status, payload) => {
    if (status) {
      let activeData = payload.data.data;

      setBasicData(activeData || {});
      setFetchBasic(false);
    } else {
    }
  };

  const onFetchShortCode = (status, payload) => {
    if (status) {
      let activeData = payload.data.data;

      setShortCodes(activeData);
      setFetchShortCodes(false);
    } else {
    }
  };

  const onFetchLicense = (status, payload) => {
    if (status) {
      let activeData = payload.data.data;

      setLicense(activeData);
      setFetchLicense(false);
    } else {
    }
  };

  const onFetchBank = (status, payload) => {
    if (status) {
      setFetchingBank(false);
      if (payload.data.data) {
        setBankAvailable(true);
        setBankInfo(payload.data.data);
      }
    } else {
    }
  };

  const onApproveComplete = (status, payload) => {
    setSubmit(false);
    if (status) {
      Notification.bubble({
        type: "success",
        content: "Approval Successful"
      });
      setBasicData({ ...basicData, status: "approve" });
    } else {
      Notification.bubble({
        type: "error",
        content: errorHandler(payload)
      });
    }
  };
  const onDisApproveComplete = (status, payload) => {
    setSubmit(false);
    if (status) {
      Notification.bubble({
        type: "success",
        content: "Operation success"
      });
      setTimeout(() => window.location.reload(), 500);
    } else {
      Notification.bubble({
        type: "error",
        content: errorHandler(payload)
      });
    }
  };

  const onApprove = () => {
    setSubmit(true);
    axiosFunc(
      "get",
      approveProviderUrl(activeId),
      null,
      "yes",
      onApproveComplete
    );
  };

  const onDisApprove = () => {
    setSubmit(true);
    axiosFunc(
      "get",
      approveProviderUrl(activeId, "reject", `&reason=${reason}`),
      null,
      "yes",
      onDisApproveComplete
    );
  };

  const approve = () => {
    Modal.confirm({
      title: "Approval Confirmation",
      content: "Do you want to proceed with this approval?",
      okText: "Proceed",
      onOK: onApprove
    });
  };

  const disapprove = () => {
    setShowConfirm(true);
  };

  const createNewAccountUrl = newProviderUrl(
    `${localStorage.getItem(USERTOKEN)}&providerId=${activeId}`
  );

  return (
    <React.Fragment>
      <Modal
        onClose={() => setShowConfirm(false)}
        title="Approval Removal Confirmation"
        visible={showConfirm}
        closable
        footer
        onOK={onDisApprove}
        okText="Remove"
      >
        <p>
          You are about to remove approval for this account, Do you want to
          proceed?
        </p>
        <div>
          <br />
          <TextAreaField
            value={reason}
            onChange={e => {
              setReason(e.target.value);
            }}
            placeholder={"provide reason"}
          />
        </div>
      </Modal>
      <div className={"max-width-1200 card-control"}>
        <div className="flex justify-between align-c">
          <div className="breadcrum">
            {user_data.role === "admin" && (
              <>
                {" "}
                <Link to={"/admin/account"}>
                  <span style={{ marginBottom: "5px" }}>
                    <Icon name={"chevronLeft"} type={"feather"} />
                  </span>
                  Back
                </Link>
                <Link
                  to={"/admin"}
                  className={activeTabMain === 1 && "active"}
                  onClick={e => {
                    e.preventDefault();
                    setActiveTabMain(1);
                  }}
                >
                  Dashboard
                </Link>
                <Link
                  to={"/admin"}
                  className={activeTabMain === 2 && "active"}
                  onClick={e => {
                    e.preventDefault();
                    setActiveTabMain(2);
                  }}
                >
                  Products
                </Link>
              </>
            )}

            <Link
              to={"/admin"}
              className={activeTabMain === 3 && "active"}
              onClick={e => {
                e.preventDefault();
                setActiveTabMain(3);
              }}
            >
              Account Approval
            </Link>
            {user_access.data.edit_account && (
              <a href={createNewAccountUrl} target="_blank">
                Edit Account
              </a>
            )}
          </div>
        </div>
        <p />
        {activeTabMain === 1 && (
          <ProviderDashboard
            {...props}
            activeSubscriber={activeId}
            basicData={basicData}
          />
        )}
        {activeTabMain === 2 && (
          <ProviderProducts
            {...props}
            activeSubscriber={activeId}
            basicData={basicData}
          />
        )}
        {activeTabMain === 3 && (
          <Card round>
            <div className="tab-heading">
              {user_access.data.basic_info && user_access_profile.basicInfo && (
                <li
                  className={`${activeTab === 1 && "active"}`}
                  onClick={() => setActiveTab(1)}
                >
                  Basic Information
                </li>
              )}
              {user_access.data.resource_usage && (
                <li
                  className={`${activeTab === 2 && "active"}`}
                  onClick={() => setActiveTab(2)}
                >
                  Resource Usage / SLA
                </li>
              )}
              {user_access.data.revenue && (
                <li
                  className={`${activeTab === 3 && "active"}`}
                  onClick={() => setActiveTab(3)}
                >
                  Revenue (per payment channel)
                </li>
              )}
              {user_access.data.bank_details && user_access_profile.bankDetail && (
                <li
                  className={`${activeTab === 4 && "active"}`}
                  onClick={() => setActiveTab(4)}
                >
                  Bank Details
                </li>
              )}
              {user_access_profile.subAccount && (
                <li
                  className={`${activeTab === 5 && "active"}`}
                  onClick={() => setActiveTab(5)}
                >
                  Sub-Accounts
                </li>
              )}
            </div>

            <div className="tab-content">
              {activeTab === 1 && (
                <div
                  className={`tab-item ${activeTab === 1 && "active"}`}
                  id={"tab-category"}
                >
                  <BasicTab
                    {...props}
                    dataBasic={basicData}
                    fetchingBasic={fetchBasic}
                    dataLicense={license}
                    fetchingLicense={fetchLicense}
                    dataShortCode={shortCodes}
                    fetchingShortCode={fetchShortCodes}
                  />
                </div>
              )}
              {activeTab === 2 && (
                <div
                  className={`tab-item ${activeTab === 2 && "active"}`}
                  id={"tab-category"}
                >
                  <ResourceTab
                    {...props}
                    providerId={activeId}
                    data={basicData}
                  />
                </div>
              )}
              {activeTab === 3 && (
                <div
                  className={`tab-item ${activeTab === 3 && "active"}`}
                  id={"tab-category"}
                >
                  <TabRevenueSharing
                    {...props}
                    global={false}
                    providerId={activeId}
                  />
                </div>
              )}
              {activeTab === 4 && (
                <div
                  className={`tab-item ${activeTab === 4 && "active"}`}
                  id={"tab-category"}
                >
                  {fetchingBank ? (
                    <Spinner color={secondaryColor} />
                  ) : (
                    <>
                      <TabBankAccount
                        bankAvailable={bankAvailable}
                        bankInfo={bankInfo}
                      />
                      {/*<BankAccounts providerId={activeId} />*/}
                    </>
                  )}
                </div>
              )}

              {activeTab === 5 && (
                <div className="padding-20">
                  <AllSubAccounts {...props} />
                </div>
              )}
            </div>

            {!fetchBasic && basicData && (
              <div className={"flex padding-20 float-r"}>
                {!basicData.status && user_access.data.decline && (
                  <Button
                    color={"danger"}
                    disabled={submit}
                    onClick={() => setShowConfirm(true)}
                  >
                    Decline
                  </Button>
                )}
                {!basicData.status && user_access.data.accept ? (
                  <Button
                    style={{ marginLeft: "10px" }}
                    disabled={submit}
                    loading={submit}
                    onClick={approve}
                  >
                    Approve
                  </Button>
                ) : (
                  <>
                    {user_access.data.accept && (
                      <Button
                        style={{ marginLeft: "10px" }}
                        color={"danger"}
                        disabled={submit}
                        loading={submit}
                        onClick={disapprove}
                      >
                        Remove Approval
                      </Button>
                    )}
                  </>
                )}
              </div>
            )}

            <div className="clear" />
          </Card>
        )}

        {activeTabMain === 4 && <SubAccount {...props} inline />}
      </div>
    </React.Fragment>
  );
}

export default AccountView;
