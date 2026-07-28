import {
  Controller,
  Post,
  Body,
  Headers,
  Req,
  RawBodyRequest,
  Logger,
} from '@nestjs/common';
import { StripeService } from './stripe.service';
import { CreatePaymentIntentDto } from './dto/create-payment-intent.dto';

@Controller('stripe')
export class StripeController {
  private readonly logger = new Logger(StripeController.name);

  constructor(private readonly stripeService: StripeService) {}

  @Post('create-payment-intent')
  async createPaymentIntent(@Body() dto: CreatePaymentIntentDto) {
    const paymentIntent = await this.stripeService.createPaymentIntent(
      dto.amount,
      dto.currency,
      dto.metadata,
    );

    return { clientSecret: paymentIntent.client_secret };
  }

  @Post('webhook')
  async handleWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('stripe-signature') signature: string,
  ) {
    const event = await this.stripeService.constructEventFromPayload(
      req.rawBody!,
      signature,
    );

    this.logger.log(`Webhook received: ${event.type}`);
    await this.stripeService.handleWebhookEvent(event);

    return { received: true };
  }
}
