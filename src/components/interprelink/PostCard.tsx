import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  MessageCircle, Heart, Share2, MoreHorizontal,
  Bookmark
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Post } from "./types";

interface PostCardProps {
  post: Post;
}

// Memoized to prevent re-renders when parent state (like search query) changes
const PostCard = React.memo(({ post }: PostCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start gap-4">
          <Avatar className="w-12 h-12">
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">User</h3>
                <p className="text-sm text-muted-foreground">Interpreter</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                </span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="focus-visible:ring-2">
                      <span className="sr-only">More options</span>
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>More options</TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-foreground leading-relaxed">{post.content}</p>

        {post.tags && (
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag, index) => (
              <Badge key={index} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center gap-6">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center gap-2 focus-visible:ring-2">
                  <span className="sr-only">Like post</span>
                  <Heart className="w-4 h-4" />
                  <span aria-hidden="true">0</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Like</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center gap-2 focus-visible:ring-2">
                  <span className="sr-only">Comment on post</span>
                  <MessageCircle className="w-4 h-4" />
                  <span aria-hidden="true">0</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Comment</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center gap-2 focus-visible:ring-2">
                  <span className="sr-only">Share post</span>
                  <Share2 className="w-4 h-4" />
                  <span aria-hidden="true">0</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Share</TooltipContent>
            </Tooltip>
          </div>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="focus-visible:ring-2">
                <span className="sr-only">Bookmark post</span>
                <Bookmark className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Bookmark</TooltipContent>
          </Tooltip>
        </div>
      </CardContent>
    </Card>
  );
});

PostCard.displayName = "PostCard";

export default PostCard;
