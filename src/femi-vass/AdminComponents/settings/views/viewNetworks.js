import React from "react";
import { Button, Card, Icon } from "../../../../components/common";
import { Link } from "react-router-dom";

function ViewNetwork(props) {
  return (
    <div className={"max-width-1200"}>
      <div className="breadcrum">
        <Link to={"/admin/settings?network"}>Networks</Link>
        <Link
          to={"/admin"}
          className={"active"}
          onClick={e => e.preventDefault()}
        >
          View Network
        </Link>
      </div>
      <Card round>
        <div className="flex flex-wrap category-view-main">
          <div className="flex-left flex-1 padding-20 max-width-600">
            <div className="img-con">
              <img src="" alt="" />
            </div>

            <table>
              <tr>
                <th>Name:</th>
                <td>Airtel</td>
              </tr>
              <tr>
                <th>Description:</th>
                <td>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                  Asperiores, assumenda at eius est inventore libero maxime
                  natus neque non nostrum nulla placeat praesentium quaerat quo
                  sapiente sequi temporibus ut vero?
                </td>
              </tr>
              <tr>
                <th>Created On:</th>
                <td>21-05-2019</td>
              </tr>
              <tr>
                <th>Updated On:</th>
                <td>21-05-2019</td>
              </tr>
            </table>
          </div>
        </div>

        <div className="padding-20">
          <Button
            onClick={() => props.history.push("/admin/network/edit/3489892390")}
          >
            <span style={{ marginRight: "5px" }}>Edit</span>{" "}
            <Icon name={"edit"} type={"feather"} />
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default ViewNetwork;
