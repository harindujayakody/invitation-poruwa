import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";
import si from "@/messages/si.json";
import ta from "@/messages/ta.json";
import en from "@/messages/en.json";

const messagesMap = {
  si,
  ta,
  en,
} as const;

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  // Validate that the incoming locale is supported
  if (!locale || !routing.locales.includes(locale as typeof routing.locales[number])) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: messagesMap[locale as keyof typeof messagesMap] ?? messagesMap.si,
  };
});
