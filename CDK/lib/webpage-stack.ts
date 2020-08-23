import * as cdk from '@aws-cdk/core';
import * as ec2 from "@aws-cdk/aws-ec2";
import * as ecs from "@aws-cdk/aws-ecs";
import * as ecs_patterns from "@aws-cdk/aws-ecs-patterns";
import * as s3 from "@aws-cdk/aws-s3";
import * as route53 from '@aws-cdk/aws-route53';
import * as targets from '@aws-cdk/aws-route53-targets';

export interface serviceProps extends cdk.StackProps {
  cluster: ecs.Cluster
}

export class WebPageStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props: serviceProps) {
        super(scope, id, props);
        const s3Bucket = new s3.Bucket(this, 'FileBucket');
        const service = new ecs_patterns.NetworkLoadBalancedEc2Service(this, "EC2Service", {
        cluster: props.cluster,
        desiredCount: 1,
        publicLoadBalancer: false,
        taskImageOptions: {
            image: ecs.ContainerImage.fromAsset("../sourceCode"),
            containerPort: 8081,
            environment: {
              "BUCKETNAME": s3Bucket.bucketName
            }
        },
        memoryLimitMiB: 512,
        cpu: 1
        });
        s3Bucket.grantReadWrite(service.taskDefinition.taskRole);

        // Friendly Name To Access website
        const zone = route53.HostedZone.fromHostedZoneAttributes(this, 'MyZone', {
          zoneName: 'aws.rutwikpatel.com',
          hostedZoneId: 'Z05638817DWPGGBD0P34',
        });
        new route53.ARecord(this, 'ARecord', {
          zone: zone,
          recordName: 'test.aws.rutwikpatel.com',
          target: route53.RecordTarget.fromAlias(new targets.LoadBalancerTarget(service.loadBalancer))
        });
    }
}
