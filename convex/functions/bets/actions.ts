"use node";

import { BET_TX_STATUS } from "@/constants/bets";
import {
    getSolanaConnection,
    getTxSignature,
    validatePaymentTransfer,
} from "@/lib/solana";
import { PublicKey } from "@solana/web3.js";
import { internal } from "../../_generated/api";
import { internalAction } from "../../_generated/server";

import { apiEnv } from "@/env/api";
import { parseURL, type TransferRequestURL } from "@solana/pay";

export const checkAndUpdateBetTxStatus = internalAction({
    handler: async (ctx, args) => {
        try {
            const bets = await ctx.runQuery(
                internal.functions.bets.queries.getAllPendingBets,
                {}
            );

            console.log("pending bets =>", bets);

            if (!bets || bets.length === 0) {
                return null;
            }

            for (const bet of bets) {
                try {
                    console.log(`pending bet: ${bet._id} =>`, bet);

                    const transferRequestData = parseURL(
                        bet.solanaPayUrl
                    ) as TransferRequestURL;

                    console.log("transferRequestData =>", transferRequestData);

                    if (!transferRequestData) {
                        throw new Error("Error parsing transfer request data!");
                    }

                    if (!transferRequestData.reference) {
                        throw new Error("Reference not found!");
                    }

                    if (!transferRequestData.recipient) {
                        throw new Error("Recipient wallet address not found!");
                    }

                    if (!transferRequestData.amount) {
                        throw new Error("Amount not found!");
                    }

                    const connection = getSolanaConnection(
                        apiEnv.SOLANA_RPC_URL
                    );

                    const txSignature = await getTxSignature(
                        connection,
                        new PublicKey(transferRequestData.reference.toString())
                    );

                    console.log("txSignature =>", txSignature);

                    if (!txSignature) {
                        throw new Error(
                            "txSignature not found for this invoice!"
                        );
                    }

                    const isPaymentSuccessful = await validatePaymentTransfer(
                        connection,
                        txSignature.signature,
                        {
                            amount: transferRequestData.amount,
                            recipient: transferRequestData.recipient,
                            splToken: transferRequestData.splToken,
                        }
                    );

                    console.log("isPaymentSuccessful =>", isPaymentSuccessful);

                    if (isPaymentSuccessful) {
                        await ctx.runMutation(
                            internal.functions.bets.mutations.updateBet,
                            {
                                id: bet._id,
                                data: {
                                    txStatus: BET_TX_STATUS.SUCCESS,
                                },
                            }
                        );
                    }
                } catch (error) {
                    console.error(
                        `error while processing bet: ${bet._id} =>`,
                        error
                    );
                }
            }
        } catch (error) {
            console.error(error);
        }
    },
});
