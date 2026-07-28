"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { handleCreateReview } from "@/lib/actions/review-action";
import type { Review } from "@/lib/api/reviews";

export function ReviewsSection({ productId, initialReviews }: { productId: string; initialReviews: Review[] }) {
  const router = useRouter();
  const [reviews, setReviews] = useState(initialReviews);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setMessage(null);
    startTransition(async () => {
      try {
        const result = await handleCreateReview(productId, rating, comment || undefined);
        if (result.success && result.data) {
          setReviews((prev) => [result.data, ...prev]);
          setComment("");
          setMessage({ type: "success", text: "Review submitted!" });
        } else if ("authRequired" in result && result.authRequired) {
          router.push("/login");
        } else {
          setMessage({ type: "error", text: "message" in result && result.message ? result.message : "Failed to submit review" });
        }
      } catch {
        setMessage({ type: "error", text: "Something went wrong. Please try again." });
      }
    });
  };

  return (
    <div>
      <form onSubmit={onSubmit} className="mb-8 rounded-lg bg-white p-6 shadow-sm ring-1 ring-black/5">
        <h3 className="text-sm font-bold">Write a Review</h3>
        {message && (
          <p className={`mt-2 text-sm ${message.type === "success" ? "text-emerald-600" : "text-red-600"}`}>{message.text}</p>
        )}
        <div className="mt-4 flex items-center gap-2 text-2xl">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              aria-label={`Rate ${star} stars`}
              className={star <= rating ? "text-[#d8b52f]" : "text-neutral-300"}
            >
              ★
            </button>
          ))}
        </div>
        <textarea
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          placeholder="Share your thoughts (optional)"
          className="mt-4 h-24 w-full rounded-lg border border-neutral-200 p-3 text-sm outline-none focus:border-[#d8b52f]"
        />
        <button
          type="submit"
          disabled={isPending}
          className="mt-4 h-10 rounded bg-[#d8b52f] px-6 text-sm font-semibold text-[#3c3106] transition hover:bg-[#c9a828] disabled:opacity-60"
        >
          {isPending ? "Submitting..." : "Submit Review"}
        </button>
      </form>

      {reviews.length === 0 ? (
        <p className="text-sm text-neutral-500">No reviews yet. Be the first to review this product.</p>
      ) : (
        <div className="space-y-5">
          {reviews.map((review) => {
            const user = typeof review.userId === "object" ? review.userId : null;
            return (
              <div key={review._id} className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-black/5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">{user?.fullName || "Anonymous"}</span>
                  <span className="text-xs text-[#d8b52f]">
                    {"★".repeat(review.rating)}
                    {"☆".repeat(5 - review.rating)}
                  </span>
                </div>
                {review.comment && <p className="mt-2 text-sm text-neutral-600">{review.comment}</p>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
