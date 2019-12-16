import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  FormGroup,
  Input,
  Modal,
  Notification,
  Select,
  Spinner,
  Upload
} from "../../../components/common";
import { axiosFunc, formatCurrency } from "../../utils/helper";
import {
  baseFileUploadUrl,
  invoiceStatusUrl,
  invoiceUrl,
  secondaryColor
} from "../../utils/data";
import { errorHandler } from "../../../components/utils/helper";
import moment from "moment";
import { getUserAccess } from "./Finance";
import { Switch } from "antd";
import { Tag } from "antd";

function Invoice(props) {
  const [slug] = useState(props.match.params.slug);
  const [invoice, setInvoice] = useState({
    data: {},
    fetching: true
  });
  const [verifyInvoice, setVerifyInvoice] = useState(false);
  const [refType, setRefType] = useState(false);
  const [approvalData, setApprovalData] = useState({
    status: "approved"
  });
  const [showModal, setShowModal] = useState(false);

  const onFetchData = (status, payload) => {
    if (status) {
      setInvoice({
        data: payload.data.data,
        fetching: false
      });
    } else {
    }
  };

  const onChangeApproval = e => {
    setApprovalData({
      ...approvalData,
      [e.target.name]: e.target.value
    });
  };

  const onVerificationCompleted = (status, payload) => {
    setVerifyInvoice(false);
    if (status) {
      Notification.bubble({
        type: "success",
        content: "Verification successful"
      });
      setShowModal(false);
      setApprovalData({ status: "approved" });
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } else {
      Notification.bubble({
        type: "error",
        content: errorHandler(payload)
      });
    }
  };

  const updateInvoice = e => {
    e.preventDefault();
    approvalData.invoiceId = invoice.data.invoiceId;
    setVerifyInvoice(true);
    axiosFunc(
      "post",
      invoiceStatusUrl(),
      approvalData,
      "yes",
      onVerificationCompleted
    );
  };

  useEffect(() => {
    if (!slug) {
      Notification.bubble({
        type: "error",
        content: "Access denied, you shouldn't be here"
      });
      props.history.goBack();
    } else {
      axiosFunc(
        "get",
        invoiceUrl(`fetch?invoiceId=${slug}`),
        null,
        "yes",
        onFetchData
      );
    }
  }, []);
  return (
    <div className="category-container max-width-1200 invoice-main">
      <Modal
        onClose={() => setShowModal(false)}
        visible={showModal}
        title={"Verify Invoice"}
      >
        <form onSubmit={updateInvoice}>
          <FormGroup title="Status">
            <Select
              value={approvalData.status || "approved"}
              onChange={onChangeApproval}
              name="status"
            >
              <Select.Option value="approved">Approve</Select.Option>
              <Select.Option value="disapproved">Disapprove</Select.Option>
            </Select>
          </FormGroup>
          <FormGroup
            title={
              <span>
                Reference <Switch onChange={e => setRefType(e)} size="small" />
              </span>
            }
          >
            {refType ? (
              <div>
                Upload a reference file
                <Upload
                  single
                  fileUploadName="file_url"
                  onUploadComplete={file =>
                    onChangeApproval({
                      target: {
                        name: "reference",
                        value: file.data.file_url
                      }
                    })
                  }
                  uploadUrl={baseFileUploadUrl}
                />
              </div>
            ) : (
              <Input
                value={approvalData.reference || ""}
                onChange={onChangeApproval}
                placeholder="reference info"
                name="reference"
              />
            )}
          </FormGroup>
          <Button
            disabled={verifyInvoice}
            loading={verifyInvoice}
            type="submit"
          >
            Verify
          </Button>
        </form>
      </Modal>
      <br />
      <div className="flex justify-between">
        <div className="link" onClick={() => props.history.goBack()}>
          BACK
        </div>
        {/*<div className="link">Print Invoice</div>*/}
      </div>
      <br />
      <div>
        {invoice.fetching ? (
          "..."
        ) : (
          <>
            {invoice.data.status === "pending" ? (
              getUserAccess().sideBar.finances.data.invoices.data.approval && (
                <Button variant="outlined" onClick={() => setShowModal(true)}>
                  Approve
                </Button>
              )
            ) : invoice.data.status === "approved" ? (
              <Tag color="green" style={{ textTransform: "capitalize" }}>
                {invoice.data.status}
              </Tag>
            ) : (
              <Tag color="orange" style={{ textTransform: "capitalize" }}>
                {invoice.data.status}
              </Tag>
            )}
          </>
        )}
      </div>
      <br />

      {invoice.fetching ? (
        <Spinner color={secondaryColor} />
      ) : (
        <Card>
          <div className="padding-20">
            <div className="flex justify-between">
              <div className="img-con">
                <img src="" alt="" />
              </div>
              <div className="content-address-up">
                <div className="black-color">Vaas</div>
              </div>
            </div>
            <br />
            <div className="divider black-color" />
            <br />
            <div className="flex justify-between">
              <div className="content-address-up">
                <div className="black-color">
                  {moment(new Date(invoice.data.createdAt)).format(
                    "MMMM DD, YYYY"
                  )}
                </div>

                <br />
                <br />
                <br />
                <br />
                <br />

                <div className="div">
                  Invoice No.:{" "}
                  <strong className="black-color">
                    {invoice.data.invoiceId}
                  </strong>
                </div>
                <div className="div">
                  Provider ID.:{" "}
                  <strong className="black-color">
                    {invoice.data.providerId}
                  </strong>
                </div>
              </div>

              <div className="content-address-up" />
            </div>
            <br />
            <br />
            <div className="flex justify-between heading-content">
              <li>Description</li>
              <li className="text-align-r">Type</li>
              <li className="text-align-r">Reference</li>
              <li className="text-align-r">Amount (excl. VAT)</li>
            </div>
            <br />
            <div className="divider black-color" />
            <br />
            <div className="flex justify-between">
              <li>{invoice.data.description}</li>
              <li className="text-align-r">{invoice.data.type}</li>
              <li className="text-align-r">{invoice.data.invoiceId}</li>
              <li className="text-align-r">
                ₦{formatCurrency(invoice.data.amount)}
              </li>
            </div>
            <br />
            <div className="divider black-color" />
            <br />
            <div className="flex justify-between heading-content">
              <li />
              <li />
              <li className="text-align-r">Order total</li>
              <li className="text-align-r">
                ₦{formatCurrency(invoice.data.amount)}
              </li>
            </div>

            <br />
            <br />
            <div>Thanks for your purchase!</div>
            <div>For any further questions do hesitate to contact us!</div>
            <br />
            <br />
          </div>
        </Card>
      )}
    </div>
  );
}

export default Invoice;
