import axios from 'axios';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BASE_URL } from '../utils/utils';
import { addConnections } from '../store/connectionsSlice';

const Connections = () => {
    const dispatch = useDispatch();
    const connections = useSelector(state => state.connections);

    const fetchConnections = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/user/connections`, { withCredentials: true });
            dispatch(addConnections(res.data.data || []));
        } catch (error) {
            console.error("Failed to fetch connections", error);
        }
    };

    useEffect(() => {
        fetchConnections();
    }, []);

    if (!connections) {
        return (
            <div className="min-h-screen bg-base-200 flex items-center justify-center">
                <div className="text-center">
                    <div className="loading loading-spinner loading-lg text-primary mb-4"></div>
                    <p className="text-lg text-base-content/70">Loading your connections...</p>
                </div>
            </div>
        );
    }
    if (connections.length === 0) {
        return (
            <div className="min-h-screen bg-base-200 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-lg text-base-content/70">You don't have any connections.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-8 px-4">
            {/* Header */}
            <div className="max-w-3xl mx-auto mb-6">
                <h1 className="text-3xl font-bold text-primary mb-1">My Connections</h1>
                <p className="text-base-content/70">
                    You have {connections.length} developer connection{connections.length !== 1 ? 's' : ''}.
                </p>
            </div>

            {/* Chat-Style List */}
            <div className="max-w-3xl mx-auto rounded-lg shadow-md divide-y divide-base-300 ">
                {connections.map((conn) => (
                    <div key={conn._id} className="flex my-2 items-center rounded-lg bg-base-200 p-4 hover:bg-base-300 transition-all">
                        <img
                            src={conn.photoUrl || 'https://tse2.mm.bing.net/th/id/OIP.W3Do-GTQuxzJ5cL288waCAHaHa?pid=Api&P=0&h=180'}
                            alt={conn.firstName}
                            className="w-14 h-14 rounded-full object-cover ring ring-primary ring-offset-base-100 mr-4"
                        />
                        <div className="flex-1">
                            <h3 className="font-semibold text-lg">{conn.firstName} {conn.lastName}</h3>
                            <p className="text-sm text-base-content/70 line-clamp-1">{conn.about}</p>

                        </div>
                        <div className="flex flex-col sm:flex-row gap-2 ml-4">
                            <button className="btn btn-sm btn-primary">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                                Message
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Connections;
