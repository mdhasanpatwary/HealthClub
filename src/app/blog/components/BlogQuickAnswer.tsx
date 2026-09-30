import React from "react";
import { BlogPost } from "@/types/blog";
import { GeoAnswerCapsule } from "./GeoAnswerCapsule";

export interface BlogQuickAnswerProps {
  post: BlogPost;
}

export function BlogQuickAnswer({ post }: BlogQuickAnswerProps) {
  return <GeoAnswerCapsule post={post} />;
}

