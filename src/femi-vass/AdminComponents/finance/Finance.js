import React, { useState, useEffect } from "react";
import "../products/Product.css"
import "./Finance.css";
import {
  invoiceCreateUrl,
  invoiceFetchUrl,
  invoiceUrl,
  revenueSumUrl,
  USERACCESSCONTROL,
  walletTotalUrl
} from "../../utils/data";
import {
  Spinner,
  Notification,
  Card,
  Button,
  Modal,
  FormGroup,
  Input,
  TextAreaField,
  Select
} from "../../../components/common";
import { axiosFunc, formatCurrency } from "../../utils/helper";
import { errorHandler } from "../../../components/utils/helper";
import moment from "moment";
import Table from "antd/lib/table";
import Pagination from "antd/lib/pagination";

const data = (props, providers) => {
  const newArray = [];

  providers.map((item, id) => {
    let data = {
      key: id,
      created_at: moment(new Date(item.createdAt)).format("DD-MM-YYYY"),
      amount: <span>₦ {formatCurrency(item.amount) || 0}</span>,
      type: <span className="text-capitalize">{item.type}</span>,
      invoiceId: (
        <span className="text-overflow">
          {item.invoiceId}{" "}
          {item.reference && (
            <a href={item.reference} className="link" target="_blank">
              [ref]
            </a>
          )}
        </span>
      ),
      status: (
        <span
          className={
            item.status === "approved"
              ? "status-badge approved"
              : "status-badge"
          }
        >
          {item.status}
        </span>
      ),
      description: (
        <span className={"text-overflow"} style={{ width: "100px" }}>
          {item.description}
        </span>
      ),
      action: {
        props,
        invoice_id: item.invoiceId
      }
    };

    newArray.push(data);
    return null;
  });
  return newArray;
};

const columns = [
  {
    title: "Created At",
    dataIndex: "created_at",
    key: "created_at"
  },
  {
    title: "Amount",
    dataIndex: "amount",
    key: "amount"
  },
  {
    title: "Type",
    dataIndex: "type",
    key: "type"
  },
  {
    title: "InvoiceID",
    dataIndex: "invoiceId",
    key: "invoiceId"
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status"
  },
  {
    title: "Description",
    dataIndex: "description",
    key: "description"
  },
  {
    title: "Action",
    dataIndex: "action",
    key: "x",
    render: ({ props, invoice_id }) => (
      <span
        className="link"
        onClick={() =>
          props.history.push(`/admin/finance/invoice/${invoice_id}`)
        }
      >
        View
      </span>
    )
  }
];

export const getUserAccess = () => {
  return JSON.parse(localStorage.getItem(USERACCESSCONTROL));
};

