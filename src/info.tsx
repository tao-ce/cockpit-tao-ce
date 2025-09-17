import React, { useEffect, useRef, useState } from 'react';
import { parse as yamlParse } from "yaml";

import {TAOConfig} from './interface.TAOConfig';
import { Table, Tr, Th, Td, Tbody } from '@patternfly/react-table';
import { Button, ClipboardCopy, ClipboardCopyAction, ClipboardCopyButton, Flex } from '@patternfly/react-core';
import { url_root } from 'cockpit/_internal/location-utils';
import { PlayIcon } from '@patternfly/react-icons';
import { BsCursor } from 'react-icons/bs';

type TAOInfosProps = {
  config: TAOConfig;
}

const initTAOInfos = {
  url: ''
};


const InfoLine: React.FunctionComponent = ({label,url}:any) => (
  <Tr>
    <Th>{label}</Th>
    <Td>
      <Flex>
        <Button
          href={url}
          component='a'
          target='_blank'
          icon={<PlayIcon/>}
          variant='control'
          />
        <ClipboardCopy
          hoverTip='Copy'
          clickTip='Copied'
          isCode
          isReadOnly
          variant='inline'
        >{url}</ClipboardCopy>
      </Flex>
    </Td>
  </Tr>
);

export const TAOInfos: React.FunctionComponent = ({config}: TAOInfosProps) => {

  const [infos, updateInfos] = useState(initTAOInfos);

  useEffect(() => {
    infos.url = config?.spec?.publicDomain
    updateInfos(infos);
  },[config]);

  return (
<>
<Table>
  <Tbody>
    {(infos.url)?
      <>
        <InfoLine key="Portal" label="Portal" url={`https://${infos.url}/portal/`} />
        <InfoLine key="Devkit" label="Devkit" url={`https://${infos.url}/devkit/`} />
        <InfoLine key="Construct" label="Construct" url={`https://${infos.url}/backoffice/`} />
      </> : <></>
    }
  </Tbody>
</Table>
</>
  );
};