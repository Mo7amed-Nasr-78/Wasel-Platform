import { Injectable, Logger, Inject, forwardRef } from '@nestjs/common';
import type Stripe from 'stripe';
import { WalletService } from '@/modules/wallet/wallet.service';

const StripeLib = require('stripe');

@Injectable()
export class StripeService {
  private readonly stripe: Stripe;
  private readonly logger = new Logger(StripeService.name);

  constructor(
    @Inject(forwardRef(() => WalletService))
    private readonly walletService: WalletService,
  ) {
    this.stripe = new StripeLib(process.env.STRIPE_SECRET_KEY!);
  }

  getClient(): Stripe {
    return this.stripe;
  }

  async createPaymentIntent(
    amount: number,
    currency: string = 'usd',
    metadata?: Record<string, string>,
  ) {
    return this.stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency,
      metadata,
    });
  }

  async retrievePaymentIntent(paymentIntentId: string) {
    return this.stripe.paymentIntents.retrieve(paymentIntentId);
  }

  async constructEventFromPayload(payload: Buffer, signature: string) {
    return this.stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  }

  async createConnectedAccount(email: string): Promise<Stripe.Account> {
    return this.stripe.accounts.create({
      type: 'express',
      email,
      capabilities: {
        transfers: { requested: true },
      },
    });
  }

  async createAccountLink(
    accountId: string,
    refreshUrl: string,
    returnUrl: string,
  ): Promise<Stripe.AccountLink> {
    return this.stripe.accountLinks.create({
      account: accountId,
      refresh_url: refreshUrl,
      return_url: returnUrl,
      type: 'account_onboarding',
    });
  }

  async retrieveAccount(accountId: string): Promise<Stripe.Account> {
    return this.stripe.accounts.retrieve(accountId);
  }

  async createTransfer(
    amount: number,
    destinationAccountId: string,
    currency: string = 'usd',
    metadata?: Record<string, string>,
  ): Promise<Stripe.Transfer> {
    return this.stripe.transfers.create({
      amount: Math.round(amount * 100),
      currency,
      destination: destinationAccountId,
      metadata,
    });
  }

  async createPayout(
    amount: number,
    accountId: string,
    currency: string = 'usd',
    metadata?: Record<string, string>,
  ): Promise<Stripe.Payout> {
    return this.stripe.payouts.create(
      {
        amount: Math.round(amount * 100),
        currency,
        metadata,
      },
      { stripeAccount: accountId },
    );
  }

  async handleWebhookEvent(event: Stripe.Event): Promise<void> {
    const type = event.type as string;

    switch (type) {
      case 'payment_intent.succeeded': {
        const pi = event.data.object as any;
        this.logger.log(`PaymentIntent succeeded: ${pi.id}`);
        await this.walletService.handlePaymentIntentSucceeded(pi);
        break;
      }

      case 'payment_intent.payment_failed': {
        const pi = event.data.object as any;
        this.logger.warn(`PaymentIntent failed: ${pi.id} — ${pi.last_payment_error?.message}`);
        break;
      }

      case 'account.updated': {
        const account = event.data.object as any;
        this.logger.log(`Connected account updated: ${account.id}, charges_enabled: ${account.charges_enabled}, payouts_enabled: ${account.payouts_enabled}`);
        break;
      }

      case 'transfer.created': {
        const transfer = event.data.object as any;
        this.logger.log(`Transfer created: ${transfer.id}, amount: ${transfer.amount}`);
        break;
      }

      case 'transfer.paid': {
        const transfer = event.data.object as any;
        this.logger.log(`Transfer paid: ${transfer.id}`);
        break;
      }

      case 'transfer.failed': {
        const transfer = event.data.object as any;
        this.logger.error(`Transfer failed: ${transfer.id} — ${transfer.failure_message}`);
        break;
      }

      case 'payout.created': {
        const payout = event.data.object as any;
        this.logger.log(`Payout created: ${payout.id}`);
        break;
      }

      case 'payout.paid': {
        const payout = event.data.object as any;
        this.logger.log(`Payout paid: ${payout.id}`);
        await this.walletService.handlePayoutPaid(payout);
        break;
      }

      case 'payout.failed': {
        const payout = event.data.object as any;
        this.logger.error(`Payout failed: ${payout.id} — ${payout.failure_message}`);
        await this.walletService.handlePayoutFailed(payout);
        break;
      }

      default:
        this.logger.log(`Unhandled event type: ${type}`);
    }
  }
}
