export interface BookReview {
  userId: string
  reviewId: string
  createdAt: string
  bookName: string
  content: string
  attachmentUrl?: string
}
