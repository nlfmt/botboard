import { DatabaseSessionAttributes, DatabaseUserAttributes } from "../lucia";

export type User = DatabaseUserAttributes & { userId: string }

export type Session = {
  user: User;
  sessionId: string;
  activePeriodExpiresAt: Date;
  idlePeriodExpiresAt: Date;
  state: "idle" | "active";
  fresh: boolean;
} & DatabaseSessionAttributes