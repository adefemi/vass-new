import React, { useEffect, useState } from "react";
import "../support.css";
import AppIcon from "../../../../components/common/icons/Icon";
import { Card } from "../../../../components/common/card";
import { axiosFunc } from "../../../utils/helper";
import {
  fetchFileUpload,
  fetchFileUploadStream,
  fileUpload,
  primaryColor,
  supportUrlMain,
  USERDATA
} from "../../../utils/data";
import { Notification } from "../../../../components/common/notification";
import { errorHandler } from "../../../../components/utils/helper";
import { Spinner } from "../../../../components/common/spinner";
import moment from "moment";
import { TextAreaField } from "../../../../components/common/textarea";
import { Button } from "../../../../components/common/button";

function TicketInfo(props) {
  let fileRef;
  const [activeTicket, setActiveTicket] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [loadingLink, setLoadingLink] = useState(false);
  const activeUser = JSON.parse(localStorage.getItem(USERDATA));
  const [groupData, setGroupData] = useState({
    email: activeUser.email,
    name: activeUser.profile.name
  });
  const [fileUrls, setFileUrls] = useState([]);

  const onChange = e => {
    setGroupData({
      ...groupData,
      [e.target.name]: e.target.value
    });
  };

  useEffect(() => {
    fetchSupportGroup();
  }, [props.activeTicket]);

  const fetchSupportGroup = _ => {
    setGroupData({
      ...groupData,
      message: ""
    });
    setFileUrls([]);
    setFetching(true);
    axiosFunc(
      "get",
      supportUrlMain("tickets/" + props.activeTicket.ticketId + "/messages"),
      null,
      "yes",
      (status, data) => {
        if (status) {
          setActiveTicket(data.data);
          setFetching(false);
        } else {
          Notification.bubble({
            type: "error",
            content: errorHandler(data)
          });
        }
      }
    );
  };

  const onSaveGroup = e => {
    e.preventDefault();
    setLoading2(true);
    const data = {
      ...groupData,
      fileIds: fileUrls.filter(item => {
        return item.id;
      }),
      url: `${window.location.origin}/admin/support`
    };
    axiosFunc(
      "post",
      supportUrlMain("tickets/" + props.activeTicket.ticketId + "/messages"),
      data,
      "yes",
      (status, data) => {
        setLoading2(false);
        if (status) {
          Notification.bubble({
            type: "success",
            content: "Message sent successfully"
          });

          fetchSupportGroup()
        } else {
          Notification.bubble({
            type: "error",
            content: errorHandler(data)
          });
        }
      }
    );
  };

  const onFileChange = e => {
    setLoading(true);
    const filedata = new FormData();
    filedata.append("file_url", e.target.files[0]);
    axiosFunc("post", fileUpload, filedata, "yes", (status, data) => {
      setLoading(false);
      if (status) {
        setFileUrls([...fileUrls, data.data.data]);
      } else {
        Notification.bubble({
          type: "error",
          content: errorHandler(data)
        });
      }
    });
  };

  const removeFile = id => {
    setFileUrls(fileUrls.filter(item => item.id !== id));
  };

  const getFileUrl = (e, id) => {
    e.preventDefault();
    setLoadingLink(true)
    axiosFunc(
        "get",
        fetchFileUpload(`/${id}`),
        null,
        "yes",
        (status, payload) => {
          if(status){
            setLoadingLink(false)
            window.open(payload.data.data.file_url, '_blank');
          }
        }
    );
  }

  return (
    <div className="ticket-info">
      <div className="close" onClick={() => props.close()}>
        <AppIcon name="x" type="feather" />
      </div>
      <div className="header-main">
        <p>Ticket ID: {props.activeTicket.ticketId}</p>
        <p>Creator: {props.activeTicket.sender.name}</p>
      </div>
      <div className="ticket-body">
        {fetching ? (
          <Spinner color={primaryColor} />
        ) : (
          activeTicket.data.map((item, key) => (
            <Card
              key={key}
              className={
                activeUser.email === item.sender.email ? "creator" : "replier"
              }
              round
            >
              <div className="padding-10">
                {item.message}
                <br />
                {item.fileIds.length > 0 && (
                  <>
                    <br />
                    {item.fileIds.map((i, key) => (
                      <>
                        {
                          loadingLink ? <Spinner color={primaryColor} /> :<a
                              key={key}
                              className="link"
                              onClick={e => getFileUrl(e, i)}
                              target="_blank"
                          >
                            media {key + 1}
                          </a>
                        }
                        ,{" "}
                      </>
                    ))}
                  </>
                )}
              </div>
              <div className="sender flex align-c justify-between">
                <div className="time-stamp">
                  {moment(new Date(item.timestamp)).format(
                    "DD-MM-YYYY, HH-MM a"
                  )}
                </div>
                <div className="user">{item.sender.email}</div>
              </div>
            </Card>
          ))
        )}
        {fileUrls.length > 0 && (
          <div className="fileList">
            {fileUrls.map((item, key) => (
              <div key={key} className="fileListItem flex align-c">
                <span className="close" onClick={() => removeFile(item.id)}>
                  <AppIcon name="trash" type="feather" />
                </span>
                <img src={item.file_url} alt="" />
                <div>{item.id}</div>
              </div>
            ))}
          </div>
        )}
      </div>
      <form onSubmit={onSaveGroup}>
        <div className="footer-main flex align-c">
          <div className="textzone">
            <TextAreaField
              value={groupData.message || ""}
              name="message"
              required
              onChange={onChange}
            />

            <div className="file-upload">
              <input
                onChange={onFileChange}
                ref={ref => (fileRef = ref)}
                type="file"
                style={{ display: "none" }}
              />
              {loading ? (
                <Spinner color={primaryColor} />
              ) : (
                <div onClick={() => fileRef.click()}>
                  <AppIcon name="camera" type="feather" />
                </div>
              )}
            </div>
          </div>
          <Button loading={loading2} disabled={loading2} type="submit">
            Send
          </Button>
        </div>
      </form>
    </div>
  );
}

export default TicketInfo;
