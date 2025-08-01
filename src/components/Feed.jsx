import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { BASE_URL } from '../utils/utils'
import { addFeed } from '../store/feedSlice'
import UserCard from "./UserCard"

function Feed() {
  const dispatch = useDispatch()
  const feedData = useSelector((store) => store.feed)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchFeed = async () => {
      if (feedData && feedData.length > 0) return;

      try {
        const response = await axios.get(BASE_URL + "/user/feed", {
          withCredentials: true,
        })
        dispatch(addFeed(response.data))
      } catch (err) {
        setError(err?.response?.data || "Failed to load feed.")
      }
    }

    fetchFeed()
  }, [feedData])

  if (error) return <div className="text-red-500 text-center">{error}</div>

  if (!feedData) {
    <div className="min-h-screen bg-base-200 flex items-center justify-center">
      <div className="text-center">
        <div className="loading loading-spinner loading-lg text-primary mb-4"></div>
        <p className="text-lg text-base-content/70">Loading your Feed...</p>
      </div>
    </div>
  }

  if (feedData && feedData.length === 0) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg text-primary mb-4"></div>
        </div>
      </div>
    );
  }

  return (
    feedData && feedData.length > 0 ? (
      <div className='min-h-screen flex items-center justify-center'>
        <UserCard
          firstName={feedData[0].firstName}
          lastName={feedData[0].lastName}
          age={feedData[0].age}
          gender={feedData[0].gender}
          photoUrl={feedData[0].photoUrl}
          about={feedData[0].about}
          skills={feedData[0].skills}
          _id={feedData[0]._id}
        />
      </div>
    ) : (
      <div className="text-center min-h-screen flex  justify-center items-center">
        <span className="loading loading-bars text-info loading-md"></span>
      </div>
    )
  )
}

export default Feed
