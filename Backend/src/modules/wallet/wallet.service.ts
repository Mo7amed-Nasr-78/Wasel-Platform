import { Injectable, Logger, Inject, forwardRef } from '@nestjs/common';
import { PrismaService } from '@/database/prisma/prisma.service';
import { StripeService } from '@/modules/stripe';
import {
  Wallet,
  Transaction,
  TransactionType,
  TransactionStatus,
  Withdrawal,
  WithdrawalStatus,
} from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/client';
import {
  InsufficientFundsException,
  WalletNotFoundException,
  TransactionFailedException,
  InvalidAmountException,
} from './exceptions/wallet.exceptions';

@Injectable()
export class WalletService {
  private readonly logger = new Logger(WalletService.name);

  constructor(
    private readonly prisma: PrismaService,
    @Inject(forwardRef(() => StripeService))
    private readonly stripeService: StripeService,
  ) {}

  async initializeWallet(userId: string, currency: string = 'USD'): Promise<Wallet> {
    return this.prisma.wallet.create({
      data: { userId, currency, balance: new Decimal(0) },
    });
  }

  async getBalance(userId: string): Promise<Decimal> {
    const wallet = await this.prisma.wallet.findUnique({ where: { userId } });
    if (!wallet) throw new WalletNotFoundException(userId);
    return wallet.balance;
  }

  async getWallet(userId: string): Promise<Wallet> {
    const wallet = await this.prisma.wallet.findUnique({ where: { userId } });
    if (!wallet) throw new WalletNotFoundException(userId);
    return wallet;
  }

  async getWalletById(walletId: string): Promise<Wallet> {
    const wallet = await this.prisma.wallet.findUnique({ where: { id: walletId } });
    if (!wallet) throw new WalletNotFoundException(walletId);
    return wallet;
  }

  // ──────────────────────────────────────────────
  //  TOP-UP / CHARGE
  // ──────────────────────────────────────────────

  async topUp(userId: string, amount: number, currency: string = 'usd') {
    const wallet = await this.getWallet(userId);

    const paymentIntent = await this.stripeService.createPaymentIntent(
      amount,
      currency,
      { userId, walletId: wallet.id },
    );

    this.logger.log(`Top-up PaymentIntent created: ${paymentIntent.id} for user ${userId}`);

    return { clientSecret: paymentIntent.client_secret, paymentIntentId: paymentIntent.id };
  }

  async handlePaymentIntentSucceeded(pi: any): Promise<void> {
    const { userId, walletId } = pi.metadata || {};
    if (!userId || !walletId) {
      this.logger.warn(`Missing metadata on PaymentIntent ${pi.id}`);
      return;
    }

    const amount = new Decimal(pi.amount_received / 100);

    try {
      await this.prisma.$transaction(async (tx) => {
        const existing = await tx.transaction.findUnique({
          where: { externalTransactionId: pi.id },
        });
        if (existing) {
          this.logger.log(`PaymentIntent ${pi.id} already processed`);
          return;
        }

        await tx.wallet.update({
          where: { id: walletId },
          data: { balance: { increment: amount } },
        });

        await tx.transaction.create({
          data: {
            type: TransactionType.RECHARGE,
            amount,
            status: TransactionStatus.COMPLETED,
            walletId,
            externalTransactionId: pi.id,
            paymentMethod: 'stripe',
            description: `Wallet top-up via Stripe (${pi.id})`,
          },
        });
      });

      this.logger.log(`Wallet ${walletId} credited ${amount} from PaymentIntent ${pi.id}`);
    } catch (error) {
      this.logger.error(`Failed to process PaymentIntent ${pi.id}`, error);
    }
  }

  // ──────────────────────────────────────────────
  //  TRANSFER (peer-to-peer)
  // ──────────────────────────────────────────────

