import React, { useEffect, useState } from "react";
import {
  planConfigUrl,
  primaryColor,
  secondaryColor
} from "../../../utils/data";
import { Spinner, Notification, Icon } from "../../../../components/common";
import ReactTable from "react-table";
import { errorHandler } from "../../../../components/utils/helper";
import { axiosFunc } from "../../../utils/helper";

const data = (props, providers) => {
  const newArray = [];

  providers.map(item => {
    newArray.push({
      amount: item.amount,
      name: item.name,
      renewable: item.renewable,
      validity: item.validity,
      test: item.test
    });
    return null;
  });
  return newArray;
};

const columns = [
  {
    Header: "Amount",
    accessor: "amount" // String-based value accessors!
  },
  {
    Header: "Name",
    accessor: "name"
  },
  {
    Header: "Renewable",
    accessor: "renewable"
  },
  {
    Header: "Validity",
    accessor: "validity"
  },
  {
    Header: "Test", // Custom header components!
    accessor: "test"
  }
];

function Plan(props) {
  const [showNetwork, setShowNetwork] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [networks, setNetworks] = useState([]);
  const [activeNetworks, setActiveNetworks] = useState(null);

  const setActiveNetwork = id => {
    let activeChan = networks.filter(item => item.networkId === id)[0];
    setActiveNetworks(activeChan);
    setShowNetwork(true);
  };

  const onFetchData = (status, payload) => {
    if (status) {
      setNetworks(payload.data.data);
      setFetching(false);
    } else {
    }
  };

  useEffect(() => {
    if (!props.static) {
      axiosFunc(
        "get",
        planConfigUrl(props.activeProductId),
        null,
        null,
        onFetchData
      );
    }
  }, []);
  return (
    <div>
      {props.fetching ? (
        <Spinner color={secondaryColor} />
      ) : (
        <React.Fragment>
          <div
            className="flex align-c create-comp float-right"
            onClick={() => null}
            style={{ marginRight: "20px" }}
          >
            <div>
              <Icon
                type={"feather"}
                name={"plusCircle"}
                style={{ color: primaryColor }}
              />
            </div>
            <div>Create New Plan</div>
          </div>
          <div className={"clear-fix"} />
          <br />
          <br />
          <ReactTable
            data={data(props, networks, setActiveNetwork)}
            columns={columns}
            className={"react-table"}
            defaultPageSize={networks.length < 5 ? 5 : 10}
          />
        </React.Fragment>
      )}
    </div>
  );
}

export default Plan;
