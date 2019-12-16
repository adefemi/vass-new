import React, { useState } from "react";
import { Spinner } from "../../../../components/common/spinner";
import {
  fetchFileUpload,
  fetchFileUploadStream,
  primaryColor,
  secondaryColor
} from "../../../utils/data";
import { DownLoad } from "../../../../components/common/customIcon";
import { axiosFunc } from "../../../utils/helper";

const filterShortCode = (array, channel) => {
  return array.filter(
    item => item.channel.toLowerCase() === channel.toLowerCase()
  );
};

const BasicTab = props => {
  const [loadingLink, setLoadingLink] = useState(false);

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
    <React.Fragment>
      <div className="flex flew-wrap">
        {props.fetchingBasic || !props.dataBasic ? (
          <Spinner color={secondaryColor} />
        ) : (
          <React.Fragment>
            <div className="item">
              <div className="item-head">Company Name</div>
              <div className="item-content">{props.dataBasic.name}</div>
              {props.dataBasic.email && (
                <React.Fragment>
                  <div className="item-head">Email Address</div>
                  <div className="item-content">{props.dataBasic.email}</div>
                </React.Fragment>
              )}
              {props.dataBasic.phoneNumber && (
                <React.Fragment>
                  <div className="item-head">Phone Number</div>
                  <div className="item-content">
                    {props.dataBasic.phoneNumber}
                  </div>
                </React.Fragment>
              )}
              {props.dataBasic.address && (
                <React.Fragment>
                  <div className="item-head">location</div>
                  <div className="item-content">{props.dataBasic.address}</div>
                </React.Fragment>
              )}
            </div>
            <div className="item">
              <React.Fragment>
                <div className="item-head">Status</div>
                <div className="item-content">
                  {!props.dataBasic.status ? "Pending" : "Approved"}
                </div>
              </React.Fragment>
              {props.dataBasic.cacNumber && (
                <React.Fragment>
                  <div className="item-head">CAC Number</div>
                  <div className="item-content">
                    {props.dataBasic.cacNumber}
                  </div>
                </React.Fragment>
              )}
              {props.dataBasic.description && (
                <React.Fragment>
                  <div className="item-head">Description</div>
                  <div className="item-content">
                    {props.dataBasic.description}
                  </div>
                </React.Fragment>
              )}
            </div>
            <div className="item">
              <div
                className="image-con"
                style={{
                  backgroundImage: `url(
                    "${fetchFileUploadStream(props.dataBasic.avatar)}"
                  )`
                }}
              />
            </div>
          </React.Fragment>
        )}
      </div>
      <br />
      <div className="divider" />
      <br />

      <div className="content-heading">Company Documents</div>
      {props.fetchingLicense ? (
        <Spinner color={secondaryColor} />
      ) : (
        <ul>
          {props.dataLicense.length < 1 ? (
            <span>No License found!</span>
          ) : (
            props.dataLicense.map((item, id) => {
              return loadingLink ? (
                <div>
                  <Spinner color={primaryColor} />
                </div>
              ) : (
                <a onClick={e => getFileUrl(e, item.fileId)} target="_blank">
                  <li key={id}>
                    <span>{item.name}</span>{" "}
                    <DownLoad size={"20px"} color={primaryColor} />
                  </li>
                </a>
              );
            })
          )}
        </ul>
      )}

      <br />

      {props.fetchingShortCode ? (
        <Spinner color={secondaryColor} />
      ) : (
        props.dataShortCode &&
        props.dataShortCode.length > 0 && (
          <React.Fragment>
            <div className="divider" />
            <br />

            <div className="content-heading">Identifier Codes</div>

            <React.Fragment>
              {filterShortCode(props.dataShortCode, "ussd").length > 0 && (
                <div className="code-item">
                  <div className="header">USSD</div>
                  {filterShortCode(props.dataShortCode, "ussd").map(
                    (item, key) => {
                      return <li key={key}>{item.shortCode}</li>;
                    }
                  )}
                </div>
              )}
              {filterShortCode(props.dataShortCode, "sms").length > 0 && (
                <div className="code-item">
                  <div className="header">SMS</div>
                  {filterShortCode(props.dataShortCode, "sms").map(
                    (item, key) => {
                      return <li key={key}>{item.shortCode}</li>;
                    }
                  )}
                </div>
              )}
              {filterShortCode(props.dataShortCode, "ivr").length > 0 && (
                <div className="code-item">
                  <div className="header">IVR</div>
                  {filterShortCode(props.dataShortCode, "ivr").map(
                    (item, key) => {
                      return <li key={key}>{item.shortCode}</li>;
                    }
                  )}
                </div>
              )}
              {filterShortCode(props.dataShortCode, "WEB").length > 0 && (
                <div className="code-item">
                  <div className="header">WEB</div>
                  {filterShortCode(props.dataShortCode, "WEB").map(
                    (item, key) => {
                      return <li key={key}>{item.shortCode}</li>;
                    }
                  )}
                </div>
              )}
            </React.Fragment>
          </React.Fragment>
        )
      )}
    </React.Fragment>
  );
};

export default BasicTab;
