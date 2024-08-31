import {
    findReference,
    validateTransfer,
    type ValidateTransferFields,
} from "@solana/pay";
import { Connection, type PublicKey } from "@solana/web3.js";
import { extractErrorMessage } from "./utils";

export function shortenWalletAddress(address: string, chars = 4) {
    if (address) {
        return `${address.slice(0, chars)}...${address.slice(chars * -1)}`;
    }

    return null;
}

export function getSolanaConnection(rpcUrl: string) {
    return new Connection(rpcUrl, "confirmed");
}

export async function validatePaymentTransfer(
    connection: Connection,
    txSignature: string,
    validateTransferFields: ValidateTransferFields
) {
    try {
        await validateTransfer(connection, txSignature, validateTransferFields);

        return true;
    } catch (error) {
        console.error(
            `validatePaymentTransfer => ${extractErrorMessage(error)}`,
            error
        );
        return false;
    }
}

export async function getTxSignature(
    connection: Connection,
    reference: PublicKey
) {
    try {
        return await findReference(connection, reference, {
            finality: "confirmed",
        });
    } catch (error) {
        console.error("getTxSignature =>", error);
        return null;
    }
}
