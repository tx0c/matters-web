import { gql } from '@apollo/client'

export const fragments = {
  user: gql`
    fragment EditProfileDialogUserPublic on User {
      id
      avatar
      displayName
      info {
        profileCover
        description
        badges {
          type
        }
      }
      liker {
        civicLiker
      }
    }
  `,
}
