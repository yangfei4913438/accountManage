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

type AccountList = AccountListItem[];
