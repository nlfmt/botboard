/// <reference types="lucia" />
declare namespace Lucia {
	type Auth = import("../shared/util/lucia").Auth;
	type DatabaseUserAttributes = object;
	type DatabaseSessionAttributes = object;
}