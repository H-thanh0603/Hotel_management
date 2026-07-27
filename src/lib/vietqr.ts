export interface VietQRConfig {
  bankId: string;       // e.g. "MB", "VCB", "ACB", "TCB", "ICB" (Vietinbank)
  accountNo: string;    // Account Number
  accountName: string;  // Account Holder Name
}

export const defaultBankConfig: VietQRConfig = {
  bankId: "MB",
  accountNo: "0901000001",
  accountName: "HOTELFLOW LUXURY SYSTEM",
};

export function generateVietQRUrl(amount: number, addInfo: string, config: VietQRConfig = defaultBankConfig): string {
  const bank = encodeURIComponent(config.bankId);
  const account = encodeURIComponent(config.accountNo);
  const name = encodeURIComponent(config.accountName);
  const info = encodeURIComponent(addInfo);
  const amt = Math.max(0, Math.round(amount));

  return `https://img.vietqr.io/image/${bank}-${account}-compact2.png?amount=${amt}&addInfo=${info}&accountName=${name}`;
}
