/// <reference types="lucia" />

declare namespace Lucia {
  type Auth = import("../shared/lucia").Auth;
  type DatabaseUserAttributes = import("../shared/lucia").DatabaseUserAttributes;
  type DatabaseSessionAttributes = import("../shared/lucia").DatabaseSessionAttributes;
}