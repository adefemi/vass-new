export const accessControlMeta = {
  sideBar: {
    dashboard: true,
    accounts: true,
    subscribers: true,
    products: true,
    campaigns: true,
    finances: true,
    settings: true,
    support: true,
    profile: true,
  },
  navBar: {
    earnings: true
  },
  dashboard: {
    dashboard: true,
    payment_transactions: true,
    subscriptions: true
  },
  accounts: {
    filter: true,
    create_new: true,
    create_sub_account: true,
    show_list: true,
    single_account: true
  },
  subscribers: {
    search: true,
    single_subscriber: true
  },
  products: {
    filter: true,
    create_new: true,
    show_list: true,
    single_product: true
  },
  campaigns: {
    all_campaign: true,
    products: true
  },
  finances: {
    total_revenue: true,
    wallet_balance: true,
    total_payable: true,
    invoices: true
  },
  settings: {
    categories: true,
    networks: true,
    payment_channel: true,
    account_setup: true,
    revenue_sharing: true,
    finance: true,
    blacklist: true,
    bank_accounts: true,
    roles: true
  },
  support: {
    tabSwitch: true,
    category: true,
    ticket: true
  },
  profile: {
    basicInfo: true,
    bankDetail: true,
    subAccount: true
  }
};

export const navEarnings = {
  payable: true,
  total: true
};

export const contentDashboard = {
  total_subscribers: true,
  total_products: true,
  total_accounts: true,
  sub_accounts: true,
  total_revenue: true,
  revenue_graph: true,
  subscriptions_graph: true,
  churn_graph: true
};

export const singleAccount = {
  edit_account: true,
  basic_info: true,
  resource_usage: true,
  revenue: true,
  bank_details: true,
  decline: true,
  accept: true
};

export const singleSubscriber = {
  user_info: true,
  subscription_logs: true,
  subscribed_service: true,
  subscriptions: true,
  wallet_amount: true,
  recent_transaction_logs: true,
  total_revenue: true
};

export const singleProduct = {
  dashboard_product_tab: true,
  content: true,
  transactions: true,
  subscriptions: true,
  edit_product: true,
  basic_info: true,
  disapprove: true,
  approve: true,
  settings: true
};

export const singleProductDashboard = {
  status: true,
  sort: true,
  total_subscribers: true,
  total_contents: true,
  total_revenue: true,
  revenue_graphs: true,
  subscriptions_graphs: true,
  churn_graph: true,
  approve: true
};

export const singleProductContent = {
  status: true,
  show_list: true,
  create_new: true
};

export const campaignProducts = {
  push_campaign: true
};

export const financeWallerBalance = {
  top_wallet: true
};

export const financeTotalPayable = {
  generate_invoice: true
};

export const financeInvoice = {
  approval: true
};

export const settingCategories = {
  show_list: true,
  filter: true,
  create_new: true
};

export const settingNetworks = {
  show_list: true,
  filter: true,
  create_new: true
};

export const settingsPaymentChannel = {
  show_list: true,
  filter: true,
  create_new: true
};

export const settingsAccountSetup = {
  service_provider: true,
  content_provider: true
};

export const settingsRevenueSharing = {
  airtime: true,
  payment_gateway: true
};

export const supportTicket = {
  viewTicket: true,
  createTicket: true,
  updateTicket: true
};

export const supportCategories = {
  viewCategories: true,
  createCategories: true
};

