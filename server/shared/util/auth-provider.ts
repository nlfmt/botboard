import { type OAuth2Provider, generateState } from "arctic"
import { RegisteredDatabaseUserAttributes } from "lucia"
import prisma from "@/shared/prisma"

type ProviderConfig<
  Provider extends OAuth2Provider = OAuth2Provider,
  Tokens = Awaited<ReturnType<Provider["validateAuthorizationCode"]>>
> = {
  id: string
  provider: Provider
  getUser: (
    tokens: Tokens
  ) => Promise<{ externalId: string; user: RegisteredDatabaseUserAttributes }>
}

/**
 * Create a universally usable provider
 * @param provider the provider to use
 * @param getUser the transformation function to create a db user from the provider user
 */
function provider<Provider extends OAuth2Provider, Tokens>(
  config: ProviderConfig<Provider, Tokens>
) {
  return {
    createAuthUrl: async () => {
      const state = generateState()
      const url = await config.provider.createAuthorizationURL(state)
      return { url, state }
    },
    validateCallback: async (code: string) => {
      const tokens = (await config.provider.validateAuthorizationCode(
        code
      )) as Tokens
      const { externalId, user } = await config.getUser(tokens)

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
  Providers extends Record<string, Omit<ProviderConfig, "id">>
>(providers: Providers) {
  const _providers = Object.entries(providers).map(
    ([id, config]) => [id, provider({ id, ...config })] as const
  )

  return Object.fromEntries(_providers) as {
    [K in keyof Providers]: ReturnType<typeof provider>
  }
}
