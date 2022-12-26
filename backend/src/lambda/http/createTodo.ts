import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { getUserId } from '../utils';
import { createTodo } from '../../helpers/todos'
import { createLogger } from '../../utils/logger'

const logger = createLogger('createTodo')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info("Processing getTodo event: ", event)
    const newTodo: CreateTodoRequest = JSON.parse(event.body)
    const userId = getUserId(event)

    const newItem = await createTodo(userId, newTodo)
    
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
