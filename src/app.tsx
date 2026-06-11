import React, { createRef, useEffect, useState } from 'react';
import { Alert } from "@patternfly/react-core/dist/esm/components/Alert/index.js";
import { Card, CardBody, CardExpandableContent, CardHeader, CardTitle } from "@patternfly/react-core/dist/esm/components/Card/index.js";
import { Grid, GridItem, Page, PageSection, Title, Tabs, Tab, TabTitleText, Button, Flex, FlexItem, TabTitleIcon, TabContent, TabContentBody, Accordion } from '@patternfly/react-core';
import { proxy } from 'service';

import cockpit from 'cockpit';
import { ServicesTable } from './services';
import { TAOWizard } from './wizard';
import { TAOConfig as TAOConfigUI } from './config';
import { TAOInfos} from './info';

import { getAdmins } from './gateway/elasticsearch.admins';

import {Service} from './interface.Service';
import {TAOUser} from './interface.TAOUser';
import {TAOConfig} from './interface.TAOConfig';
import { parse as yamlParse } from "yaml";
import { PageHeader } from '@patternfly/react-component-groups';
import { HotSpot } from './hotspot';
import { BoxIcon, CogIcon, NetworkIcon, SlidersHIcon, SunIcon } from '@patternfly/react-icons';
import { TAOAdminUI } from './admin';
import { getAdmins } from './gateway/elasticsearch.admins';

const _ = cockpit.gettext;

const initAdmins: TAOUser[] = [];

const initServices: Service[] = [
        {unit:"tao-ce.service", name: "TAO Community Edition", state: "unknown"},
        {unit:"elasticsearch.service",  name: "ElasticSearch", state: "unknown"},
        {unit:"redis.service",  name: "Redis", state: "unknown"},
        {unit:"pgsql.service",  name: "PostgresSQL", state: "unknown"},
        {unit:"pubsub-emulator.service",  name: "PubSub Emulator", state: "unknown"},
        {unit:"firestore-emulator.service",  name: "Firestore Emulator", state: "unknown"},
    ];

const CONFIG_FILE = '/etc/tao-ce/config/tao.yaml';

