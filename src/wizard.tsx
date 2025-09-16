import React, { Fragment, useEffect, useState } from "react"
import { Spinner, Wizard, WizardStep } from '@patternfly/react-core';

import { ProgressStepper, ProgressStep } from '@patternfly/react-core';
import {Service} from './interface.Service';

export const TAOProgress: React.FunctionComponent = ({progress}: any) => (
  <ProgressStepper aria-label="Basic progress stepper with issue">
    <ProgressStep
      variant={progress.services.state}
      id="basic-with-issue-step1"
      titleId="basic-with-issue-step1-title"
      description=<><p>TAO Community Edition requires some additional services to be started.</p><p>{progress.services.details}</p></>
    >
      Start dependencies
    </ProgressStep>
    <ProgressStep
      variant={progress.start.state}
      id="basic-with-issue-step2"
      titleId="basic-with-issue-step2-title"
      aria-label="completed step, step with success"
    >
      Start TAO Community Edition
    </ProgressStep>
    <ProgressStep
        isCurrent
        icon={<Spinner size="sm" />}
      id="basic-with-issue-step3"
      titleId="basic-with-issue-step3-title"
      aria-label="completed step, step with warning"
    >
      Configure TAO Community Edition
    </ProgressStep>
  </ProgressStepper>
);

type WizardProps = {
    services: Service[],
}

export const TAOWizard: React.FunctionComponent = ({services}:WizardProps) => {

    const [progress, updateProgress] = useState({
        services: {state: "unknown", details: ""},
        start: {state: "unknown", details: ""},
        config: {state: "unknown", details: ""},
        install: {stateu: "unknown", details: ""},
        ready: {state: "unknown", details: ""},   
    });

    useEffect(()=>{
        const taoCERunning = services.filter((svc)=> svc.state === "running" && svc.unit === "tao-ce.service").length;

        progress.start.state = (taoCERunning > 0) ? "success" : "pending";
        progress.start.details = "";
        updateProgress(progress);
    }, [services]);

    useEffect(()=>{
        const runningCount = services.filter((svc)=> svc.state === "running" && svc.unit != "tao-ce.service").length;
        const totalCount = services.filter((svc)=> svc.unit != "tao-ce.service").length;

        progress.services.state = (runningCount === totalCount) ? "success" : "pending";
        progress.services.details = `${runningCount}/${totalCount} services started.`;
        updateProgress(progress);
    }, [services]);

    return <Wizard>
    <WizardStep name="Welcome" id="basic-first-step">
        <h2>Welcome to <b>TAO Community Edition</b></h2>
        
        <p>
            You are running <i>Cozy</i> version of TAO Community Edition. This version is designed to let you enjoy our products without efforts.
        </p>


        <p>
            If your Virtual Machine has just started, 
            it should already be downloading the service dependencies required to run TAO Community Edition. 
            You can check progress in the <i>Services</i> section aside.
        </p>

    {/* </WizardStep>
    <WizardStep name="Get ready..." id="basic-second-step"> */}
        
            <TAOProgress progress={progress}/>
        
    </WizardStep>
    <WizardStep name="Enjoy!" id="basic-ready-step" footer={{ nextButtonText: 'Finish' }}>
        You can now connect on TAO !
    </WizardStep>
  </Wizard>

};
