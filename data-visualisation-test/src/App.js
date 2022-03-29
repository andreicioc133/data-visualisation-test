import MainScreen from "./components/MainScreen/MainScreen";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
} from "@apollo/client";

const client = new ApolloClient({
  uri: "https://fakerql.goosfraba.ro/graphql",
  cache: new InMemoryCache()
});

export default function App() {

  return (
    <ApolloProvider client={client}>
      <MainScreen />
    </ApolloProvider>
  );
}
