import "./App.css"
import { useQuery, useInfiniteQuery } from "react-query"
import React from "react"
import useIntersectionObserver from "./hooks/useIntersectionObserver"

const fetchUsers = async ({ pageParam = 1 }) => {
  const res = await fetch(`https://reqres.in/api/users?${pageParam}&per_page=3`)
  return res.json()
}

function App() {
  const {
    data,
    error,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery("users", fetchUsers, {
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.page < lastPage.total_pages) return lastPage.page + 1
      return false
    },
  })

  const loadMoreButtonRef = React.useRef()

  useIntersectionObserver({
    target: loadMoreButtonRef,
    onIntersect: fetchNextPage,
    enabled: hasNextPage,
  })

  console.log(data)

  if (isLoading) {
    return <div className="App">Chargement...</div>
  }
  if (isError) {
    return <div className="App">Erreur </div>
  }

  return (
    <div className="App">
      <h2>Liste des utilisateurs</h2>

      {data.pages.map((group, i) => (
        <React.Fragment key={i}>
          {group.data.map(user => (
            <div
              key={user.id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                minHeight: "400px",
                marginBottom: "30px",
                backgroundColor: "#777",
                fontSize: "4rem",
                color: "#FFF",
              }}
            >
              {user.first_name} {user.last_name}
            </div>
          ))}
        </React.Fragment>
      ))}
      <button
        ref={loadMoreButtonRef}
        onClick={() => fetchNextPage()}
        disabled={!hasNextPage || isFetchingNextPage}
      >
        {isFetchingNextPage
          ? "Loading more..."
          : hasNextPage
          ? "Load More"
          : "Nothing more to load"}
      </button>
      <div>{isFetching && !isFetchingNextPage ? "Fetching..." : null}</div>
    </div>
  )
}

export default App
