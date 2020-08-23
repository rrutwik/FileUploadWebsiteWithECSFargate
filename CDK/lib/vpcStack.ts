import * as cdk from '@aws-cdk/core';
import * as ec2 from "@aws-cdk/aws-ec2";
import * as ecs from "@aws-cdk/aws-ecs";

export class VPCStack extends cdk.Stack {
  public readonly cluster: ecs.Cluster;
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const vpc = new ec2.Vpc(this, "FileUploadWebsiteVpc", {
      maxAzs: 1
    });

    this.cluster = new ecs.Cluster(this, "FileUploadWebsiteCluster", {
      clusterName: "FileUploadWebsiteCluster",
      containerInsights: true,
      vpc: vpc
    });
    const ec2Type = new ec2.InstanceType("t2.micro");
    this.cluster.addCapacity("ec2Instance", {
      instanceType: ec2Type
    });
  }
}
