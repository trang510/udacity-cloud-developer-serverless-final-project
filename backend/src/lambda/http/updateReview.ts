import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { updateReview } from '../../helpers/reviews'
import { UpdateReviewRequest } from '../../requests/UpdateReviewRequest'
// import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'

const logger = createLogger('updateReview')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info("Processing updateReview event: ", event)
    const reviewId = event.pathParameters.reviewId
    const updatedReview: UpdateReviewRequest = JSON.parse(event.body)
    
    await updateReview(updatedReview, reviewId)
    return {
      statusCode: 200,
      body: JSON.stringify({
      })
    }
  })

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
