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
    adWebAuthConfig: ADWebAuthConfig;
    permissions: {
        canUpdate: string[];
    };
    customizations: {
        contractCategory: {
            alias: string;
            aliasPlural: string;
        };
    };
}
