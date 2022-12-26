import { ReviewAccess } from './reviewsAcess'
// import { AttachmentUtils } from './attachmentUtils';
import { BookReview } from '../models/BookReview'
import { CreateReviewRequest } from '../requests/CreateReviewRequest'
import { UpdateReviewRequest } from '../requests/UpdateReviewRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
// import * as createError from 'http-errors'
import { ReviewUpdate } from '../models/ReviewUpdate'
import { ReviewsStorage } from './attachmentUtils'

const logger = createLogger('reviews')
const reviewAccess = new ReviewAccess()
const reviewsStorage = new ReviewsStorage()

export async function getReviewsForUser(userId: string): Promise<BookReview[]> {
  logger.info(`Get all reviews for user ${userId}`)
  return await reviewAccess.getAllReviews(userId)
}

export async function createReview(userId: string, newReview: CreateReviewRequest): Promise<BookReview> {  
  logger.info(`Create new review for user ${userId}`)
  const newItem = {
    userId,
    reviewId: uuid.v4(),
    createdAt: new Date().toISOString(),
    attachmentUrl: 'default',
    ...newReview
  }
  return await reviewAccess.createReview(newItem)
}

export async function updateReview(updateReviewRequest: UpdateReviewRequest, reviewId: string) {
  logger.info(`Updating review ${reviewId}`)

  const item = await reviewAccess.getReview(reviewId)

  if (!item)
    throw new Error('Review not found')

    reviewAccess.updateReview(reviewId, updateReviewRequest as ReviewUpdate)
}

export async function deleteReview(reviewId: string) {
  logger.info(`Deleting review ${reviewId}`)

  const item = await reviewAccess.getReview(reviewId)

  if (!item)
    throw new Error('Review not found')

    reviewAccess.deleteReview(reviewId)
}

export async function updateAttachmentUrl(reviewId: string, attachmentId: string){
  logger.info(`Getting upload url review ${reviewId}`)

  const item = await reviewAccess.getReview(reviewId)

  if (!item)
    throw new Error('Review not found')

  const attachmentUrl = await reviewsStorage.getAttachmentUrl(attachmentId)

  await reviewAccess.updateAttachmentUrl(reviewId, attachmentUrl)
}

export async function generateUploadUrl(attachmentId: string): Promise<string> {
  logger.info(`Generating upload url for attachment ${attachmentId}`)
  return await reviewsStorage.getUploadUrl(attachmentId)
}
