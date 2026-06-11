import cockpit from 'cockpit';

export type Admin = {
    firstName: string;
    lastName: string;
    userName: string;
    passwordHash: string;
}


function api() {
    return cockpit
        .http("9200", {
            address: "es",
            port: 9200, 
        });
    // if (!res.ok) throw new Error(await res.text());
    // return res.json(); 
}

function query() {

}

export function getAdmins() {
    return api().post(
        "/portal-user/_search",
        { query: {term: { 'workingProfiles.role': 'ADMIN' }}}
        ).then((res) => {
            return JSON.parse(res);
            console.log(res);
            // updateAdmins((JSON.parse(res).hits?.hits||[]).map(h=>({id: h._id, ...h._source})));
        }).catch((o) => console.error(o));

}