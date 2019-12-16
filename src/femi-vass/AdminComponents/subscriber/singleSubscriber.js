import React, { useState, useEffect } from "react";
import { Card, Spinner, Notification } from "../../../components/common";
import { axiosFunc, axiosMed, formatCurrency } from "../../utils/helper";
import {
  billingUrl,
  secondaryColor,
  subscriptionsUrl,
  USERACCESSCONTROL,
  userUrl
} from "../../utils/data";
import { errorHandler } from "../../../components/utils/helper";
import "./subscriber.css";
import Transactions from "../products/components/transactions";
import moment from "moment";
import Subscriptions from "../products/components/subscriptions";
import AppIcon from "../../../components/common/icons/Icon";

function SingleSubscriber(props) {
  const getActiveSubscriber = () => {
    return props.match.params.slug;
  };

  const [activeTag, setActiveTab] = useState(1);
  const [activeSubscriber] = useState(getActiveSubscriber());
  const [subscriberService, setSubscriberService] = useState({
    total: 0,
    today: 0,
    fetching: true
  });

  const [subscriptions, setSubscriptions] = useState({
    total: 0,
    today: 0,
    data: [],
    fetching: true
  });

  const [revenue, setRevenue] = useState({
    total: 0,
    today: 0,
    fetching: true
  });

  const [wallet, setWallet] = useState({
    total: 0,
    fetching: true
  });

  const [recentTransLog, setRecentTransLog] = useState({
    data: [],
    fetching: true
  });

  const [userInfo, setUserInfo] = useState({
    data: null,
    fetching: true
  });

  const getSubscribedService = () => {
    Promise.all([
      axiosMed(
        "get",
        subscriptionsUrl(
          `counts?dataType=subscribed&stepType=total&type=count&subscriberId=${activeSubscriber}`
        ),
        null,
        "yes"
      ),
      axiosMed(
        "get",
        subscriptionsUrl(
          `counts?dataType=subscribed&stepType=today&type=count&subscriberId=${activeSubscriber}`
        ),
        null,
        "yes"
      )
    ])
      .then(function([totalSubSev, todaySubSev]) {
        setSubscriberService({
          today: todaySubSev.data.data,
          total: totalSubSev.data.data,
          fetching: false
        });
      })
      .catch(err =>
        Notification.bubble({
          type: "error",
          content: errorHandler(err)
        })
      );
  };
  const getSubscription = userId => {
    Promise.all([
      axiosMed(
        "get",
        subscriptionsUrl(
          `counts?dataType=subscribed&stepType=today&type=count&subscriberId=${userId}`
        ),
        null,
        "yes"
      ),
      axiosMed(
        "get",
        subscriptionsUrl(
          `counts?dataType=subscribed&stepType=total&type=count&subscriberId=${userId}`
        ),
        null,
        "yes"
      ),
      axiosMed(
        "get",
        subscriptionsUrl(
          `counts?dataType=subscribed&stepType=total&type=data&subscriberId=${userId}`
        ),
        null,
        "yes"
      )
    ])
      .then(function([todaySub, totalSub, subscriptions]) {
        setSubscriptions({
          today: todaySub.data.data,
          total: totalSub.data.data,
          data: subscriptions.data.data,
          fetching: false
        });
      })
      .catch(err =>
        Notification.bubble({
          type: "error",
          content: errorHandler(err)
        })
      );
  };
  const getRevenue = userId => {
    Promise.all([
      axiosMed(
        "get",
        billingUrl(`sum?type=total&status=SUCCESS&userId=${userId}`),
        null,
        "yes"
      ),
      axiosMed(
        "get",
        billingUrl(`sum?status=SUCCESS&userId=${userId}&type=today`),
        null,
        "yes"
      )
    ])
      .then(function([totalRev, todayRev]) {
        setRevenue({
          today: todayRev.data.data,
          total: totalRev.data.data,
          fetching: false
        });
      })
      .catch(err =>
        Notification.bubble({
          type: "error",
          content: errorHandler(err)
        })
      );
  };
  const getWallet = userId => {
    Promise.all([
      axiosMed(
        "get",
        billingUrl(
          `wallets/sum?recordType=total&type=subscriber&typeId=${userId}`
        ),
        null,
        "yes"
      )
    ])
      .then(function([totalWallet]) {
        setWallet({
          total: totalWallet.data.data.balance,
          fetching: false
        });
      })
      .catch(err =>
        Notification.bubble({
          type: "error",
          content: errorHandler(err)
        })
      );
  };
  const onGetTransLog = (status, payload) => {
    if (status) {
      setRecentTransLog({
        data: payload.data.data,
        fetching: false
      });
    } else {
      Notification.bubble({
        type: "error",
        content: errorHandler(payload)
      });
    }
  };
  const onGetUser = (status, payload) => {
    if (status) {
      setUserInfo({
        data: payload.data.data,
        fetching: false
      });

      if (!payload.data) return;
      if (!payload.data.data) return;

      getSubscribedService(payload.data.data.phoneNumber);
      getSubscription(payload.data.data.phoneNumber);
      getRevenue(payload.data.data.phoneNumber);
      getWallet(payload.data.data.phoneNumber);
      axiosFunc(
        "get",
        `${billingUrl()}transactions?type=data&dateFrom=2019-06-01&dateTo=2019-07-09&stepType=total&page=1&limit=100&subscriberId=${
          payload.data.data.phoneNumber
        }`,
        null,
        "yes",
        onGetTransLog
      );
    } else {
      Notification.bubble({
        type: "error",
        content: errorHandler(payload)
      });
    }
  };

  let user_access = JSON.parse(localStorage.getItem(USERACCESSCONTROL));
  user_access = user_access.sideBar.subscribers.data.single_subscriber;

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
        `${userUrl()}subscribers?subscriberId=${activeSubscriber}`,
        null,
        "yes",
        onGetUser
      );
    }
  }, []);

  return (
    <div className={"category-container max-width-1200"}>
      <br />
      <div className="heading-content">Subscriber</div>
      <br />
      <div className="breadcrum">
        <li className="link" onClick={() => props.history.goBack()}>
          <AppIcon name="chevronLeft" type="feather" /> Back
        </li>
        <li
          className={activeTag !== 1 ? "link" : "gray-text"}
          onClick={() => setActiveTab(1)}
        >
          Dashboard
        </li>
        {user_access.data.user_info && (
          <li
            className={activeTag !== 2 ? "link" : "gray-text"}
            onClick={() => setActiveTab(2)}
          >
            User Info
          </li>
        )}
        {user_access.data.subscription_logs && (
          <li
            className={activeTag !== 3 ? "link" : "gray-text"}
            onClick={() => setActiveTab(3)}
          >
            Subscription Logs
          </li>
        )}
      </div>
      <br />
      {activeTag === 1 && (
        <React.Fragment>
          <div className="grid-auto">
            {user_access.data.subscribed_service && (
              <Card
                round
                className={"productCardInfo"}
                style={{ backgroundColor: "#74b9ff", color: "white" }}
              >
                <div className={"title"}>Subscribed Service</div>
                <div className="inner-content">
                  {subscriberService.fetching ? (
                    <Spinner />
                  ) : (
                    <>
                      <div className={"mainFig"}>{subscriberService.total}</div>
                      <small>
                        Today: <span>{subscriberService.today}</span>
                      </small>
                    </>
                  )}
                </div>
              </Card>
            )}
            {user_access.data.subscriptions && (
              <Card
                round
                className={"productCardInfo"}
                style={{ backgroundColor: "#ec63ff", color: "white" }}
              >
                <div className={"title"}>Subscriptions</div>
                <div className="inner-content">
                  {subscriptions.fetching ? (
                    <Spinner />
                  ) : (
                    <>
                      <div className={"mainFig"}>{subscriptions.total}</div>
                      <small>
                        Today: <span>{subscriptions.today}</span>
                      </small>
                    </>
                  )}
                </div>
              </Card>
            )}
            {user_access.data.total_revenue && (
              <Card
                round
                className={"productCardInfo"}
                style={{ backgroundColor: "#ffa059", color: "white" }}
              >
                <div className={"title"}>Total Revenue</div>
                <div className="inner-content">
                  {revenue.fetching ? (
                    <Spinner />
                  ) : (
                    <>
                      <div className={"mainFig"}>
                        ₦{formatCurrency(revenue.total) || 0}
                      </div>
                      <small>
                        Today:{" "}
                        <span>₦{formatCurrency(revenue.today) || 0}</span>
                      </small>
                    </>
                  )}
                </div>
              </Card>
            )}

            {user_access.data.wallet_amount && (
              <Card
                round
                className={"productCardInfo"}
                style={{ backgroundColor: "#0e91ff", color: "white" }}
              >
                <div className={"title"}>Wallet Amount</div>
                <div className="inner-content">
                  {wallet.fetching ? (
                    <Spinner />
                  ) : (
                    <div className={"mainFig"}>
                      ₦{formatCurrency(wallet.total) || 0}
                    </div>
                  )}
                </div>
              </Card>
            )}
          </div>
          <br />
          <br />
          {user_access.data.recent_transaction_logs && (
            <Card round heading="Recent Transactions Log">
              <Transactions
                {...props}
                data={recentTransLog.data}
                extra={{ hideSubscriber: true }}
                fetching={recentTransLog.fetching}
              />
            </Card>
          )}
        </React.Fragment>
      )}

      {activeTag === 2 && (
        <Card round>
          <div className="padding-20">
            {userInfo.fetching ? (
              <Spinner color={secondaryColor} />
            ) : (
              <table className="user-info-table">
                <tbody>
                  {userInfo.data.phoneNumber && (
                    <tr>
                      <th>Phone Number:</th>
                      <td>{userInfo.data.phoneNumber}</td>
                    </tr>
                  )}
                  {userInfo.data.name && (
                    <tr>
                      <th>Name:</th>
                      <td>{userInfo.data.name}</td>
                    </tr>
                  )}
                  {userInfo.data.email && (
                    <tr>
                      <th>Email:</th>
                      <td>{userInfo.data.email}</td>
                    </tr>
                  )}

                  {userInfo.data.createdAt && (
                    <tr>
                      <th>Joined:</th>
                      <td>
                        {moment(new Date(userInfo.data.createdAt)).format(
                          "YYYY-MM-DD"
                        )}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </Card>
      )}
      {activeTag === 3 && (
        <Card round>
          <Subscriptions
            {...props}
            data={subscriptions}
            extra={{ hideSubscriber: true }}
            fetching={subscriptions.fetching}
          />
        </Card>
      )}
      <br />
      <br />
    </div>
  );
}

export default SingleSubscriber;
