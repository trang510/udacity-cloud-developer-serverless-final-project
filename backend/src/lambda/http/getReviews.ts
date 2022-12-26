import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { getReviewsForUser as getReviewsForUser } from '../../helpers/reviews'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger';


const logger = createLogger('getReview')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info("Processing getReview event: ", event)
    
    const userId = getUserId(event)
    const reviews = await getReviewsForUser(userId)
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        items: reviews
      })
    }
})

handler.use(
  cors({
    credentials: true
  })
)
