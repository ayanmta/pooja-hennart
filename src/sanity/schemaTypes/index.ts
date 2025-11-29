import { type SchemaTypeDefinition } from 'sanity'
import hero from '../../../sanity/schemas/hero'
import mediaItem from '../../../sanity/schemas/mediaItem'
import videoItem from '../../../sanity/schemas/videoItem'
import about from '../../../sanity/schemas/about'
import contact from '../../../sanity/schemas/contact'
import category from '../../../sanity/schemas/category'
import testimonial from '../../../sanity/schemas/testimonial'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    hero,
    mediaItem,
    videoItem,
    about,
    contact,
    category,
    testimonial,
  ],
}
