import React, { useEffect, useState } from "react";
import { Divider } from "antd";
import {
  FormGroup,
  TextAreaField,
  Button,
  Notification,
  Upload,
  Spinner
} from "../../../../components/common";
import { axiosFunc } from "../../../utils/helper";
import {
  fetchFileUpload,
  fileUpload,
  primaryColor,
  userUrl
} from "../../../utils/data";
import { errorHandler } from "../../../../components/utils/helper";

function GeneralSettings(props) {
  const [activeTab, setActiveTab] = useState("sms");
  const [notificationId, setNotificationId] = useState(null);
  const [notificationData, setNotificationData] = useState({});
  const [fetching, setFetching] = useState(true);
  const [loading, setLoading] = useState(false);
  const [loadingLink, setLoadingLink] = useState(false);
  const changeData = e => {
    setNotificationData({
      ...notificationData,
      [e.target.name]: e.target.value
    });
  };

  useEffect(() => {
    if (!fetching) {
      setFetching(true);
      setNotificationData({});
      setNotificationId(null);
    }
    axiosFunc(
      "get",
      userUrl(`settings/notifications?type=${activeTab}`),
      null,
      "yes",
      (status, payload) => {
        if (status) {
          let activeData = payload.data.data[0];
          if (activeData) {
            setNotificationData(activeData.notification);
            setNotificationId(activeData.notificationId);
          }
          setFetching(false);
        } else {
        }
      }
    );
  }, [activeTab]);

  const onSubmit = e => {
    e.preventDefault();
    setLoading(true);
    let dataToSave = {
      type: activeTab,
      notificationId,
      notification: notificationData
    };

    axiosFunc(
      "post",
      userUrl("settings/notifications"),
      dataToSave,
      "yes",
      (status, payload) => {
        setLoading(false);
        if (status) {
          Notification.bubble({
            type: "success",
            content: "Notification saved successfully"
          });
        } else {
          Notification.bubble({
            type: "error",
            content: errorHandler(payload)
          });
        }
      }
    );
  };

  const imageUploaded = (e, type) => {
    setNotificationData({
      ...notificationData,
      [type]: e.data.id
    });
  };

  const getFileUrl = (e, id) => {
    e.preventDefault();
    setLoadingLink(true);
    axiosFunc(
      "get",
      fetchFileUpload(`/${id}`),
      null,
      "yes",
      (status, payload) => {
        if (status) {
          setLoadingLink(false);
          window.open(payload.data.data.file_url, "_blank");
        }
      }
    );
  };

  return (
    <div style={{ minHeight: 300 }}>
      <div className="heading-content">Generic Notification Messages</div>
      <br />
      <div className="tab-heading">
        <li
          className={`${activeTab === "sms" && "active"}`}
          onClick={() => setActiveTab("sms")}
        >
          SMS
        </li>
        <li
          className={`${activeTab === "ivr" && "active"}`}
          onClick={() => setActiveTab("ivr")}
        >
          IVR
        </li>
        <li
          className={`${activeTab === "web" && "active"}`}
          onClick={() => setActiveTab("ussd")}
        >
          USSD
        </li>
      </div>
      <Divider />
      {fetching ? (
        <Spinner color="#999" />
      ) : (
        <form onSubmit={onSubmit}>
          <FormGroup title="Subscription" className="flex-1">
            <div className="">
              {activeTab === "ivr" ? (
                <div className="">
                  <Upload
                    single
                    validFileTypes={["mp3", "wav", "aff"]}
                    validImageTypesSrc={["mp3", "wav", "aff"]}
                    onUploadComplete={e => imageUploaded(e, "subscription")}
                    fileUploadName={"file_url"}
                    uploadUrl={fileUpload}
                  />
                  <div className="info">
                    Supported types includes: Mp3, WAV and AFF
                  </div>
                  {notificationData.subscription && (
                    <a
                      style={{ color: primaryColor }}
                      onClick={e =>
                        getFileUrl(e, notificationData.subscription)
                      }
                      target="_blank"
                    >
                      {loadingLink ? (
                        <Spinner color={primaryColor} />
                      ) : (
                        notificationData.subscription
                      )}
                    </a>
                  )}
                </div>
              ) : (
                <TextAreaField
                  name="subscription"
                  value={notificationData.subscription || ""}
                  onChange={changeData}
                  required
                  style={{ width: "100%" }}
                />
              )}
            </div>
          </FormGroup>
          <FormGroup title="Deactivation" className="flex-1">
            <div className="">
              {activeTab === "ivr" ? (
                <div className="">
                  <Upload
                    single
                    validFileTypes={["mp3", "wav", "aff"]}
                    validImageTypesSrc={["mp3", "wav", "aff"]}
                    onUploadComplete={e => imageUploaded(e, "deactivation")}
                    fileUploadName={"file_url"}
                    uploadUrl={fileUpload}
                  />
                  <div className="info">
                    Supported types includes: Mp3, WAV and AFF
                  </div>
                  {notificationData.deactivation && (
                    <a
                      style={{ color: primaryColor }}
                      onClick={e =>
                        getFileUrl(e, notificationData.deactivation)
                      }
                      target="_blank"
                    >
                      {loadingLink ? (
                        <Spinner color={primaryColor} />
                      ) : (
                        notificationData.deactivation
                      )}
                    </a>
                  )}
                </div>
              ) : (
                <TextAreaField
                  name="deactivation"
                  value={notificationData.deactivation || ""}
                  onChange={changeData}
                  required
                  style={{ width: "100%" }}
                />
              )}
            </div>
          </FormGroup>
          <FormGroup title="Charge" className="flex-1">
            <div className="">
              {activeTab === "ivr" ? (
                <div className="">
                  <Upload
                    single
                    validFileTypes={["mp3", "wav", "aff"]}
                    validImageTypesSrc={["mp3", "wav", "aff"]}
                    onUploadComplete={e => imageUploaded(e, "charge")}
                    fileUploadName={"file_url"}
                    uploadUrl={fileUpload}
                  />
                  <div className="info">
                    Supported types includes: Mp3, WAV and AFF
                  </div>
                  {notificationData.charge && (
                    <a
                      style={{ color: primaryColor }}
                      onClick={e => getFileUrl(e, notificationData.charge)}
                      target="_blank"
                    >
                      {loadingLink ? (
                        <Spinner color={primaryColor} />
                      ) : (
                        notificationData.charge
                      )}
                    </a>
                  )}
                </div>
              ) : (
                <TextAreaField
                  name="charge"
                  value={notificationData.charge || ""}
                  onChange={changeData}
                  required
                  style={{ width: "100%" }}
                />
              )}
            </div>
          </FormGroup>
          <FormGroup title="Renewal" className="flex-1">
            <div className="">
              {activeTab === "ivr" ? (
                <div className="">
                  <Upload
                    single
                    validFileTypes={["mp3", "wav", "aff"]}
                    validImageTypesSrc={["mp3", "wav", "aff"]}
                    onUploadComplete={e => imageUploaded(e, "renewal")}
                    fileUploadName={"file_url"}
                    uploadUrl={fileUpload}
                  />
                  <div className="info">
                    Supported types includes: Mp3, WAV and AFF
                  </div>
                  {notificationData.renewal && (
                    <a
                      style={{ color: primaryColor }}
                      onClick={e => getFileUrl(e, notificationData.renewal)}
                      target="_blank"
                    >
                      {loadingLink ? (
                        <Spinner color={primaryColor} />
                      ) : (
                        notificationData.renewal
                      )}
                    </a>
                  )}
                </div>
              ) : (
                <TextAreaField
                  name="renewal"
                  value={notificationData.renewal || ""}
                  onChange={changeData}
                  required
                  style={{ width: "100%" }}
                />
              )}
            </div>
          </FormGroup>
          <Button type="submit" loading={loading} disabled={loading}>
            Update
          </Button>
        </form>
      )}
    </div>
  );
}

export default GeneralSettings;
