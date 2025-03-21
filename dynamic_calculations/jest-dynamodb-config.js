const config = {
  tables: [
    {
      TableName: "actions",
      KeySchema: [{ AttributeName: "pk", KeyType: "HASH" }],
      AttributeDefinitions: [
        { AttributeName: "pk", AttributeType: "S" },
        { AttributeName: "parentPk", AttributeType: "S" },
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1,
      },
      GlobalSecondaryIndexes: [
        {
          IndexName: "parent-index",
          KeySchema: [
            {
              AttributeName: "parentPk",
              KeyType: "HASH",
            },
          ],
          Projection: { ProjectionType: "ALL" },
          ProvisionedThroughput: {
            // Add provisioned throughput for the index
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1,
          },
        },
      ],
    },
    {
      TableName: "users",
      KeySchema: [{ AttributeName: "pk", KeyType: "HASH" }],
      AttributeDefinitions: [{ AttributeName: "pk", AttributeType: "S" }],
      ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1,
      },
    },
  ],
  port: 9100,
};

module.exports = config;
