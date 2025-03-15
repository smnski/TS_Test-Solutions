export type EventPayload = {
  Headers: {
    userId: string;
  };
  body: string;
};

export type EventBody = {
  actionId: string;
};

export type ResponseType = {
  statusCode: number;
  body: {
    timestamp?: string;
    color?: string;
    image?: string;
    result?: number;
    message?: string;
  };
};