export const Application = () => {

    const [services, updateServices] = useState(initServices);

    const [isExpandedConfigInstall, expandConfigInstall] = useState(false);
    const [isExpandedConfigAdmins, expandConfigAdmins] = useState(false);
    const [isExpandedNetworkZeroconf, expandNetworkZeroconf] = useState(false);
    const [isExpandedNetworkHotSpot, expandNetworkHotSpot] = useState(false);

    const [configFile, updateConfigFile] = useState('');

    const [taoAdmins, updateAdmins] = useState(initAdmins);

    // const taoConfig: TAOConfig = yamlParse(configFile) as TAOConfig;

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

    useEffect(() => {
        cockpit.file(CONFIG_FILE).read().then((content, tag) => {
            updateConfigFile(content);
        })
    },[]);

    useEffect(() => {
        getAdmins().then((res) => {
            console.log(res);
            updateAdmins((res.hits?.hits||[]).map(h=>({id: h._id, ...h._source})));
        }).catch((o) => console.error(o));
        
        // cockpit.http("9200", {address: "es", port: 9200}).post("/portal-user/_search", 
            // {query: {term: { 'workingProfiles.role': 'ADMIN' }}}
        // ).then((res) => {
            // console.log(res);
        // }).catch((o) => console.error(o));
        // cockpit.http("9200", {address: "es", port: 9200}).post("/portal-user/_search", { query: { bool: { must: [ { match: {active: true}}]}} }).then((res) => console.log(res)).catch((o) => console.error(o));
    },[]);


  const contentRef0 = createRef<HTMLElement>();
  const contentRef1 = createRef<HTMLElement>();
  const contentRef2 = createRef<HTMLElement>();

    
    const [activeTabKey, setActiveTabKey] = useState<string | number>(0);

    return (
            <Page className='no-masthead-sidebar'>
                <PageHeader title="TAO Community Edition Dashboard" subtitle="Pilot your environment" />
                <PageSection>
                    <Tabs
                        activeKey={activeTabKey}
                        onSelect={(_,i) => setActiveTabKey(i)}
                        role='region'
                    >
                        <Tab eventKey={0} title={<>
                            <TabTitleIcon><SunIcon/></TabTitleIcon>
                            <TabTitleText>Overview</TabTitleText>
                            </>}
                            tabContentId='tabOverview'
                            tabContentRef={contentRef0}
                            />
                        <Tab eventKey={1} title={<>
                            <TabTitleIcon><CogIcon/></TabTitleIcon>
                            <TabTitleText>TAO Administration</TabTitleText>
                            </>}
                            tabContentId='tabConfig'
                            tabContentRef={contentRef1}
                            />
                        <Tab eventKey={2} title={<>
                            <TabTitleIcon><NetworkIcon/></TabTitleIcon>
                            <TabTitleText>TAO Network</TabTitleText>
                            </>} 
                            tabContentId='tabNetwork'
                            tabContentRef={contentRef2}
                            />
                    </Tabs>
                        <div>
                            <TabContent eventKey={0} id="tabOverview" ref={contentRef0}>
                                <TabContentBody hasPadding>
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
                                                <CardTitle>Info</CardTitle>
                                                <CardBody>
                                                    {/* <TAOInfos config={taoConfig} /> */}
                                                </CardBody>
                                            </Card>
                                        </GridItem>
                                    </Grid>
                                </TabContentBody>
                            </TabContent>
                            <TabContent hidden eventKey={1} id="tabConfig" ref={contentRef1}>
                                <TabContentBody hasPadding>
                                    <Card isExpanded={isExpandedConfigAdmins}>
                                        <CardHeader onExpand={() => expandConfigAdmins(!isExpandedConfigAdmins)}>
                                        <CardTitle>Administrators</CardTitle>
                                        </CardHeader>
                                        <CardExpandableContent>
                                            <CardBody>
                                                <TAOAdminUI admins={taoAdmins} />
                                            </CardBody> 
                                        </CardExpandableContent>
                                    </Card>
                                    <Card isExpanded={isExpandedConfigInstall}>
                                        <CardHeader onExpand={() => expandConfigInstall(!isExpandedConfigInstall)}>
                                        <CardTitle>Installation</CardTitle>
                                        </CardHeader>
                                        <CardExpandableContent>
                                            <CardBody>
                                            {/* <TAOConfigUI config={taoConfig} /> */}
                                            </CardBody> 
                                        </CardExpandableContent>
                                    </Card>
                                </TabContentBody>
                            </TabContent>
                            <TabContent hidden eventKey={2} id="tabNetwork" ref={contentRef2}>
                                <TabContentBody hasPadding>
                                    <Card variant='secondary' isExpanded>
                                        <CardTitle>Network settings</CardTitle>
                                        <CardExpandableContent>
                                            <CardBody>
                                                <p> This tab is dedicated to specific network settings for TAO Community Edition.  </p>
                                                <p> If you are looking for your host network settings, open the <i>Networking</i> menu in sidebar, or click on the button below.  </p>
                                                <Button icon={<SlidersHIcon />} onClick={() => cockpit.jump('/network', cockpit.transport.host)} >Go to network settings</Button>
                                            </CardBody> 
                                        </CardExpandableContent>
                                    </Card>
                                    <Card isExpanded={isExpandedNetworkZeroconf}>
                                        <CardHeader onExpand={() => expandNetworkZeroconf(!isExpandedNetworkZeroconf)}>
                                            <CardTitle>Zeroconf</CardTitle>
                                        </CardHeader>
                                        <CardExpandableContent>
                                            <CardBody>
                                            </CardBody> 
                                        </CardExpandableContent>
                                    </Card>
                                    <Card isExpanded={isExpandedNetworkHotSpot}>
                                        <CardHeader onExpand={() => expandNetworkHotSpot(!isExpandedNetworkHotSpot)}>
                                            <CardTitle>Wireless HotSpot configuration</CardTitle>
                                        </CardHeader>
                                        <CardExpandableContent>
                                            <CardBody>
                                                <HotSpot />
                                            </CardBody>
                                        </CardExpandableContent>
                                    </Card>
                                </TabContentBody>
                            </TabContent>
                        </div>
                </PageSection>
            </Page>
    );
};
