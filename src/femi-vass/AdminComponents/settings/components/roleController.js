import React, { useEffect, useState } from "react";
import ListRole from "./listRole";
import TabRoles from "./TabRoles";
import { axiosFunc } from "../../../utils/helper";
import { userUrl } from "../../../utils/data";
import { Notification } from "../../../../components/common";
import { errorHandler } from "../../../../components/utils/helper";

function RoleController(props) {
  const [roles, setRoles] = useState({
    fetching: true,
    data: []
  });
  const [updateRole, setUpdateRole] = useState(false);
  const [activeRole, setActive] = useState(null);

  const onFetchRoles = (status, payload) => {
    if (status) {
      setRoles({
        data: payload.data.data,
        fetching: false
      });
    } else {
      Notification.bubble({
        type: "error",
        content: errorHandler(payload)
      });
    }
  };

  const setActiveRole = id => {
    setActive(roles.data.filter(item => item.roleId === id)[0]);
    setUpdateRole(true);
  };

  const closeUpdate = () => {
    setActive(null);
    setUpdateRole(false);
  };

  const fetchRoles = (type = null) => {
    if (type) {
      setRoles({
        fetching: true,
        data: []
      });
    }
    axiosFunc("get", userUrl("roles"), null, "yes", onFetchRoles);
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  return (
    <div>
      <ListRole
        {...props}
        roleInfo={roles}
        onUpDate={id => setActiveRole(id)}
      />
      <TabRoles
        {...props}
        fetchRoles={fetchRoles}
        update={updateRole}
        activeRole={activeRole}
        cancelUpdate={closeUpdate}
      />
    </div>
  );
}

export default RoleController;
