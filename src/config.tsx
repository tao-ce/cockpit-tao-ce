import React, { useRef, useState } from 'react';
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
  FormGroupLabelHelp
} from '@patternfly/react-core';

export const TAOConfig: React.FunctionComponent = () => {
  const [domain, setDomain] = useState('');

  const handleDomainChange = (_event, name: string) => {
    setDomain(name);
  };


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
          value={domain}
          onChange={handleDomainChange}
        />
      </FormGroup>
      <ActionGroup>
        <Button variant="danger">Re-install</Button>
      </ActionGroup>
    </Form>
  );
};
