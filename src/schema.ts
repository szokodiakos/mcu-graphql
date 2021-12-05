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
  Character,
  characters,
  getCharactersForMovie,
  getCharactersForTvShow,
  getMoviesForCharacter,
  getTvShowForCharacter,
  Movie,
  movies,
  Picture,
  TvShow,
  tvShows,
} from './db'

const DateScalar = new GraphQLScalarType({
  name: 'Date',
  serialize: (date: unknown) => (date as Date).toJSON(),
  parseValue: (str: unknown) => new Date(str as string),
})

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

const Character = new GraphQLObjectType({
  name: 'Character',
  fields: () => ({
    name: {
      type: new GraphQLNonNull(GraphQLString),
    },
    alias: { type: GraphQLString },
    pictures: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(Picture))),
      resolve: (source: Character) => [
        ...getMoviesForCharacter(source),
        ...getTvShowForCharacter(source),
      ],
    },
  }),
})

const pictureFields = {
  title: { type: new GraphQLNonNull(GraphQLString) },
  phase: { type: new GraphQLNonNull(GraphQLInt) },
  characters: {
    type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(Character))),
  },
}

const Picture: GraphQLInterfaceType = new GraphQLInterfaceType({
  name: 'Picture',
  fields: () => pictureFields,
  resolveType: (picture) => (picture.seasons ? 'TvShow' : 'Movie'),
})

const Movie = new GraphQLObjectType({
  name: 'Movie',
  interfaces: () => [Picture],
  fields: () => ({
    ...pictureFields,
    characters: {
      ...pictureFields.characters,
      resolve: (source: Movie) => getCharactersForMovie(source),
    },
    releaseDate: {
      type: DateScalar,
    },
  }),
})

const TvShow = new GraphQLObjectType({
  name: 'TvShow',
  interfaces: () => [Picture],
  fields: () => ({
    ...pictureFields,
    characters: {
      ...pictureFields.characters,
      resolve: (source: TvShow) => getCharactersForTvShow(source),
    },
    seasons: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(Season))),
    },
  }),
})

const RootQuery = new GraphQLObjectType({
  name: 'RootQuery',
  fields: () => ({
    characters: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(Character))),
      resolve: () => Object.values(characters),
    },
    pictures: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(Picture))),
      resolve: () => [...Object.values(movies), ...Object.values(tvShows)],
    },
  }),
})

export const schema = new GraphQLSchema({
  query: RootQuery,
  types: [Movie, TvShow],
})
