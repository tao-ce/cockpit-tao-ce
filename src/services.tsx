import { Table, Thead, Tr, Th, Tbody, Td } from '@patternfly/react-table';
import React, { Fragment } from 'react';

import {proxy} from 'service';
import { Icon, Spinner } from '@patternfly/react-core';

import { MdError, MdOutlineStopCircle, MdOutlinePlayCircle, MdOutlineQuestionMark } from "react-icons/md";



const ServiceStatus: React.FunctionComponent = (props: any) => {
    switch (props.state) {
        case "running":
            return <Icon status="success"><MdOutlinePlayCircle/></Icon>
        case "failed":
            return <Icon status="danger"><MdError/></Icon>
        case "starting":
            return <Spinner size="sm" aria-label="Starting" />
        case "stopping":
            return <Spinner size="sm" aria-label="Stopping" />
            // return <Icon status="warning"><MdOutlinePlayCircle/></Icon>
        case "stopped":
            return <Icon status="warning"><MdOutlineStopCircle/></Icon>
    }
    return <Icon status="warning"><MdOutlineQuestionMark/></Icon>
}


const ServiceLine: React.FunctionComponent = (props: any) => {
        const service = props.service;
    
        return  <Tr key={service.unit}>
                    <Td dataLabel="name">{service.name}</Td>
                    <Td dataLabel="state">
                        <ServiceStatus state={service.state} />
                        {" "}
                        {service.state}
                    </Td>
                </Tr>;
}

export const ServicesTable: React.FunctionComponent = (props: { services: any[]; updateServices: any}) => {


    return (
        <>
            <Table>
                <Thead>
                    <Tr>
                    <Th>Service name</Th>
                    <Th>Service status</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {props.services.map((service) => (
                        <ServiceLine key={service.unit} service={service} />
                    ))}
                </Tbody>
            </Table>
        </>
    )
}