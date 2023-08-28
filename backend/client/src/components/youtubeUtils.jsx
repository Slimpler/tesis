// youtubeUtils.js
export function getYoutubeVideoId(url) {
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/embed\/|youtu\.be\/)([a-zA-Z0-9_-]+)/i;
    const match = url.match(regex);
    return match && match[1] ? match[1] : null;
  }
  