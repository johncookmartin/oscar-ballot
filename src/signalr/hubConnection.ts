import {
  HubConnectionBuilder,
  HubConnection,
  LogLevel,
  HubConnectionState,
} from '@microsoft/signalr';

const hubUrl = `${import.meta.env.VITE_API_BASE_URL}/hubs/oscar`;

export const hubConnection: HubConnection = new HubConnectionBuilder()
  .withUrl(hubUrl)
  .withAutomaticReconnect()
  .configureLogging(LogLevel.Warning)
  .build();

export { HubConnectionState };
