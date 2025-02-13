#!/usr/bin/env node
import 'source-map-support/register'
import * as cdk from 'aws-cdk-lib'
import { CodePipelineStack } from '../lib/pipeline-stack'
import { MainStack } from '../lib/main-stack'

const app = new cdk.App()
new CodePipelineStack(app, 'CodePipeline', {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION }
})
new MainStack(app, 'Dev-MainStack')
// new line
