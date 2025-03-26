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
    new sst.aws.Nextjs("WebApp", {
      path: "./packages/app",
    });

    new sst.aws.Cron("ScheduledFunction", {
      schedule: "rate(1 hour)",
      job: {
        function: {
          handler: "packages/functions/src/index.hello",
        },
      },
    });
  },
});
