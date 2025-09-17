export interface TAOConfig {
    spec: TAOConfigSpec;
}

interface TAOConfigSpec {
    publicDomain: string;
    dependencies: Dependency[];
}

interface Dependency {
    key: string;
    type: string;
    address: Address;
}

interface Address {
    schema: string | undefined;
    port: number | undefined;
    host: string | undefined;
}