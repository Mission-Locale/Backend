import "isomorphic-fetch";
import { ClientSecretCredential } from "@azure/identity";
import { Client } from "@microsoft/microsoft-graph-client";
import { TokenCredentialAuthenticationProvider } from "@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials/index.js";
import { addMinutes, isBefore } from "date-fns";
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

  async addAppointment(appointment) {
    const jobSeeker = appointment.job_seeker.user;
    let pathPrefix;
    let subject;

    if (appointment.advisor != null) {
      pathPrefix = `/users/${appointment.advisor.user.email}`;
      subject = `Rendez-vous avec ${jobSeeker.last_name} ${jobSeeker.first_name}`;
    } else {
      pathPrefix = "/me";
      subject = `Rendez-vous d'inscription avec ${jobSeeker.last_name} ${jobSeeker.first_name}`;
    }

    return await this.client.api(pathPrefix + "/calendar/events").post({
      subject: subject,
      start: {
        dateTime: appointment.startTime,
      },
      end: {
        dateTime: addMinutes(appointment.startTime, appointment.duration),
      },
      id: appointment.id,
    });
  }

  async getRegistrationEvents() {
    return await this.client.api("/me/calendars/events").top(30).get();
  }

  async getAdvisorEvents(advisorEmail) {
    return await this.client
      .api(`/users/${advisorEmail}/calendars/events`)
      .top(30)
      .get();
  }

  async getRegistrationSchedule(start, end, duration = 60) {
    return await this.client.api(`/me/calendars/getSchedule`).post({
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

export default new MicrosoftService();
