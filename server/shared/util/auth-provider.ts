import { OAuth2ProviderAuth } from "@lucia-auth/oauth"
import { Auth } from "lucia"

/**
 * Create a universally usable provider
 * @param provider the provider to use
 * @param getUser the transformation function to create a db user from the provider user
 */
export function provider<C extends object, P extends OAuth2ProviderAuth>(
  auth: Auth,
  provider: (auth: Auth, config: C) => P,
  config: C,
  getUser: (
    data: Awaited<ReturnType<P["validateCallback"]>>
  ) => Lucia.DatabaseUserAttributes
) {
  const prv = provider(auth, config)
  return {
    getAuthorizationUrl: prv.getAuthorizationUrl,
    validateCallback: async (code: string) => {
      const data = await prv.validateCallback(code)
      return {
        ...data,
        userData: getUser(data as Awaited<ReturnType<P["validateCallback"]>>),
      }
    },
  }
}
