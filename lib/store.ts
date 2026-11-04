import { dikorDB, type DBOrder, type DBUser } from "./db";
export * from "./types";

export type Order = DBOrder;
export type User = DBUser;

export const db = dikorDB;
