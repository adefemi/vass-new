import React, { useEffect, useState } from "react";
import { axiosFunc } from "../../utils/helper";
import { primaryColor, supportUrlMain, userUrl } from "../../utils/data";
import { withRouter } from "react-router-dom";
import { Notification } from "../../../components/common/notification";
import { errorHandler } from "../../../components/utils/helper";
import { Card } from "../../../components/common/card";
import { Spinner } from "../../../components/common/spinner";
import "./support.css";
import Table from "antd/lib/table";
import Pagination from "antd/lib/pagination";
import { Checkbox } from "../../../components/common/checkbox";
import AppIcon from "../../../components/common/icons/Icon";
import { Button } from "../../../components/common/button";

const columns = [
    {
        title: "Id",
        dataIndex: "role_id",
        key: "role_id"
    },
    {
        title: "Name",
        dataIndex: "role_name",
        key: "role_name"
    },
    {
        title: "Access",
        dataIndex: "role_access",
        key: "role_access"
    },
    {
        title: "Assign Role", // Custom title components!
        dataIndex: "action",
        key: "action"
    }
];

const fillData = (props, dataList, selectedRole, onChange) => {
    const newArray = [];

    dataList.map((item, id) => {
        newArray.push({
            key: id,
            role_id: item.roleId,
            role_name: item.name,
            role_access: item.roleAccess,
            action: (
                <div className="table-check">
                    <Checkbox
                        id={id}
                        name={item.roleId}
                        checked={selectedRole.includes(item.roleId)}
                        onChange={() => onChange(item.roleId)}
                    />
                </div>
            )
        });
        return null;
    });
    return newArray;
};

function AssignSupportRole(props) {
    const [fetching, setFetching] = useState(true);
    const [loading, setLoading] = useState(false);
    const [fetchingRole, setFetchingRole] = useState(true);
    const [categories, setCategories] = useState({});
    const [contactId, setContactId] = useState(null);
    const [roles, setRoles] = useState([]);
    const [selectedRole, setSelectedRole] = useState([]);

    const onChange = value => {
        if (selectedRole.includes(value)) {
            setSelectedRole(selectedRole.filter(item => item !== value));
        } else {
            setSelectedRole([...selectedRole, value]);
        }
    };

    const updateGroup = () => {
        setLoading(true);

        const data = {
            categoryId: categories.categoryId,
            roleIds: selectedRole
        };
        if (contactId) {
            data.contactId = contactId;
        }
        axiosFunc(
            "post",
            supportUrlMain("contacts"),
            data,
            "yes",
            (status, data) => {
                setLoading(false);
                if (status) {
                    Notification.bubble({
                        type: "success",
                        content: "Contacts updated successfully"
                    });
                } else {
                    Notification.bubble({
                        type: "error",
                        content: errorHandler(data)
                    });
                }
            }
        );
    };

    useEffect(() => {
        axiosFunc(
            "get",
            supportUrlMain(`categories?categoryId=${props.match.params.slug}`),
            null,
            "yes",
            (status, data) => {
                if (status) {
                    if (data.data.data.length < 1) {
                        Notification.bubble({
                            type: "error",
                            content:
                                "The category you are looking for does not exist, Redirecting..."
                        });
                        setTimeout(() => props.history.push("/admin/support"), 1000);
                    }
                    setCategories(data.data.data[0]);
                    setFetching(false);
                } else {
                    Notification.bubble({
                        type: "error",
                        content: errorHandler(data)
                    });
                }
            }
        );
        axiosFunc(
            "get",
            supportUrlMain(`contacts?categoryId=${props.match.params.slug}`),
            null,
            "yes",
            (status, data) => {
                if (status) {
                    if (data.data.data.length > 0) {
                        const contactId = data.data && data.data.data[0] && data.data.data[0].contactId || null;
                        const roleId = data.data && data.data.data[0] && data.data.data[0].roleIds || [];
                        setContactId(contactId);
                        setSelectedRole(roleId);
                    }
                } else {
                    Notification.bubble({
                        type: "error",
                        content: errorHandler(data)
                    });
                }
            }
        );
        axiosFunc("get", userUrl(`roles`), null, "yes", (status, data) => {
            if (status) {
                setRoles(data.data.data);
                setFetchingRole(false);
            } else {
                Notification.bubble({
                    type: "error",
                    content: errorHandler(data)
                });
            }
        });
    }, []);

    return (
        <div className="max-width-1400">
            <div className="link" onClick={() => props.history.goBack()}>
                <AppIcon name="arrowLeft" type="feather" />
            </div>
            <br />
            <Card round className="padding-20">
                {fetching ? (
                    <Spinner color={primaryColor} />
                ) : (
                    <table className="support-table">
                        <tbody>
                        <tr>
                            <th>Name:</th>
                            <td>{categories.name}</td>
                        </tr>
                        <tr>
                            <th>CategoryId:</th>
                            <td>{categories.categoryId}</td>
                        </tr>
                        </tbody>
                    </table>
                )}
            </Card>
            <br />
            <div>
                <div className="heading-main">Roles</div>
                {fetchingRole ? (
                    <Card round className="padding-20">
                        <Spinner color={primaryColor} />{" "}
                    </Card>
                ) : (
                    <Card round>
                        <Table
                            loading={fetching}
                            columns={columns}
                            dataSource={
                                fetching ? [] : fillData(props, roles, selectedRole, onChange)
                            }
                            pagination={false}
                        />
                        <br />
                        <div className="tab-content padding-20">
                            <div className="flex justify-between align-c">
                                <div />
                                <Pagination
                                    onChange={page => null}
                                    defaultCurrent={fetching ? 1 : 1}
                                    total={10}
                                />
                            </div>
                        </div>
                    </Card>
                )}
            </div>
            <br />
            <div className="flex align-c justify-between">
                <div />
                <Button onClick={updateGroup} loading={loading} disabled={loading}>
                    Update
                </Button>
            </div>
        </div>
    );
}

export default withRouter(AssignSupportRole);
