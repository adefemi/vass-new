import React from "react";
import Table from "antd/lib/table";

const data = (roles, update) => {
  const newArray = [];

  roles.map((item, key) => {
    newArray.push({
      key,
      name: item.name,
      roleAccess: item.roleAccess,
      action: (
        <span className="link" onClick={() => update(item.roleId)}>
          Update
        </span>
      )
    });
    return null;
  });
  return newArray;
};

const columns = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name"
  },
  {
    title: "Role Access",
    dataIndex: "roleAccess",
    key: "name"
  },
  {
    title: "Action",
    dataIndex: "action",
    key: "action"
  }
];

function ListRole(props) {
  return (
    <div>
      <div className="heading-content">Available Roles</div>
      <Table
        loading={props.roleInfo.fetching}
        columns={columns}
        dataSource={
          props.roleInfo.fetching
            ? []
            : data(props.roleInfo.data, props.onUpDate)
        }
      />
      <br />
      <div className="divider" />
      <br />
    </div>
  );
}

export default ListRole;
