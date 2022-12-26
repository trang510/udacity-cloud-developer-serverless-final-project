import dateFormat from 'dateformat'
import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import {
  Button,
  Checkbox,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader,
  Form
} from 'semantic-ui-react'

import { createReview, deleteReview, getReviews, patchReview } from '../api/reviews-api'
import Auth from '../auth/Auth'
import { Review } from '../types/Review'

interface ReviewsProps {
  auth: Auth
  history: History
}

interface ReviewsState {
  reviews: Review[]
  newContent: string
  newBookName: string
  loadingReviews: boolean
}

export class Reviews extends React.PureComponent<ReviewsProps, ReviewsState> {
  state: ReviewsState = {
    reviews: [],
    newContent: '',
    newBookName: '',
    loadingReviews: true
  }

  handleBookNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newBookName: event.target.value })
  }

  handleContentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newContent: event.target.value })
  }

  

  onEditButtonClick = (reviewId: string) => {
    this.props.history.push(`/reviews/${reviewId}/edit`)
  }

  onReviewCreate = async (event: React.FormEvent<HTMLFormElement>) => {
    try {
      const newReview = await createReview(this.props.auth.getIdToken(), {
        content: this.state.newContent,
        bookName:this.state.newBookName
      })
      this.setState({
        reviews: [...this.state.reviews, newReview]
      })
    } catch {
      alert('Review creation failed')
    }
  }

  onReviewDelete = async (reviewId: string) => {
    try {
      await deleteReview(this.props.auth.getIdToken(), reviewId)
      this.setState({
        reviews: this.state.reviews.filter(review => review.reviewId !== reviewId)
      })
    } catch {
      alert('Review deletion failed')
    }
  }

  // onReviewCheck = async (pos: number) => {
  //   try {
  //     const review = this.state.reviews[pos]
  //     await patchReview(this.props.auth.getIdToken(), review.reviewId, {
  //       title: review.title        
  //     })
  //     this.setState({
  //       reviews: update(this.state.reviews, {
  //         [pos]: { done: { $set: !review.done } }
  //       })
  //     })
  //   } catch {
  //     alert('Review deletion failed')
  //   }
  // }

  async componentDidMount() {
    try {
      const reviews = await getReviews(this.props.auth.getIdToken())
      this.setState({
        reviews,
        loadingReviews: false
      })
    } catch (e) {
      alert(`Failed to fetch reviews: ${(e as Error).message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">BOOK Reviews</Header>

        {this.renderCreateReviewInput()}

        {this.renderReviews()}
      </div>
    )
  }

  renderCreateReviewInput() {
    const { newBookName, newContent } = this.state    
    return (
      <Grid.Row>
        <Grid.Column width={16}>
        <Form onSubmit={this.onReviewCreate}>
          <Form.Group>
            <Form.Input
              name='Book Name'
              placeholder='Book Name'
              value={newBookName}
              id='form-input-book-name'
              onChange={this.handleBookNameChange}
            />
            <Form.Input
              name='Review'
              placeholder='Your Review'
              value={newContent}
              id='form-input-review'
              onChange={this.handleContentChange}
            />
            <Form.Button content='Submit' />
          </Form.Group>           
        </Form>          
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderReviews() {
    if (this.state.loadingReviews) {
      return this.renderLoading()
    }

    return this.renderReviewsList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading REVIEWs
        </Loader>
      </Grid.Row>
    )
  }

  renderReviewsList() {
    return (
      <Grid padded>
        {this.state.reviews.map((review, pos) => {
          return (
            <Grid.Row key={review.reviewId}>
              {/* <Grid.Column width={1} verticalAlign="middle">
                <Checkbox
                  onChange={() => this.onReviewCheck(pos)}
                  checked={review.done}
                />
              </Grid.Column> */}
              <Grid.Column width={10} verticalAlign="middle">
                {review.bookName}
              </Grid.Column>
              <Grid.Column width={3} floated="right">
                {review.content}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(review.reviewId)}
                >
                  <Icon name="pencil" />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onReviewDelete(review.reviewId)}
                >
                  <Icon name="delete" />
                </Button>
              </Grid.Column>
              {review.attachmentUrl && (
                <Image src={review.attachmentUrl} size="small" wrapped />
              )}
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }

  calculateDueDate(): string {
    const date = new Date()
    date.setDate(date.getDate() + 7)

    return dateFormat(date, 'yyyy-mm-dd') as string
  }
}
