import { gql, useQuery } from "@apollo/client";
import type { NextPage } from "next";

import Hero from "modules/home/components/Hero";
import Board from "modules/home/components/Board";

import { apolloClient } from "common/services/apollo/client";

const Home: NextPage<{ users: any }> = ({ users }) => {
  return (
    <>
      <Hero />
      <Board />
    </>
  );
};

export async function getServerSideProps() {
  const { data } = await apolloClient.query({
    query: gql`
      query Users {
        users {
          exampleField
        }
      }
    `,
  });

  return {
    props: {
      users: data.users,
    },
  };
}

export default Home;
