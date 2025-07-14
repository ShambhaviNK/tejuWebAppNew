"use client";
import React, { useState } from "react";
import { FaTimes, FaStar } from "react-icons/fa";
import {
  FeedbackOverlay,
  FeedbackModal,
  FeedbackHeader,
  CloseButton,
  FeedbackForm,
  RatingContainer,
  StarButton,
  FeedbackTextArea,
  SubmitButton,
  FeedbackTypeContainer,
  FeedbackTypeButton,
  ThankYouMessage
} from "./FeedbackPopup.styles";

interface FeedbackPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FeedbackPopup({ isOpen, onClose }: FeedbackPopupProps) {
  const [rating, setRating] = useState(0);
  const [feedbackType, setFeedbackType] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!feedback.trim()) {
      alert("Please provide some feedback before submitting.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rating,
          feedbackType,
          feedback,
          timestamp: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        setIsSubmitted(true);
        setTimeout(() => {
          onClose();
          // Reset form
          setRating(0);
          setFeedbackType("");
          setFeedback("");
          setIsSubmitted(false);
        }, 2000);
      } else {
        alert("Failed to submit feedback. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("Failed to submit feedback. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <FeedbackOverlay onClick={onClose}>
      <FeedbackModal onClick={(e: React.MouseEvent) => e.stopPropagation()}>
        <FeedbackHeader>
          <h3>We'd love your feedback!</h3>
          <CloseButton onClick={onClose}>
            <FaTimes />
          </CloseButton>
        </FeedbackHeader>

        {!isSubmitted ? (
          <FeedbackForm onSubmit={handleSubmit}>
            <div>
              <label>How would you rate your experience?</label>
              <RatingContainer>
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarButton
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    $active={star <= rating}
                  >
                    <FaStar />
                  </StarButton>
                ))}
              </RatingContainer>
            </div>

            <div>
              <label>What type of feedback is this?</label>
              <FeedbackTypeContainer>
                <FeedbackTypeButton
                  type="button"
                  onClick={() => setFeedbackType("bug")}
                  $active={feedbackType === "bug"}
                >
                  Bug Report
                </FeedbackTypeButton>
                <FeedbackTypeButton
                  type="button"
                  onClick={() => setFeedbackType("feature")}
                  $active={feedbackType === "feature"}
                >
                  Feature Request
                </FeedbackTypeButton>
                <FeedbackTypeButton
                  type="button"
                  onClick={() => setFeedbackType("general")}
                  $active={feedbackType === "general"}
                >
                  General Feedback
                </FeedbackTypeButton>
              </FeedbackTypeContainer>
            </div>

            <div>
              <label>Tell us more about your experience:</label>
              <FeedbackTextArea
                placeholder="Please share your thoughts, suggestions, or report any issues you encountered..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={4}
                required
              />
            </div>

            <SubmitButton type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Feedback"}
            </SubmitButton>
          </FeedbackForm>
        ) : (
          <ThankYouMessage>
            <h4>Thank you for your feedback!</h4>
            <p>Your input helps us improve Teju Talks.</p>
          </ThankYouMessage>
        )}
      </FeedbackModal>
    </FeedbackOverlay>
  );
} 