  async transfer(
    senderUserId: string,
    receiverUserId: string,
    amount: number,
  ): Promise<{ senderTransaction: Transaction; receiverTransaction: Transaction }> {
    const decimalAmount = new Decimal(amount);
    if (decimalAmount.isNegative() || decimalAmount.isZero()) {
      throw new InvalidAmountException('Transfer amount must be positive');
    }

    return this.prisma.$transaction(async (tx) => {
      const senderWallet = await tx.wallet.findUnique({
        where: { userId: senderUserId },
      });
      if (!senderWallet) throw new WalletNotFoundException(senderUserId);

      const receiverWallet = await tx.wallet.findUnique({
        where: { userId: receiverUserId },
      });
      if (!receiverWallet) throw new WalletNotFoundException(receiverUserId);

      if (senderWallet.balance.lessThan(decimalAmount)) {
        throw new InsufficientFundsException(
          senderWallet.balance.toNumber(),
          decimalAmount.toNumber(),
        );
      }

      // Debit sender
      await tx.wallet.update({
        where: { id: senderWallet.id },
        data: { balance: { decrement: decimalAmount } },
      });

      // Credit receiver
      await tx.wallet.update({
        where: { id: receiverWallet.id },
        data: { balance: { increment: decimalAmount } },
      });

      const senderTransaction = await tx.transaction.create({
        data: {
          type: TransactionType.TRANSFER,
          amount: decimalAmount.negated(),
          status: TransactionStatus.COMPLETED,
          walletId: senderWallet.id,
          referenceType: 'user',
          referenceId: receiverUserId,
          description: `Transfer to user ${receiverUserId}`,
        },
      });

      const receiverTransaction = await tx.transaction.create({
        data: {
          type: TransactionType.TRANSFER,
          amount: decimalAmount,
          status: TransactionStatus.COMPLETED,
          walletId: receiverWallet.id,
          referenceType: 'user',
          referenceId: senderUserId,
          description: `Transfer from user ${senderUserId}`,
        },
      });

      // If receiver has a Stripe Connect account, create a Transfer
      const receiverUser = await tx.user.findUnique({
        where: { id: receiverUserId },
        select: { stripeAccountId: true },
      });

      if (receiverUser?.stripeAccountId) {
        await this.stripeService
          .createTransfer(amount, receiverUser.stripeAccountId, 'usd', {
            senderUserId,
            receiverUserId,
          })
          .catch((err) => {
            this.logger.error(`Stripe transfer failed: ${err.message}`);
          });
      }

      return { senderTransaction, receiverTransaction };
    });
  }

  // ──────────────────────────────────────────────
  //  WITHDRAW
  // ──────────────────────────────────────────────

  async withdraw(userId: string, amount: number): Promise<{ withdrawal: Withdrawal; transaction: Transaction }> {
    const decimalAmount = new Decimal(amount);
    if (decimalAmount.isNegative() || decimalAmount.isZero()) {
      throw new InvalidAmountException('Withdrawal amount must be positive');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { stripeAccountId: true, wallet: true },
    });

    if (!user?.stripeAccountId) {
      throw new TransactionFailedException(
        'User does not have a Stripe Connect account. Please set up your account first.',
      );
    }

    if (!user.wallet) throw new WalletNotFoundException(userId);

    if (user.wallet.balance.lessThan(decimalAmount)) {
      throw new InsufficientFundsException(
        user.wallet.balance.toNumber(),
        decimalAmount.toNumber(),
      );
    }

