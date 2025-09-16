import React, { useEffect, useState } from 'react';
import { Alert } from "@patternfly/react-core/dist/esm/components/Alert/index.js";
import { Card, CardBody, CardTitle } from "@patternfly/react-core/dist/esm/components/Card/index.js";
import { Grid, GridItem, Page, PageSection, Title } from '@patternfly/react-core';
import { proxy } from 'service';

import cockpit from 'cockpit';
import { ServicesTable } from './services';
import { TAOWizard } from './wizard';
import { TAOConfig } from './config';
import { TAOInfos} from './info';

import {Service} from './interface.Service';

const _ = cockpit.gettext;

const initServices: Service[] = [
        {unit:"tao-ce.service", name: "TAO Community Edition", state: "unknown"},
        {unit:"elasticsearch.service",  name: "ElasticSearch", state: "unknown"},
        {unit:"redis.service",  name: "Redis", state: "unknown"},
        {unit:"pgsql.service",  name: "PostgresSQL", state: "unknown"},
        {unit:"pubsub-emulator.service",  name: "PubSub Emulator", state: "unknown"},
        {unit:"firestore-emulator.service",  name: "Firestore Emulator", state: "unknown"},
    ];

export const Application = () => {

    const [services, updateServices] = useState(initServices);

    const handleServiceChange = (newService: Service) => {
        updateServices(services.map((service) => {
            if(service.unit === newService.unit) {
                return newService
            }
            return service
        }));
    }

    services.forEach((service: Service) => {
        useEffect(() => {
            const serviceProxy = proxy(service.unit,
                'service'
            );

            serviceProxy.addEventListener('changed', () => {
                service.state = serviceProxy.state ?? "unknown";
                console.log("Status update " + service.state);
                handleServiceChange(service);
            });
        },[]);
    });

    const [infos] = useState({domain: "unknown"});
    
    return (
            <Page>
                <PageSection>
                    <Title headingLevel={'h1'}>TAO Community Edition</Title>
                </PageSection>
                <PageSection>
                    <Grid hasGutter>
                        <GridItem span={8}>
                            <Card>
                                <CardTitle>Wizard</CardTitle>
                                <CardBody>
                                    <TAOWizard services={services} />
                                </CardBody>
                            </Card>
                        </GridItem>
                        <GridItem span={4}>
                            <Card>
                                <CardTitle>Services</CardTitle>
                                <CardBody>
                                <ServicesTable services={services} />
                                </CardBody>
                            </Card>
                        </GridItem>
                    <GridItem span={8}>
                    <Card>
                        <CardTitle>Configuration</CardTitle>
                        <CardBody>
                            <TAOConfig/>
                        </CardBody>
                    </Card>

                    </GridItem>
                    <GridItem span={4}>
                    <Card>
                        <CardTitle>Info</CardTitle>
                        <CardBody>
                            <TAOInfos infos={infos}/>
                        </CardBody>
                    </Card>

                    </GridItem>

                    </Grid>
                </PageSection>
            </Page>
    );
};
