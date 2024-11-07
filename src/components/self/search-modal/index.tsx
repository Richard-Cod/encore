"use client"

import { Input } from "@/components/ui/input"
import { MenuSquareIcon, SearchIcon } from "lucide-react"
// import { InstantSearch } from "react-instantsearch-hooks-web"
import { useRouter } from "next/navigation"
// import { MagnifyingGlassMini } from "@medusajs/icons"

// import { SEARCH_INDEX_NAME, searchClient } from "@lib/search-client"
// import Hit from "@modules/search/components/hit"
// import Hits from "@modules/search/components/hits"
// import SearchBox from "@modules/search/components/search-box"
import { useCallback, useEffect, useRef, useState } from "react"

import _ from 'lodash';

export default function SearchModal() {
  const router = useRouter()
  const searchRef = useRef(null)

  const [query, setQuery] = useState('');

  // Fonction pour gérer le changement du champ de recherche
  const handleInputChange = (event :any) => {
    setQuery(event.target.value);
    debouncedSearch(event.target.value);
  };

  // Définir la fonction de recherche avec debounce
  const debouncedSearch = useCallback(
    _.debounce((searchTerm) => {
      console.log('Recherche pour :', searchTerm);
    }, 500), // 500 ms délai de debounce
    []
  );
  

  // close modal on outside click
  const handleOutsideClick = (event: MouseEvent) => {
    if (event.target === searchRef.current) {
      router.back()
    }
  }

  useEffect(() => {
    window.addEventListener("click", handleOutsideClick)
    // cleanup
    return () => {
      window.removeEventListener("click", handleOutsideClick)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // disable scroll on body when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [])

  // on escape key press, close modal
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        router.back()
      }
    }
    window.addEventListener("keydown", handleEsc)

    // cleanup
    return () => {
      window.removeEventListener("keydown", handleEsc)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // backdrop-blur-md
  return (
    <div className="relative z-[75]">
      <div className="fixed inset-0 bg-opacity-75 backdrop-blur-md  opacity-100 h-screen w-screen" />
      <div className="fixed inset-0 px-5 sm:p-0" ref={searchRef}>
        <div className="flex flex-col justify-start w-full h-fit transform p-5 items-center text-left align-middle transition-all max-h-[75vh] bg-transparent shadow-none">
          {/* <InstantSearch
            indexName={SEARCH_INDEX_NAME}
            searchClient={searchClient}
          > */}
            <div
              className="flex absolute flex-col h-fit w-full sm:w-fit"
              data-testid="search-modal-container"
            >
              <div className="w-full flex items-center gap-x-2 p-4 bg-[rgba(3,7,18,0.5)] rounded-xl text-ui-fg-on-color backdrop-blur-2xl rounded-rounded">
                {/* <SearchIcon /> */}
                <Input 
                onChange={handleInputChange}
                
                style={{
                  fontSize : 20,
                }}
                className="bg-transparent  text-white placeholder:text-gray-200 "
                
                PrefixComponent={
                  <div className="p-2"> 
                  <SearchIcon className="" />
                  </div>
                  // <InputPrefix label={instaUrlBase} />
              }
              placeholder="Search products ..." />
                {/* <SearchBox /> */}
              </div>
              <div className="flex-1 mt-6 ">

              <div className="grid grid-cols-3 gap-4">
                {[1,2,1,1,1].map((v) => <div className="p-4 border shadow-md hover:shadow-xl">
                  <img className="h-44" src="https://next.medusajs.com/_next/image?url=https%3A%2F%2Fmedusa-server-testing.s3.us-east-1.amazonaws.com%2Fblender-nobg-1700674984144.png&w=1920&q=50" alt="" />
                  <p>Produic </p>
                </div>)}
              </div>

                {/* <Hits hitComponent={Hit} /> */}
              </div>
            </div>
          {/* </InstantSearch> */}
        </div>
      </div>
    </div>
  )
}
