// import Prismic from "@prismicio/client";

// export function getPrismicClient(req?: unknown) {
//   process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
//   const prismic = Prismic.client(
//     process.env.PRISMIC_ENDPOINT, 
//     {
//       req,
//       accessToken: process.env.PRISMIC_ACCESS_TOKEN,
//     }
//   );

//   return prismic;
// }

import Prismic from '@prismicio/client'

const endpoint = 'https://ignewssls.cdn.prismic.io/api/v2'

export function getPrismicClient(req?: unknown) {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  const prismic = Prismic.client(
    endpoint, 
    {
      req,
      accessToken: process.env.PRIMIC_ACCESS_TOKEN,
    }
  )
  return prismic;
}
