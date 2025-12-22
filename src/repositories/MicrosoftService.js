import 'isomorphic-fetch';
import { ClientSecretCredential } from "@azure/identity";
import { Client } from "@microsoft/microsoft-graph-client";
import { TokenCredentialAuthenticationProvider } from '@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials/index.js';

class MicrosoftService {
  client;
  microsoftAccount = process.env.MICROSOFT_ACCOUNT;
  clientId = process.env.MICROSOFT_APPLICATION_ID;
  tenantId = process.env.MICROSOFT_TENANT_ID;
  clientSecret = process.env.MICROSOFT_SECRET;
  callendarId;

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

  async getCallendars() {
    return await this.client
      .api(`/users/${this.microsoftAccount}/calendars`)
      .header("Prefer", 'outlook.timezone="Europe/Paris"')
      .top(10)
      .get();
  }

  async getCallendarId() {
    if (!this.callendarId) {
      this.callendarId = (await this.getCallendars()).value[0].id;
    }
    return this.callendarId;
  }

  async getEvents() {
    const id = await this.getCallendarId();
    return await this.client
      .api(`/users/${this.microsoftAccount}/calendars/${id}/events`)
      .header("Prefer", 'outlook.timezone="Europe/Paris"')
      .top(10)
      .get();
  }

  async getSchedule(start, end, duration = 60) {
    const id = await this.getCallendarId();
    return await this.client
      .api(`/users/${this.microsoftAccount}/calendars/${id}/getSchedule`)
      .post({
        schedules: [this.microsoftAccount],
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

export default new MicrosoftService;