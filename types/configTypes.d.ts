import type { ADWebAuthConfig } from "@cityssm/ad-web-auth-connector/types";
export interface Config {
    application?: {
        httpPort?: number;
        userDomain?: string;
    };
    reverseProxy?: {
        disableCompression: boolean;
        disableEtag: boolean;
        blockViaXForwardedFor: boolean;
        urlPrefix: string;
    };
    session?: {
        cookieName?: string;
        secret?: string;
        maxAgeMillis?: number;
        doKeepAlive?: boolean;
    };
    authentication: {
        source: "ad-web-auth" | "Active Directory";
        adWebAuthConfig?: ADWebAuthConfig;
        activeDirectoryConfig?: ActiveDirectoryConfig;
    };
    permissions: {
        canUpdate: string[];
    };
    customizations: {
        applicationName?: string;
        contract?: FieldCustomization;
        contractCategory?: FieldCustomization;
        notificationDays?: number;
    };
}
export interface ActiveDirectoryConfig {
    url: string;
    baseDN: string;
    username: string;
    password: string;
}
interface FieldCustomization {
    alias: string;
    aliasPlural: string;
}
export {};
