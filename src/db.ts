const createDate = (year: number, month: number, day: number) =>
  new Date(year, month - 1, day)

export type Picture = {
  title: string
  phase: number
}

export type Movie = Picture & {
  releaseDate: Date
}

export const movies: Record<string, Movie> = {
  ironMan: {
    title: 'Iron Man',
    releaseDate: createDate(2008, 5, 2),
    phase: 1,
  },
  theIncredibleHulk: {
    title: 'The Incredible Hulk',
    releaseDate: createDate(2008, 6, 13),
    phase: 1,
  },
  ironMan2: {
    title: 'Iron Man 2',
    releaseDate: createDate(2010, 5, 7),
    phase: 1,
  },
  thor: {
    title: 'Thor',
    releaseDate: createDate(2011, 5, 6),
    phase: 1,
  },
  captainAmericaTheFirstAvenger: {
    title: 'Captain America: The First Avenger',
    releaseDate: createDate(2008, 6, 22),
    phase: 1,
  },
  theAvengers: {
    title: 'The Avengers',
    releaseDate: createDate(2012, 5, 4),
    phase: 1,
  },
}

export type TvShow = Picture & {
  seasons: Season[]
}

export type Season = {
  seasonNumber: number
  episodes: Episode[]
}

export type Episode = {
  title: string
  episodeNumber: number
  releaseDate: Date
}

export const tvShows: Record<string, TvShow> = {
  wandaVision: {
    title: 'WandaVision',
    phase: 4,
    seasons: [
      {
        seasonNumber: 1,
        episodes: [
          {
            title: 'Filmed Before a Live Studio Audience',
            episodeNumber: 1,
            releaseDate: createDate(2021, 1, 15),
          },
          {
            title: `Don't Touch That Dial`,
            episodeNumber: 2,
            releaseDate: createDate(2021, 1, 15),
          },
          {
            title: 'Now in Color',
            episodeNumber: 3,
            releaseDate: createDate(2021, 1, 22),
          },
          {
            title: 'We Interrupt This Program',
            episodeNumber: 4,
            releaseDate: createDate(2021, 1, 29),
          },
          {
            title: 'On a Very Special Episode...',
            episodeNumber: 5,
            releaseDate: createDate(2021, 2, 5),
          },
          {
            title: 'All-New Halloween Spooktacular!',
            episodeNumber: 6,
            releaseDate: createDate(2021, 2, 12),
          },
          {
            title: 'Breaking the Fourth Wall',
            episodeNumber: 7,
            releaseDate: createDate(2021, 2, 19),
          },
          {
            title: 'Previously On',
            episodeNumber: 8,
            releaseDate: createDate(2021, 2, 26),
          },
          {
            title: 'The Series Finale',
            episodeNumber: 9,
            releaseDate: createDate(2021, 3, 5),
          },
        ],
      },
    ],
  },
}

export type Character = {
  name: string
  alias?: string
}

export const characters: Record<string, Character> = {
  tonyStark: {
    name: 'Tony Stark',
    alias: 'Iron Man',
  },
  jamesRhodes: {
    name: 'James Rhodes',
    alias: 'War Machine',
  },
  philCoulson: {
    name: 'Phil Coulson',
  },
  nickFury: {
    name: 'Nick Fury',
  },
  bruceBanner: {
    name: 'Bruce Banner',
    alias: 'The Hulk',
  },
  natashaRomanoff: {
    name: 'Natasha Romanoff',
    alias: 'Black Widow',
  },
  thor: {
    name: 'Thor',
  },
  loki: {
    name: 'Loki',
  },
  clintBarton: {
    name: 'Clint Barton',
    alias: 'Hawkeye',
  },
  janeFoster: {
    name: 'Jane Foster',
  },
  darcyLewis: {
    name: 'Darcy Lewis',
  },
  steveRogers: {
    name: 'Steve Rogers',
    alias: 'Captain America',
  },
  peggyCarter: {
    name: 'Peggy Carter',
  },
  buckyBarnes: {
    name: 'Bucky Barnes',
    alias: 'The Winter Soldier',
  },
  wandaMaximoff: {
    name: 'Wanda Maximoff',
    alias: 'Scarlet Witch',
  },
  vision: {
    name: 'Vision',
  },
  monicaRambeau: {
    name: 'Monica Rambeau',
  },
  agathaHarkness: {
    name: 'Agatha Harkness',
  },
}

export const moviesCharacters: Record<string, Character[]> = {
  ironMan: [
    characters.tonyStark,
    characters.jamesRhodes,
    characters.nickFury,
    characters.philCoulson,
  ],
  theIncredibleHulk: [characters.bruceBanner, characters.tonyStark],
  ironMan2: [
    characters.tonyStark,
    characters.jamesRhodes,
    characters.nickFury,
    characters.philCoulson,
    characters.natashaRomanoff,
  ],
  thor: [
    characters.thor,
    characters.loki,
    characters.janeFoster,
    characters.darcyLewis,
    characters.clintBarton,
    characters.philCoulson,
    characters.nickFury,
  ],
  captainAmericaTheFirstAvenger: [
    characters.steveRogers,
    characters.peggyCarter,
    characters.nickFury,
    characters.buckyBarnes,
  ],
  theAvengers: [
    characters.tonyStark,
    characters.steveRogers,
    characters.thor,
    characters.bruceBanner,
    characters.natashaRomanoff,
    characters.clintBarton,
    characters.nickFury,
    characters.philCoulson,
    characters.loki,
  ],
}

export const tvShowsCharacters: Record<string, Character[]> = {
  wandaVision: [
    characters.wandaMaximoff,
    characters.vision,
    characters.darcyLewis,
    characters.monicaRambeau,
    characters.agathaHarkness,
  ],
}

export const getCharactersForMovie = (movie: Movie) => {
  const movieKey = Object.entries(movies).find(
    ([, value]) => value === movie
  )?.[0]
  if (!movieKey) {
    throw new Error(`Movie not found ${movie}`)
  }

  return moviesCharacters[movieKey]
}

export const getCharactersForTvShow = (tvShow: TvShow) => {
  const tvShowKey = Object.entries(tvShows).find(
    ([, value]) => value === tvShow
  )?.[0]
  if (!tvShowKey) {
    throw new Error(`TV Show not found ${tvShow}`)
  }

  return tvShowsCharacters[tvShowKey]
}

export const getMoviesForCharacter = (character: Character) =>
  Object.entries(moviesCharacters)
    .filter(([, value]) => value.includes(character))
    .map(([key]) => movies[key])

export const getTvShowForCharacter = (character: Character) =>
  Object.entries(tvShowsCharacters)
    .filter(([, value]) => value.includes(character))
    .map(([key]) => tvShows[key])
