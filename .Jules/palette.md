## 2024-03-XX - [Added Feedback for Copy Action]
**Learning:** For copy-to-clipboard or similar non-navigational icon button actions, the lack of visual feedback creates confusion about whether the action succeeded.
**Action:** Always provide visual feedback for copy actions using the Shadcn UI `useToast` hook imported directly from `@/hooks/use-toast` (not `@/components/ui/use-toast`). Ensure `aria-label` and `Tooltip` are also present.
