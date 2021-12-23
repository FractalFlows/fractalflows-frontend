import { gql } from "@apollo/client";
import type { NextPage } from "next";

import Hero from "modules/home/components/Hero";
import Board from "modules/home/components/Board";

import client from "common/apollo-client";

const Home: NextPage<{ users: any }> = ({ users }) => {
  console.log(users);
  return (
    <>
      <Hero />
      <Board />
    </>
  );
};

export async function getServerSideProps() {
  const { data } = await client.query({
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
