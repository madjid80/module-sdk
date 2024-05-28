import { Account } from 'src/account'
import { parseEther, PublicClient, TestClient } from 'viem'
import { ensureBundlerIsReady } from 'test/utils/healthCheck'
import { getInstallModuleActions } from './installModuleActions'
import * as HelpersModule from 'src/common/getPrevModule'
import { SENTINEL_ADDRESS } from 'src/common/constants'
import { sendUserOp } from './sendUserOp'

type Params = {
  account: Account
  publicClient: PublicClient
  testClient: TestClient
}

export const setupEnvironment = async ({
  account,
  publicClient,
  testClient,
}: Params) => {
  await ensureBundlerIsReady()

  jest
    .spyOn(HelpersModule, 'getPreviousModule')
    .mockReturnValue(new Promise((resolve) => resolve(SENTINEL_ADDRESS)))

  // top up account balance
  await testClient.setBalance({
    address: account.address,
    value: parseEther('1'),
  })

  const installAllModulesActions = await getInstallModuleActions({
    account,
    client: publicClient,
  })

  if (installAllModulesActions.length) {
    await sendUserOp({ account, actions: installAllModulesActions })
  }
}
