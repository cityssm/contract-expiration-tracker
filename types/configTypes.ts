import type { ADWebAuthConfig } from "@cityssm/ad-web-auth-connector/types";
import type * as docuShareConfig from "@cityssm/docushare/types";


export interface Config {

  application?: {
    userDomain?: string;
    httpPort?: number;
    rootUrl?: string;
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
    source: "ad-web-auth" | "Active Directory",
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
    contractParty?: FieldCustomization;
    notificationDays?: number;
  };

  docuShare?: {
    isEnabled: boolean;
    rootURL?: string;
    collectionHandle?: string;
    server?: docuShareConfig.ServerConfig;
    session?: docuShareConfig.SessionConfig;
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
