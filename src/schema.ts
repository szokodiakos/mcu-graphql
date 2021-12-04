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
import { characters, movies, tvShows } from './db'

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

const character = new GraphQLObjectType({
  name: 'Character',
  fields: characterFields,
})

const rootPictureFields = {
  ...pictureFields,
  characters: {
    type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(character))),
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

const episode = new GraphQLObjectType({
  name: 'Episode',
  fields: {
    title: {
      type: GraphQLString,
    },
    episodeNumber: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    releaseDate: {
      type: new GraphQLNonNull(DateScalar),
    },
  },
})

const season = new GraphQLObjectType({
  name: 'Season',
  fields: {
    seasonNumber: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    episodes: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(episode))),
    },
  },
})

const tvShowFields = {
  seasons: {
    type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(season))),
  },
}

const picture = new GraphQLInterfaceType({
  name: 'Picture',
  fields: pictureFields,
})

const rootPicture = new GraphQLInterfaceType({
  name: 'RootPicture',
  fields: rootPictureFields,
})

const rootCharacter = new GraphQLObjectType({
  name: 'RootCharacter',
  fields: {
    ...characterFields,
    pictures: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(picture))),
    },
  },
})

const movie = new GraphQLObjectType({
  name: 'Movie',
  interfaces: [picture],
  fields: {
    ...pictureFields,
    ...movieFields,
  },
})

const rootMovie = new GraphQLObjectType({
  name: 'RootMovie',
  interfaces: [picture, rootPicture],
  fields: {
    ...rootPictureFields,
    ...movieFields,
  },
})

const tvShow = new GraphQLObjectType({
  name: 'TvShow',
  interfaces: [picture],
  fields: {
    ...pictureFields,
    ...tvShowFields,
  },
})

const rootTvShow = new GraphQLObjectType({
  name: 'RootTvShow',
  interfaces: [picture, rootPicture],
  fields: {
    ...rootPictureFields,
    ...tvShowFields,
  },
})

const rootQuery = new GraphQLObjectType({
  name: 'RootQuery',
  fields: {
    characters: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(character))),
      resolve() {
        return Object.values(characters)
      },
    },
    pictures: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(picture))),
      resolve() {
        return [...Object.values(movies), ...Object.values(tvShows)]
      },
    },
  },
})

export const schema = new GraphQLSchema({
  query: rootQuery,
})
