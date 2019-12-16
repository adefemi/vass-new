import React, { useEffect, useState } from "react";
import {
  Button,
  Checkbox,
  FormGroup,
  Input,
  Select,
  Notification
} from "../../../../components/common";
import {
  accessControlMeta,
  navEarnings,
  campaignProducts,
  contentDashboard,
  financeTotalPayable,
  financeWallerBalance,
  settingCategories,
  settingNetworks,
  settingsAccountSetup,
  settingsPaymentChannel,
  settingsRevenueSharing,
  singleAccount,
  singleProduct,
  singleProductContent,
  singleProductDashboard,
  singleSubscriber,
  financeInvoice,
  supportCategories,
  supportTicket
} from "../../../utils/access_control";
import { axiosFunc } from "../../../utils/helper";
import { userUrl } from "../../../utils/data";
import { errorHandler } from "../../../../components/utils/helper";

let sn = 1;

function TabRoles(props) {
  const [accessControl, setAccessControl] = useState(accessControlMeta);
  const [navEarning, setNavEarnings] = useState(navEarnings);
  const [campaignProduct, setCampaignProducts] = useState(campaignProducts);
  const [contentDashboards, setContentDashboard] = useState(contentDashboard);
  const [financeTotalPayables, setfinanceTotalPayable] = useState(
    financeTotalPayable
  );
  const [financeWallerBalances, setfinanceWallerBalance] = useState(
    financeWallerBalance
  );
  const [financeInvoices, setfinanceInvoice] = useState(financeInvoice);
  const [settingCategory, setSettingCategories] = useState(settingCategories);
  const [settingNetwork, setSettingNetworks] = useState(settingNetworks);
  const [settingsAccountSetups, setSettingsAccountSetup] = useState(
    settingsAccountSetup
  );
  const [settingsPaymentChannels, setSettingsPaymentChannel] = useState(
    settingsPaymentChannel
  );
  const [settingsRevenueSharings, setsettingsRevenueSharing] = useState(
    settingsRevenueSharing
  );
  const [singleAccounts, setsingleAccount] = useState(singleAccount);
  const [singleProducts, setsingleProduct] = useState(singleProduct);

  const [supportCategory, setSupportCategory] = useState(supportCategories);
  const [supportTicketData, setSupportTicket] = useState(supportTicket);

  const [singleProductContents, setsingleProductContent] = useState(
    singleProductContent
  );
  const [singleProductDashboards, setsingleProductDashboard] = useState(
    singleProductDashboard
  );
  const [singleSubscribers, setsingleSubscriber] = useState(singleSubscriber);

  const [roledata, setRoleData] = useState(props.activeRole || {});
  const [submit, setSubmit] = useState(false);
  const [update, setUpdate] = useState(props.update);

  const onChangeRoleData = e => {
    setRoleData({
      ...roledata,
      [e.target.name]: e.target.value
    });
  };

  const setData = (keyMain, key, value) => {
    if (keyMain === accessControl.sideBar) {
      setAccessControl({
        ...accessControl,
        sideBar: {
          ...accessControl.sideBar,
          [key]: value
        }
      });
    } else if (keyMain === accessControl.navBar) {
      setAccessControl({
        ...accessControl,
        navBar: {
          ...accessControl.navBar,
          [key]: value
        }
      });
    } else if (keyMain === accessControl.dashboard) {
      setAccessControl({
        ...accessControl,
        dashboard: {
          ...accessControl.dashboard,
          [key]: value
        }
      });
    } else if (keyMain === accessControl.accounts) {
      setAccessControl({
        ...accessControl,
        accounts: {
          ...accessControl.accounts,
          [key]: value
        }
      });
    } else if (keyMain === accessControl.subscribers) {
      setAccessControl({
        ...accessControl,
        subscribers: {
          ...accessControl.subscribers,
          [key]: value
        }
      });
    } else if (keyMain === accessControl.products) {
      setAccessControl({
        ...accessControl,
        products: {
          ...accessControl.products,
          [key]: value
        }
      });
    } else if (keyMain === accessControl.campaigns) {
      setAccessControl({
        ...accessControl,
        campaigns: {
          ...accessControl.campaigns,
          [key]: value
        }
      });
    } else if (keyMain === accessControl.finances) {
      setAccessControl({
        ...accessControl,
        finances: {
          ...accessControl.finances,
          [key]: value
        }
      });
    } else if (keyMain === accessControl.settings) {
      setAccessControl({
        ...accessControl,
        settings: {
          ...accessControl.settings,
          [key]: value
        }
      });
    } else if (keyMain === accessControl.support) {
      setAccessControl({
        ...accessControl,
        support: {
          ...accessControl.support,
          [key]: value
        }
      });
    } else if (keyMain === accessControl.profile) {
      setAccessControl({
        ...accessControl,
        profile: {
          ...accessControl.profile,
          [key]: value
        }
      });
    } else if (keyMain === navEarning) {
      setNavEarnings({
        ...navEarning,
        [key]: value
      });
    } else if (keyMain === campaignProduct) {
      setCampaignProducts({
        ...campaignProduct,
        [key]: value
      });
    } else if (keyMain === contentDashboards) {
      setContentDashboard({
        ...contentDashboards,
        [key]: value
      });
    } else if (keyMain === financeTotalPayables) {
      setfinanceTotalPayable({
        ...financeTotalPayables,
        [key]: value
      });
    } else if (keyMain === financeWallerBalances) {
      setfinanceWallerBalance({
        ...financeWallerBalances,
        [key]: value
      });
    } else if (keyMain === financeInvoices) {
      setfinanceInvoice({
        ...financeInvoices,
        [key]: value
      });
    } else if (keyMain === settingCategory) {
      setSettingCategories({
        ...settingCategory,
        [key]: value
      });
    } else if (keyMain === settingNetwork) {
      setSettingNetworks({
        ...settingNetwork,
        [key]: value
      });
    } else if (keyMain === settingsAccountSetups) {
      setSettingsAccountSetup({
        ...settingsAccountSetups,
        [key]: value
      });
    } else if (keyMain === settingsPaymentChannels) {
      setSettingsPaymentChannel({
        ...settingsPaymentChannels,
        [key]: value
      });
    } else if (keyMain === settingsRevenueSharings) {
      setsettingsRevenueSharing({
        ...settingsRevenueSharings,
        [key]: value
      });
    } else if (keyMain === singleAccounts) {
      setsingleAccount({
        ...singleAccounts,
        [key]: value
      });
    } else if (keyMain === singleProducts) {
      setsingleProduct({
        ...singleProducts,
        [key]: value
      });
    } else if (keyMain === supportCategory) {
      setSupportCategory({
        ...supportCategory,
        [key]: value
      });
    } else if (keyMain === supportTicketData) {
      setSupportTicket({
        ...supportTicketData,
        [key]: value
      });
    } else if (keyMain === singleProductDashboards) {
      setsingleProductDashboard({
        ...singleProductDashboards,
        [key]: value
      });
    } else if (keyMain === singleProductContents) {
      setsingleProductContent({
        ...singleProductContents,
        [key]: value
      });
    } else if (keyMain === singleSubscribers) {
      setsingleSubscriber({
        ...singleSubscribers,
        [key]: value
      });
    }
  };

  const getAccessControlData = keyMain => {
    let returnData = [];
    for (let key in keyMain) {
      sn++;
      if (keyMain.hasOwnProperty(key)) {
        returnData.push(
          <div key={key}>
            <Checkbox
              id={key + sn}
              checked={keyMain[key]}
              onChange={e => {
                setData(keyMain, key, e.target.checked);
              }}
              label={<span className="text-capitalize">{key}</span>}
            />
          </div>
        );
      }
    }

    return returnData;
  };

  const generateControls = () => {
    return {
      sideBar: {
        dashboard: {
          status: accessControl.sideBar.dashboard,
          data: {
            dashboard: {
              status: accessControl.dashboard.dashboard,
              data: {
                total_subscribers: contentDashboards.total_subscribers,
                total_products: contentDashboards.total_products,
                total_accounts: contentDashboards.total_accounts,
                total_revenue: contentDashboards.total_revenue,
                revenue_graph: contentDashboards.revenue_graph,
                subscriptions_graph: contentDashboards.subscriptions_graph,
                churn_graph: contentDashboards.churn_graph
              }
            },
            payment_transactions: accessControl.dashboard.payment_transactions,
            subscriptions: accessControl.dashboard.subscriptions
          }
        },
        accounts: {
          status: accessControl.sideBar.accounts,
          data: {
            filter: accessControl.accounts.filter,
            create_new: accessControl.accounts.create_new,
            show_list: accessControl.accounts.show_list,
            single_account: {
              status: accessControl.accounts.single_account,
              data: {
                edit_account: singleAccounts.edit_account,
                basic_info: singleAccounts.basic_info,
                resource_usage: singleAccounts.resource_usage,
                revenue: singleAccounts.revenue,
                bank_details: singleAccounts.bank_details,
                decline: singleAccounts.decline,
                accept: singleAccounts.accept
              }
            }
          }
        },
        subscribers: {
          status: accessControl.sideBar.subscribers,
          data: {
            search: accessControl.subscribers.search,
            single_subscriber: {
              status: accessControl.subscribers.single_subscriber,
              data: {
                total_receipt: singleSubscribers.total_receipt,
                delivery_rate: singleSubscribers.delivery_rate,
                total_receipt_graph: singleSubscribers.total_receipt_graph,
                delivery_rate_graph: singleSubscribers.delivery_rate_graph
              }
            }
          }
        },
        products: {
          status: accessControl.sideBar.products,
          data: {
            filter: accessControl.products.filter,
            create_new: accessControl.products.create_new,
            show_list: accessControl.products.show_list,
            single_product: {
              status: accessControl.products.single_product,
              data: {
                dashboard_product_tab: {
                  status: singleProducts.dashboard_product_tab,
                  data: {
                    status: singleProductDashboards.status,
                    sort: singleProductDashboards.sort,
                    total_subscribers:
                      singleProductDashboards.total_subscribers,
                    total_contents: singleProductDashboards.total_contents,
                    total_revenue: singleProductDashboards.total_revenue,
                    revenue_graphs: singleProductDashboards.revenue_graphs,
                    subscriptions_graphs:
                      singleProductDashboards.subscriptions_graphs,
                    churn_graph: singleProductDashboards.churn_graph
                  }
                },
                content: {
                  status: singleProducts.content,
                  data: {
                    status: singleProductContents.status,
                    show_list: singleProductContent.show_list,
                    create_new: singleProductContent.create_new
                  }
                },
                transactions: singleProducts.transactions,
                subscriptions: singleProducts.subscriptions,
                edit_product: singleProducts.edit_product,
                basic_info: singleProducts.basic_info,
                disapprove: singleProducts.disapprove,
                approve: singleProducts.approve,
                settings: singleProducts.settings
              }
            }
          }
        },
        campaigns: {
          status: accessControl.sideBar.campaigns,
          data: {
            all_campaign: accessControl.campaigns.all_campaign,
            products: {
              status: accessControl.campaigns.products,
              data: {
                push_campaign: campaignProduct.push_campaign
              }
            }
          }
        },
        finances: {
          status: accessControl.sideBar.finances,
          data: {
            total_revenue: accessControl.finances.total_revenue,
            wallet_balance: {
              status: accessControl.finances.wallet_balance,
              data: {
                top_wallet: financeWallerBalances.top_wallet
              }
            },
            total_payable: {
              status: accessControl.finances.total_payable,
              data: {
                generate_invoice: financeTotalPayables.generate_invoice
              }
            },
            invoices: {
              status: accessControl.finances.invoices,
              data: {
                approval: financeInvoices.approval
              }
            }
          }
        },
        settings: {
          status: accessControl.sideBar.settings,
          data: {
            categories: accessControl.settings.categories,
            networks: accessControl.settings.networks,
            payment_channel: accessControl.settings.payment_channel,
            account_setup: accessControl.settings.account_setup,
            revenue_sharing: accessControl.settings.revenue_sharing,
            finance: accessControl.settings.finance,
            blacklist: accessControl.settings.blacklist,
            bank_accounts: accessControl.settings.bank_accounts,
            roles: accessControl.settings.roles
          }
        },
        support: {
          status: accessControl.sideBar.support,
          data: {
            tabSwitch: accessControl.support.tabSwitch,
            category: {
              status: accessControl.support.category,
              data: {
                viewCategories: supportCategory.viewCategories,
                createCategories: supportCategory.createCategories
              }
            },
            ticket: {
              status: accessControl.support.ticket,
              data: {
                viewTicket: supportTicketData.viewTicket,
                createTicket: supportTicketData.createTicket
              }
            }
          }
        }
      },
      navBar: {
        earnings: {
          status: accessControl.navBar.earnings,
          data: {
            payable: navEarning.payable,
            total: navEarning.total
          }
        }
      }
    };
  };

  const onCreateRole = (status, payload) => {
    setSubmit(false);
    if (status) {
      Notification.bubble({
        type: "success",
        content: update
          ? "Role update successfully"
          : "Role created successfully"
      });
      setRoleData({});
      props.fetchRoles("reload");
    } else {
    }
  };

  useEffect(() => {
    setUpdate(props.update);
    setRoleData(props.activeRole || {});
  }, [props.update]);

  const onCreate = e => {
    e.preventDefault();
    setSubmit(true);
    let newData = { ...roledata, accessControl: generateControls() };
    if (update) {
      axiosFunc(
        "post",
        `${userUrl()}roles/${props.activeRole.roleId}/update`,
        newData,
        "yes",
        onCreateRole
      );
    } else {
      axiosFunc(
        "post",
        `${userUrl()}roles/create`,
        newData,
        "yes",
        onCreateRole
      );
    }
  };

  return (
    <div>
      <div className="flex align-c justify-between">
        {update ? (
          <div className="heading-content">Update Role</div>
        ) : (
          <div className="heading-content">Create new Role</div>
        )}

        {update && (
          <div className="link" onClick={() => props.cancelUpdate()}>
            cancel update
          </div>
        )}
      </div>

      <br />
      <form onSubmit={onCreate}>
        <FormGroup title={"Name"}>
          <div className="max-width-600">
            <Input
              name="name"
              required
              value={roledata.name || ""}
              onChange={onChangeRoleData}
            />
          </div>
        </FormGroup>
        <FormGroup title={"Role Access"}>
          <div className="max-width-600">
            <Select
              required
              value={roledata.roleAccess || ""}
              onChange={onChangeRoleData}
              name="roleAccess"
            >
              <Select.Option value="">--select access--</Select.Option>
              <Select.Option value="service_provider">
                Service Provider
              </Select.Option>
              <Select.Option value="admin">Admin</Select.Option>
            </Select>
          </div>
        </FormGroup>
        <FormGroup title={<span>Permissions (Account access)</span>}>
          <p />
          <div className="grid-2">
            <FormGroup
              title={
                <small>
                  <b>Sidebar</b>
                </small>
              }
            >
              {getAccessControlData(accessControl.sideBar)}
            </FormGroup>

            <FormGroup
              title={
                <small>
                  <b>Navbar</b>
                </small>
              }
            >
              {getAccessControlData(accessControl.navBar)}
              {accessControl.navBar.earnings && (
                <div className="padding-l-20">
                  <FormGroup
                    title={
                      <small>
                        <b>Earnings</b>
                      </small>
                    }
                  >
                    {getAccessControlData(navEarning)}
                  </FormGroup>
                </div>
              )}
            </FormGroup>
          </div>

          <div className="grid-4">
            {accessControl.sideBar.dashboard && (
              <FormGroup
                title={
                  <small>
                    <b>Dashboard</b>
                  </small>
                }
              >
                {getAccessControlData(accessControl.dashboard)}
                {accessControl.dashboard.dashboard && (
                  <div className="padding-l-20">
                    <FormGroup
                      title={
                        <small>
                          <b>Dashboard</b>
                        </small>
                      }
                    >
                      {getAccessControlData(contentDashboards)}
                    </FormGroup>
                  </div>
                )}
              </FormGroup>
            )}
            {accessControl.sideBar.accounts && (
              <FormGroup
                title={
                  <small>
                    <b>Accounts</b>
                  </small>
                }
              >
                {getAccessControlData(accessControl.accounts)}
                {accessControl.accounts.single_account && (
                  <div className="padding-l-20">
                    <FormGroup
                      title={
                        <small>
                          <b>Single Account</b>
                        </small>
                      }
                    >
                      {getAccessControlData(singleAccounts)}
                    </FormGroup>
                  </div>
                )}
              </FormGroup>
            )}
            {accessControl.sideBar.subscribers && (
              <FormGroup
                title={
                  <small>
                    <b>Subscribers</b>
                  </small>
                }
              >
                {getAccessControlData(accessControl.subscribers)}
                {accessControl.subscribers.single_subscriber && (
                  <div className="padding-l-20">
                    <FormGroup
                      title={
                        <small>
                          <b>Single Subscribers</b>
                        </small>
                      }
                    >
                      {getAccessControlData(singleSubscribers)}
                    </FormGroup>
                  </div>
                )}
              </FormGroup>
            )}

            {accessControl.sideBar.products && (
              <FormGroup
                title={
                  <small>
                    <b>Products</b>
                  </small>
                }
              >
                {getAccessControlData(accessControl.products)}
                {accessControl.products.single_product && (
                  <div className="padding-l-20">
                    <small>
                      <b>Single Products</b>
                    </small>
                    {getAccessControlData(singleProducts)}
                    <div className="padding-l-20">
                      <small>
                        <b>Dashboard</b>
                      </small>
                      {getAccessControlData(singleProductDashboards)}
                    </div>
                    <div className="padding-l-20">
                      <small>
                        <b>Contents</b>
                      </small>
                      {getAccessControlData(singleProductDashboards)}
                    </div>
                  </div>
                )}
              </FormGroup>
            )}
            {accessControl.sideBar.campaigns && (
              <FormGroup
                title={
                  <small>
                    <b>Campaigns</b>
                  </small>
                }
              >
                {getAccessControlData(accessControl.campaigns)}
                <div className="padding-l-20">
                  <small>
                    <b>Products</b>
                  </small>
                  {getAccessControlData(campaignProduct)}
                </div>
              </FormGroup>
            )}
            {accessControl.sideBar.finances && (
              <FormGroup
                title={
                  <small>
                    <b>Finances</b>
                  </small>
                }
              >
                {getAccessControlData(accessControl.finances)}
                <div className="padding-l-20">
                  <small>
                    <b>Wallet balance</b>
                  </small>
                  {getAccessControlData(financeWallerBalances)}
                </div>
                <div className="padding-l-20">
                  <small>
                    <b>Total payable</b>
                  </small>
                  {getAccessControlData(financeTotalPayables)}
                </div>
              </FormGroup>
            )}
            {accessControl.sideBar.settings && (
              <FormGroup
                title={
                  <small>
                    <b>Settings</b>
                  </small>
                }
              >
                {getAccessControlData(accessControl.settings)}
              </FormGroup>
            )}
            {accessControl.sideBar.profile && (
              <FormGroup
                title={
                  <small>
                    <b>Profile</b>
                  </small>
                }
              >
                {getAccessControlData(accessControl.profile)}
              </FormGroup>
            )}
            {accessControl.sideBar.support && (
              <FormGroup
                title={
                  <small>
                    <b>Support</b>
                  </small>
                }
              >
                {getAccessControlData(accessControl.support)}
                {accessControl.support.category && (
                  <div className="padding-l-20">
                    <small>
                      <b>Support Category</b>
                    </small>
                    {getAccessControlData(supportCategory)}
                  </div>
                )}

                {accessControl.support.ticket && (
                  <div className="padding-l-20">
                    <small>
                      <b>Support Ticket</b>
                    </small>
                    {getAccessControlData(supportTicketData)}
                  </div>
                )}
              </FormGroup>
            )}
          </div>
        </FormGroup>
        <FormGroup>
          <Button type="submit" loading={submit} disabled={submit}>
            {update ? "Update" : "Create"}
          </Button>
        </FormGroup>
      </form>
    </div>
  );
}

export default TabRoles;
