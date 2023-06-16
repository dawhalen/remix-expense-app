const { Stack, Duration } = require('aws-cdk-lib');
const ec2 = require("aws-cdk-lib/aws-ec2");
const ecs = require("aws-cdk-lib/aws-ecs");
const ecs_patterns = require("aws-cdk-lib/aws-ecs-patterns");

class CdkStack extends Stack {
  /**
   *
   * @param {Construct} scope
   * @param {string} id
   * @param {StackProps=} props
   */
  constructor(scope, id, props) {
    super(scope, id, props);

    /**
    const vpc = new ec2.Vpc(this, "DanDevVPC", {
      maxAzs: 3 // Default is all AZs in region
    });
    */
   const vpc = ec2.Vpc.fromLookup(this, 'DefaultVPC', { isDefault: true });

    /**
    const cluster = new ecs.Cluster(this, "DanDevCluster", {
      vpc: vpc
    });
    */
   const cluster = ecs.Cluster.fromClusterAttributes(this, 'DanDevCluster', {clusterArn: 'arn:aws:ecs:us-east-1:319180752723:cluster/DevCluster', vpc: vpc})

    // Create a load-balanced Fargate service and make it public
    new ecs_patterns.ApplicationLoadBalancedFargateService(this, "DanDevTest", {
      cluster: cluster, // Required
      cpu: 256, // Default is 256
      desiredCount: 1, // Default is 1
      assignPublicIp: false, // Default is false
      taskImageOptions: { image: ecs.ContainerImage.fromRegistry("319180752723.dkr.ecr.us-east-1.amazonaws.com/dandev") },
      memoryLimitMiB: 512, // Default is 512
      publicLoadBalancer: true // Default is true
    });
  }
}

module.exports = { CdkStack }
