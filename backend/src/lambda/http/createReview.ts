import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateReviewRequest } from '../../requests/CreateReviewRequest'
import { getUserId } from '../utils';
import { createReview } from '../../helpers/reviews'
import { createLogger } from '../../utils/logger'

const logger = createLogger('createReview')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info("Processing getReview event: ", event)
    const newReview: CreateReviewRequest = JSON.parse(event.body)
    const userId = getUserId(event)

    const newItem = await createReview(userId, newReview)
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        item: newItem
      })
    }
})

handler.use(
  cors({
    credentials: true
  })
)
