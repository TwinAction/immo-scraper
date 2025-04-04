/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "immo-scraper",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "aws",
      providers: {
        aws: {
          profile:
            input.stage === "production"
              ? "schwabbrothers-prod"
              : "schwabbrothers-dev",
        },
      },
    };
  },
  async run() {

    const brokerTable = new sst.aws.Dynamo("BrokerTable", {
      fields: {
        id: "string"
      },
      primaryIndex: { hashKey: "id" }
    });
    new sst.aws.Nextjs("WebApp", {
      path: "./packages/app",
      link: [brokerTable],
    });

    new sst.aws.Cron("CronJob", {
      schedule: "rate(1 minute)",
      function: "./packages/functions/src/cron.handler",
      link: [brokerTable],
    });
  },
});
