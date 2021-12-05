# MCU GraphQL

Characters query:
```
{
  characters {
    name
    alias
    pictures {
      title
      phase
      ... on Movie {
        releaseDate
      }
      ... on TvShow {
        seasons {
          seasonNumber
          episodes {
            title
            episodeNumber
            releaseDate
          }
        }
      }
    }
  }
}
```

Pictures query:
```
{
  pictures {
    title,
    phase,
    characters {
      name,
      alias
    }
    ... on Movie {
      releaseDate
    }
    ... on TvShow {
      seasons {
        seasonNumber
        episodes {
          title
          episodeNumber
          releaseDate
        }
      }
    }
  }
}

```