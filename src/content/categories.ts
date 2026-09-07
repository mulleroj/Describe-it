import type { Category } from '../domain/content-types.ts'

export const categories = [
  { id: 'people', title: 'People', subcategories: [
    { id: 'appearance', title: 'Appearance' },
    { id: 'personality', title: 'Personality' },
    { id: 'emotions', title: 'Emotions' },
    { id: 'smile', title: 'Smile' },
    { id: 'body-language', title: 'Body language' },
  ] },
  { id: 'places', title: 'Places', subcategories: [
    { id: 'city', title: 'City' },
    { id: 'countryside', title: 'Countryside' },
    { id: 'nature', title: 'Nature' },
    { id: 'rooms', title: 'Rooms' },
    { id: 'atmosphere', title: 'Atmosphere' },
  ] },
  { id: 'things', title: 'Things', subcategories: [
    { id: 'everyday-objects', title: 'Everyday objects' },
    { id: 'clothes', title: 'Clothes' },
    { id: 'furniture', title: 'Furniture' },
    { id: 'vehicles', title: 'Vehicles' },
  ] },
  { id: 'situations', title: 'Situations', subcategories: [
    { id: 'shopping', title: 'Shopping' },
    { id: 'travelling', title: 'Travelling' },
    { id: 'waiting', title: 'Waiting' },
    { id: 'restaurant', title: 'Restaurant' },
    { id: 'school', title: 'School' },
    { id: 'workplace', title: 'Workplace' },
  ] },
  { id: 'five-senses', title: 'Five senses', subcategories: [
    { id: 'sight', title: 'Sight' },
    { id: 'sound', title: 'Sound' },
    { id: 'smell', title: 'Smell' },
    { id: 'taste', title: 'Taste' },
    { id: 'touch', title: 'Touch' },
  ] },
] as const satisfies readonly Category[]
