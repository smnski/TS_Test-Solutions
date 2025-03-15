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
    data?: ResponseData;
  };
};

export type ResponseData = {
  color?: string;
  image?: string;
  timestamp?: number;
  result?: number;
};