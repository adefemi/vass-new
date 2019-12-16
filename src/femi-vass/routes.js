import React, {lazy, Suspense} from "react";
import { Route } from "react-router-dom";
import AdminLayout from "./layouts/AdminLayout/AdminLayout";
import AuthController from "./HOC/authcontroller";
import {Spinner} from "../components/common/spinner";
import {primaryColor} from "./utils/data";

const Loading = <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "80vh"
}}><Spinner size={30} color={primaryColor}/></div>;

const LoginView = lazy(() => import("./AdminComponents/login/login"));
const ForgotPassword = lazy(() => import("./AdminComponents/forgotPassword/forgotPassword"));
const ResetPassword = lazy(() => import("./AdminComponents/forgotPassword/resetPassword"));
const Dashboard = lazy(() => import("./AdminComponents/dashboard/Dashboard"));
const ViewCategory = lazy(() => import("./AdminComponents/settings/views/viewCategory"));
const SupportMain = lazy(() => import("./AdminComponents/Support/supportMain"));
const Finance = lazy(() => import("./AdminComponents/finance/Finance"));
const AssignSupportRole = lazy(() => import("./AdminComponents/Support/assignSupportRole"));
const ViewChannel = lazy(() => import("./AdminComponents/settings/views/viewChannels"));
const ViewNetwork = lazy(() => import("./AdminComponents/settings/views/viewNetworks"));
const ViewProduct = lazy(() => import("./AdminComponents/products/productView"));
const Campaign = lazy(() => import("./AdminComponents/campaign/campaign"));
const SingleCampaign = lazy(() => import("./AdminComponents/campaign/components/singleCampaign"));
const NewCampaign = lazy(() => import("./AdminComponents/campaign/components/newCampaign"));
const NewTicket = lazy(() => import("./AdminComponents/Support/components/newTicket"));
const Audits = lazy(() => import("./AdminComponents/audits/audits"));
const ContentManagement = lazy(() => import("./AdminComponents/contents/serviceContentEdit"));
const SingleContent = lazy(() => import("./AdminComponents/contents/singleContent"));
const SubAccount = lazy(() => import("./AdminComponents/account/subAccount"));
const AllSubAccounts = lazy(() => import("./AdminComponents/account/allSubAccounts"));
const Invoice = lazy(() => import("./AdminComponents/finance/invoice"));
const SingleSubscriber = lazy(() => import("./AdminComponents/subscriber/singleSubscriber"));
const Setting = lazy(() => import("./AdminComponents/settings/Setting"));
const CreateCategory = lazy(() => import("./AdminComponents/settings/views/CreateCategory"));
const CreateNetwork = lazy(() => import("./AdminComponents/settings/views/CreateNetwork"));
const CreateChannel = lazy(() => import("./AdminComponents/settings/views/CreateChannel"));
const Services = lazy(() => import("./AdminComponents/subscriber/Subscriber"));
const Account = lazy(() => import("./AdminComponents/account/account"));
const AccountView = lazy(() => import("./AdminComponents/account/accountView"));
const Product = lazy(() => import("./AdminComponents/products/Product"));
const Content = lazy(() => import("./AdminComponents/contents/Content"));

