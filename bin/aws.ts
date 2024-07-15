#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { EraAwsStackLambda } from '../lib/era-aws-stack-lambda';
import {EraAwsStackAdmin} from "../lib/era-aws-stack-admin";
import {EraAwsStackPublic} from "../lib/era-aws-stack-public";
import {EraAwsStackUser} from "../lib/era-aws-stack-user";
import {EraAwsStackManager} from "../lib/era-aws-stack-manager";
import {EraAwsStackApi} from "../lib/era-aws-stack-api";
import {EraAwsStackDynamo} from "../lib/era-aws-stack-dynamo";

const app = new cdk.App();

const publicStack = new EraAwsStackPublic(app, 'EraAwsStackPublic');
const userStack = new EraAwsStackUser(app, 'EraAwsStackUser');
const managerStack = new EraAwsStackManager(app, 'EraAwsStackManager');
const adminStack = new EraAwsStackAdmin(app, 'EraAwsStackAdmin');
const dynamoStack = new EraAwsStackDynamo(app, 'EraAwsStackDynamo');

new EraAwsStackLambda(app,
    'EraAwsStackLambda',
    publicStack,
    userStack,
    managerStack,
    adminStack,
    dynamoStack
);

new EraAwsStackApi(app,
'EraAwsStackApi',
    publicStack,
    userStack,
    managerStack,
    adminStack,
    dynamoStack
);