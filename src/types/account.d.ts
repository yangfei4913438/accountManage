type AccountType = '游戏' | '平台' | '银行卡' | '其他';

interface Account {
  id: string;
  type: AccountType;
  name: string;
  account: string;
  password: string;
}

interface AccountListItem {
  type: AccountType;
  data: Account[];
}

interface AccountTypeStatus {
  游戏: boolean;
  平台: boolean;
  银行卡: boolean;
  其他: boolean;
}

type AccountListType = AccountListItem[];
