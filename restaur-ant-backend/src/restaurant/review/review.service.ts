import { Injectable } from '@nestjs/common';
import { Review, ReviewStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ReviewService {
  constructor(private readonly prismaService: PrismaService) {}

  async findForRestaurant(restaurantId: string) {
    const getTotalReviews = async () => {
      const reviewsCount = await this.prismaService.review.count({
        where: {
          restaurantId,
          status: ReviewStatus.PUBLISHED,
        },
      });
      return reviewsCount;
    };
    const getAverageRating = async () => {
      const reviews = await this.prismaService.review.aggregate({
        _avg: {
          rating: true,
        },
        where: {
          status: {
            equals: ReviewStatus.PUBLISHED,
          },
          restaurantId: { equals: restaurantId },
        },
      });

      return reviews._avg.rating;
    };
    const getHighestReview = async () => {
      return this.prismaService.review.findFirst({
        where: {
          status: {
            equals: ReviewStatus.PUBLISHED,
          },
          restaurantId: { equals: restaurantId },
        },
        orderBy: [{ rating: 'desc' }],
        include: { user: { select: { name: true } } },
      });
    };
    const getLowestReview = async () => {
      return this.prismaService.review.findFirst({
        where: {
          status: {
            equals: ReviewStatus.PUBLISHED,
          },
          restaurantId: { equals: restaurantId },
        },
        orderBy: [{ rating: 'asc' }],
        include: { user: { select: { name: true } } },
      });
    };
    const getLatest = async () => {
      return this.prismaService.review.findFirst({
        where: {
          status: {
            equals: ReviewStatus.PUBLISHED,
          },
          restaurantId: { equals: restaurantId },
        },
        orderBy: [{ createdAt: 'desc' }],
        include: { user: { select: { name: true } } },
      });
    };

    return {
      averageRating: await getAverageRating(),
      totalReviews: await getTotalReviews(),
      highestReview: await getHighestReview(),
      lowestReview: await getLowestReview(),
      latest: await getLatest(),
    };
  }

  async findAllForRestaurant(restaurantId: string): Promise<Review[]> {
    return this.prismaService.review.findMany({
      where: {
        restaurantId: {
          equals: restaurantId,
        },
        status: { equals: ReviewStatus.PUBLISHED },
      },
      orderBy: [{ createdAt: 'desc' }],
      include: { user: { select: { id: true, name: true } } },
    });
  }

  async findOne(restaurantId: string, reviewId: string): Promise<Review> {
    return this.prismaService.review.findUnique({
      where: {
        id: reviewId,
      },
      include: { user: { select: { id: true, name: true } } },
    });
  }

  async create(
    userId: string,
    restaurantId: string,
    reviewDto: Partial<Review>,
  ) {
    const review: Review = {
      id: undefined,
      userId,
      restaurantId,
      rating: reviewDto.rating,
      comment: reviewDto.comment,
      dateOfVisit: reviewDto.dateOfVisit,
      status: undefined,
      createdAt: undefined,
    };

    try {
      const createdReview = await this.prismaService.review.create({
        data: review,
      });
      return createdReview;
    } catch (err) {
      //TODO HANDLE
      throw err;
    }
  }

  async update(id: string, reviewDto: Partial<Review>) {
    const review = await this.prismaService.review.findUnique({
      where: { id },
    });

    if (review) {
      const sanitaryReview: Partial<Review> = {
        rating: reviewDto.rating,
        comment: reviewDto.comment,
        dateOfVisit: reviewDto.dateOfVisit,
      };

      try {
        const updatedReview = await this.prismaService.review.update({
          data: sanitaryReview,
          where: { id },
        });
        return updatedReview;
      } catch (err) {
        //TODO HANDLE
        throw err;
      }
    } else throw new Error(`REVIEW_NOT_FOUND`);
  }

  async delete(id: string) {
    const review = await this.prismaService.review.findUnique({
      where: { id },
    });

    if (review) {
      try {
        const updatedReview = await this.prismaService.review.update({
          data: { status: ReviewStatus.DELETED },
          where: { id },
        });
        return updatedReview;
      } catch (err) {
        //TODO HANDLE
        throw err;
      }
    } else throw new Error(`REVIEW_NOT_FOUND`);
  }
}
