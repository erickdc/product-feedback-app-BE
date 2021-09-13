//import db
const db = require('../config/db/db');

// create a class called FeedbackDAO and create methods with queries on accessing db:
class FeedbackDAO {
	async getFeedback() {
		const knex = await db;
		return await knex
			.default('product_feedback')
			.leftJoin(
				'comments',
				'product_feedback.product_feedback_id',
				'=',
				'comments.product_request_id'
			)
			.select(
				'product_feedback.title',
				'product_feedback.category',
				'product_feedback.upvotes',
				'product_feedback.status',
				'product_feedback.description',
				'product_feedback.created_at'
			)
			.count('comments.comment_id as comments')
			.whereNull('comments.reply_id')
			.groupBy(
				'product_feedback.title',
				'product_feedback.category',
				'product_feedback.upvotes',
				'product_feedback.status',
				'product_feedback.description',
				'product_feedback.created_at'
			);
	}

	async getSingleFeedback(id: number) {
		const product_feedbackId: number = id;
		const knex = await db;
		return await knex
			.default('product_feedback')
			.select('title', 'category', 'upvotes')
			.where('product_feedback_id', product_feedbackId);
	}

	async getSingleFeedbackComments(id: number) {
		const product_feedbackId = id;
		const knex = await db;
		return await knex
			.default('comments')
			.select(
				'content',
				'product_request_id',
				'replying_to_user',
				'replying_to_id',
				'reply_id',
				'created_at'
			)
			.where('product_request_id', product_feedbackId);
	}

	async createFeedback(
		feedbackTitle: string,
		category: string,
		feedbackDetail: string
	) {
		const knex = await db;
		return await knex.default('product_feedback').insert({
			title: feedbackTitle,
			category,
			upvotes: 0,
			status: 'suggestion',
			description: feedbackDetail,
		});
	}

	async deleteFeedback(id: number) {
		const feedbackId: number = id;
		const knex = await db;
		return await knex
			.default('product_feedback')
			.where('product_feedback_id', feedbackId)
			.del();
	}
}

// createFeedback(title, category, description)

// export feedbackDAO
module.exports = new FeedbackDAO();
