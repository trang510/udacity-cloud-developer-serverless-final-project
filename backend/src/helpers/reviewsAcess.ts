import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { BookReview } from '../models/BookReview'
import { ReviewUpdate } from '../models/ReviewUpdate';

const AWSXRay = require('aws-xray-sdk')
const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('ReviewsAccess')

export class ReviewAccess {
  constructor(
    private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
    private readonly reviewsTable = process.env.REVIEWS_TABLE,
    private readonly reviewsByUserIndex = process.env.REVIEWS_TABLE_USER_ID_INDEX
  ) {}
    
  async getAllReviews(userId: string): Promise<BookReview[]> {
    logger.info(`Get all reviews for user ${userId}`)
    const result = await this.docClient.query({
      TableName: this.reviewsTable,
      IndexName: this.reviewsByUserIndex,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {':userId': userId},
    }).promise()
        
    return result.Items as BookReview[]
  }
      
  async createReview(review: BookReview): Promise<BookReview> {
    logger.info('Create new review')
    await this.docClient.put({
      TableName: this.reviewsTable,
      Item: review
    }).promise()
      
    return review
  }

  async getReview(reviewId: string): Promise<BookReview> {
    logger.info(`Get review ${reviewId}`)
    const review = await this.docClient.get({
      TableName: this.reviewsTable,
      Key: {
        reviewId,
      }
    }).promise()
    
    const item = review.Item
    return item as BookReview
  }  

  async updateReview(reviewId: string, reviewUpdate: ReviewUpdate): Promise<void> {
    logger.info(`Update review ${reviewId}`)
    await this.docClient.update({
      TableName: this.reviewsTable,
      Key: {
        "reviewId": reviewId
      },
      UpdateExpression: "set #bookName=:bookName, content=:content",
      ExpressionAttributeValues:{
          ":bookName": reviewUpdate.bookName,
          ":content": reviewUpdate.content
      },
      ExpressionAttributeNames: {
        "#bookName": "bookName"
      }
    }).promise()    
  }

  async deleteReview(reviewId: string) {
    logger.info(`Delete review ${reviewId}`)
    await this.docClient.delete({
      TableName: this.reviewsTable,
      Key: {
        reviewId
      }
    }).promise()    
  }

  async updateAttachmentUrl(reviewId: string, attachmentUrl: string) {
    logger.info(`Update attachment url ${reviewId}`)
    await this.docClient.update({
      TableName: this.reviewsTable,
      Key: { reviewId},
      UpdateExpression: 'set attachmentUrl = :attachmentUrl',
      ExpressionAttributeValues: {':attachmentUrl': attachmentUrl}
    }).promise()
  }
  
}