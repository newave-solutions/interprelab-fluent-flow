## 2024-05-24 - Interactive Conversation Icons Missing Labels
**Learning:** Icon-only interactive elements in module overlays (like the ConversationMode SOAP note close button and audio playback buttons) are prone to missing ARIA labels and focus states because they are often deeply nested in modal-like or absolute-positioned UI structures.
**Action:** When implementing or reviewing interactive assessment/study modules, ensure all standalone utility icons (close, play, mic toggle) are wrapped in `Tooltip` components and include `focus-visible` styling for keyboard users.