export const AdminAccessControl = {
  sideBar: {
    dashboard: {
      status: true,
      data: {
        dashboard: {
          status: true,
          data: {
            total_subscribers: true,
            total_products: true,
            total_accounts: true,
            sub_accounts: false,
            total_revenue: true,
            revenue_graph: true,
            subscriptions_graph: true,
            churn_graph: true
          }
        },
        payment_transactions: true,
        subscriptions: true
      }
    },
    accounts: {
      status: true,
      data: {
        filter: true,
        create_new: true,
        create_sub_account: true,
        show_list: true,
        single_account: {
          status: true,
          data: {
            edit_account: true,
            create_sub_account: false,
            sub_accounts: false,
            basic_info: true,
            resource_usage: true,
            revenue: true,
            bank_details: true,
            decline: true,
            accept: true
          }
        }
      }
    },
    subscribers: {
      status: true,
      data: {
        search: true,
        single_subscriber: {
          status: true,
          data: {
            user_info: true,
            subscription_logs: true,
            subscribed_service: true,
            subscriptions: true,
            wallet_amount: true,
            recent_transaction_logs: true,
            total_revenue: true
          }
        }
      }
    },
    products: {
      status: true,
      data: {
        filter: true,
        create_new: false,
        show_list: true,
        single_product: {
          status: true,
          data: {
            dashboard_product_tab: {
              status: true,
              data: {
                status: true,
                approve: true,
                sort: true,
                total_subscribers: true,
                total_contents: true,
                total_revenue: true,
                revenue_graphs: true,
                subscriptions_graphs: true,
                churn_graph: true
              }
            },
            content: {
              status: true,
              data: {
                status: true,
                show_list: true,
                create_new: true
              }
            },
            transactions: true,
            subscriptions: true,
            edit_product: true,
            basic_info: true,
            disapprove: true,
            approve: true,
            settings: true
          }
        }
      }
    },
    campaigns: {
      status: true,
      data: {
        all_campaign: true,
        products: {
          status: true,
          data: {
            push_campaign: true
          }
        }
      }
    },
    finances: {
      status: true,
      data: {
        total_revenue: true,
        wallet_balance: {
          status: true,
          data: {
            top_wallet: false
          }
        },
        total_payable: {
          status: true,
          data: {
            generate_invoice: false
          }
        },
        invoices: {
          status: true,
          data: {
            approval: true
          }
        }
      }
    },
    settings: {
      status: true,
      data: {
        categories: true,
        networks: true,
        payment_channel: true,
        account_setup: true,
        revenue_sharing: true,
        finance: true,
        blacklist: true,
        bank_accounts: true,
        roles: true
      }
    },
    profile: {
      status: false,
      data: {
        basicInfo: true,
        bankDetail: true,
        subAccount: true
      }
    },
    support: {
      status: true,
      data: {
        tabSwitch: true,
        category: true,
        ticket: true,
        supportTicket: {
          status: true,
          data: {
            viewTicket: true,
            createTicket: false,
            updateTicket: true
          }
        },
        supportCategories: {
          status: true,
          data: {
            viewCategories: true,
            createCategories: true
          }
        }
      }
    },

  },
  navBar: {
    earnings: {
      status: true,
      data: {
        payable: true,
        total: true
      }
    }
  }
};

export const ServiceProviderAccessControl = {
  sideBar: {
    dashboard: {
      status: true,
      data: {
        dashboard: {
          status: true,
          data: {
            total_subscribers: true,
            total_products: true,
            total_accounts: false,
            sub_accounts: true,
            total_revenue: true,
            revenue_graph: true,
            subscriptions_graph: true,
            churn_graph: true
          }
        },
        payment_transactions: true,
        subscriptions: true
      }
    },
    accounts: {
      status: false,
      data: {
        filter: true,
        create_new: true,
        create_sub_account: false,
        show_list: true,
        single_account: {
          status: true,
          data: {
            edit_account: true,
            create_sub_account: true,
            sub_accounts: true,
            basic_info: true,
            resource_usage: false,
            revenue: false,
            bank_details: true,
            decline: false,
            accept: false
          }
        }
      }
    },
    subscribers: {
      status: false,
      data: {
        search: true,
        single_subscriber: {
          status: true,
          data: {
            user_info: true,
            subscription_logs: true,
            subscribed_service: true,
            subscriptions: true,
            wallet_amount: true,
            recent_transaction_logs: true,
            total_revenue: true
          }
        }
      }
    },
    products: {
      status: true,
      data: {
        filter: true,
        create_new: true,
        show_list: true,
        single_product: {
          status: true,
          data: {
            dashboard_product_tab: {
              status: true,
              data: {
                status: true,
                sort: true,
                approve: false,
                total_subscribers: true,
                total_contents: true,
                total_revenue: true,
                revenue_graphs: true,
                subscriptions_graphs: true,
                churn_graph: true
              }
            },
            content: {
              status: true,
              data: {
                status: true,
                show_list: true,
                create_new: true
              }
            },
            transactions: true,
            subscriptions: true,
            edit_product: true,
            basic_info: true,
            disapprove: false,
            approve: false,
            settings: true
          }
        }
      }
    },
    campaigns: {
      status: true,
      data: {
        all_campaign: true,
        products: {
          status: true,
          data: {
            push_campaign: true
          }
        }
      }
    },
    finances: {
      status: true,
      data: {
        total_revenue: true,
        wallet_balance: {
          status: true,
          data: {
            top_wallet: true
          }
        },
        total_payable: {
          status: true,
          data: {
            generate_invoice: true
          }
        },
        invoices: {
          status: true,
          data: {
            approval: false
          }
        }
      }
    },
    settings: {
      status: false,
      data: {
        categories: true,
        networks: true,
        payment_channel: true,
        account_setup: true,
        revenue_sharing: true,
        finance: true,
        blacklist: true,
        bank_accounts: true,
        roles: true
      }
    },
    profile: {
      status: true,
      data: {
        basicInfo: true,
        bankDetail: true,
        subAccount: true
      }
    },
    support: {
      status: true,
      data: {
        tabSwitch: false,
        category: false,
        ticket: true,
        supportTicket: {
          status: true,
          data: {
            viewTicket: true,
            createTicket: true,
            updateTicket: false
          }
        },
        supportCategories: {
          status: false,
          data: {
            viewCategories: false,
            createCategories: false
          }
        }
      }
    }
  },
  navBar: {
    earnings: {
      status: true,
      data: {
        payable: true,
        total: true
      }
    }
  }
};
