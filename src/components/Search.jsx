import React, {useState, useEffect} from 'react'

import MasonryLayout from './MasonryLayout'
import {client} from '../client'
import {feedQuery, searchQuery} from '../utils/data'
import Spinner from './Spinner'

const Search = ({ searchTerm }) => {
  const [pins, setPins] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (searchTerm !== '') {
      const query = searchQuery(searchTerm?.toLowerCase())
      setLoading(true)

      client.fetch(query)
        .then(data => {
          setPins(data)
          setLoading(false)
        })
        .catch(error => {
          console.log("Fetch error: ", error)
        })
    } else {
      client.fetch(feedQuery())
        .then(data => {
          setPins(data)
          setLoading(false)
        })
        .catch(error => {
          console.log("Fetch error: ", error)
        })
    }
  }, [searchTerm])

  return (
    <div>
      {loading && <Spinner message="Searching for Pins..." />}
      {pins?.length !== 0 && <MasonryLayout pins={pins} />}
      {pins?.length === 0 && searchTerm !== '' && !loading && (
        <div className="mt-10 text-center text-xl">No Pins found!</div>
      )}
    </div>
  )
}

export default Search