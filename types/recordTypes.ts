export interface User {
  userName: string;
  canUpdate: boolean;
}


declare module "express-session" {
  interface Session {
    user: User;
  }
}


export interface Contract {
  contractId: number;
  contractCategory?: string;
  contractTitle: string;
  contractParty?: string;
  contractDescription?: string;
  startDate: number;
  endDate?: number;
  extensionDate?: number;
  tags?: string[];
  recordCreate_userName: string;
  recordCreate_timeMillis: number;
  recordUpdate_userName: string;
  recordUpdate_timeMillis: number;
  recordDelete_userName?: string;
  recordDelete_timeMillis?: number;
}