function Finance(props) {
  const [userAccess] = useState(getUserAccess);
  const [generating, setGenerating] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [activeObj, setActiveObj] = useState("topup");
  const [toping, setToping] = useState(false);
  const [topUpData, setTopUpData] = useState({});

  const [invoiceData, setInvoiceData] = useState({});

  const [invoices, setInvoices] = useState({
    fetching: true,
    data: []
  });
  const [todayRev, setTodayRev] = useState({
    fetching: true,
    data: 0
  });

  const [totalRev, setTotalRev] = useState({
    fetching: true,
    data: 0
  });

  const [walletInfo, setWalletInfo] = useState({
    fetching: true,
    total: 0,
    payable: 0,
    promoBalance: 0
  });

  const [filterData, setFilterData] = useState("all");

  const onChangeTop = e => {
    setTopUpData({
      ...topUpData,
      [e.target.name]: e.target.value
    });
  };

  const filtering = type => {
    setFilterData(type);

    if (type !== "all") {
      let newType = type.toLowerCase();
      let extra = `status=${newType}`;
      if (newType === "topup" || newType === "payout") {
        extra = `type=${newType}`;
      }
      getAllInvoice(1, extra);
    } else {
      getAllInvoice(1);
    }
  };

  const onChangeInvoice = e => {
    setInvoiceData({
      ...topUpData,
      [e.target.name]: e.target.value
    });
  };

  const onGenerated = (status, payload) => {
    setGenerating(false);
    if (status) {
      Notification.bubble({
        type: "success",
        content: "Invoice Created, Awaiting approval..."
      });
      getAllInvoice();
      setShowModal(false);
      setInvoiceData({});
    } else {
      Notification.bubble({
        type: "error",
        content: errorHandler(payload)
      });
    }
  };

  const onDataFetch = (status, data, _type) => {
    if (status) {
      let activeData = data.data.data;
      if (_type === "all_invoices") {
        setInvoices({
          data: data.data,
          fetching: false
        });
      } else if (_type === "wallet_info") {

        setWalletInfo({
          total: activeData.total,
          payable: activeData.payable,
          promoBalance: activeData.promoBalance,
          fetching: false
        });
      } else if (_type === "revenue_info_today") {
        setTodayRev({
          fetching: false,
          data: activeData
        });
      } else if (_type === "revenue_info_total") {
        setTotalRev({
          fetching: false,
          data: activeData
        });
      }
    } else {
      Notification.bubble({
        type: "error",
        content: errorHandler(data)
      });
    }
  };

  const getAllInvoice = (page, extra = null) => {
    setInvoices({
      fetching: true,
      data: []
    });

    let url = `?page=${page}&limit=10`;
    if (extra) {
      url += `&${extra}`;
    }

    axiosFunc(
      "get",
      invoiceFetchUrl(url),
      null,
      "yes",
      onDataFetch,
      "all_invoices"
    );
  };

  let user_access = JSON.parse(localStorage.getItem(USERACCESSCONTROL));
  user_access = user_access.sideBar.finances;

  useEffect(() => {
    if (!user_access.status) {
      Notification.bubble({
        type: "error",
        content: "You don't have access to this page!!!"
      });
      props.history.goBack();
    } else {
      getAllInvoice(1);

      axiosFunc(
        "get",
        walletTotalUrl("?recordType=total"),
        null,
        "yes",
        onDataFetch,
        "wallet_info"
      );

      axiosFunc(
        "get",
        revenueSumUrl("?type=today&status=SUCCESS"),
        null,
        "yes",
        onDataFetch,
        "revenue_info_today"
      );
      axiosFunc(
        "get",
        revenueSumUrl("?type=total&status=SUCCESS"),
        null,
        "yes",
        onDataFetch,
        "revenue_info_total"
      );
    }
  }, []);

  const generateInvoice = e => {
    e.preventDefault();
    setGenerating(true);
    axiosFunc("post", invoiceCreateUrl(), invoiceData, "yes", onGenerated);
  };

  const onTopUpCompleted = (status, payload) => {
    setToping(false);
    if (status) {
      Notification.bubble({
        type: "success",
        content: "Invoice Created, Awaiting approval..."
      });
      getAllInvoice(1);
      setShowModal(false);
      setTopUpData({});
    } else {
      Notification.bubble({
        type: "error",
        content: errorHandler(payload)
      });
    }
  };

  const topUpInvoice = e => {
    e.preventDefault();
    setToping(true);
    axiosFunc("post", invoiceUrl("topup"), topUpData, "yes", onTopUpCompleted);
  };

  const onChangePage = page => {
    setInvoices({
      fetching: true,
      data: []
    });
    getAllInvoice(page);
  };

  return (
    <div className={"category-container max-width-1200"}>
      {!userAccess.sideBar.finances.status ? (
        <p>You don't have access to this page!</p>
      ) : (
        <div>
          <br />
          <div className={"flex justify-between align-c"}>
            <div className="heading-content" style={{ marginBottom: "0" }}>
              Financial Records
            </div>
          </div>
          <br />
          <br />

          <Modal
            onClose={() => setShowModal(false)}
            visible={showModal}
            title={
              activeObj === "topup"
                ? "Top up wallet"
                : activeObj === "generateInvoice"
                ? "Generate Invoice"
                : "Verify Invoice"
            }
          >
            {activeObj === "topup" && (
              <>
                <form onSubmit={topUpInvoice}>
                  <FormGroup title="Amount">
                    <Input
                      type="number"
                      value={topUpData.amount || ""}
                      onChange={onChangeTop}
                      name="amount"
                    />
                  </FormGroup>
                  <FormGroup title="Description">
                    <TextAreaField
                      value={topUpData.description || ""}
                      onChange={onChangeTop}
                      name="description"
                    />
                  </FormGroup>
                  <Button disabled={toping} loading={toping} type="submit">
                    Top Up
                  </Button>
                </form>
              </>
            )}
            {activeObj === "generateInvoice" && (
              <>
                <form onSubmit={generateInvoice}>
                  <FormGroup title="Description">
                    <TextAreaField
                      value={invoiceData.description || ""}
                      onChange={onChangeInvoice}
                      name="description"
                    />
                  </FormGroup>
                  <Button
                    disabled={generating}
                    loading={generating}
                    type="submit"
                  >
                    Generate
                  </Button>
                </form>
              </>
            )}
          </Modal>

          <div className="grid-auto finance-control">
            {userAccess.sideBar.finances.data.total_revenue && (
              <Card
                round
                className={"productCardInfo"}
                style={{ backgroundColor: "#74b9ff", color: "white" }}
              >
                <div className={"title"}>Total Revenue</div>
                <div className="inner-content">
                  {totalRev.fetching ? (
                    <Spinner />
                  ) : (
                    <React.Fragment>
                      <div className={"mainFig"}>
                        <span>
                          &#8358; {formatCurrency(totalRev.data) || 0.0}
                        </span>
                      </div>
                      <br />
                      <small>
                        Today <br />
                        <span>₦ {formatCurrency(todayRev.data) || 0.0}</span>
                      </small>
                    </React.Fragment>
                  )}
                </div>
              </Card>
            )}

            {userAccess.sideBar.finances.data.wallet_balance.status && (
              <Card
                round
                className={"productCardInfo"}
                style={{ backgroundColor: "#ff7675", color: "white" }}
              >
                <div className={"title"}>Wallet Balance</div>
                <div className="inner-content">
                  {walletInfo.fetching ? (
                    <Spinner />
                  ) : (
                    <React.Fragment>
                      <div className={"mainFig"}>
                        ₦ {formatCurrency(walletInfo.total) || 0.0}
                      </div>
                    </React.Fragment>
                  )}

                  {!walletInfo.fetching &&
                    userAccess.sideBar.finances.data.wallet_balance.data
                      .top_wallet && (
                      <>
                        <br />
                        <br />
                        <div className="card-btn">
                          <button
                            onClick={() => {
                              setActiveObj("topup");
                              setShowModal(true);
                            }}
                          >
                            Top Up
                          </button>
                        </div>
                      </>
                    )}
                </div>
              </Card>
            )}

            {userAccess.sideBar.finances.data.total_payable.status && (
              <Card
                round
                className={"productCardInfo"}
                style={{ backgroundColor: "#a29bfe", color: "white" }}
              >
                <div className={"title"}>Total Payable</div>
                <div className="inner-content">
                  {walletInfo.fetching ? (
                    <Spinner />
                  ) : (
                    <React.Fragment>
                      <div className={"mainFig"}>
                        ₦ {formatCurrency(walletInfo.payable) || 0.0}
                      </div>
                    </React.Fragment>
                  )}
                  {!walletInfo.fetching &&
                    userAccess.sideBar.finances.data.total_payable.data
                      .generate_invoice && (
                      <>
                        <br />
                        <br />
                        <div className="card-btn">
                          <Button
                            variant="outlined"
                            disabled={parseInt(walletInfo.payable) < 1}
                            style={{ borderColor: "white", color: "white" }}
                            onClick={() => {
                              setActiveObj("generateInvoice");
                              setShowModal(true);
                            }}
                          >
                            Generate Invoice
                          </Button>
                        </div>
                      </>
                    )}
                </div>
              </Card>
            )}
          </div>
          <br />
          <br />
          {userAccess.sideBar.finances.data.invoices.status && (
            <Card round heading="Invoices">
              <div className={"padding-20"}>
                <div className="flex justify-between align-c">
                  <div />
                  <div className="flex align-c">
                    <Select
                      value={filterData}
                      onChange={e => filtering(e.target.value)}
                    >
                      <Select.Option value={"all"}>All</Select.Option>
                      <Select.Option value={"pending"}>Pending</Select.Option>
                      <Select.Option value={"approved"}>Approved</Select.Option>
                      <Select.Option value={"topup"}>Topup</Select.Option>
                      <Select.Option value={"payout"}>Payout</Select.Option>
                    </Select>
                  </div>
                </div>
                <br />
                <Table
                  columns={columns}
                  dataSource={
                    invoices.fetching ? [] : data(props, invoices.data.data)
                  }
                  pagination={false}
                  loading={invoices.fetching}
                />
                <br />
                <div className="flex justify-between align-c">
                  <div />
                  <Pagination
                    onChange={page => onChangePage(page)}
                    defaultCurrent={parseInt(invoices.data.page) || 1}
                    total={invoices.data.total || 1}
                  />
                </div>
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}

export default Finance;