const Routes = () => (
    <div className="femi-controller">
          <Suspense fallback={Loading}>
                <Route exact path="/login-admin" component={LoginView} />
                <Route exact path="/forgot-password" component={ForgotPassword} />
                <Route exact path="/reset-password" component={ResetPassword} />

          </Suspense>
          <Route
              path="/admin"
              render={props => (
                  <AdminLayout {...props}>
                        <Suspense fallback={Loading} >
                              <Route exact path="/admin" component={AuthController(Dashboard)} />
                              <Route
                                  exact
                                  path="/admin/category/view/:slug"
                                  component={AuthController(ViewCategory)}
                              />
                              <Route
                                  exact
                                  path="/admin/network/view/:slug"
                                  component={AuthController(ViewNetwork)}
                              />
                              <Route
                                  exact
                                  path="/admin/support"
                                  component={AuthController(SupportMain)}
                              />
                              <Route
                                  exact
                                  path="/admin/support/assign/:slug"
                                  component={AuthController(AssignSupportRole)}
                              />
                              <Route
                                  exact
                                  path="/admin/support/ticket/new"
                                  component={AuthController(NewTicket)}
                              />
                              <Route
                                  exact
                                  path="/admin/support/:slug"
                                  component={AuthController(AssignSupportRole)}
                              />
                              <Route
                                  exact
                                  path="/admin/channel/view/:slug"
                                  component={AuthController(ViewChannel)}
                              />
                              <Route
                                  exact
                                  path="/admin/category/add"
                                  component={AuthController(CreateCategory)}
                              />
                              <Route
                                  exact
                                  path="/admin/network/add"
                                  component={AuthController(CreateNetwork)}
                              />
                              <Route
                                  exact
                                  path="/admin/channel/add"
                                  component={AuthController(CreateChannel)}
                              />
                              <Route
                                  exact
                                  path="/admin/category/edit/:slug"
                                  component={props => <CreateCategory {...props} edit />}
                              />
                              <Route
                                  exact
                                  path="/admin/channel/edit/:slug"
                                  component={props => <CreateChannel {...props} edit />}
                              />
                              <Route
                                  exact
                                  path="/admin/network/edit/:slug"
                                  component={props => <CreateNetwork {...props} edit />}
                              />
                              <Route
                                  exact
                                  path="/admin/account-subs"
                                  component={AuthController(AllSubAccounts)}
                              />
                              <Route
                                  exact
                                  path="/admin/account"
                                  component={AuthController(Account)}
                              />
                              <Route
                                  exact
                                  path="/admin/account-create"
                                  component={AuthController(SubAccount)}
                              />
                              <Route
                                  exact
                                  path="/admin/account-edit/:slug"
                                  component={AuthController(SubAccount)}
                              />
                              <Route
                                  exact
                                  path="/admin/campaign"
                                  component={AuthController(Campaign)}
                              />
                              <Route
                                  exact
                                  path="/admin/finance/invoice/:slug"
                                  component={AuthController(Invoice)}
                              />
                              <Route
                                  exact
                                  path="/admin/account/:slug"
                                  component={AuthController(AccountView)}
                              />
                              <Route
                                  exact
                                  path="/admin/services"
                                  component={AuthController(Product)}
                              />
                              <Route
                                  exact
                                  path="/admin/audits"
                                  component={AuthController(Audits)}
                              />
                              <Route
                                  exact
                                  path="/admin/services/:slug"
                                  component={AuthController(ViewProduct)}
                              />
                              <Route
                                  exact
                                  path="/admin/campaign/:slug/new"
                                  component={AuthController(NewCampaign)}
                              />
                              <Route
                                  exact
                                  path="/admin/campaign/view/:slug"
                                  component={AuthController(SingleCampaign)}
                              />
                              <Route
                                  exact
                                  path="/admin/content/view/:slug"
                                  component={AuthController(SingleContent)}
                              />
                              <Route
                                  exact
                                  path="/admin/content/edit/:slug"
                                  component={AuthController(props => (
                                      <ContentManagement {...props} edit />
                                  ))}
                              />

                              <Route
                                  exact
                                  path="/admin/subscriber/view/:slug"
                                  component={AuthController(SingleSubscriber)}
                              />

                              <Route
                                  exact
                                  path="/admin/services/:slug/create"
                                  component={ContentManagement}
                              />

                              <Route
                                  exact
                                  path="/admin/subscribers"
                                  component={AuthController(Services)}
                              />
                              <Route exact path="/admin/settings" component={Setting} />
                              <Route
                                  exact
                                  path="/admin/contents"
                                  component={AuthController(Content)}
                              />
                              <Route
                                  exact
                                  path="/admin/finance"
                                  component={AuthController(Finance)}
                              />
                        </Suspense>
                  </AdminLayout>
              )}
          />
          <Suspense fallback={Loading}>
                <Route path="*" component={() => <h3>404 page not found</h3>} />
          </Suspense>
    </div>
);

export default Routes;
