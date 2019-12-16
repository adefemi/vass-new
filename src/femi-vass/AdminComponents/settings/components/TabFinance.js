import React, { useState, useEffect } from "react";
import {
  Button,
  Input,
  Notification,
  Spinner,
  FormGroup
} from "../../../../components/common";
import { axiosFunc } from "../../../utils/helper";
import { secondaryColor, utilitiesUrl } from "../../../utils/data";
import { errorHandler } from "../../../../components/utils/helper";

function TabFinance() {
  const [utilData, setUtilData] = useState([]);
  const [util, setUtil] = useState({});
  const [fetching, setFetching] = useState(true);

  const [loading, setLoading] = useState(false);

  const changeData = e => {
    setUtil({
      ...util,
      [e.target.name]: e.target.value
    });
  };

  const onSubmit = (status, payload) => {
    setLoading(false);

    if (status) {
      Notification.bubble({
        type: "success",
        content: "Settings saved successfully"
      });
    } else {
      Notification.bubble({
        type: "error",
        content: errorHandler(payload)
      });
    }
  };

  const submit = (e, type) => {
    e.preventDefault();
    setLoading(true);
    let newData = [];

    for (let i in util) {
      newData.push({
        key: i,
        value: util[i]
      });
    }
    axiosFunc("put", utilitiesUrl(), newData, "yes", onSubmit, type);
  };

  const onGetData = (status, payload) => {
    if (status) {
      if (payload.data.data && payload.data.data.length > 0) {
        let newData = {};
        payload.data.data.map(item => {
          newData[item.key] = item.value;
          return null;
        });
        setUtil(newData);
        setUtilData(payload.data.data);
        setFetching(false);
      }
    } else {
    }
  };

  useEffect(() => {
    axiosFunc("get", utilitiesUrl(), null, "yes", onGetData);
  }, []);

  return (
    <React.Fragment>
      {fetching ? (
        <Spinner color={secondaryColor} />
      ) : (
        <div className="max-width-600">
          <form onSubmit={e => submit(e, "email")}>
            {utilData.map((item, key) => (
              <FormGroup
                key={key}
                title={
                  <span style={{ textTransform: "capitalize" }}>
                    {item.key.replace(/_/g, " ")}
                  </span>
                }
                className="flex-1"
              >
                <div className="flex">
                  <Input
                    name={item.key}
                    value={util[item.key] || ""}
                    onChange={changeData}
                    required
                    style={{ width: "100%" }}
                  />
                </div>
              </FormGroup>
            ))}
            <Button type="submit" loading={loading} disabled={loading}>
              Update
            </Button>
          </form>
        </div>
      )}
    </React.Fragment>
  );
}

export default TabFinance;
