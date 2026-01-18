# AWS Lambda Projects - DVA-C02 Exam Preparation

Hands-on Lambda projects to master AWS event-driven architecture for Developer Associate exam.

## 🏆 Technologies

![AWS](https://img.shields.io/badge/AWS-Lambda-orange)
![Node.js](https://img.shields.io/badge/Node.js-20.x-green)
![DynamoDB](https://img.shields.io/badge/DynamoDB-NoSQL-blue)

## 📚 Projects Overview

| Project | Services | Exam Topics | Status |
|---------|----------|-------------|--------|
| [S3 → Lambda → DynamoDB → SNS](./project-01-s3-lambda-dynamodb-sns/) | S3, Lambda, DynamoDB, SNS | Event-driven, IAM, Error Handling | ✅ Complete |
| [API Gateway + Lambda](./project-02-api-gateway-lambda/) | API Gateway, Lambda, DynamoDB | REST API, HTTP methods, CORS | 🚧 In Progress |
| [SQS + Lambda + DLQ](./project-03-sqs-lambda-dlq/) | SQS, Lambda | Async processing, DLQ | ⏳ Planned |




## 🎯 Learning Objectives

- **Event-driven architecture**: S3 triggers, API Gateway, SQS, EventBridge
- **IAM permissions**: Execution roles, resource-based policies
- **Error handling**: DLQ, retries, CloudWatch monitoring
- **Integration patterns**: Synchronous vs asynchronous invocation
- **Lambda configuration**: Timeout, memory, environment variables, layers

## 🛠️ Technologies

- **Runtime**: Node.js 20.x
- **AWS Services**: Lambda, S3, DynamoDB, SNS, SQS, API Gateway, EventBridge, CloudWatch
- **IaC** (optional): AWS SAM / Terraform for deployment

## 📖 How to Use This Repository

1. Each project has its own folder with detailed README
2. Lambda code is production-ready and well-commented
3. IAM policies are included for reference
4. Screenshots demonstrate working implementations
5. Test data included for hands-on practice

## 🚀 Quick Start

### Prerequisites
- AWS Account (Free Tier eligible)
- AWS CLI configured
- Basic understanding of JavaScript/Node.js

### Running a Project
1. Navigate to project folder
2. Read the project README
3. Follow step-by-step instructions
4. Deploy Lambda code from `lambda/` folder
5. Use test data from `test-data/` folder

## 📝 Project Details

### Project 1: S3 → Lambda → DynamoDB → SNS
**What it does**: Automatically processes CSV files uploaded to S3, stores data in DynamoDB, and sends email notifications.

**Key Learnings**:
- S3 event triggers
- CSV parsing in Lambda
- DynamoDB batch writes
- SNS notifications
- CloudWatch log monitoring

[View Project →](./project-01-s3-lambda-dynamodb-sns/)



## 🎓 Exam Tips

### Lambda Limits (Memorize These!)
- Default timeout: **3 seconds** (max: 15 minutes)
- Default memory: **128 MB** (max: 10,240 MB)
- Max deployment package: **50 MB** zipped
- Concurrent executions: **1000** per account
- Environment variables: **4 KB** total

### Common Exam Scenarios
1. **"Lambda times out"** → Increase timeout
2. **"Lambda can't access S3"** → Check IAM execution role
3. **"Failed messages disappear"** → Add DLQ
4. **"Database connection exhaustion"** → Use RDS Proxy
5. **"Share code between Lambdas"** → Use Lambda Layers

## 📂 Repository Structure
aws-lambda-projects/
├── README.md                    # This file
├── project-01-s3-lambda-dynamodb-sns/
├── project-02-api-gateway-lambda/
└── project-03-sqs-lambda-dlq/


## 🤝 Contributing

This is a personal learning repository, but feedback is welcome!

## 📜 License

MIT License - Feel free to use for your own exam prep

## 📧 Contact

- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your Name](https://linkedin.com/in/yourprofile)

---

**Note**: These projects use AWS Free Tier services. Remember to clean up resources after practice to avoid charges!

## ⚠️ Cost Warning

While most services are Free Tier eligible:
- **DynamoDB**: First 25 GB free
- **Lambda**: 1M requests/month free
- **S3**: First 5 GB free
- **SNS**: First 1,000 emails free

Always delete resources after practice:
```bash
# Cleanup checklist
□ Delete S3 buckets
□ Delete DynamoDB tables
□ Delete Lambda functions
□ Delete SNS topics
□ Delete API Gateway APIs
□ Delete CloudWatch log groups
□ Delete IAM roles
```

## 🌟 Star This Repo

If this helped your exam prep, please star ⭐ this repository!
=======