import { gql, useQuery } from "@apollo/client";
import type { NextPage } from "next";

import Hero from "modules/home/components/Hero";
import Board from "modules/home/components/Board";

import { apolloClient } from "common/apollo/client";

const Home: NextPage<{ users: any }> = ({ users }) => {
  // const {
  //   loading,
  //   error,
  //   data: session,
  // } = useQuery(GET_SESSION, {
  //   fetchPolicy: "cache-and-network",
  // });

  // console.log(loading, error, session?.getSession);

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
