import type { Request } from "express";
import type { Contract, SessionWithUser } from "../../types/recordTypes";
import type { GetContractsFilters } from "../../helpers/contractDB/getContracts";
export declare const getExportSession: (request: Request) => SessionWithUser;
export declare const getExportParameters: (request: Request) => GetContractsFilters;
export declare const formatContractContent: (contract: Contract) => string;
