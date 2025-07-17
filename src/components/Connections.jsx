import axios from 'axios'
import React from 'react'
import { useEffect } from 'react'
import { BASE_URL } from '../utils/utils'
import { useDispatch } from 'react-redux'
import { addConnections } from '../store/connectionsSlice'
import { useSelector } from 'react-redux'

const Connections = () => {
    const dispatch = useDispatch();

    const connections = useSelector(state => state.connections)
    console.log(connections)

    const fetchConnections = async () => {
        const connections = await axios.get(BASE_URL + "/user/connections", { withCredentials: true })
        dispatch(addConnections(connections.data.data))
    }
    
    useEffect(() => {
        if (connections && connections.length > 0) return;
        fetchConnections()
    }, [])

    const ConnectionCard = ({ connection }) => {
        return (
            <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300">
                <figure className="px-6 pt-6 pb-1">
                    <div className="avatar">
                        <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                            <img 
                                src={connection.photoUrl || 'https://via.placeholder.com/150'} 
                                alt={`${connection.firstName} ${connection.lastName}`}
                                className="object-cover"
                            />
                        </div>
                    </div>
                </figure>
                
                <div className="card-body items-center text-center">
                    <h2 className="card-title text-lg font-bold">
                        {connection.firstName} {connection.lastName}
                    </h2>
                    
                    <div className="flex items-center gap-2 text-sm text-base-content/70">
                        <span className="badge badge-ghost">{connection.age} years old</span>
                        <span className="badge badge-ghost capitalize">{connection.gender}</span>
                    </div>
                    
                    <p className="text-sm text-base-content/80 mt-2 line-clamp-2">
                        {connection.about}
                    </p>
                    
                    <div className="mt-4 w-full">
                        <h4 className="font-semibold text-sm mb-2">Skills:</h4>
                        <div className="flex flex-wrap gap-1 justify-center">
                            {connection.skills?.map((skill, index) => (
                                <span 
                                    key={index} 
                                    className="badge badge-primary badge-sm"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                    
                    <div className="card-actions justify-end mt-4 w-full">
                        <button className="btn btn-primary btn-sm flex-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            Message
                        </button>
                        <button className="btn btn-ghost btn-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    if (!connections || connections.length === 0) {
        return (
            <div className="min-h-screen bg-base-200 flex items-center justify-center">
                <div className="text-center">
                    <div className="loading loading-spinner loading-lg text-primary mb-4"></div>
                    <p className="text-lg text-base-content/70">Loading your connections...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-base-200 py-8 flex justify-center">
            <div className="container max-w-7xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-primary mb-2">
                        My Connections
                    </h1>
                    <p className="text-base-content/70">
                        You have {connections.length} developer connection{connections.length !== 1 ? 's' : ''}
                    </p>
                </div>

                {/* Stats */}
                <div className="stats shadow mb-8 mx-auto">
                    <div className="stat">
                        <div className="stat-figure text-primary">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <div className="stat-title">Total Connections</div>
                        <div className="stat-value text-primary">{connections.length}</div>
                    </div>
                </div>

                {/* Connections Grid */}
                <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {connections.map((connection) => (
                        <ConnectionCard key={connection._id} connection={connection} />
                    ))}
                </div>

                {/* Empty State (if no connections after loading) */}
                {connections.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">👥</div>
                        <h2 className="text-2xl font-bold text-base-content/70 mb-2">
                            No connections yet
                        </h2>
                        <p className="text-base-content/50">
                            Start swiping to find your perfect developer match!
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Connections