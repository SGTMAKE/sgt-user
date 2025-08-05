"use client"

import type React from "react"

import { Input } from "@nextui-org/input"
import { type FormEvent, useEffect, useRef, useState } from "react"
import { Frown, History, SearchIcon, Trash2 } from "lucide-react"
import type { CategoryProduct } from "@/lib/types/types"
import { useSearch } from "@/api-hooks/use-search"
import { useDebounce } from "@/hooks/use-debounce"
import Image from "next/image"
import { formatCurrency } from "@/lib/utils"
import SkeletonSearchResult from "../skeletons/skeleton-search-result"
import { useRouter } from "next/navigation"

const Search = ({ bestSeller }: { bestSeller: CategoryProduct[] | null }) => {
  const [searchKeyword, setSearchKeyword] = useState("")
  const [showDropdown, setShowDropdown] = useState(false)
  const [recentSearch, setRecentSearch] = useState<string[]>([])
  const [isFocused, setIsFocused] = useState(false)
  const debouncedSearchKeyword = useDebounce(searchKeyword)

  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const { data, isLoading } = useSearch(debouncedSearchKeyword)

  useEffect(() => {
    const currentHistory = getHistoryFromLocalStorage()
    if (currentHistory !== null) setRecentSearch(currentHistory.reverse())
  }, [])

  // Handle clicks outside the search component
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
        setIsFocused(false)
        setSearchKeyword("")
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  function getHistoryFromLocalStorage(): string[] | null {
    const history = localStorage.getItem("history")
    if (history !== null && history !== undefined) return JSON.parse(history)
    return null
  }

  function deleteSearchHistory() {
    localStorage.removeItem("history")
    setRecentSearch([])
  }

  function saveToLocalStorage() {
    const currentHistory = getHistoryFromLocalStorage() || []

    // Check if the keyword is not already in the history
    if (!currentHistory.includes(searchKeyword)) {
      currentHistory.push(searchKeyword)
      if (currentHistory.length >= 6) currentHistory.shift()
    }

    localStorage.setItem("history", JSON.stringify(currentHistory))
  }

  function searchProduct(e: FormEvent) {
    e.preventDefault()
    if (!searchKeyword.trim()) return

    saveToLocalStorage()
    setShowDropdown(false)
    setIsFocused(false)
    router.push(`/store/search?q=${searchKeyword}`)
  }

  function handleClickLink(slug: string, pid: string) {
    // Don't close the search bar when clicking on items
    router.push(`/store/${slug}?pid=${pid}`)
  }

  function handleRecentSearchClick(item: string) {
    setSearchKeyword(item)
    // Keep dropdown open to show search results
  }

  const handleSearchButtonClick = () => {
    setIsFocused(true)
    setShowDropdown(true)
    setTimeout(() => {
      inputRef.current?.focus()
    }, 100)
  }

  const handleInputFocus = () => {
    setIsFocused(true)
    setShowDropdown(true)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(e.target.value)
    if (!showDropdown) setShowDropdown(true)
  }

  const handleDropdownItemClick = (e: React.MouseEvent) => {
    // Prevent the dropdown from closing when clicking on items
    e.stopPropagation()
  }

  return (
    <div
      ref={containerRef}
      className={`relative mx-auto cursor-pointer transition-all duration-300 ease-in-out ${
        isFocused ? "md:w-96" : "md:w-12"
      }`}
    >
      {/* Search Button (collapsed state) */}
      {!isFocused && (
        <button
          type="button"
          onClick={handleSearchButtonClick}
          className="hidden  absolute md:flex items-center justify-center w-12 h-12 rounded-full z-10 -top-[0.13rem] border hover:bg-gray-50 transition-colors"
          aria-label="Search"
        >
          <SearchIcon className="w-5 h-5" />
        </button>
      )}

      {/* Search Form (expanded state) */}
      <form onSubmit={searchProduct} className={`${isFocused ? "block" : "hidden md:block"}`}>
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search..."
          value={searchKeyword}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          size="sm"
          isClearable={true}
          classNames={{
            inputWrapper: `${
              isFocused ? "md:bg-gray-100" : "md:bg-transparent"
            } m-0 rounded-lg md:rounded-full transition-colors duration-300`,
          }}
          onClear={() => {
            setSearchKeyword("")
            setShowDropdown(true)
          }}
          startContent={
            isFocused && <SearchIcon className="pointer-events-none flex-shrink-0 text-xl cursor-pointer text-gray-500" />
          }
        />
      </form>

      {/* Dropdown */}
      {showDropdown && isFocused && (
        <div
          ref={dropdownRef}
          className="scrollbar-thin absolute z-[9999] max-h-[500px] min-h-fit w-full overflow-y-scroll rounded-2xl bg-white p-4 shadow-lg border mt-2"
          onClick={handleDropdownItemClick}
        >
          {!searchKeyword ? (
            <div className="scrollbar-thin overflow-x-auto">
              {/* Recently Searched */}
              {recentSearch.length !== 0 && (
                <>
                  <p className="flex items-center justify-between font-light text-muted-foreground mb-2">
                    Recently searched
                    <Trash2
                      size={20}
                      className="cursor-pointer text-gray-400 hover:text-red-500 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteSearchHistory()
                      }}
                    />
                  </p>
                  <div className="flex flex-col py-2">
                    {recentSearch?.map((item, i) => (
                      <span
                        key={i}
                        onClick={(e) => {
                          e.stopPropagation()
                          handleRecentSearchClick(item)
                        }}
                        className="flex cursor-pointer items-center gap-2 py-2 ps-3 text-sm hover:bg-gray-100 md:text-base rounded-lg transition-colors"
                      >
                        <History className="text-gray-400" size={20} />
                        {item}
                      </span>
                    ))}
                  </div>
                </>
              )}

              {/* Popular */}
              {bestSeller && bestSeller?.length !== 0 && (
                <>
                  <p className="font-light text-muted-foreground mb-2">Popular</p>
                  <div className="flex flex-col py-2">
                    {bestSeller.slice(0, 5).map((item, i) => (
                      <span
                        key={i}
                        onClick={(e) => {
                          e.stopPropagation()
                          setSearchKeyword(item.title)
                        }}
                        className="cursor-pointer py-2 ps-3 text-sm hover:bg-gray-100 md:text-base rounded-lg transition-colors"
                      >
                        {item.title}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>
          ) : isLoading ? (
            <>
              <SkeletonSearchResult />
              <SkeletonSearchResult />
            </>
          ) : data && data.length !== 0 ? (
            data.map((item, i) => (
              <div
                key={i}
                onClick={(e) => {
                  e.stopPropagation()
                  handleClickLink(item.slug, item.pid)
                }}
                className="flex cursor-pointer gap-3 border-b px-1 py-2 duration-300 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <div className="relative h-14 w-14 flex-shrink-0">
                  <Image
                    src={process.env.NEXT_PUBLIC_IMAGE_URL + item.image || "/placeholder.svg"}
                    alt={item.title + " Image"}
                    fill
                    sizes="100px"
                    className="bg-gray-100 rounded-md object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h1 className="cutoff-text font-medium text-gray-900">{item.title}</h1>
                  <p className="font-Roboto text-sm text-muted-foreground">{formatCurrency(item.offerPrice)}</p>
                </div>
              </div>
            ))
          ) : (
            data && (
              <div className="flex flex-col items-center justify-center gap-2 py-10">
                <Frown className="animate-bounce text-gray-300" size={40} />
                <h1 className="text-muted-foreground">Sorry, No matches were found.</h1>
              </div>
            )
          )}
        </div>
      )}

      {/* Mobile Search (always visible on mobile) */}
      <div className="block md:hidden">
        <Input
          type="text"
          placeholder="Search..."
          value={searchKeyword}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          size="sm"
          isClearable={true}
          classNames={{
            inputWrapper: "bg-gray-100 rounded-lg",
          }}
          onClear={() => {
            setSearchKeyword("")
            setShowDropdown(true)
          }}
          startContent={
            <SearchIcon className="pointer-events-none flex-shrink-0 text-xl cursor-pointer text-gray-500" />
          }
        />
      </div>
    </div>
  )
}

export default Search
