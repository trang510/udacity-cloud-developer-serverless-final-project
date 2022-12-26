import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { deleteReview } from '../../businessLogic/reviews'
// import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'

const logger = createLogger('deleteReview')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info("Processing deleteReview event: ", event)
    const reviewId = event.pathParameters.reviewId
    
    await deleteReview(reviewId)
    
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
