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
  body: ResponseBodyType;
};

export type ResponseBodyType = {
  message?: string;
  result?: number;
  timestamp?: number;
  color?: string;
  image?: string;
}

export type ActionData = {
  result?: number;
  timestamp?: number;
  color?: string;
  image?: string;
}