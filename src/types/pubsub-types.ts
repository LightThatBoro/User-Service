import { Connection } from "typeorm";

export interface ISubscriberParams {
    userId: string,
    data: Record<any, any>,
    db: Connection
}

export enum Subscribers {
    InstituteUpdate = "InstituteUpdate",
}

export enum Publishers {
}
