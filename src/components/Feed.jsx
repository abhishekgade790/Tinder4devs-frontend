import axios from 'axios'
import React, { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { BASE_URL } from '../utils/utils'
import { addFeed } from '../store/feedSlice'
import UserCard from "./UserCard"
import { Cpu, Terminal, Globe, Rocket } from 'lucide-react'
import { addRequests } from '../store/requestSlice'

function Feed() {
  const dispatch = useDispatch()
  const feedData = useSelector((store) => store.feed)
  const [error, setError] = useState("")
  const triedEmptyFetch = useRef(false) // ⬅️ Track empty-fetch attempts

  const fetchRequests = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/user/requests/received`, { withCredentials: true });
      dispatch(addRequests(res?.data?.connectionRequests || []));
    } catch (error) {
      console.error("Failed to fetch requests", error);
    }
  };

  const fetchFeed = async () => {
    try {
      const response = await axios.get(BASE_URL + "/user/feed", {
        withCredentials: true,
      })
      dispatch(addFeed(response.data))

      // reset the flag if new data comes
      if (response.data && response.data.length > 0) {
        triedEmptyFetch.current = false
      }
    } catch (err) {
      setError(err?.response?.data || "Failed to load feed.")
    }
  }

  useEffect(() => {
    if (!feedData || feedData.length === 0) {
      if (!triedEmptyFetch.current) {
        fetchFeed()
        fetchRequests()
        triedEmptyFetch.current = true
      }
    }
  }, [feedData])

  if (error) return <div className="text-red-500 min-h-screen text-center">{error}</div>

  if (!feedData) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg text-primary mb-4"></div>
          <p className="text-lg text-base-content/70">Loading your Feed...</p>
        </div>
      </div>
    )
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
      <div className="hero min-h-[90vh] bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 relative overflow-hidden">
        <UserCard
          firstName={feedData[0].firstName}
          lastName={feedData[0].lastName}
          age={feedData[0].age}
          gender={feedData[0].gender}
          photoUrl={feedData[0].photoUrl}
          about={feedData[0].about}
          skills={feedData[0].skills}
          _id={feedData[0]._id}
          isPremium={feedData[0].isPremium}
        />
        {/* Animated background elements */}
        <div className="absolute top-10 left-10 opacity-20">
          <Cpu className="w-16 h-16 text-primary animate-pulse" />
        </div>
        <div className="absolute top-20 right-20 opacity-20">
          <Terminal className="w-12 h-12 text-secondary animate-bounce" style={{ animationDelay: '1s' }} />
        </div>
        <div className="absolute bottom-20 left-20 opacity-20">
          <Globe className="w-14 h-14 text-accent animate-spin" style={{ animationDuration: '10s' }} />
        </div>
        <div className="absolute bottom-10 right-10 opacity-20">
          <Rocket className="w-10 h-10 text-info animate-pulse" style={{ animationDelay: '2s' }} />
        </div>
      </div>
    ) : (
      <div className="text-center min-h-screen flex justify-center items-center">
        <span className="loading loading-bars text-primary loading-md"></span>
      </div>
    )
  )
}

export default Feed
