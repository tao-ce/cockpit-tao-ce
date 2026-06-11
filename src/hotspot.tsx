import React, { Fragment, useEffect, useMemo, useState } from "react"
import {
    Form,
    FormGroup,
    TextInput,
    Button,
    Select,
    SelectList,
    SelectOption,
    TextArea,
    Alert,
    Switch,
    ToggleGroup,
    ToggleGroupItem,
    FlexItem,
    Flex,
    ToolbarGroup,
    TextInputGroup,
    TextInputGroupMain,
    TextInputGroupUtilities
} from "@patternfly/react-core";
import cockpit from 'cockpit';
import { superuser } from 'superuser';
import { proxy } from 'service';

import { EyeIcon, EyeSlashIcon } from "@patternfly/react-icons";

const NETWORK_IF = 'wlan0';
const NETWORK_NAME = `wifi-${NETWORK_IF}`;
const NMCONNECTION_PATH = `/etc/NetworkManager/system-connections/${NETWORK_NAME}.nmconnection`;

superuser.reload_page_on_change();

export const HotSpot: React.FunctionComponent = () => {

    const [ssid, setSsid] = useState("TAO Community Edition");
    const [psk, setPsk] = useState("password");
    const [hiddenPsk, setHiddenPsk] = useState(true);
    const [band, setBand] = useState<string | undefined>();

    const [openBand, setOpenBand] = useState(false);

    const [isSecured, setSecured] = useState(true);
    const [isHidden, setHidden] = useState(false);

    const [submitStatus, setSubmitStatus] = useState({status: -1, message: ""});
    const resetSubmitStatus = () => setSubmitStatus({status: -1, message:""});

    const valid = useMemo(() => {
        const errs: string[] = [];
        const warns: string[] = [];

        if (!ssid) errs.push("SSID is required");
        else if (ssid.length > 32) errs.push("SSID is too long (2-32 chars).");
        else if (ssid.length < 2) errs.push("SSID is too short (2-32 chars).");
        else if (!ssid.match(/^[^!#;+\]/"\t][^+\]/"\t]*$/)) errs.push("SSID contains invalid characters");

        if (isSecured) {
            if (psk.length > 64) errs.push("WPA2 Password is too long (8-64 chars).");
            else if (psk.length < 8) errs.push("WPA2 Password is too short (8-64 chars).");
            else if (!psk.match(/^[^!#;+\]/"\t][^+\]/"\t]*$/)) errs.push("WPA2 Password contains invalid characters");
        } else {
            warns.push("This network will not require a password to connect.");
        }

        if (!superuser.allowed) errs.push("Your session has `Limited Access`. Check login bar.");

        return { ok: errs.length === 0, hasWarn: warns.length === 0, errs, warns };
    }, [ssid, psk, isSecured, superuser]);

    const saveConfig = () => {
        resetSubmitStatus();
        cockpit
            .file(NMCONNECTION_PATH, {superuser: "require"})
            .replace(nmconnection)
                .then(() => {
                    return cockpit.spawn(["chmod", "0600", NMCONNECTION_PATH], {superuser: 'require'})
                })
                .then(() => {
                    return cockpit.spawn(["nmcli", "connection", "reload"], {superuser: 'require'})
                })
                .then(() => {
                    return cockpit.spawn(["nmcli", "connection", "up", NETWORK_NAME], {superuser: 'require'})
                })
                .then(() => {
                    return proxy('NetworkManager').restart();
                })
                .then(() => {
                    setSubmitStatus({status: 0, message: "HotSpot configuration applied."})
                })
                .catch((error) => {
                    console.error(error);
                    setSubmitStatus({status: error.exit_status || 20, message: "Error while configuring HotSpot."})
                });
    };

    const nmconnection = useMemo(() => {
        const lines: string[] = [];
        lines.push("[connection]");
        lines.push(`id=${NETWORK_NAME}`);
        lines.push("type=wifi");
        lines.push(`match-device=interface-name:wlan0`);
        lines.push(`interface-name=${NETWORK_IF}`);
        lines.push("autoconnect=yes");
        lines.push("");
        lines.push("[wifi]");
        lines.push("mode=ap");
        if (isHidden) lines.push("hidden=true");
        lines.push(`ssid=${ssid}`);
        if (band) lines.push(`band=${band}`);
        lines.push("");
        lines.push("[wifi-sec]");
        lines.push("pmf=1");
        lines.push(`key-mgmt=${isSecured ?"wpa-psk" : "none"}`);
        if (isSecured) lines.push(`psk=${psk}`);
        lines.push("");
        lines.push("[ipv4]");
        lines.push("address1=10.74.0.254/24");
        lines.push("method=shared");
        lines.push("");
        lines.push("[ipv6]");
        lines.push("method=ignore");
        lines.push("");
        return lines.join("\n");
    }, [ssid, band, psk, isHidden , isSecured]);

    return <>
    <Form isHorizontal isWidthLimited >
                <FormGroup label="SSID" isRequired fieldId="ssid">
                    <Switch 
                        label="Hidden network"
                        isChecked={isHidden}
                        hasCheckIcon
                        onChange={(_,v) => setHidden(v)}
                        />
                    <TextInput placeholder="Hotspot SSID" id="ssid" value={ssid} onChange={(_, v) => setSsid(v)} />
                </FormGroup>
                <FormGroup label="Security" isRequired={isSecured} fieldId="psk">
                    <Switch 
                        label="Secured with WPA2"
                        isChecked={isSecured}
                        hasCheckIcon
                        onChange={(_,v) => setSecured(v)}
                        />
                    { isSecured &&
                    <TextInputGroup>
                        <TextInputGroupMain
                            id="psk" 
                            type={hiddenPsk ? 'password' : 'text'} 
                            value={psk} 
                            placeholder="WPA2 password"
                            onChange={(_, v) => setPsk(v)}
                        />
                        <TextInputGroupUtilities>
                            {
                                hiddenPsk ?
                                <Button variant="control" icon={<EyeIcon/>} onClick={() => setHiddenPsk(false)}/>
                                :
                                <Button variant="control" icon={<EyeSlashIcon/>} onClick={() => setHiddenPsk(true)}/>
                            } 
                        </TextInputGroupUtilities>
                    </TextInputGroup>
                    }
                </FormGroup>

    

        <FormGroup label="Band" fieldId="band">
            <ToggleGroup>
                <ToggleGroupItem
                    text="Auto"
                    isSelected={band === undefined}
                    onChange={(_,v) => setBand(undefined)}
                    />
                <ToggleGroupItem
                    text="2.4GHz"
                    isSelected={band === 'bg'}
                    onChange={(_,v) => setBand('bg')}
                    />
                <ToggleGroupItem
                    text="5GHz"
                    isSelected={band === 'a'}
                    onChange={(_,v) => setBand('a')}
                    />
            </ToggleGroup>
        </FormGroup>
    
        {submitStatus?.status > -1 && (
            <Alert variant={submitStatus.status === 0 ? "success" : "danger"} isInline title="Applying configuration">
                {submitStatus.message}
            </Alert>
        )}

        {!valid.hasWarn && (
            <Alert variant="warning" isInline title="Please pay attention to the following">
            <ul style={{ margin: 0, paddingLeft: 18 }}>
            {valid.warns.map((e, i) => (<li key={i}>{e}</li>))}
            </ul>
            </Alert>
        )}
        
        {!valid.ok && (
            <Alert variant="danger" isInline title="Please fix the following">
            <ul style={{ margin: 0, paddingLeft: 18 }}>
            {valid.errs.map((e, i) => (<li key={i}>{e}</li>))}
            </ul>
            </Alert>
        )}
        

        <Flex>
        <Button isBlock={false} variant="danger" isDisabled={!valid.ok} onClick={saveConfig}>Apply</Button>
        <Button isBlock={false} variant="warning" >Reset to defaults</Button>

        </Flex>
    </Form>
    </>
};
