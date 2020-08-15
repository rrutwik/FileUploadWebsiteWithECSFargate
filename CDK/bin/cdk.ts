#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { VPCStack } from '../lib/vpcStack';
import { WebPageStack } from '../lib/webpage-stack';
//Account Details
const env  = { account: '687783266853', region: 'us-east-1' };
const app = new cdk.App();
//Stacks
const vpc = new VPCStack(app, "VPCStack",{
    env: env
});
new WebPageStack(app, "WebPageStack", {
    cluster: vpc.cluster,
    env: env
})