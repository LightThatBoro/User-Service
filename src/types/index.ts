import { Connection } from "typeorm";
import { components } from "./gen";

export type IUser = components["schemas"]["User"];

export interface ISubscriberParams {
    userId: string,
    data: Record<any, any>,
    db: Connection
}

export enum Subscribers {
    InstituteUpdate = "InstituteUpdate",
}

export type IUserType = "user" | "educator" | "admin";
