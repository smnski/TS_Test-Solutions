export type EventPayload = {
  Headers: {
    userId: string;
  };
  body: EventBody;
};

type EventBody = {
  actionId: string;
};

export type ResponseType = {
  statusCode: number;
  body: {
    timestamp?: string;
    message?: string;
    data?: ResponseData;
  };
};

export type ResponseData = {
  color?: string;
  image?: string;
  result?: number;
};