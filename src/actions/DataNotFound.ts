import { MessengerContext, LineContext, TelegramContext } from 'bottender';

export default async function DataNotFound(
  context: MessengerContext | LineContext | TelegramContext
): Promise<void> {
  await context.sendText('Sorry. No data.');
}
