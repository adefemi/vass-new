import React, { lazy, Suspense } from "react";
import { Route, Redirect, BrowserRouter, Switch } from "react-router-dom";
import { Spinner } from "../components/common/spinner";
import AdminLayout from "./layouts/AdminLayout/AdminLayout";
import AuthController from "./HOC/authcontroller";
import { primaryColor } from "./utils/data";

const Loading = (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "80vh"
    }}
  >
    <Spinner size={30} color={primaryColor} />
  </div>
);

const LoginView = lazy(() => import("./AdminComponents/login/login"));
const ForgotPassword = lazy(() =>
  import("./AdminComponents/forgotPassword/forgotPassword")
);
const ResetPassword = lazy(() =>
  import("./AdminComponents/forgotPassword/resetPassword")
);
const Dashboard = lazy(() => import("./AdminComponents/dashboard/Dashboard"));
const ViewCategory = lazy(() =>
  import("./AdminComponents/settings/views/viewCategory")
);
const SupportMain = lazy(() => import("./AdminComponents/Support/supportMain"));
const Finance = lazy(() => import("./AdminComponents/finance/Finance"));
const AssignSupportRole = lazy(() =>
  import("./AdminComponents/Support/assignSupportRole")
);
const ViewChannel = lazy(() =>
  import("./AdminComponents/settings/views/viewChannels")
);
const ViewNetwork = lazy(() =>
  import("./AdminComponents/settings/views/viewNetworks")
);
const ViewProduct = lazy(() =>
  import("./AdminComponents/products/productView")
);
const Campaign = lazy(() => import("./AdminComponents/campaign/campaign"));
const SingleCampaign = lazy(() =>
  import("./AdminComponents/campaign/components/singleCampaign")
);
const NewCampaign = lazy(() =>
  import("./AdminComponents/campaign/components/newCampaign")
);
const NewTicket = lazy(() =>
  import("./AdminComponents/Support/components/newTicket")
);
const Audits = lazy(() => import("./AdminComponents/audits/audits"));
const ContentManagement = lazy(() =>
  import("./AdminComponents/contents/serviceContentEdit")
);
const SingleContent = lazy(() =>
  import("./AdminComponents/contents/singleContent")
);
const SubAccount = lazy(() => import("./AdminComponents/account/subAccount"));
const AllSubAccounts = lazy(() =>
  import("./AdminComponents/account/allSubAccounts")
);
const Invoice = lazy(() => import("./AdminComponents/finance/invoice"));
const SingleSubscriber = lazy(() =>
  import("./AdminComponents/subscriber/singleSubscriber")
);
const Setting = lazy(() => import("./AdminComponents/settings/Setting"));
const CreateCategory = lazy(() =>
  import("./AdminComponents/settings/views/CreateCategory")
);
const CreateNetwork = lazy(() =>
  import("./AdminComponents/settings/views/CreateNetwork")
);
const CreateChannel = lazy(() =>
  import("./AdminComponents/settings/views/CreateChannel")
);
const Services = lazy(() => import("./AdminComponents/subscriber/Subscriber"));
const Account = lazy(() => import("./AdminComponents/account/account"));
const AccountView = lazy(() => import("./AdminComponents/account/accountView"));
const Product = lazy(() => import("./AdminComponents/products/Product"));
const Content = lazy(() => import("./AdminComponents/contents/Content"));

