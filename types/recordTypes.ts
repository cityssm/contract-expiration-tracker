export interface User {
  userName: string;
  canUpdate: boolean;
  guidA: string;
  guidB: string;
}


declare module "express-session" {
  interface Session {
    user: User;
  }
}


export interface SessionWithUser {
  user: User;
}


export interface Contract {
  contractId: number;
  contractCategory?: string;
  contractTitle: string;
  contractParty?: string;
  contractDescription?: string;
  privateContractDescription?: string;
  startDate: number;
  startDateString: string;
  endDate?: number;
  endDateString?: string;
  extensionDate?: number;
  extensionDateString?: string;
  managingUserName?: string;
  tags?: string[];
  recordCreate_userName: string;
  recordCreate_timeMillis: number;
  recordUpdate_userName: string;
  recordUpdate_timeMillis: number;
  recordDelete_userName?: string;
  recordDelete_timeMillis?: number;
}


export interface ContractCategoryUser {
  userName: string;
  contractCategory: string;
}
