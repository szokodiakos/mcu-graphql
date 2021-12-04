import {
  GraphQLInt,
  GraphQLInterfaceType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLScalarType,
  GraphQLSchema,
  GraphQLString,
} from 'graphql'
import {
  characters,
  getCharactersForMovie,
  getCharactersForTvShow,
  getMoviesForCharacter,
  getTvShowForCharacter,
  movies,
  tvShows,
} from './db'

const pictureFields = {
  title: { type: new GraphQLNonNull(GraphQLString) },
  phase: { type: new GraphQLNonNull(GraphQLInt) },
}

const characterFields = {
  name: {
    type: new GraphQLNonNull(GraphQLString),
  },
  alias: { type: GraphQLString },
}

const Character = new GraphQLObjectType({
  name: 'Character',
  fields: () => characterFields,
})

const rootPictureFields = {
  ...pictureFields,
  characters: {
    type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(Character))),
  },
}

const DateScalar = new GraphQLScalarType({
  name: 'Date',
  serialize: (date: unknown) => {
    return (date as Date).toJSON()
  },
  parseValue: (str: unknown) => {
    return new Date(str as string)
  },
})

const movieFields = {
  releaseDate: {
    type: DateScalar,
  },
}

const Episode = new GraphQLObjectType({
  name: 'Episode',
  fields: () => ({
    title: {
      type: GraphQLString,
    },
    episodeNumber: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    releaseDate: {
      type: new GraphQLNonNull(DateScalar),
    },
  }),
})

const Season = new GraphQLObjectType({
  name: 'Season',
  fields: () => ({
    seasonNumber: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    episodes: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(Episode))),
    },
  }),
})

const tvShowFields = {
  seasons: {
    type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(Season))),
  },
}

const Picture = new GraphQLInterfaceType({
  name: 'Picture',
  fields: () => pictureFields,
  resolveType: (picture) => {
    if (picture.seasons) {
      return 'TvShow'
    }
    return 'Movie'
  },
})

const RootPicture = new GraphQLInterfaceType({
  name: 'RootPicture',
  fields: () => rootPictureFields,
  resolveType: (rootPicture) => {
    if (rootPicture.seasons) {
      return 'RootTvShow'
    }
    return 'RootMovie'
  },
})

const RootCharacter = new GraphQLObjectType({
  name: 'RootCharacter',
  fields: () => ({
    ...characterFields,
    pictures: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(Picture))),
    },
  }),
})

const Movie = new GraphQLObjectType({
  name: 'Movie',
  interfaces: () => [Picture],
  fields: () => ({
    ...pictureFields,
    ...movieFields,
  }),
})

const RootMovie = new GraphQLObjectType({
  name: 'RootMovie',
  interfaces: () => [Picture, RootPicture],
  fields: () => ({
    ...rootPictureFields,
    ...movieFields,
  }),
})

const TvShow = new GraphQLObjectType({
  name: 'TvShow',
  interfaces: () => [Picture],
  fields: () => ({
    ...pictureFields,
    ...tvShowFields,
  }),
})

const RootTvShow = new GraphQLObjectType({
  name: 'RootTvShow',
  interfaces: () => [Picture, RootPicture],
  fields: () => ({
    ...rootPictureFields,
    ...tvShowFields,
  }),
})

const RootQuery = new GraphQLObjectType({
  name: 'RootQuery',
  fields: () => ({
    characters: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(RootCharacter))
      ),
      resolve() {
        return Object.values(characters).map((character) => ({
          ...character,
          pictures: [
            ...getMoviesForCharacter(character),
            ...getTvShowForCharacter(character),
          ],
        }))
      },
    },
    pictures: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(RootPicture))
      ),
      resolve() {
        return [
          ...Object.values(movies).map((movie) => ({
            ...movie,
            characters: getCharactersForMovie(movie),
          })),
          ...Object.values(tvShows).map((tvShow) => ({
            ...tvShow,
            characters: getCharactersForTvShow(tvShow),
          })),
        ]
      },
    },
  }),
})

export const schema = new GraphQLSchema({
  query: RootQuery,
  types: [RootMovie, RootTvShow, Movie, TvShow],
})