    return this.prisma.$transaction(async (tx) => {
      await tx.wallet.update({
        where: { userId },
        data: { balance: { decrement: decimalAmount } },
      });

      const withdrawal = await tx.withdrawal.create({
        data: {
          walletId: user.wallet!.id,
          amount: decimalAmount,
          status: WithdrawalStatus.PROCESSING,
          bankAccount: {},
        },
      });

      const transaction = await tx.transaction.create({
        data: {
          type: TransactionType.WITHDRAW,
          amount: decimalAmount.negated(),
          status: TransactionStatus.PENDING,
          walletId: user.wallet!.id,
          referenceType: 'withdrawal',
          referenceId: withdrawal.id,
          description: `Withdrawal to bank via Stripe`,
        },
      });

      // Create Stripe Payout on the user's Connect account
      this.stripeService
        .createPayout(amount, user.stripeAccountId!, 'usd', {
          userId,
          withdrawalId: withdrawal.id,
        })
        .then((payout) => {
          this.logger.log(`Payout created: ${payout.id} for user ${userId}`);
        })
        .catch(async (err) => {
          this.logger.error(`Payout creation failed: ${err.message}`);
          // Reverse the debit
          await this.prisma.wallet.update({
            where: { userId },
            data: { balance: { increment: decimalAmount } },
          });
          await this.prisma.withdrawal.update({
            where: { id: withdrawal.id },
            data: { status: WithdrawalStatus.FAILED },
          });
          await this.prisma.transaction.update({
            where: { id: transaction.id },
            data: { status: TransactionStatus.FAILED },
          });
        });

      return { withdrawal, transaction };
    });
  }

  async handlePayoutPaid(payout: any): Promise<void> {
    const { withdrawalId } = payout.metadata || {};
    if (!withdrawalId) return;

    await this.prisma.withdrawal.update({
      where: { id: withdrawalId },
      data: { status: WithdrawalStatus.COMPLETED, processedAt: new Date() },
    });

    await this.prisma.transaction.updateMany({
      where: { referenceType: 'withdrawal', referenceId: withdrawalId },
      data: { status: TransactionStatus.COMPLETED },
    });

    this.logger.log(`Withdrawal ${withdrawalId} completed via payout ${payout.id}`);
  }

  async handlePayoutFailed(payout: any): Promise<void> {
    const { withdrawalId, userId } = payout.metadata || {};
    if (!withdrawalId) return;

    const withdrawal = await this.prisma.withdrawal.findUnique({
      where: { id: withdrawalId },
    });

    if (!withdrawal) return;

    // Reverse the debit
    await this.prisma.wallet.update({
      where: { id: withdrawal.walletId },
      data: { balance: { increment: withdrawal.amount } },
    });

    await this.prisma.withdrawal.update({
      where: { id: withdrawalId },
      data: { status: WithdrawalStatus.FAILED },
    });

    await this.prisma.transaction.updateMany({
      where: { referenceType: 'withdrawal', referenceId: withdrawalId },
      data: { status: TransactionStatus.FAILED },
    });

    this.logger.warn(`Withdrawal ${withdrawalId} reversed due to payout failure`);
  }

  // ──────────────────────────────────────────────
  //  STRIPE CONNECT
  // ──────────────────────────────────────────────

  async createConnectAccount(userId: string, email: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new TransactionFailedException('User not found');

    if ((user as any).stripeAccountId) {
      throw new TransactionFailedException('User already has a Stripe Connect account');
    }

    const account = await this.stripeService.createConnectedAccount(email);

    await this.prisma.user.update({
      where: { id: userId },
      data: { stripeAccountId: account.id } as any,
    });

    this.logger.log(`Stripe Connect account created: ${account.id} for user ${userId}`);

    return { accountId: account.id };
  }

  async getConnectAccountLink(userId: string, refreshUrl: string, returnUrl: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new TransactionFailedException('User not found');

    const accountId = (user as any).stripeAccountId;
    if (!accountId) {
      throw new TransactionFailedException('User does not have a Stripe Connect account');
    }

    const accountLink = await this.stripeService.createAccountLink(accountId, refreshUrl, returnUrl);

    return { url: accountLink.url, expiresAt: accountLink.expires_at };
  }

  // ──────────────────────────────────────────────
  //  TRANSACTIONS
  // ──────────────────────────────────────────────

  async getTransactions(userId: string, limit = 20, offset = 0) {
    const wallet = await this.getWallet(userId);

    const [transactions, total] = await Promise.all([
      this.prisma.transaction.findMany({
        where: { walletId: wallet.id },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      this.prisma.transaction.count({ where: { walletId: wallet.id } }),
    ]);

    return { transactions, total };
  }
}
