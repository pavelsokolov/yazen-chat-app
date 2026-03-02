export const PAGE_SIZE = 25;
export const MAX_MESSAGE_LENGTH = 1000;
export const MAX_DISPLAY_NAME_LENGTH = 30;
export const ROOMS_COLLECTION = "rooms";

export const ROOMS = [
  { id: "general", name: "General" },
  { id: "random", name: "Random" },
  { id: "tech", name: "Tech" },
] as const;
