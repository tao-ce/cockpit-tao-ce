import React, { useEffect, useRef, useState } from 'react';
import WarningModal from '@patternfly/react-component-groups/dist/dynamic/WarningModal';

import {
  Form,
  FormGroup,
  TextInput,
  Checkbox,
  Popover,
  ActionGroup,
  Button,
  Radio,
  HelperText,
  HelperTextItem,
  FormHelperText,
  FormGroupLabelHelp,
  ButtonVariant
} from '@patternfly/react-core';

export const TAOConfig: React.FunctionComponent = ({config}) => {
  const [newConfig, setNewConfig] = useState({domain: ''});
  const [confirmModal, setConfirmModal] = useState(false);

  const handleDomainChange = (_event, value: string) => {
    newConfig.domain = value;
    setNewConfig(newConfig);
  };

  const reinstall = () => {
    console.log("Running reinstall...");
    console.log(newConfig);
  };

  useEffect(() => {
    newConfig.domain = config?.spec?.publicDomain || newConfig.domain;
    setNewConfig(newConfig);
    console.log(`update newConfig with ${newConfig}`)
  },[config]);

  return (
    <Form>
      <FormGroup
        label="Domain"
        isRequired
        fieldId="simple-form-name-01"
      >
        <TextInput
          isRequired
          type="text"
          id="simple-form-name-01"
          name="simple-form-name-01"
          aria-describedby="simple-form-name-01-helper"
          onChange={handleDomainChange}
          placeholder={newConfig.domain}
        />
      </FormGroup>
      <ActionGroup>
        <Button variant="danger" onClick={() => setConfirmModal(true)}>Re-install</Button>
        <WarningModal
          isOpen={confirmModal}
          title="Confirm reinstallation"
          confirmButtonVariant={ButtonVariant.danger}
          onClose={() => setConfirmModal(false) }
          onConfirm={() => {setConfirmModal(false);reinstall();} }
        >
          Reinstallation of TAO Community Edition will erase all data and credentials. Do you want to continue?
        </WarningModal>
      </ActionGroup>
    </Form>
  );
};
