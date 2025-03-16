export type EventPayload = {
  Headers: {
    userId: string;
  };
  body: EventPayloadBody;
};

type EventPayloadBody = {
  actionId: string;
};

export type ResponseType = {
  statusCode: number;
  body: {
    message?: string;
    result?: number | ActionData;
  };
};

export type ActionData = {
  color?: string;
  image?: string;
  timestamp?: number;
};