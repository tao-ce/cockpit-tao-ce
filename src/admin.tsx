
import React from "react";
import { Table, Tr, Td, Tbody } from "@patternfly/react-table";
import { Button } from "@patternfly/react-core";
const TAOAdminLine: React.FunctionComponent = ({admin}) => {
    return (
    <Tr>
        <Td>
            {admin.login}
        </Td>
        <Td>
            {admin.id}
        </Td>
        <Td>
            <Button variant="tertiary">Update password</Button>
        </Td>
    </Tr>);
}

export const TAOAdminUI: React.FunctionComponent = ({admins}) => {
    return <Table>
        <Tbody>
            {admins?.map(admin => <TAOAdminLine admin={admin} key={admin.id} />)}
        </Tbody>
        </Table>
}