import { Provider } from "@server/shared/lucia";

export function signIn(provider: Provider) {
  window.location.href = `/api/auth/login/${provider}`;
}

export function signOut() {
  window.location.href = "/api/auth/logout";
}