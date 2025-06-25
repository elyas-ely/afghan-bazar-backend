ALTER TABLE "reviews" DROP CONSTRAINT "reviews_user_id_product_id_unique";--> statement-breakpoint
DROP INDEX "idx_reviews_user_id";--> statement-breakpoint
CREATE INDEX "orders_product_id_idx" ON "orders" USING btree ("product_id");