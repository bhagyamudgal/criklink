import type {
    IUnifiedWalletConfig,
    IWalletNotification,
} from "@jup-ag/wallet-adapter/dist/types/contexts/WalletConnectionProvider";
import { ToastNotification } from "../common/ToastNotificationDisplay";

const infoToast = new ToastNotification("wallet-notification-info");
const toast = new ToastNotification("wallet-notification");

export const WalletNotification: IUnifiedWalletConfig["notificationCallback"] =
    {
        onConnect: (props: IWalletNotification) => {
            infoToast.remove();
            toast.success(`Wallet Connected - ${props.shortAddress}`);
        },
        onConnecting: (props: IWalletNotification) => {
            infoToast.info(`Connecting to ${props.walletName}`);
        },
        onDisconnect: (props: IWalletNotification) => {
            infoToast.info(`Disconnected from ${props.walletName}`);
        },
        onNotInstalled: (props: IWalletNotification) => {
            infoToast.remove();
            toast.error(`${props.walletName} Wallet is not installed`);
        },
    };
