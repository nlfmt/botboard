import { type OAuth2Provider, generateState } from "arctic"
import { RegisteredDatabaseUserAttributes } from "lucia"
import prisma from "@/shared/prisma"
import { tryCatch } from "./helpers"

type ProviderConfig<
  Provider extends OAuth2Provider = OAuth2Provider,
  Tokens = Awaited<ReturnType<Provider["validateAuthorizationCode"]>>
> = {
  id: string
  provider: Provider
  createAuthUrl?: (provider: NoInfer<Provider>, state: string) => Promise<string | URL>
  getUser: (
    tokens: Tokens
  ) => Promise<{ externalId: string; user: RegisteredDatabaseUserAttributes }>
}
type ProviderDef<Provider extends OAuth2Provider = OAuth2Provider> = Omit<ProviderConfig<Provider>, "id">

/**
 * Create a universally usable provider
 * @param provider the provider to use
 * @param getUser the transformation function to create a db user from the provider user
 */
function createProvider<Provider extends OAuth2Provider, Tokens>(
  config: ProviderConfig<Provider, Tokens>
) {
  return {
    createAuthUrl: async () => {
      const state = generateState()
      let url = ""

      if (!config.createAuthUrl) {
        url = await config.provider.createAuthorizationURL(state).then(u => u.toString())
      } else {
        const _url = await config.createAuthUrl(config.provider, state)
        url = _url instanceof URL ? _url.toString() : _url
      }

      return { url, state }
    },
    validateCallback: async (code: string) => {
      const tokens = (await config.provider.validateAuthorizationCode(
        code
      )) as Tokens
      
      const res = await tryCatch(config.getUser)(tokens)
      if (!res.success) throw new Error(`[getUser Error] ${res.error}`)
      const { externalId, user } = res.data

      const oauthAcc = await prisma.oauthAccount.findUnique({
        where: {
          providerId_providerUserId: {
            providerId: config.id,
            providerUserId: externalId,
          },
        },
      })

      if (oauthAcc) {
        return oauthAcc.userId
      }

      const newUser = await prisma.user.create({
        data: {
          ...user,
          oauthAccount: {
            create: {
              providerId: config.id,
              providerUserId: externalId,
            },
          },
        },
        select: { id: true },
      })

      return newUser.id
    },
  }
}

export function defineProviders<
  Providers extends Record<string, ProviderDef<any>>
>(providers: Providers) {
  const _providers = Object.entries(providers).map(
    ([id, config]) => [id, createProvider({ id, ...config })] as const
  )

  return Object.fromEntries(_providers) as {
    [K in keyof Providers]: ReturnType<typeof createProvider>
  }
}

export const defineProvider = <Provider extends OAuth2Provider>(config: ProviderDef<Provider>) => config