import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';

// Initialize AWS clients
const s3Client = new S3Client({});
const dynamoClient = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(dynamoClient);
const snsClient = new SNSClient({});

// Environment variables
const TABLE_NAME = process.env.DYNAMODB_TABLE || 'CustomerData';
const SNS_TOPIC_ARN = process.env.SNS_TOPIC_ARN || '';

export const handler = async (event) => {
    console.log('Event received:', JSON.stringify(event, null, 2));
    
    let processedCount = 0;
    let errors = [];
    let bucket, key;
    
    try {
        // Get bucket and key from S3 event
        bucket = event.Records[0].s3.bucket.name;
        key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
        
        console.log(`Processing file: s3://${bucket}/${key}`);
        
        // Get the CSV file from S3
        const getObjectCommand = new GetObjectCommand({
            Bucket: bucket,
            Key: key
        });
        
        const response = await s3Client.send(getObjectCommand);
        const fileContent = await streamToString(response.Body);
        
        // Parse CSV manually (simple parser)
        const lines = fileContent.trim().split('\n');
        const headers = lines[0].split(',').map(h => h.trim());
        
        console.log(`CSV Headers: ${headers.join(', ')}`);
        console.log(`Total rows to process: ${lines.length - 1}`);
        
        // Process each row (skip header)
        for (let i = 1; i < lines.length; i++) {
            try {
                const values = lines[i].split(',').map(v => v.trim());
                
                // Create object from headers and values
                const row = {};
                headers.forEach((header, index) => {
                    row[header] = values[index] || '';
                });
                
                // Add metadata
                row.uploadedAt = new Date().toISOString();
                row.sourceFile = key;
                
                // Write to DynamoDB
                const putCommand = new PutCommand({
                    TableName: TABLE_NAME,
                    Item: row
                });
                
                await docClient.send(putCommand);
                processedCount++;
                
                console.log(`✓ Processed record ${processedCount}:`, row.customerId || 'unknown');
                
            } catch (rowError) {
                const errorMsg = `Error processing row ${i}: ${rowError.message}`;
                console.error(errorMsg);
                errors.push(errorMsg);
            }
        }
        
        // Send SNS notification
        const notificationMessage = `
CSV Processing Complete!

File: ${key}
Bucket: ${bucket}
Records Processed: ${processedCount}
Errors: ${errors.length}
Timestamp: ${new Date().toISOString()}

${errors.length > 0 ? 'Errors encountered:\n' + errors.join('\n') : 'All records processed successfully!'}
        `;
        
        const publishCommand = new PublishCommand({
            TopicArn: SNS_TOPIC_ARN,
            Subject: `CSV Processing: ${key}`,
            Message: notificationMessage
        });
        
        await snsClient.send(publishCommand);
        console.log('✓ SNS notification sent');
        
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Processing complete',
                recordsProcessed: processedCount,
                errors: errors.length
            })
        };
        
    } catch (error) {
        const errorMessage = `Fatal error processing CSV: ${error.message}`;
        console.error(errorMessage);
        console.error('Full error:', error);
        
        // Send error notification
        try {
            const errorPublishCommand = new PublishCommand({
                TopicArn: SNS_TOPIC_ARN,
                Subject: 'CSV Processing FAILED',
                Message: `Error: ${errorMessage}\nFile: ${key || 'unknown'}\nBucket: ${bucket || 'unknown'}`
            });
            
            await snsClient.send(errorPublishCommand);
        } catch (snsError) {
            console.error('Failed to send error notification:', snsError);
        }
        
        throw error;
    }
};

// Helper function to convert stream to string
async function streamToString(stream) {
    const chunks = [];
    for await (const chunk of stream) {
        chunks.push(chunk);
    }
    return Buffer.concat(chunks).toString('utf-8');
}