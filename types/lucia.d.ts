/// <reference types="lucia" />

declare namespace Lucia {
  type Auth = import("../server/shared/lucia").Auth;
  type DatabaseUserAttributes = {
    name: string
    email: string | null
    avatar: string | null
  }
  type DatabaseSessionAttributes = Record<string, never>
}