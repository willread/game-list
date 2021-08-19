- Backend
  - Search
    - Improve cold start of search OR move to external search service
    - Allow partial game / search index updates based on only games that have been updates since the last run
    - Only read search index on cold start
    - Update search index when json file changes
  - Move firebase config to env
  - Make igdb functions non-https (scheduled?)
  - Proper CORS policy
- Frontend
  - Move listItems between lists
  - Move service code to services folder
  - ListItem page (manage attributes)
  - Friendly urls for games / lists
  - Add time log
  - Add condition
  - Cache games
  - Cache platforms
  - Cache game images
  - Add date purchased
  - Add purchase price
  - Page titles / SEO
  - Default to last list / platform when adding game
  - SSR of games / other static pages
  - Cache List/ListItem and merge changes since last update in realtime

list: {
  --stats--: {
    gamesByPlatform: {
      ...
    },
    gamesByGenre: {
      ...
    },
    gamesByCondition: {
      ...
    }
  }
}
