import gql from 'graphql-tag'

import EditCollection from '~/components/CollectionDigest/DropdownActions/EditCollection'

export const fragments = {
  collection: gql`
    fragment CollectionProfileCollection on Collection {
      id
      author {
        id
        userName
      }
      ...EditCollectionCollection
    }
    ${EditCollection.fragments.collection}
  `,
}
