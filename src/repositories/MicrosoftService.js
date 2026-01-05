import "isomorphic-fetch";
import { ClientSecretCredential } from "@azure/identity";
import { Client } from "@microsoft/microsoft-graph-client";
import { TokenCredentialAuthenticationProvider } from "@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials/index.js";

function mapToCalendarEvent(microsoftEvent) {
  return {
    id: microsoftEvent.id,
    timeZone: microsoftEvent.start.timeZone,
    start: microsoftEvent.start.dateTime,
    end: microsoftEvent.end.dateTime,
    title: microsoftEvent.subject,
  };
}
class MicrosoftService {
  client;
  microsoftAccount = process.env.MICROSOFT_ACCOUNT;
  clientId = process.env.MICROSOFT_APPLICATION_ID;
  tenantId = process.env.MICROSOFT_TENANT_ID;
  clientSecret = process.env.MICROSOFT_SECRET;

  constructor() {
    const clientSecret = new ClientSecretCredential(
      this.tenantId,
      this.clientId,
      this.clientSecret
    );
    const authProvider = new TokenCredentialAuthenticationProvider(
      clientSecret,
      {
        scopes: ["https://graph.microsoft.com/.default"],
      }
    );
    const fetchOptions = {
      headers: { Prefer: 'outlook.timezone="Europe/Paris"' },
    };
    this.client = Client.initWithMiddleware({ authProvider, fetchOptions });
  }

  async getRegistrationEvents() {
    return await this.client
      .api(`/users/${this.microsoftAccount}/calendars/events`)
      .top(30)
      .get()
      .map(mapToCalendarEvent);
  }

  async getAdvisorEvents(advisorEmail) {
    return await this.client
      .api(`/users/${advisorEmail}/calendars/events`)
      .top(30)
      .get()
      .map(mapToCalendarEvent);
  }

  async getAdvisorSchedule(advisorEmail, start, end, duration = 60) {
    return await this.client
      .api(`/users/${advisorEmail}/calendars/getSchedule`)
      .post({
        schedules: [advisorEmail],
        startTime: {
          dateTime: start.toISOString(),
          timeZone: "Europe/Paris",
        },
        endTime: {
          dateTime: end.toISOString(),
          timeZone: "Europe/Paris",
        },
        availabilityViewInterval: duration,
      });
  }
}

export default new MicrosoftService();
