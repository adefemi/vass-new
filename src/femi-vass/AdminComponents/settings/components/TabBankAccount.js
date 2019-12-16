import React, { useEffect, useState } from "react";
import {
  Button,
  Input,
  Notification,
  FormGroup,
  Card,
  Select
} from "../../../../components/common";
import { errorHandler } from "../../../../components/utils/helper";
import Table from "antd/lib/table";
import Divider from "antd/lib/divider";
import { axiosFunc } from "../../../utils/helper";
import { bankAccountFetchUrl, bankAccountUrl } from "../../../utils/data";

function TabBankAccount(props) {
  const [bankInfo, setBankInfo] = useState({});
  const [update, setUpdate] = useState(false);

  const [loading, setLoading] = useState(false);
  const [bankType, setType] = useState("local");

  const onChangeBank = e => {
    setBankInfo({
      ...bankInfo,
      [e.target.name]: e.target.value
    });
  };

  const onSubmit = (status, payload) => {
    setLoading(false);
    if (status) {
      Notification.bubble({
        type: "success",
        content: "Operation Successful"
      });
      setBankInfo({})
      props.setTrigger(true)
    } else {
      Notification.bubble({
        type: "error",
        content: errorHandler(payload)
      });
    }
  };

  useEffect(() => {
    if (props.bankAvailable) {
      setBankInfo(props.bankInfo);
      setType(props.bankInfo.type);
      setUpdate(true);
    }
  }, [props]);

  const submit = e => {
    e.preventDefault();
    let _tempData = { ...bankInfo };
    if (bankType !== "local") {
      _tempData.type = "international";
    } else {
      _tempData.type = "local";
    }
    setLoading(true);
    axiosFunc("post", bankAccountUrl(), _tempData, "yes", onSubmit);
  };

  return (
    <React.Fragment>
      <div className="max-width-600">
        <form onSubmit={submit}>
          <FormGroup title="Bank Locality">
            <Select
              value={bankType}
              onChange={e => {
                setBankInfo({});
                setType(e.target.value);
              }}
            >
              <Select.Option value="local">Local</Select.Option>
              <Select.Option value="international">International</Select.Option>
            </Select>
          </FormGroup>
          <Divider />
          <FormGroup title="Bank Name">
            <Input
              name="bankName"
              value={bankInfo.bankName || ""}
              onChange={onChangeBank}
            />
          </FormGroup>
          {bankType === "local" ? (
            <FormGroup title="Account Name">
              <Input
                name="accountName"
                value={bankInfo.accountName || ""}
                onChange={onChangeBank}
              />
            </FormGroup>
          ) : (
            <FormGroup title="Beneficiary Name">
              <Input
                name="beneficiaryName"
                value={bankInfo.beneficiaryName || ""}
                onChange={onChangeBank}
              />
            </FormGroup>
          )}

          <FormGroup title="Account Number">
            <Input
              type="number"
              name="accountNumber"
              value={bankInfo.accountNumber || ""}
              onChange={onChangeBank}
            />
          </FormGroup>
          {bankType !== "local" && (
            <>
              <FormGroup title="Bank Address">
                <Input
                  name="bankAddress"
                  value={bankInfo.bankAddress || ""}
                  onChange={onChangeBank}
                />
              </FormGroup>
              <FormGroup title="Swift Code">
                <Input
                  type="number"
                  name="swiftCode"
                  value={bankInfo.swiftCode || ""}
                  onChange={onChangeBank}
                />
              </FormGroup>
              <FormGroup title="Sort Code">
                <Input
                  type="number"
                  name="sortCode"
                  value={bankInfo.sortCode || ""}
                  onChange={onChangeBank}
                />
              </FormGroup>
              <FormGroup title="Iban Number">
                <Input
                  type="number"
                  name="ibanNumber"
                  value={bankInfo.ibanNumber || ""}
                  onChange={onChangeBank}
                />
              </FormGroup>
            </>
          )}
          <br />
          <Button type="submit" loading={loading} disabled={loading}>
            {update ? "Update" : "Create"}
          </Button>
          <br />
          <br />
        </form>
      </div>
    </React.Fragment>
  );
}

const data = providers => {
  const newArray = [];

  providers.map((item, key) => {
    newArray.push({
      key,
      bank_name: item.bankName,
      acc_number: item.accountNumber,
      account_name: item.accountName,
      // action: (
      //   <span className="link" onClick={() => null}>
      //     Delete
      //   </span>
      // )
    });
    return null;
  });
  return newArray;
};

const columns = [
  {
    title: "Bank Name",
    dataIndex: "bank_name",
    key: "bank_name"
  },
  {
    title: "Account Number",
    dataIndex: "acc_number",
    key: "acc_number"
  },

  {
    title: "Account Name",
    dataIndex: "account_name",
    key: "account_name"
  },
  {
    title: "Actions",
    dataIndex: "action",
    key: "action"
  }
];

export const BankAccounts = props => {
  const [fetching, setFetching] = useState(true);
  const [bankAccounts, setBankAccount] = useState([]);

  useEffect(() => {
    getBankAccounts()
  }, []);

  useEffect(() => {
    if(props.trigger){
      setFetching(true)
      getBankAccounts()
      props.setTrigger(false)
    }
  }, [props.trigger])

  const getBankAccounts = () => {
    const extra = props.providerId ? `providerId=${props.providerId}` : "";
    axiosFunc(
        "get",
        bankAccountFetchUrl(extra),
        null,
        "yes",
        (status, payload) => {
          if (status) {
            setBankAccount(payload.data.data);
            setFetching(false);
          } else {
            Notification.bubble({
              type: "error",
              content: errorHandler(payload)
            });
          }
        }
    );
  }

  return (
    <React.Fragment>
      <br />
      <br />
      <Card
        round
        heading={
          <div className="flex justify-between align-c">
            <div>Bank Accounts</div>
          </div>
        }
      >
        <div className="padding-20">
          <Table
            loading={fetching}
            columns={columns}
            dataSource={data(bankAccounts)}
          />
        </div>
      </Card>
      <br />
      <br />
    </React.Fragment>
  );
};

export default TabBankAccount;
