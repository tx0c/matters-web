import { ReactComponent as IconWallet } from '@/public/static/icons/24px/wallet.svg'
import { Empty, Icon, Translate } from '~/components'

export const EmptyTransaction = () => (
  <Empty
    icon={<Icon icon={IconWallet} size="xxl" />}
    description={
      <Translate
        zh_hant="還沒有交易記錄"
        zh_hans="还没有交易记录"
        en="No transaction history."
      />
    }
  />
)
