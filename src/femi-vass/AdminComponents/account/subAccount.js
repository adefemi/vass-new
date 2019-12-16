import React, { useEffect, useState } from "react";
import {
  Select,
  Card,
  Notification,
  FormGroup,
  Input,
  Checkbox,
  Button,
  Spinner
} from "../../../components/common";
import { axiosFunc } from "../../utils/helper";
import {
  productsUrl,
  secondaryColor,
  USERDATA,
  userUrl
} from "../../utils/data";
import { errorHandler } from "../../../components/utils/helper";
import { Link } from "react-router-dom";

function SubAccount(props) {
  const [products, setProducts] = useState({
    fetching: true,
    data: []
  });

  const getSlug = () => {
    if (props.inline) return null;
    return props.match.params.slug;
  };

  const [subAccountInfo, setSubAccountInfo] = useState({});
  const [subProducts, setSubProducts] = useState({});
  const [activeUser, setActiveUser] = useState({
    fetching: true,
    data: {}
  });
  const [slug] = useState(getSlug());

  const [roles, setRoles] = useState({
    fetching: true,
    data: []
  });

  const [submit, setSubmit] = useState(false);

  const onProductChange = e => {
    setSubProducts({
      ...subProducts,
      [e.target.name]: e.target.checked
    });
  };

  const onChange = e => {
    setSubAccountInfo({
      ...subAccountInfo,
      [e.target.name]: e.target.value
    });
  };

  const onFetchData = (status, payload, _type) => {
    try {
      if (status) {
        const activeData = payload.data.data;
        if (_type === "products") {
          setProducts({
            data: activeData,
            fetching: false
          });
        } else if (_type === "roles") {
          setRoles({
            data: activeData,
            fetching: false
          });
        } else if (_type === "sub") {
          setActiveUser({
            data: activeData,
            fetching: false
          });
          let p = {};
          activeData.products.map(item => {
            p[item] = true;
            return null;
          });
          setSubProducts(p);
          setSubAccountInfo(activeData);
        }
      } else {
      }
    } catch (e) {}
  };

  useEffect(() => {
    axiosFunc("get", productsUrl, null, "yes", onFetchData, "products");

    axiosFunc(
      "get",
      userUrl(
        `roles?${
          props.admin ? `roleAccess=admin` : "roleAccess=service_provider"
        }`
      ),
      null,
      "yes",
      onFetchData,
      "roles"
    );
    if (slug) {
      axiosFunc(
        "get",
        userUrl(`sub-accounts?subAccountId=${slug}`),
        null,
        "yes",
        onFetchData,
        "sub"
      );
    }
  }, []);

  const onCreateSubAccount = (status, payload) => {
    setSubmit(false);
    if (status) {
      Notification.bubble({
        type: "success",
        content: "Operation successful"
      });
      setSubAccountInfo({});
      setSubProducts({});
    } else {
    }
  };

  const onSubmit = e => {
    const user = JSON.parse(localStorage.getItem(USERDATA));
    e.preventDefault();
    setSubmit(true);
    let products = [];
    for (let key in subProducts) {
      if (subProducts.hasOwnProperty(key) && subProducts[key]) {
        products.push(key);
      }
    }
    let newData = {
      ...subAccountInfo,
      products,
      providerId: user.userId
    };

    axiosFunc(
      "post",
      userUrl("sub-accounts/create"),
      newData,
      "yes",
      onCreateSubAccount
    );
  };

  return (
    <div className={"max-width-1200"}>
      {!props.inline && (
        <>
          <br />
          {!slug && <div className="heading-content">Create a sub-account</div>}
          {slug && <div className="heading-content">Edit Sub-account</div>}

          <br />
          <div className="breadcrum">
            <Link
              to={"/admin"}
              onClick={() => {
                props.history.goBack();
              }}
            >
              Back
            </Link>
          </div>
          <br />
        </>
      )}

      <form onSubmit={onSubmit}>
        <Card round heading="Account Info">
          <div className="padding-20 max-width-600">
            <FormGroup title="Full Name">
              <Input
                type="text"
                name="name"
                onChange={onChange}
                disabled={slug && true}
                value={subAccountInfo.name || ""}
                required
              />
            </FormGroup>
            <FormGroup title="Email">
              <Input
                type="email"
                name="email"
                onChange={onChange}
                disabled={slug && true}
                value={subAccountInfo.email || ""}
                required
              />
            </FormGroup>
            {!slug && (
              <FormGroup title="Password">
                <Input
                  type="password"
                  name="password"
                  onChange={onChange}
                  value={subAccountInfo.password || ""}
                  required
                />
              </FormGroup>
            )}
            {slug && activeUser.fetching ? (
              <Spinner color={secondaryColor} />
            ) : (
              <FormGroup title="Role">
                {roles.fetching ? (
                  <Spinner color={secondaryColor} />
                ) : (
                  <Select
                    name="roleId"
                    onChange={onChange}
                    value={subAccountInfo.roleId || ""}
                    required
                  >
                    {roles.data.length < 1
                      ? [
                          <Select.Option value="">
                            No role available...
                          </Select.Option>
                        ]
                      : roles.data.map((item, ind) => (
                          <Select.Option key={ind} value={item.roleId}>
                            {item.name}
                          </Select.Option>
                        ))}
                  </Select>
                )}
              </FormGroup>
            )}
          </div>
        </Card>
        {!props.admin && (
          <>
            <br />
            <Card round heading="Assign Products">
              <div className="padding-20 grid-2">
                {products.fetching ? (
                  <Spinner color={secondaryColor} />
                ) : products.data.length < 1 ? (
                  <span>No products available</span>
                ) : (
                  products.data.map((item, key) => {
                    return (
                      <Checkbox
                        label={item.name}
                        onChange={onProductChange}
                        name={item.productId}
                        checked={subProducts[item.productId]}
                        key={key}
                        id={key}
                      />
                    );
                  })
                )}
              </div>
            </Card>
          </>
        )}
        <br />
        <Button type="submit" loading={submit} disabled={submit}>
          {slug ? "Update" : "Create"} Account
        </Button>
        <br />
      </form>
    </div>
  );
}

export default SubAccount;