const Routes = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" render={() => <Redirect to="/admin" />} />
      <Route
        exact
        path="/login-admin"
        component={props => (
          <Suspense fallback={Loading}>
            <LoginView {...props} />
          </Suspense>
        )}
      />
      <Route
        exact
        path="/forgot-password"
        component={props => (
          <Suspense fallback={Loading}>
            <ForgotPassword {...props} />
          </Suspense>
        )}
      />
      <Route
        exact
        path="/reset-password"
        component={props => (
          <Suspense fallback={Loading}>
            <ResetPassword {...props} />
          </Suspense>
        )}
      />
      <Route path="/admin">
        <AdminLayout>
          <Route
            exact
            path="/admin"
            component={AuthController(props => (
              <Suspense fallback={Loading}>
                <Dashboard {...props} />
              </Suspense>
            ))}
          />
          <Route
            exact
            path="/admin/category/view/:slug"
            component={AuthController(props => (
              <Suspense fallback={Loading}>
                <ViewCategory {...props} />
              </Suspense>
            ))}
          />
          <Route
            exact
            path="/admin/network/view/:slug"
            component={AuthController(props => (
              <Suspense fallback={Loading}>
                <ViewNetwork {...props} />
              </Suspense>
            ))}
          />
          <Route
            exact
            path="/admin/support"
            component={AuthController(props => (
              <Suspense fallback={Loading}>
                <SupportMain {...props} />
              </Suspense>
            ))}
          />
          <Route
            exact
            path="/admin/support/assign/:slug"
            component={AuthController(props => (
              <Suspense fallback={Loading}>
                <AssignSupportRole {...props} />
              </Suspense>
            ))}
          />
          <Route
            exact
            path="/admin/support/ticket/new"
            component={AuthController(props => (
              <Suspense fallback={Loading}>
                <NewTicket {...props} />
              </Suspense>
            ))}
          />
          <Route
            exact
            path="/admin/support/:slug"
            component={AuthController(props => (
              <Suspense fallback={Loading}>
                <AssignSupportRole {...props} />
              </Suspense>
            ))}
          />
          <Route
            exact
            path="/admin/channel/view/:slug"
            component={AuthController(props => (
              <Suspense fallback={Loading}>
                <ViewChannel {...props} />
              </Suspense>
            ))}
          />
          <Route
            exact
            path="/admin/category/add"
            component={AuthController(props => (
              <Suspense fallback={Loading}>
                <CreateCategory {...props} />
              </Suspense>
            ))}
          />
          <Route
            exact
            path="/admin/network/add"
            component={AuthController(props => (
              <Suspense fallback={Loading}>
                <CreateNetwork {...props} />
              </Suspense>
            ))}
          />
          <Route
            exact
            path="/admin/channel/add"
            component={AuthController(props => (
              <Suspense fallback={Loading}>
                <CreateChannel {...props} />
              </Suspense>
            ))}
          />
          <Route
            exact
            path="/admin/category/edit/:slug"
            component={AuthController(props => (
              <Suspense fallback={Loading}>
                <CreateCategory {...props} edit />
              </Suspense>
            ))}
          />
          <Route
            exact
            path="/admin/channel/edit/:slug"
            component={AuthController(props => (
              <Suspense fallback={Loading}>
                <CreateChannel {...props} edit />
              </Suspense>
            ))}
          />
          <Route
            exact
            path="/admin/network/edit/:slug"
            component={AuthController(props => (
              <Suspense fallback={Loading}>
                <CreateNetwork {...props} edit />
              </Suspense>
            ))}
          />
          <Route
            exact
            path="/admin/account-subs"
            component={AuthController(props => (
              <Suspense fallback={Loading}>
                <AllSubAccounts {...props} />
              </Suspense>
            ))}
          />
          <Route
            exact
            path="/admin/account"
            component={AuthController(props => (
              <Suspense fallback={Loading}>
                <Account {...props} />
              </Suspense>
            ))}
          />
          <Route
            exact
            path="/admin/account-create"
            component={AuthController(props => (
              <Suspense fallback={Loading}>
                <SubAccount {...props} />
              </Suspense>
            ))}
          />
          <Route
            exact
            path="/admin/account-edit/:slug"
            component={AuthController(props => (
              <Suspense fallback={Loading}>
                <SubAccount {...props} edit />
              </Suspense>
            ))}
          />
          <Route
            exact
            path="/admin/campaign"
            component={AuthController(props => (
              <Suspense fallback={Loading}>
                <Campaign {...props} />
              </Suspense>
            ))}
          />
          <Route
            exact
            path="/admin/finance/invoice/:slug"
            component={AuthController(props => (
              <Suspense fallback={Loading}>
                <Invoice {...props} />
              </Suspense>
            ))}
          />
          <Route
            exact
            path="/admin/account/:slug"
            component={AuthController(props => (
              <Suspense fallback={Loading}>
                <AccountView {...props} />
              </Suspense>
            ))}
          />
          <Route
            exact
            path="/admin/services"
            component={AuthController(props => (
              <Suspense fallback={Loading}>
                <Product {...props} />
              </Suspense>
            ))}
          />
          <Route
            exact
            path="/admin/audits"
            component={AuthController(props => (
              <Suspense fallback={Loading}>
                <Audits {...props} />
              </Suspense>
            ))}
          />
          <Route
            exact
            path="/admin/services/:slug"
            component={AuthController(props => (
              <Suspense fallback={Loading}>
                <ViewProduct {...props} />
              </Suspense>
            ))}
          />
          <Route
            exact
            path="/admin/campaign/:slug/new"
            component={AuthController(props => (
              <Suspense fallback={Loading}>
                <NewCampaign {...props} />
              </Suspense>
            ))}
          />
          <Route
            exact
            path="/admin/campaign/view/:slug"
            component={AuthController(props => (
              <Suspense fallback={Loading}>
                <SingleCampaign {...props} />
              </Suspense>
            ))}
          />
          <Route
            exact
            path="/admin/content/view/:slug"
            component={AuthController(props => (
              <Suspense fallback={Loading}>
                <SingleContent {...props} />
              </Suspense>
            ))}
          />
          <Route
            exact
            path="/admin/content/edit/:slug"
            component={AuthController(props => (
              <Suspense fallback={Loading}>
                <ContentManagement {...props} edit />
              </Suspense>
            ))}
          />
          <Route
            exact
            path="/admin/subscriber/view/:slug"
            component={AuthController(props => (
              <Suspense fallback={Loading}>
                <SingleSubscriber {...props} />
              </Suspense>
            ))}
          />
          <Route
            exact
            path="/admin/services/:slug/create"
            component={props => (
              <Suspense fallback={Loading}>
                <ContentManagement {...props} />
              </Suspense>
            )}
          />
          <Route
            exact
            path="/admin/subscribers"
            component={AuthController(props => (
              <Suspense fallback={Loading}>
                <Services {...props} />
              </Suspense>
            ))}
          />
          <Route
            exact
            path="/admin/settings"
            component={props => (
              <Suspense fallback={Loading}>
                <Setting {...props} />
              </Suspense>
            )}
          />
          <Route
            exact
            path="/admin/contents"
            component={props => (
              <Suspense fallback={Loading}>
                <Content {...props} />
              </Suspense>
            )}
          />
          <Route
            exact
            path="/admin/finance"
            component={props => (
              <Suspense fallback={Loading}>
                <Finance {...props} />
              </Suspense>
            )}
          />
        </AdminLayout>
      </Route>
      <Route path="/404" component={() => <div>404 page not found!</div>} />
      <Redirect path="*" exact to="/404" />
    </Switch>
  </BrowserRouter>
);

export default Routes;
