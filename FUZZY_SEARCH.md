Implement FuzzySearch SearchBar - https://www.algolia.com/doc/api-reference/widgets/autocomplete/react

## - [] Searchbar should use Algolia IntantSearch React Autocomplete 

example: 

```ts
import React from "react";
import { liteClient as algoliasearch } from "algoliasearch/lite";
import { InstantSearch, Autocomplete } from "react-instantsearch";

const searchClient = algoliasearch("YourApplicationID", "YourSearchOnlyAPIKey");

function App() {
  return (
    <InstantSearch indexName="instant_search" searchClient={searchClient}>
      <EXPERIMENTAL_Autocomplete
        indices={[
          {
            indexName: "instant_search",
            getQuery: (item) => item.name,
            getUrl: (item) => `/search?q=${item.name}`,
            headerComponent: () => <div>Products</div>,
            itemComponent: ({ item, onSelect }) =>
              <div onClick={onSelect}>{item.name}</div>,
          },
        ]}
        showSuggestions={{
          indexName: "query_suggestions",
        }}
      />
    </InstantSearch>
  );
}
```


## - [] Items found should show image, title, price, short description and rating
## - [] If Searchbar is not yet filled you can show Suggestions
## - [] Show last 3 searches
## - [] Style The components accordlingly to the rest of the app. YOu can use SHadcn if needed.