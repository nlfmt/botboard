/// <reference types="lucia" />
declare namespace Lucia {
	type Auth = import("../shared/lucia").Auth;
	type DatabaseUserAttributes = {
		name: string;
		email?: string;
		avatar: string;
	};
	type DatabaseSessionAttributes = object;
}